-- ============================================================
-- Fase D3 — visitante novo × recorrente + cobertura de consentimento
-- Rodar no SQL Editor (ou via conector) DEPOIS da 0003.
--
-- visitor_id: código aleatório gerado no navegador (localStorage, 13 meses),
-- sem PII. Não existe para quem recusou ("Só o essencial") → null.
-- ============================================================

alter table public.analytics_sessions
  add column if not exists visitor_id   uuid,
  add column if not exists is_returning boolean not null default false;

create index if not exists analytics_sessions_visitor_idx
  on public.analytics_sessions (visitor_id, started_at desc)
  where visitor_id is not null;

-- Marca a sessão como recorrente se o mesmo visitor_id já tinha sessão antes
create or replace function public.analytics_mark_returning()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.visitor_id is not null then
    new.is_returning := exists (
      select 1 from public.analytics_sessions s
      where s.visitor_id = new.visitor_id and s.id <> new.id
    );
  end if;
  return new;
end;
$$;

drop trigger if exists analytics_sessions_returning on public.analytics_sessions;
create trigger analytics_sessions_returning
  before insert on public.analytics_sessions
  for each row execute function public.analytics_mark_returning();

revoke all on function public.analytics_mark_returning() from public, anon, authenticated;

-- Novo × recorrente × sem identificador (recusou)
create or replace function public.analytics_visitors(
  p_from timestamptz, p_to timestamptz, p_channel text default null)
returns table (kind text, sessions bigint, wa_clicks bigint)
language sql stable security invoker set search_path = public
as $$
  select case when s.visitor_id is null then 'unknown'
              when s.is_returning then 'returning' else 'new' end as kind,
         count(distinct s.id) as sessions,
         count(e.id) as wa_clicks
  from analytics_sessions s
  left join analytics_events e on e.session_id = s.id and e.name = 'whatsapp_click'
  where s.started_at >= p_from and s.started_at < p_to
    and (p_channel is null or s.channel = p_channel)
  group by 1
  order by 2 desc;
$$;

-- Cobertura do banner de cookies: aceitou × só essencial × não respondeu
create or replace function public.analytics_consent(p_from timestamptz, p_to timestamptz)
returns table (choice text, sessions bigint)
language sql stable security invoker set search_path = public
as $$
  with s as (
    select id from analytics_sessions
    where started_at >= p_from and started_at < p_to
  ),
  c as (
    select distinct on (e.session_id) e.session_id, e.params->>'consent_choice' as choice
    from analytics_events e join s on s.id = e.session_id
    where e.name = 'cookie_consent'
    order by e.session_id, e.ts desc
  )
  select coalesce(c.choice, 'none') as choice, count(*) as sessions
  from s left join c on c.session_id = s.id
  group by 1
  order by 2 desc;
$$;

do $$
declare f record;
begin
  for f in
    select p.oid::regprocedure as sig
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname in ('analytics_visitors', 'analytics_consent')
  loop
    execute format('revoke all on function %s from public, anon', f.sig);
    execute format('grant execute on function %s to authenticated, service_role', f.sig);
  end loop;
end;
$$;

-- Jornadas passam a informar se o visitante já esteve no site antes
drop function if exists public.analytics_journeys(timestamptz, timestamptz, text, boolean, int);
create or replace function public.analytics_journeys(
  p_from timestamptz, p_to timestamptz, p_channel text default null,
  p_only_converted boolean default true, p_limit int default 50)
returns table (
  id uuid, started_at timestamptz, last_seen_at timestamptz, channel text,
  utm_campaign text, utm_term text, device text, browser text, os text,
  region text, city text, landing_path text, referrer_host text, converted boolean,
  is_returning boolean, trail jsonb)
language sql stable security invoker set search_path = public
as $$
  select s.id, s.started_at, s.last_seen_at, s.channel,
         s.utm_campaign, s.utm_term, s.device, s.browser, s.os,
         s.region, s.city, s.landing_path, s.referrer_host, s.converted, s.is_returning,
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
revoke all on function public.analytics_journeys(timestamptz, timestamptz, text, boolean, int) from public, anon;
grant execute on function public.analytics_journeys(timestamptz, timestamptz, text, boolean, int) to authenticated, service_role;
