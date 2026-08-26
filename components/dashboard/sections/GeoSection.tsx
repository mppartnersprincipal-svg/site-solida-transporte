import { getGeo, type Range } from "@/lib/analytics-queries";
import { fmtInt } from "@/lib/analytics-types";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { DataTable, InlineBar } from "@/components/dashboard/DataTable";
import { EmptyState } from "@/components/dashboard/EmptyState";

const UF: Record<string, string> = {
  GO: "Goiás", DF: "Distrito Federal", SP: "São Paulo", RJ: "Rio de Janeiro", MG: "Minas Gerais",
  PR: "Paraná", SC: "Santa Catarina", RS: "Rio Grande do Sul", BA: "Bahia", MT: "Mato Grosso",
  MS: "Mato Grosso do Sul", TO: "Tocantins", ES: "Espírito Santo", PE: "Pernambuco", CE: "Ceará",
  PA: "Pará", AM: "Amazonas", MA: "Maranhão", PB: "Paraíba", RN: "Rio Grande do Norte", PI: "Piauí",
  AL: "Alagoas", SE: "Sergipe", RO: "Rondônia", AC: "Acre", AP: "Amapá", RR: "Roraima",
};

/** Estados (barras) + cidades (tabela). */
export async function GeoSection({ range }: { range: Range }) {
  const rows = await getGeo(range, 40);
  const known = rows.filter((r) => r.city || r.region);

  const byState = new Map<string, number>();
  for (const r of rows) {
    const k = r.region ? `${UF[r.region] ?? r.region} (${r.region})` : "Não identificado";
    byState.set(k, (byState.get(k) ?? 0) + Number(r.sessions));
  }
  const states = [...byState.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  const maxCity = Math.max(0, ...known.map((r) => Number(r.sessions)));

  return (
    <ChartCard
      id="geo"
      title="De onde acessam"
      description="Estado e cidade aproximados (pela rede do visitante — sem IP armazenado)"
      className="h-full"
    >
      {!rows.length ? (
        <EmptyState compact hint="" />
      ) : (
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <h3 className="mb-2 text-sm font-bold text-ink">Por estado</h3>
            <ul className="space-y-2.5">
              {states.slice(0, 8).map((s) => (
                <li key={s.name} className="text-sm">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-ink-body">{s.name}</span>
                    <span className="font-semibold tabular-nums text-ink">{fmtInt(s.value)}</span>
                  </div>
                  <InlineBar value={s.value} max={states[0]?.value ?? 0} color="bg-brand-action" />
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-3">
            <h3 className="mb-2 text-sm font-bold text-ink">Por cidade</h3>
            {known.length ? (
              <DataTable
                dense
                rows={known.slice(0, 15)}
                rowKey={(r) => `${r.region}-${r.city}`}
                columns={[
                  {
                    key: "city",
                    header: "Cidade",
                    render: (r) => (
                      <div className="min-w-36">
                        <p className="font-semibold text-ink">{r.city ?? "—"}</p>
                        <p className="text-xs text-ink-muted">{r.region ?? ""}</p>
                      </div>
                    ),
                  },
                  {
                    key: "sessions",
                    header: "Visitas",
                    align: "right",
                    render: (r) => (
                      <div className="min-w-20">
                        <span className="font-semibold">{fmtInt(r.sessions)}</span>
                        <InlineBar value={Number(r.sessions)} max={maxCity} color="bg-brand-action" />
                      </div>
                    ),
                  },
                  { key: "wa", header: "WhatsApp", align: "right", render: (r) => fmtInt(r.wa_clicks) },
                ]}
              />
            ) : (
              <p className="text-sm text-ink-muted">Cidades só aparecem em visitas reais pela Vercel (em ambiente local ficam vazias).</p>
            )}
          </div>
        </div>
      )}
    </ChartCard>
  );
}
