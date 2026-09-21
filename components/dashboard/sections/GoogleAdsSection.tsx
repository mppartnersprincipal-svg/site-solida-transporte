import {
  Banknote,
  CircleDollarSign,
  Eye,
  MousePointerClick,
  Percent,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";
import type { Range } from "@/lib/analytics-queries";
import { getGoogleAdsReport } from "@/lib/google-ads";
import type { GoogleAdsCampaign } from "@/lib/google-ads-types";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { DataTable, type Column } from "@/components/dashboard/DataTable";
import { EmptyState } from "@/components/dashboard/EmptyState";

const integer = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
const decimal = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 });
const percentage = new Intl.NumberFormat("pt-BR", { style: "percent", maximumFractionDigits: 2 });

const campaignStatuses: Record<string, { label: string; className: string }> = {
  ENABLED: { label: "Ativa", className: "bg-whatsapp/10 text-[#157a3d]" },
  PAUSED: { label: "Pausada", className: "bg-surface-alt text-ink-muted" },
  REMOVED: { label: "Removida", className: "bg-brand-tint text-brand-hover" },
};

function formatDate(value: string) {
  return value.split("-").reverse().join("/");
}

export async function GoogleAdsSection({ range }: { range: Range }) {
  const report = await getGoogleAdsReport(range);

  if (report.status !== "ready") {
    return (
      <ChartCard id="google-ads" title="Google Ads" description="Investimento e resultados das campanhas de anúncios">
        <EmptyState
          compact
          title={report.status === "not_configured" ? "Conexão com o Google Ads pendente" : "Não foi possível carregar o Google Ads"}
          hint={report.message}
        />
      </ChartCard>
    );
  }

  const money = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: report.customer.currencyCode,
  });
  const formatMoney = (value: number | null) => value === null ? "—" : money.format(value);
  const formatPercent = (value: number | null) => value === null ? "—" : percentage.format(value);
  const formatRoas = (value: number | null) => value === null ? "—" : `${decimal.format(value)}×`;
  const totals = report.totals;
  const cards = [
    { label: "Investimento", value: formatMoney(totals.cost), icon: Wallet, hint: "Valor gasto em anúncios" },
    { label: "Impressões", value: integer.format(totals.impressions), icon: Eye, hint: "Exibições dos anúncios" },
    { label: "Cliques", value: integer.format(totals.clicks), icon: MousePointerClick, hint: "Cliques nos anúncios" },
    { label: "CTR", value: formatPercent(totals.ctr), icon: Percent, hint: "Cliques ÷ impressões" },
    { label: "CPC médio", value: formatMoney(totals.averageCpc), icon: CircleDollarSign, hint: "Custo médio por clique" },
    { label: "Conversões", value: decimal.format(totals.conversions), icon: Target, hint: "Conversões registradas no Google Ads" },
    { label: "Custo por conversão", value: formatMoney(totals.costPerConversion), icon: Banknote, hint: "Investimento ÷ conversões" },
    { label: "ROAS", value: formatRoas(totals.roas), icon: TrendingUp, hint: "Valor das conversões ÷ investimento" },
  ];
  const columns: Column<GoogleAdsCampaign>[] = [
    {
      key: "name",
      header: "Campanha",
      render: (campaign) => <span className="block min-w-44 font-semibold text-ink">{campaign.name}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (campaign) => {
        const status = campaignStatuses[campaign.status] ?? { label: "Não informado", className: "bg-surface-alt text-ink-muted" };
        return <span className={`inline-flex whitespace-nowrap rounded-full px-2 py-1 text-xs font-semibold ${status.className}`}>{status.label}</span>;
      },
    },
    { key: "cost", header: "Investimento", align: "right", render: (campaign) => formatMoney(campaign.cost) },
    { key: "impressions", header: "Impressões", align: "right", render: (campaign) => integer.format(campaign.impressions) },
    { key: "clicks", header: "Cliques", align: "right", render: (campaign) => integer.format(campaign.clicks) },
    { key: "ctr", header: "CTR", align: "right", render: (campaign) => formatPercent(campaign.ctr) },
    { key: "cpc", header: "CPC médio", align: "right", render: (campaign) => formatMoney(campaign.averageCpc) },
    { key: "conversions", header: "Conversões", align: "right", render: (campaign) => decimal.format(campaign.conversions) },
    { key: "cpa", header: "Custo / conv.", align: "right", render: (campaign) => formatMoney(campaign.costPerConversion) },
    { key: "roas", header: "ROAS", align: "right", render: (campaign) => formatRoas(campaign.roas) },
  ];

  return (
    <ChartCard
      id="google-ads"
      title="Google Ads"
      description={`Resultados da conta ${report.customer.name || "de anúncios"} · ${report.customer.currencyCode}`}
    >
      <div className="space-y-5">
        <div className="space-y-1 text-sm text-ink-muted">
          <p>
            {formatDate(report.from)} a {formatDate(report.to)} · Fuso da conta: {report.customer.timeZone}.
          </p>
          <p>O período selecionado se aplica aos anúncios. O filtro de origem se aplica apenas às visitas do site.</p>
        </div>

        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(({ label, value, icon: Icon, hint }) => (
            <div key={label} className="flex min-w-0 flex-col gap-3 rounded-2xl border border-line bg-white p-5">
              <dt className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-ink-muted">{label}</span>
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-tint text-brand-action">
                  <Icon aria-hidden className="size-4" />
                </span>
              </dt>
              <dd className="break-words font-display text-3xl font-bold tracking-tight text-ink tabular-nums">{value}</dd>
              <dd className="text-xs text-ink-muted">{hint}</dd>
            </div>
          ))}
        </dl>

        <div>
          <h3 className="mb-3 text-sm font-bold text-ink">Resultados por campanha</h3>
          {report.campaigns.length ? (
            <DataTable rows={report.campaigns} rowKey={(campaign) => campaign.id} columns={columns} minWidth={1160} dense />
          ) : (
            <EmptyState
              compact
              title="Nenhuma campanha com resultados no período"
              hint="Tente ampliar o período para consultar os resultados dos anúncios."
            />
          )}
        </div>

        <p className="text-xs text-ink-muted">
          As conversões seguem a atribuição do Google Ads e podem ser atualizadas após a interação com o anúncio.
          {" "}ROAS depende do valor atribuído às conversões. “—” indica uma taxa que não pode ser calculada no período.
        </p>
      </div>
    </ChartCard>
  );
}
