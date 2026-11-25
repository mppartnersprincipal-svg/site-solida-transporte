-- ============================================================
-- Card "Campanhas" do /dashboard — passa a mostrar também as campanhas do
-- Meta (canal `social` com utm_campaign, ex.: anúncio de vagas) e conta, por
-- campanha/anúncio, WhatsApp de frete, candidaturas e WhatsApp do RH.
-- Rodar DEPOIS da 0008. O tipo de retorno mudou → drop + create (e as
-- permissões precisam ser refeitas, porque o Supabase libera função nova
-- para `anon` por padrão).
-- ============================================================

drop function if exists public.analytics_campaigns(timestamptz, timestamptz);

create function public.analytics_campaigns(p_from timestamptz, p_to timestamptz)
returns table (channel text, utm_campaign text, utm_term text, utm_content text,
               sessions bigint, wa_clicks bigint, candidaturas bigint,
               wa_rh_clicks bigint, conv_rate numeric)
language sql stable security invoker set search_path = public
as $$
  with s as (
    select id, channel, utm_campaign, utm_term, utm_content
    from analytics_sessions
    where started_at >= p_from and started_at < p_to
      and (channel = 'google_ads' or (channel = 'social' and utm_campaign is not null))
  ),
  ev as (
    -- 1 linha por sessão (evita multiplicar ao juntar com várias contagens)
    select e.session_id,
           count(*) filter (where e.name = 'whatsapp_click')      as wa,
           count(*) filter (where e.name = 'candidatura_enviada') as cand,
           count(*) filter (where e.name = 'whatsapp_rh_click')   as wa_rh
    from analytics_events e
    join s on s.id = e.session_id
    where e.name in ('whatsapp_click', 'candidatura_enviada', 'whatsapp_rh_click')
    group by e.session_id
  )
  select s.channel, s.utm_campaign, s.utm_term, s.utm_content,
         count(*) as sessions,
         coalesce(sum(ev.wa), 0)::bigint    as wa_clicks,
         coalesce(sum(ev.cand), 0)::bigint  as candidaturas,
         coalesce(sum(ev.wa_rh), 0)::bigint as wa_rh_clicks,
         round(count(ev.session_id)::numeric / nullif(count(*), 0) * 100, 1) as conv_rate
  from s
  left join ev on ev.session_id = s.id
  group by s.channel, s.utm_campaign, s.utm_term, s.utm_content
  order by sessions desc;
$$;

revoke all on function public.analytics_campaigns(timestamptz, timestamptz) from public, anon;
grant execute on function public.analytics_campaigns(timestamptz, timestamptz) to authenticated, service_role;
