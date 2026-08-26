import { getHeatmap, type Range } from "@/lib/analytics-queries";
import { fmtInt } from "@/lib/analytics-types";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { EmptyState } from "@/components/dashboard/EmptyState";

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

/** Heatmap dia da semana × hora (grid CSS). */
export async function HeatmapSection({ range }: { range: Range }) {
  const rows = await getHeatmap(range);
  const grid = new Map<string, number>();
  let max = 0;
  for (const r of rows) {
    grid.set(`${r.dow}-${r.hour}`, Number(r.sessions));
    max = Math.max(max, Number(r.sessions));
  }
  // horas com mais visitas
  const byHour = Array.from({ length: 24 }, (_, h) =>
    rows.filter((r) => Number(r.hour) === h).reduce((s, r) => s + Number(r.sessions), 0)
  );
  const bestHour = byHour.indexOf(Math.max(...byHour));
  const byDay = DAYS.map((_, d) => rows.filter((r) => Number(r.dow) === d).reduce((s, r) => s + Number(r.sessions), 0));
  const bestDay = byDay.indexOf(Math.max(...byDay));

  return (
    <ChartCard
      id="horarios"
      title="Horários de visita"
      description={
        max
          ? `Pico: ${DAYS[bestDay]} · ${String(bestHour).padStart(2, "0")}h–${String(bestHour + 1).padStart(2, "0")}h (horário de Brasília)`
          : "Dia da semana × hora (horário de Brasília)"
      }
      className="h-full"
    >
      {!max ? (
        <EmptyState compact hint="" />
      ) : (
        <div className="overflow-x-auto">
          <div className="grid min-w-[560px] grid-cols-[2.5rem_repeat(24,minmax(0,1fr))] gap-0.5 text-[10px] text-ink-muted">
            <div />
            {Array.from({ length: 24 }, (_, h) => (
              <div key={h} className="pb-1 text-center tabular-nums">
                {h % 3 === 0 ? `${h}h` : ""}
              </div>
            ))}
            {DAYS.map((d, di) => (
              <div key={d} className="contents">
                <div className="pr-1 text-right leading-5 font-semibold text-ink-body">{d}</div>
                {Array.from({ length: 24 }, (_, h) => {
                  const v = grid.get(`${di}-${h}`) ?? 0;
                  const pct = max ? Math.round((v / max) * 100) : 0;
                  return (
                    <div
                      key={h}
                      title={`${d} ${h}h–${h + 1}h: ${fmtInt(v)} ${v === 1 ? "visita" : "visitas"}`}
                      className="h-5 rounded-sm"
                      style={{
                        background: v
                          ? `color-mix(in oklab, var(--color-brand-action) ${Math.max(12, pct)}%, var(--color-surface-alt))`
                          : "var(--color-surface-alt)",
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-ink-muted">Quanto mais forte o vermelho, mais visitas naquele horário.</p>
        </div>
      )}
    </ChartCard>
  );
}
