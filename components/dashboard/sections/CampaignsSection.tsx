import { getCampaigns, type Range } from "@/lib/analytics-queries";
import { fmtInt, fmtPct, type CampaignRow } from "@/lib/analytics-types";
import { cn } from "@/lib/utils";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { DataTable, InlineBar } from "@/components/dashboard/DataTable";
import { EmptyState } from "@/components/dashboard/EmptyState";

/** Canal `social` só entra aqui com utm_campaign — na prática, anúncio do Meta. */
function platformLabel(r: CampaignRow) {
  return r.channel === "social" ? "Meta Ads" : "Google Ads";
}

/** Zero fica apagado para os números que importam saltarem na tabela. */
function Count({ value }: { value: number | undefined }) {
  const n = Number(value ?? 0);
  return <span className={cn(n ? "font-semibold text-ink" : "text-ink-muted")}>{fmtInt(n)}</span>;
}

/** Visitas e resultados por campanha/anúncio (Google Ads e Meta), pelo rastreamento do site. */
export async function CampaignsSection({ range }: { range: Range }) {
  const rows = await getCampaigns(range);
  const max = Math.max(0, ...rows.map((r) => Number(r.sessions)));
  const sum = (pick: (r: CampaignRow) => number | undefined) =>
    rows.reduce((s, r) => s + Number(pick(r) ?? 0), 0);
  const total = sum((r) => r.sessions);
  const cand = sum((r) => r.candidaturas);

  return (
    <ChartCard
      id="campanhas"
      title="Campanhas de anúncios no site"
      description={
        total
          ? `${fmtInt(total)} visitas vindas de anúncios no período` +
            (cand ? ` · ${fmtInt(cand)} candidatura${cand === 1 ? "" : "s"}` : "")
          : "Visitas identificadas pelos links das campanhas (Google Ads e Meta)"
      }
    >
      {!rows.length ? (
        <EmptyState
          compact
          title="Nenhuma visita atribuída a anúncios no período"
          hint="As campanhas aparecem aqui quando seus links identificam a origem das visitas ao site."
        />
      ) : (
        <DataTable
          dense
          minWidth={760}
          rows={rows}
          rowKey={(r, i) => `${r.channel}-${r.utm_campaign}-${r.utm_term}-${r.utm_content}-${i}`}
          columns={[
            {
              key: "campaign",
              header: "Campanha · anúncio",
              render: (r) => (
                <div className="min-w-52">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                      r.channel === "social" ? "bg-surface-alt text-ink-body" : "bg-brand-tint text-brand-hover"
                    )}
                  >
                    {platformLabel(r)}
                  </span>
                  <p className="mt-1 font-semibold text-ink">{r.utm_campaign ?? "Campanha não identificada"}</p>
                  {r.utm_content || r.utm_term ? (
                    <p className="text-xs text-ink-muted">
                      {[r.utm_content, r.utm_term].filter(Boolean).join(" · ")}
                    </p>
                  ) : null}
                </div>
              ),
            },
            {
              key: "sessions",
              header: "Visitas (cliques)",
              align: "right",
              render: (r) => (
                <div className="min-w-20">
                  <span className="font-semibold">{fmtInt(r.sessions)}</span>
                  <InlineBar value={Number(r.sessions)} max={max} color="bg-brand-action" />
                </div>
              ),
            },
            { key: "cand", header: "Candidaturas", align: "right", render: (r) => <Count value={r.candidaturas} /> },
            { key: "wa_rh", header: "WhatsApp RH", align: "right", render: (r) => <Count value={r.wa_rh_clicks} /> },
            { key: "wa", header: "WhatsApp frete", align: "right", render: (r) => <Count value={r.wa_clicks} /> },
            { key: "conv", header: "Conversão", align: "right", render: (r) => fmtPct(r.conv_rate ?? 0) },
          ]}
        />
      )}
    </ChartCard>
  );
}
