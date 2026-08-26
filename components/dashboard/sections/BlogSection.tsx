import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { getBlog, type Range } from "@/lib/analytics-queries";
import { fmtDuration, fmtInt, fmtPct } from "@/lib/analytics-types";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { DataTable, InlineBar } from "@/components/dashboard/DataTable";
import { EmptyState } from "@/components/dashboard/EmptyState";

/** Posts mais lidos, com tempo e scroll médios. */
export async function BlogSection({ range }: { range: Range }) {
  const rows = await getBlog(range, 15);
  const max = Math.max(0, ...rows.map((r) => Number(r.views)));

  return (
    <ChartCard id="blog" title="Blog — posts mais lidos" description="Leituras, tempo médio e até onde o leitor chega" className="h-full">
      {!rows.length ? (
        <EmptyState compact title="Nenhuma leitura de post no período" hint="" />
      ) : (
        <DataTable
          dense
          rows={rows}
          rowKey={(r) => r.post_slug}
          columns={[
            {
              key: "post",
              header: "Post",
              render: (r) => (
                <div className="min-w-48">
                  <Link
                    href={`/blog/${r.post_slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 font-semibold text-ink hover:text-brand-action"
                  >
                    <span className="line-clamp-2">{r.post_title ?? r.post_slug}</span>
                    <ExternalLink aria-hidden className="size-3 shrink-0" />
                  </Link>
                  <p className="text-xs text-ink-muted">{r.post_category ?? ""}</p>
                </div>
              ),
            },
            {
              key: "views",
              header: "Leituras",
              align: "right",
              render: (r) => (
                <div className="min-w-20">
                  <span className="font-semibold">{fmtInt(r.views)}</span>
                  <InlineBar value={Number(r.views)} max={max} />
                </div>
              ),
            },
            { key: "time", header: "Tempo", align: "right", render: (r) => fmtDuration(r.avg_ms) },
            { key: "scroll", header: "Scroll", align: "right", render: (r) => fmtPct(r.avg_scroll, 0) },
          ]}
        />
      )}
    </ChartCard>
  );
}
