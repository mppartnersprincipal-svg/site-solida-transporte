import { MapPin, MessageCircle, Phone } from "lucide-react";
import { getButtons, type Range } from "@/lib/analytics-queries";
import {
  CHANNEL_ORDER,
  fmtInt,
  labelChannel,
  labelSource,
  labelSubject,
  type ButtonRow,
} from "@/lib/analytics-types";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { DataTable, InlineBar } from "@/components/dashboard/DataTable";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

type Pivot = { name: string; total: number; cells: Record<string, number> };

function pivot(rows: ButtonRow[], colKey: (r: ButtonRow) => string): { rows: Pivot[]; cols: string[] } {
  const map = new Map<string, Pivot>();
  const cols = new Set<string>();
  for (const r of rows) {
    const name = buttonName(r);
    const col = colKey(r) || "—";
    cols.add(col);
    const p = map.get(name) ?? { name, total: 0, cells: {} };
    p.total += Number(r.clicks);
    p.cells[col] = (p.cells[col] ?? 0) + Number(r.clicks);
    map.set(name, p);
  }
  return {
    rows: [...map.values()].sort((a, b) => b.total - a.total),
    cols: [...cols],
  };
}

function buttonName(r: ButtonRow) {
  if (r.kind === "whatsapp_click") return labelSubject(r.subject);
  if (r.kind === "phone_click") return `Telefone: ${r.subject ?? "—"}`;
  return `${r.option === "embed" ? "Mapa interativo" : "Mapa"}: ${r.subject ?? "—"}`;
}

function PivotTable({ title, data, colLabel }: { title: string; data: ReturnType<typeof pivot>; colLabel: (c: string) => string }) {
  if (!data.rows.length) return null;
  const max = Math.max(...data.rows.map((r) => r.total));
  return (
    <div>
      <h3 className="mb-2 text-sm font-bold text-ink">{title}</h3>
      <DataTable
        dense
        rows={data.rows}
        rowKey={(r) => r.name}
        columns={[
          {
            key: "name",
            header: "Botão",
            render: (r) => (
              <div className="min-w-44">
                <p className="font-semibold text-ink">{r.name}</p>
                <InlineBar value={r.total} max={max} color="bg-whatsapp" />
              </div>
            ),
          },
          { key: "total", header: "Total", align: "right", render: (r) => <span className="font-bold">{fmtInt(r.total)}</span> },
          ...data.cols.map((c) => ({
            key: c,
            header: colLabel(c),
            align: "right" as const,
            render: (r: Pivot) => (r.cells[c] ? fmtInt(r.cells[c]) : <span className="text-ink-muted/50">–</span>),
          })),
        ]}
      />
    </div>
  );
}

/** Botões nomeados da Central/telefone/mapa × origem × região × onde foi clicado. */
export async function ButtonsSection({ range }: { range: Range }) {
  const rows = await getButtons(range);
  const wa = rows.filter((r) => r.kind === "whatsapp_click");
  const others = rows.filter((r) => r.kind !== "whatsapp_click");

  // Cards por botão da Central
  const cards = new Map<string, { clicks: number; sessions: number }>();
  for (const r of wa) {
    const k = labelSubject(r.subject);
    const c = cards.get(k) ?? { clicks: 0, sessions: 0 };
    c.clicks += Number(r.clicks);
    c.sessions += Number(r.sessions);
    cards.set(k, c);
  }
  const cardList = [...cards.entries()].sort((a, b) => b[1].clicks - a[1].clicks);
  const maxClicks = Math.max(0, ...cardList.map(([, c]) => c.clicks));

  const byChannel = pivot(rows, (r) => r.channel);
  byChannel.cols.sort((a, b) => CHANNEL_ORDER.indexOf(a as never) - CHANNEL_ORDER.indexOf(b as never));
  const byRegion = pivot(wa.filter((r) => r.option), (r) => r.option ?? "");
  const bySource = pivot(rows, (r) => r.source ?? "");

  const otherTotals = others.reduce<Record<string, number>>((acc, r) => {
    const k = buttonName(r);
    acc[k] = (acc[k] ?? 0) + Number(r.clicks);
    return acc;
  }, {});

  return (
    <ChartCard
      id="botoes"
      title="Botões da Central de WhatsApp"
      description="Quantas vezes cada botão foi clicado — e de onde veio quem clicou"
    >
      {!rows.length ? (
        <EmptyState compact title="Nenhum clique em botão de contato no período" hint="" />
      ) : (
        <div className="space-y-8">
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            {cardList.map(([name, c], i) => (
              <Reveal as="li" key={name} delay={i * 0.05} y={10}>
                <div
                  className={cn(
                    "flex h-full flex-col gap-2 rounded-2xl border p-4",
                    i === 0 ? "border-whatsapp/40 bg-whatsapp/5" : "border-line bg-surface-alt/60"
                  )}
                >
                  <div className="flex items-center gap-2 text-whatsapp">
                    <MessageCircle aria-hidden className="size-4" />
                    <span className="text-xs font-semibold tracking-wide text-ink-muted uppercase">WhatsApp</span>
                  </div>
                  <p className="text-sm leading-snug font-semibold text-ink">{name}</p>
                  <p className="font-display text-3xl font-bold tabular-nums text-ink">{fmtInt(c.clicks)}</p>
                  <p className="text-xs text-ink-muted">
                    {fmtInt(c.sessions)} {c.sessions === 1 ? "visita" : "visitas"}
                  </p>
                  <InlineBar value={c.clicks} max={maxClicks} color="bg-whatsapp" />
                </div>
              </Reveal>
            ))}
            {Object.entries(otherTotals)
              .sort((a, b) => b[1] - a[1])
              .map(([name, clicks], i) => (
                <Reveal as="li" key={name} delay={(cardList.length + i) * 0.05} y={10}>
                  <div className="flex h-full flex-col gap-2 rounded-2xl border border-line bg-surface-alt/60 p-4">
                    <div className="flex items-center gap-2 text-brand-action">
                      {name.startsWith("Mapa") ? <MapPin aria-hidden className="size-4" /> : <Phone aria-hidden className="size-4" />}
                      <span className="text-xs font-semibold tracking-wide text-ink-muted uppercase">
                        {name.startsWith("Mapa") ? "Mapa" : "Ligação"}
                      </span>
                    </div>
                    <p className="text-sm leading-snug font-semibold text-ink">{name.replace(/^(Telefone|Mapa interativo|Mapa): /, "")}</p>
                    <p className="font-display text-3xl font-bold tabular-nums text-ink">{fmtInt(clicks)}</p>
                  </div>
                </Reveal>
              ))}
          </ul>

          <div className="grid gap-6 xl:grid-cols-2">
            <PivotTable title="Botão × origem da visita" data={byChannel} colLabel={labelChannel} />
            <PivotTable title="Botão × onde foi clicado" data={bySource} colLabel={labelSource} />
          </div>
          {byRegion.rows.length ? (
            <PivotTable title="Botão × região escolhida" data={byRegion} colLabel={(c) => c} />
          ) : null}
        </div>
      )}
    </ChartCard>
  );
}
