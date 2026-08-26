"use client";

import { Clock, Eye, MessageCircle, Phone, Target, Timer, Users } from "lucide-react";
import type { KpisRow } from "@/lib/analytics-types";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { Reveal } from "@/components/motion/Reveal";

export function KpiGrid({ kpis, previous }: { kpis: KpisRow; previous?: KpisRow | null }) {
  const cards = [
    { label: "Visitas (sessões)", value: kpis.sessions, prev: previous?.sessions, icon: Users, format: "int", accent: "ink" },
    { label: "Páginas vistas", value: kpis.page_views, prev: previous?.page_views, icon: Eye, format: "int", accent: "ink" },
    { label: "Tempo médio por visita", value: kpis.avg_session_ms, prev: previous?.avg_session_ms, icon: Clock, format: "duration", accent: "ink" },
    { label: "Tempo médio por página", value: kpis.avg_page_ms, prev: previous?.avg_page_ms, icon: Timer, format: "duration", accent: "ink" },
    { label: "Cliques no WhatsApp", value: kpis.wa_clicks, prev: previous?.wa_clicks, icon: MessageCircle, format: "int", accent: "whatsapp" },
    { label: "Cliques no telefone", value: kpis.phone_clicks, prev: previous?.phone_clicks, icon: Phone, format: "int", accent: "brand" },
    { label: "Conversão (visitas → WhatsApp)", value: kpis.conv_rate, prev: previous?.conv_rate, icon: Target, format: "pct", accent: "brand" },
  ] as const;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c, i) => (
        <Reveal key={c.label} delay={i * 0.05} y={12}>
          <KpiCard
            label={c.label}
            value={Number(c.value ?? 0)}
            previous={previous ? Number(c.prev ?? 0) : null}
            icon={c.icon}
            format={c.format}
            accent={c.accent}
          />
        </Reveal>
      ))}
    </div>
  );
}
