import { getConsent, getFunnel, getVisitors, type Range } from "@/lib/analytics-queries";
import { CONSENT_LABELS, FUNNEL_LABELS, VISITOR_LABELS, fmtInt } from "@/lib/analytics-types";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { DonutChart } from "@/components/dashboard/charts/DonutChart";
import { FunnelBars } from "@/components/dashboard/charts/FunnelBars";
import { CHART } from "@/components/dashboard/charts/chartTheme";

const VISITOR_COLORS: Record<string, string> = {
  new: CHART.ink,
  returning: CHART.brand,
  unknown: CHART.muted,
};
const CONSENT_COLORS: Record<string, string> = {
  accepted: CHART.whatsapp,
  essential: CHART.amber,
  none: CHART.muted,
};

/** Novo × recorrente · Cobertura de consentimento · Funil. */
export async function AudienceSection({ range }: { range: Range }) {
  const [visitors, consent, funnel] = await Promise.all([
    getVisitors(range),
    getConsent(range),
    getFunnel(range),
  ]);

  const consentTotal = consent.reduce((s, c) => s + Number(c.sessions), 0);
  const accepted = consent.find((c) => c.choice === "accepted");
  const coverage = consentTotal ? Math.round((Number(accepted?.sessions ?? 0) / consentTotal) * 100) : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <ChartCard
        id="visitantes"
        title="Novo × recorrente"
        description="Quem está voltando ao site (código anônimo no navegador)"
        className="h-full"
      >
        <DonutChart
          totalLabel="visitas"
          data={visitors.map((v) => ({
            name: VISITOR_LABELS[v.kind] ?? v.kind,
            value: Number(v.sessions),
            color: VISITOR_COLORS[v.kind],
            hint: `${fmtInt(v.wa_clicks)} cliques no WhatsApp`,
          }))}
        />
      </ChartCard>

      <ChartCard
        id="consentimento"
        title="Cobertura de consentimento"
        description={`${coverage}% aceitaram cookies — é o que o GA4 e o Google Ads enxergam; o dashboard mede todos`}
        className="h-full"
      >
        <DonutChart
          totalLabel="visitas"
          data={consent.map((c) => ({
            name: CONSENT_LABELS[c.choice] ?? c.choice,
            value: Number(c.sessions),
            color: CONSENT_COLORS[c.choice],
          }))}
        />
      </ChartCard>

      <ChartCard
        id="funil"
        title="Funil até o WhatsApp"
        description="Visitas → abriram a Central → clicaram para falar"
        className="h-full md:col-span-2 xl:col-span-1"
      >
        <FunnelBars
          steps={funnel.map((f) => ({ label: FUNNEL_LABELS[f.step] ?? f.step, value: Number(f.sessions) }))}
        />
      </ChartCard>
    </div>
  );
}
