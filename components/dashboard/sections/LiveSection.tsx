import { getRecent } from "@/lib/analytics-queries";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { LiveFeed } from "@/components/dashboard/LiveFeed";

/** Últimos eventos do site, atualizando sozinho. */
export async function LiveSection() {
  const initial = await getRecent(40);
  return (
    <ChartCard id="ao-vivo" title="Ao vivo" description="Últimos eventos registrados — atualiza a cada 30 s" className="h-full">
      <LiveFeed initial={initial} />
    </ChartCard>
  );
}
