import { getCampaigns, type Range } from "@/lib/analytics-queries";
import { fmtInt, fmtPct } from "@/lib/analytics-types";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { DataTable, InlineBar } from "@/components/dashboard/DataTable";
import { EmptyState } from "@/components/dashboard/EmptyState";

/** Campanhas / termos / anúncios do Google Ads (via UTM + gclid). */
export async function CampaignsSection({ range }: { range: Range }) {
  const rows = await getCampaigns(range);
  const max = Math.max(0, ...rows.map((r) => Number(r.sessions)));
  const total = rows.reduce((s, r) => s + Number(r.sessions), 0);

  return (
    <ChartCard
      id="campanhas"
      title="Campanhas do Google Ads"
      description={total ? `${fmtInt(total)} visitas vindas de anúncios no período` : "Visitas com gclid/UTM de anúncio"}
      className="h-full"
    >
      {!rows.length ? (
        <EmptyState
          compact
          title="Nenhuma visita do Google Ads no período"
          hint="Quando as campanhas estiverem no ar com as UTMs, cada campanha, termo e anúncio aparece aqui."
        />
      ) : (
        <DataTable
          dense
          rows={rows}
          rowKey={(r, i) => `${r.utm_campaign}-${r.utm_term}-${r.utm_content}-${i}`}
          columns={[
            {
              key: "campaign",
              header: "Campanha · anúncio",
              render: (r) => (
                <div className="min-w-44">
                  <p className="font-semibold text-ink">{r.utm_campaign ?? "(sem utm_campaign)"}</p>
                  {r.utm_content ? <p className="text-xs text-ink-muted">{r.utm_content}</p> : null}
                </div>
              ),
            },
            { key: "term", header: "Termo", render: (r) => <span className="text-ink-body">{r.utm_term ?? "—"}</span> },
            {
              key: "sessions",
              header: "Visitas",
              align: "right",
              render: (r) => (
                <div className="min-w-20">
                  <span className="font-semibold">{fmtInt(r.sessions)}</span>
                  <InlineBar value={Number(r.sessions)} max={max} color="bg-brand-action" />
                </div>
              ),
            },
            { key: "wa", header: "WhatsApp", align: "right", render: (r) => fmtInt(r.wa_clicks) },
            { key: "conv", header: "Conv.", align: "right", render: (r) => fmtPct(r.conv_rate ?? 0) },
          ]}
        />
      )}
    </ChartCard>
  );
}
