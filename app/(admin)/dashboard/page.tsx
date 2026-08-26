import type { Metadata } from "next";
import { Suspense } from "react";
import {
  getByChannel,
  getByDevice,
  getDaily,
  getKpis,
  getPhone,
  getRange,
  getTopPages,
  getWhatsApp,
  previousRange,
  type SearchParams,
} from "@/lib/analytics-queries";
import {
  fmtDuration,
  fmtInt,
  fmtPct,
  labelChannel,
  labelDevice,
  labelPage,
  labelSubject,
} from "@/lib/analytics-types";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { SectionNav } from "@/components/dashboard/SectionNav";
import { KpiGrid } from "@/components/dashboard/KpiGrid";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { DataTable, InlineBar } from "@/components/dashboard/DataTable";
import { CardSkeleton } from "@/components/dashboard/Skeleton";
import { DailyAreaChart } from "@/components/dashboard/charts/DailyAreaChart";
import { DonutChart } from "@/components/dashboard/charts/DonutChart";
import { HorizontalBars } from "@/components/dashboard/charts/HorizontalBars";
import { CHANNEL_COLORS, DEVICE_COLORS } from "@/components/dashboard/charts/chartTheme";
import { AudienceSection } from "@/components/dashboard/sections/AudienceSection";
import { ButtonsSection } from "@/components/dashboard/sections/ButtonsSection";
import { JourneysSection } from "@/components/dashboard/sections/JourneysSection";
import { HeatmapSection } from "@/components/dashboard/sections/HeatmapSection";
import { GeoSection } from "@/components/dashboard/sections/GeoSection";
import { CampaignsSection } from "@/components/dashboard/sections/CampaignsSection";
import { BlogSection } from "@/components/dashboard/sections/BlogSection";
import { ClicksSection } from "@/components/dashboard/sections/ClicksSection";
import { LiveSection } from "@/components/dashboard/sections/LiveSection";

export const metadata: Metadata = { title: "Dashboard | Área administrativa" };
export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const range = getRange(sp);
  const prev = previousRange(range);

  const [kpis, prevKpis, daily, byChannel, byDevice, topPages, whatsapp, phone] =
    await Promise.all([
      getKpis(range),
      getKpis(prev),
      getDaily(range),
      getByChannel(range),
      getByDevice(range),
      getTopPages(range, 12),
      getWhatsApp(range),
      getPhone(range),
    ]);

  const hasData = kpis.sessions > 0;

  const waBySubject = Object.values(
    whatsapp.reduce<Record<string, { name: string; value: number }>>((acc, r) => {
      const key = r.subject ?? "—";
      acc[key] ??= { name: labelSubject(key), value: 0 };
      acc[key].value += Number(r.clicks);
      return acc;
    }, {})
  );
  const phoneByUnit = Object.values(
    phone.reduce<Record<string, { name: string; value: number }>>((acc, r) => {
      const key = r.label ?? r.phone ?? "—";
      acc[key] ??= { name: key, value: 0 };
      acc[key].value += Number(r.clicks);
      return acc;
    }, {})
  );
  const maxViews = Math.max(0, ...topPages.map((p) => Number(p.views)));

  return (
    <div className="space-y-6">
      <div id="kpis" className="flex flex-wrap items-end justify-between gap-4 scroll-mt-28">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Comportamento dos visitantes · {range.label}
            {range.channel ? ` · ${labelChannel(range.channel)}` : ""}
          </p>
        </div>
      </div>

      <SectionNav />

      <DashboardFilters period={range.period} channel={range.channel} de={range.de} ate={range.ate} />

      <KpiGrid kpis={kpis} previous={prevKpis} />

      {!hasData ? (
        <EmptyState
          title="Nenhuma visita registrada no período"
          hint="Os dados aparecem aqui assim que alguém acessar o site. Tente outro período ou remova o filtro de origem."
        />
      ) : null}

      {/* Visitas por dia + origem */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard
            id="visitas"
            title="Visitas por dia"
            description="Sessões (área) e cliques no WhatsApp (linha verde, eixo da direita)"
            className="h-full"
          >
            {hasData ? <DailyAreaChart data={daily} /> : <EmptyState compact hint="" />}
          </ChartCard>
        </div>
        <ChartCard
          id="origem"
          title="De onde vêm as visitas"
          description={
            range.channel
              ? "Todas as origens no período (este gráfico ignora o filtro de origem)"
              : "Google Ads × orgânico × direto × redes"
          }
          className="h-full"
        >
          <DonutChart
            totalLabel="visitas"
            data={byChannel.map((c) => ({
              name: labelChannel(c.channel),
              value: Number(c.sessions),
              color: CHANNEL_COLORS[c.channel],
              hint: `${fmtInt(c.wa_clicks)} cliques no WhatsApp`,
            }))}
          />
        </ChartCard>
      </div>

      {/* Novo × recorrente · consentimento · funil */}
      <Suspense fallback={<CardSkeleton height={220} />}>
        <AudienceSection range={range} />
      </Suspense>

      {/* Dispositivo · WhatsApp por assunto · telefone */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ChartCard id="dispositivo" title="Dispositivo" description="Celular, computador ou tablet" className="h-full">
          <DonutChart
            totalLabel="visitas"
            data={byDevice.map((d) => ({
              name: labelDevice(d.device),
              value: Number(d.sessions),
              color: DEVICE_COLORS[d.device],
            }))}
          />
        </ChartCard>
        <ChartCard id="whatsapp-assunto" title="WhatsApp por assunto" description="Qual botão da Central foi clicado" className="h-full">
          <DonutChart totalLabel="cliques" data={waBySubject} emptyTitle="Nenhum clique no WhatsApp" />
        </ChartCard>
        <ChartCard
          id="telefone-unidade"
          title="Telefone por unidade"
          description="Cliques em ligar (página Contato)"
          className="h-full md:col-span-2 xl:col-span-1"
        >
          <DonutChart totalLabel="cliques" data={phoneByUnit} emptyTitle="Nenhum clique em telefone" />
        </ChartCard>
      </div>

      {/* Botões nomeados */}
      <Suspense fallback={<CardSkeleton height={320} />}>
        <ButtonsSection range={range} />
      </Suspense>

      {/* Jornadas */}
      <Suspense fallback={<CardSkeleton height={400} />}>
        <JourneysSection range={range} sp={sp} />
      </Suspense>

      {/* Páginas */}
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <ChartCard id="paginas" title="Páginas mais vistas" description="Top 10 por visualizações" className="h-full">
            <HorizontalBars
              valueLabel="Visualizações"
              data={topPages.map((p) => ({ name: labelPage(p.path, p.title), value: Number(p.views) }))}
            />
          </ChartCard>
        </div>
        <div className="lg:col-span-3">
          <ChartCard
            id="paginas-tempo"
            title="Tempo e leitura por página"
            description="Quanto tempo o visitante fica e até onde rola cada página"
            className="h-full"
          >
            {topPages.length ? (
              <DataTable
                rows={topPages}
                rowKey={(p) => p.path}
                dense
                columns={[
                  {
                    key: "page",
                    header: "Página",
                    render: (p) => (
                      <div className="min-w-40">
                        <p className="truncate font-semibold text-ink" title={p.path}>
                          {labelPage(p.path, p.title)}
                        </p>
                        <p className="truncate text-xs text-ink-muted">{p.path}</p>
                      </div>
                    ),
                  },
                  {
                    key: "views",
                    header: "Views",
                    align: "right",
                    render: (p) => (
                      <div className="min-w-24">
                        <span className="font-semibold text-ink">{fmtInt(p.views)}</span>
                        <InlineBar value={Number(p.views)} max={maxViews} />
                      </div>
                    ),
                  },
                  { key: "time", header: "Tempo médio", align: "right", render: (p) => fmtDuration(p.avg_ms) },
                  { key: "scroll", header: "Scroll médio", align: "right", render: (p) => fmtPct(p.avg_scroll, 0) },
                ]}
              />
            ) : (
              <EmptyState compact hint="" />
            )}
          </ChartCard>
        </div>
      </div>

      {/* Horários + geografia */}
      <div className="grid gap-4 xl:grid-cols-2">
        <Suspense fallback={<CardSkeleton height={220} />}>
          <HeatmapSection range={range} />
        </Suspense>
        <Suspense fallback={<CardSkeleton height={220} />}>
          <GeoSection range={range} />
        </Suspense>
      </div>

      {/* Campanhas + blog */}
      <div className="grid gap-4 xl:grid-cols-2">
        <Suspense fallback={<CardSkeleton height={220} />}>
          <CampaignsSection range={range} />
        </Suspense>
        <Suspense fallback={<CardSkeleton height={220} />}>
          <BlogSection range={range} />
        </Suspense>
      </div>

      {/* Cliques + ao vivo */}
      <div className="grid gap-4 xl:grid-cols-2">
        <Suspense fallback={<CardSkeleton height={320} />}>
          <ClicksSection range={range} />
        </Suspense>
        <Suspense fallback={<CardSkeleton height={320} />}>
          <LiveSection />
        </Suspense>
      </div>
    </div>
  );
}
