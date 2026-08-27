-- ============================================================
-- Mapas das unidades — maps_click agora traz `source` (contato, a-empresa)
-- e `via` (link = "Ver no mapa" / "Abrir no Google Maps"; embed = interagiu
-- com o mapa incorporado). Rodar DEPOIS da 0004.
-- Só recria analytics_buttons: a coluna `option` de maps_click passa a ser `via`.
-- ============================================================

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
         case e.name
           when 'whatsapp_click' then e.params->>'option'
           when 'maps_click'     then coalesce(e.params->>'via', 'link')
           else e.params->>'phone'
         end as option,
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
