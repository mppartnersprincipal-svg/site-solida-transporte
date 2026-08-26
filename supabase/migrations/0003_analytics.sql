-- ============================================================
-- Fase D1 — Analytics first-party (dashboard /dashboard)
-- Rodar no SQL Editor do Supabase (projeto khipnjfbxjgvmjvyxero).
-- Cria: analytics_sessions, analytics_events, trigger de contadores,
-- RLS (leitura só autenticado; escrita só via service role) e as funções
-- de agregação usadas pelo dashboard.
--
-- Privacidade: nenhuma linha guarda IP, cookie, identificador persistente
-- ou user-agent cru. O id da sessão é aleatório e vive só na aba do visitante.
-- ============================================================

create extension if not exists pgcrypto;

-- ---------- Sessões (1 linha por aba/visita) ----------
create table if not exists public.analytics_sessions (
  id             uuid primary key,
  started_at     timestamptz not null default now(),
  last_seen_at   timestamptz not null default now(),
  landing_path   text not null,
  referrer_host  text,
  channel        text not null check (channel in
                   ('google_ads','google_organic','other_search','social','referral','direct')),
  utm_source     text,
  utm_medium     text,
  utm_campaign   text,
  utm_term       text,
  utm_content    text,
  has_gclid      boolean not null default false,
  device         text check (device in ('mobile','tablet','desktop')),
  browser        text,
  os             text,
  country        text,
  region         text,
  city           text,
  screen_w       smallint,
  screen_h       smallint,
  lang           text,
  page_views     integer not null default 0,
  events         integer not null default 0,
  converted      boolean not null default false
);

create index if not exists analytics_sessions_started_idx
  on public.analytics_sessions (started_at desc);
create index if not exists analytics_sessions_channel_idx
  on public.analytics_sessions (channel, started_at desc);
create index if not exists analytics_sessions_geo_idx
  on public.analytics_sessions (region, city);

-- ---------- Eventos ----------
create table if not exists public.analytics_events (
  id          bigint generated always as identity primary key,
  session_id  uuid not null references public.analytics_sessions (id) on delete cascade,
  ts          timestamptz not null default now(),
  name        text not null,
  path        text not null,
  title       text,
  params      jsonb not null default '{}'::jsonb
);

create index if not exists analytics_events_ts_idx
  on public.analytics_events (ts desc);
create index if not exists analytics_events_name_ts_idx
  on public.analytics_events (name, ts desc);
create index if not exists analytics_events_session_idx
  on public.analytics_events (session_id, ts);
create index if not exists analytics_events_path_idx
  on public.analytics_events (path, ts desc);
create index if not exists analytics_events_params_idx
  on public.analytics_events using gin (params jsonb_path_ops);

-- ---------- Contadores da sessão (trigger) ----------
create or replace function public.analytics_bump_session()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update public.analytics_sessions
     set last_seen_at = greatest(last_seen_at, new.ts),
         page_views   = page_views + (new.name = 'page_view')::int,
         events       = events + 1,
         converted    = converted or new.name in ('whatsapp_click', 'phone_click')
   where id = new.session_id;
  return new;
end;
$$;

drop trigger if exists analytics_events_bump on public.analytics_events;
create trigger analytics_events_bump
  after insert on public.analytics_events
  for each row execute function public.analytics_bump_session();

-- ---------- RLS ----------
alter table public.analytics_sessions enable row level security;
alter table public.analytics_events   enable row level security;

drop policy if exists "Autenticado lê sessões" on public.analytics_sessions;
create policy "Autenticado lê sessões"
  on public.analytics_sessions for select to authenticated using (true);

drop policy if exists "Autenticado lê eventos" on public.analytics_events;
create policy "Autenticado lê eventos"
  on public.analytics_events for select to authenticated using (true);

-- Nenhuma policy de insert/update/delete: só o service role (que ignora RLS)
-- grava, a partir do Route Handler /api/collect.
revoke all on public.analytics_sessions from anon;
revoke all on public.analytics_events   from anon;

-- ============================================================
-- Funções de agregação (security invoker → RLS de leitura se aplica).
-- Datas/horas em America/Sao_Paulo. p_channel = null → todas as origens.
-- ============================================================

-- KPIs do período
create or replace function public.analytics_kpis(
  p_from timestamptz, p_to timestamptz, p_channel text default null)
returns table (
  sessions bigint, page_views bigint, avg_session_ms numeric, avg_page_ms numeric,
  wa_clicks bigint, phone_clicks bigint, wa_sessions bigint, conv_rate numeric)
language sql stable security invoker set search_path = public
as $$
  with s as (
    select * from analytics_sessions
    where started_at >= p_from and started_at < p_to
      and (p_channel is null or channel = p_channel)
  ),
  ev as (
    select e.* from analytics_events e join s on s.id = e.session_id
  ),
  agg as (
    select
      (select count(*) from s) as sessions,
      (select count(*) from ev where name = 'page_view') as page_views,
      (select coalesce(round(avg(extract(epoch from (last_seen_at - started_at)) * 1000)), 0) from s) as avg_session_ms,
      (select coalesce(round(avg((params->>'duration_ms')::numeric)), 0) from ev
        where name = 'page_leave' and (params->>'duration_ms') ~ '^[0-9]+$') as avg_page_ms,
      (select count(*) from ev where name = 'whatsapp_click') as wa_clicks,
      (select count(*) from ev where name = 'phone_click') as phone_clicks,
      (select count(distinct session_id) from ev where name = 'whatsapp_click') as wa_sessions
  )
  select sessions, page_views, avg_session_ms, avg_page_ms, wa_clicks, phone_clicks, wa_sessions,
         case when sessions = 0 then 0
              else round(wa_sessions::numeric / sessions * 100, 1) end as conv_rate
  from agg;
$$;

-- Série diária (inclui dias zerados)
create or replace function public.analytics_daily(
  p_from timestamptz, p_to timestamptz, p_channel text default null)
returns table (day date, sessions bigint, page_views bigint, wa_clicks bigint)
language sql stable security invoker set search_path = public
as $$
  with days as (
    select generate_series(
      (p_from at time zone 'America/Sao_Paulo')::date,
      ((p_to - interval '1 second') at time zone 'America/Sao_Paulo')::date,
      interval '1 day')::date as day
  ),
  s as (
    select id, (started_at at time zone 'America/Sao_Paulo')::date as day
    from analytics_sessions
    where started_at >= p_from and started_at < p_to
      and (p_channel is null or channel = p_channel)
  ),
  ev as (
    select e.name, (e.ts at time zone 'America/Sao_Paulo')::date as day
    from analytics_events e join s on s.id = e.session_id
    where e.name in ('page_view', 'whatsapp_click')
  )
  select d.day,
         (select count(*) from s where s.day = d.day),
         (select count(*) from ev where ev.day = d.day and ev.name = 'page_view'),
         (select count(*) from ev where ev.day = d.day and ev.name = 'whatsapp_click')
  from days d
  order by d.day;
$$;

-- Heatmap dia da semana × hora (0 = domingo)
create or replace function public.analytics_heatmap(
  p_from timestamptz, p_to timestamptz, p_channel text default null)
returns table (dow smallint, hour smallint, sessions bigint)
language sql stable security invoker set search_path = public
as $$
  select extract(dow  from (started_at at time zone 'America/Sao_Paulo'))::smallint as dow,
         extract(hour from (started_at at time zone 'America/Sao_Paulo'))::smallint as hour,
         count(*) as sessions
  from analytics_sessions
  where started_at >= p_from and started_at < p_to
    and (p_channel is null or channel = p_channel)
  group by 1, 2
  order by 1, 2;
$$;

-- Origem
create or replace function public.analytics_by_channel(p_from timestamptz, p_to timestamptz)
returns table (channel text, sessions bigint, wa_clicks bigint)
language sql stable security invoker set search_path = public
as $$
  select s.channel,
         count(distinct s.id) as sessions,
         count(e.id) as wa_clicks
  from analytics_sessions s
  left join analytics_events e on e.session_id = s.id and e.name = 'whatsapp_click'
  where s.started_at >= p_from and s.started_at < p_to
  group by s.channel
  order by sessions desc;
$$;

-- Dispositivo
create or replace function public.analytics_by_device(
  p_from timestamptz, p_to timestamptz, p_channel text default null)
returns table (device text, sessions bigint)
language sql stable security invoker set search_path = public
as $$
  select coalesce(device, 'desconhecido') as device, count(*) as sessions
  from analytics_sessions
  where started_at >= p_from and started_at < p_to
    and (p_channel is null or channel = p_channel)
  group by 1
  order by sessions desc;
$$;

-- Páginas mais vistas com tempo e scroll médios
create or replace function public.analytics_top_pages(
  p_from timestamptz, p_to timestamptz, p_channel text default null, p_limit int default 20)
returns table (path text, title text, views bigint, avg_ms numeric, avg_scroll numeric)
language sql stable security invoker set search_path = public
as $$
  with ev as (
    select e.* from analytics_events e
    join analytics_sessions s on s.id = e.session_id
    where e.ts >= p_from and e.ts < p_to
      and (p_channel is null or s.channel = p_channel)
      and e.name in ('page_view', 'page_leave')
  ),
  v as (
    select path, max(title) as title, count(*) as views
    from ev where name = 'page_view' group by path
  ),
  l as (
    select path,
           round(avg((params->>'duration_ms')::numeric)) as avg_ms,
           round(avg((params->>'max_scroll_pct')::numeric)) as avg_scroll
    from ev
    where name = 'page_leave'
      and (params->>'duration_ms') ~ '^[0-9]+$'
    group by path
  )
  select v.path, v.title, v.views, coalesce(l.avg_ms, 0), coalesce(l.avg_scroll, 0)
  from v left join l on l.path = v.path
  order by v.views desc
  limit p_limit;
$$;

-- Geografia (estado/cidade)
create or replace function public.analytics_geo(
  p_from timestamptz, p_to timestamptz, p_channel text default null, p_limit int default 30)
returns table (country text, region text, city text, sessions bigint, wa_clicks bigint)
language sql stable security invoker set search_path = public
as $$
  select s.country, s.region, s.city,
         count(distinct s.id) as sessions,
         count(e.id) as wa_clicks
  from analytics_sessions s
  left join analytics_events e on e.session_id = s.id and e.name = 'whatsapp_click'
  where s.started_at >= p_from and s.started_at < p_to
    and (p_channel is null or s.channel = p_channel)
  group by s.country, s.region, s.city
  order by sessions desc
  limit p_limit;
$$;

-- Campanhas do Google Ads
create or replace function public.analytics_campaigns(p_from timestamptz, p_to timestamptz)
returns table (utm_campaign text, utm_term text, utm_content text,
               sessions bigint, wa_clicks bigint, conv_rate numeric)
language sql stable security invoker set search_path = public
as $$
  with s as (
    select * from analytics_sessions
    where started_at >= p_from and started_at < p_to and channel = 'google_ads'
  )
  select s.utm_campaign, s.utm_term, s.utm_content,
         count(distinct s.id) as sessions,
         count(e.id) as wa_clicks,
         round(count(distinct e.session_id)::numeric / nullif(count(distinct s.id), 0) * 100, 1) as conv_rate
  from s
  left join analytics_events e on e.session_id = s.id and e.name = 'whatsapp_click'
  group by s.utm_campaign, s.utm_term, s.utm_content
  order by sessions desc;
$$;

-- Cliques de WhatsApp por assunto/opção/origem do clique
create or replace function public.analytics_whatsapp(
  p_from timestamptz, p_to timestamptz, p_channel text default null)
returns table (subject text, option text, source text, clicks bigint)
language sql stable security invoker set search_path = public
as $$
  select e.params->>'subject', e.params->>'option', e.params->>'source', count(*)
  from analytics_events e
  join analytics_sessions s on s.id = e.session_id
  where e.name = 'whatsapp_click' and e.ts >= p_from and e.ts < p_to
    and (p_channel is null or s.channel = p_channel)
  group by 1, 2, 3
  order by 4 desc;
$$;

-- Cliques de telefone
create or replace function public.analytics_phone(
  p_from timestamptz, p_to timestamptz, p_channel text default null)
returns table (phone text, label text, source text, clicks bigint)
language sql stable security invoker set search_path = public
as $$
  select e.params->>'phone', e.params->>'label', e.params->>'source', count(*)
  from analytics_events e
  join analytics_sessions s on s.id = e.session_id
  where e.name = 'phone_click' and e.ts >= p_from and e.ts < p_to
    and (p_channel is null or s.channel = p_channel)
  group by 1, 2, 3
  order by 4 desc;
$$;

-- Ranking de cliques genéricos (qualquer botão/link)
create or replace function public.analytics_clicks(
  p_from timestamptz, p_to timestamptz, p_channel text default null, p_limit int default 30)
returns table (label text, tag text, href text, clicks bigint, sessions bigint)
language sql stable security invoker set search_path = public
as $$
  select coalesce(e.params->>'track', e.params->>'text', e.params->>'href') as label,
         max(e.params->>'tag') as tag,
         max(e.params->>'href') as href,
         count(*) as clicks,
         count(distinct e.session_id) as sessions
  from analytics_events e
  join analytics_sessions s on s.id = e.session_id
  where e.name = 'click' and e.ts >= p_from and e.ts < p_to
    and (p_channel is null or s.channel = p_channel)
  group by 1
  order by 4 desc
  limit p_limit;
$$;

-- Blog: posts mais lidos
create or replace function public.analytics_blog(
  p_from timestamptz, p_to timestamptz, p_channel text default null, p_limit int default 20)
returns table (post_slug text, post_title text, post_category text,
               views bigint, avg_ms numeric, avg_scroll numeric)
language sql stable security invoker set search_path = public
as $$
  with v as (
    select e.params->>'post_slug' as slug,
           max(e.params->>'post_title') as title,
           max(e.params->>'post_category') as category,
           count(*) as views
    from analytics_events e
    join analytics_sessions s on s.id = e.session_id
    where e.name = 'blog_post_view' and e.ts >= p_from and e.ts < p_to
      and (p_channel is null or s.channel = p_channel)
    group by 1
  ),
  l as (
    select e.path,
           round(avg((e.params->>'duration_ms')::numeric)) as avg_ms,
           round(avg((e.params->>'max_scroll_pct')::numeric)) as avg_scroll
    from analytics_events e
    where e.name = 'page_leave' and e.ts >= p_from and e.ts < p_to
      and e.path like '/blog/%'
      and (e.params->>'duration_ms') ~ '^[0-9]+$'
    group by e.path
  )
  select v.slug, v.title, v.category, v.views, coalesce(l.avg_ms, 0), coalesce(l.avg_scroll, 0)
  from v left join l on l.path = '/blog/' || v.slug
  order by v.views desc
  limit p_limit;
$$;

-- Funil: sessões distintas em cada etapa
create or replace function public.analytics_funnel(
  p_from timestamptz, p_to timestamptz, p_channel text default null)
returns table (step text, sessions bigint)
language sql stable security invoker set search_path = public
as $$
  with s as (
    select id from analytics_sessions
    where started_at >= p_from and started_at < p_to
      and (p_channel is null or channel = p_channel)
  )
  select 'page_view'::text, count(*) from s
  union all
  select 'whatsapp_central_open'::text,
         count(distinct e.session_id) from analytics_events e join s on s.id = e.session_id
         where e.name = 'whatsapp_central_open'
  union all
  select 'whatsapp_click'::text,
         count(distinct e.session_id) from analytics_events e join s on s.id = e.session_id
         where e.name = 'whatsapp_click';
$$;

-- Botões nomeados (WhatsApp, telefone, mapa) × origem da sessão
create or replace function public.analytics_buttons(
  p_from timestamptz, p_to timestamptz, p_channel text default null)
returns table (kind text, subject text, option text, source text, channel text,
               clicks bigint, sessions bigint)
language sql stable security invoker set search_path = public
as $$
  select e.name as kind,
         case e.name
           when 'whatsapp_click' then e.params->>'subject'
           when 'phone_click'    then coalesce(e.params->>'label', e.params->>'phone')
           when 'maps_click'     then e.params->>'unit'
         end as subject,
         case e.name when 'whatsapp_click' then e.params->>'option' else e.params->>'phone' end as option,
         e.params->>'source' as source,
         s.channel,
         count(*) as clicks,
         count(distinct e.session_id) as sessions
  from analytics_events e
  join analytics_sessions s on s.id = e.session_id
  where e.name in ('whatsapp_click', 'phone_click', 'maps_click')
    and e.ts >= p_from and e.ts < p_to
    and (p_channel is null or s.channel = p_channel)
  group by 1, 2, 3, 4, 5
  order by 6 desc;
$$;

-- Jornadas: sessões com a trilha de eventos em ordem
create or replace function public.analytics_journeys(
  p_from timestamptz, p_to timestamptz, p_channel text default null,
  p_only_converted boolean default true, p_limit int default 50)
returns table (
  id uuid, started_at timestamptz, last_seen_at timestamptz, channel text,
  utm_campaign text, utm_term text, device text, browser text, os text,
  region text, city text, landing_path text, referrer_host text, converted boolean,
  trail jsonb)
language sql stable security invoker set search_path = public
as $$
  select s.id, s.started_at, s.last_seen_at, s.channel,
         s.utm_campaign, s.utm_term, s.device, s.browser, s.os,
         s.region, s.city, s.landing_path, s.referrer_host, s.converted,
         coalesce((
           select jsonb_agg(jsonb_build_object(
                    'ts', e.ts, 'name', e.name, 'path', e.path, 'title', e.title, 'params', e.params)
                  order by e.ts, e.id)
           from analytics_events e where e.session_id = s.id
         ), '[]'::jsonb) as trail
  from analytics_sessions s
  where s.started_at >= p_from and s.started_at < p_to
    and (p_channel is null or s.channel = p_channel)
    and (not p_only_converted or s.converted)
  order by s.started_at desc
  limit p_limit;
$$;

-- Últimos eventos (ao vivo)
create or replace function public.analytics_recent(p_limit int default 50)
returns table (ts timestamptz, session_id uuid, name text, path text, params jsonb,
               channel text, device text, city text, region text)
language sql stable security invoker set search_path = public
as $$
  select e.ts, e.session_id, e.name, e.path, e.params, s.channel, s.device, s.city, s.region
  from analytics_events e
  join analytics_sessions s on s.id = e.session_id
  order by e.ts desc, e.id desc
  limit p_limit;
$$;

-- Retenção: apaga sessões (e eventos, por cascade) mais antigas que N meses
create or replace function public.analytics_purge(p_months int default 13)
returns integer
language plpgsql security definer set search_path = public
as $$
declare n integer;
begin
  delete from analytics_sessions
   where started_at < now() - make_interval(months => p_months);
  get diagnostics n = row_count;
  return n;
end;
$$;

-- ---------- Permissões: só usuários autenticados executam as funções ----------
do $$
declare f record;
begin
  for f in
    select p.oid::regprocedure as sig
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname like 'analytics\_%'
  loop
    execute format('revoke all on function %s from public, anon', f.sig);
    execute format('grant execute on function %s to authenticated, service_role', f.sig);
  end loop;
end;
$$;

-- Security definer só para o servidor: trigger e purge nunca via /rest/v1/rpc
revoke all on function public.analytics_bump_session() from public, anon, authenticated;
revoke all on function public.analytics_purge(integer) from public, anon, authenticated;
grant execute on function public.analytics_purge(integer) to service_role;
-- pré-existente da 0001 (trigger de updated_at do blog): mesmo tratamento
revoke all on function public.set_updated_at() from public, anon, authenticated;

-- ---------- Opcional: limpeza mensal automática ----------
-- Habilitar pg_cron em Database → Extensions e rodar:
-- select cron.schedule('analytics-purge', '0 4 1 * *', 'select public.analytics_purge(13)');
