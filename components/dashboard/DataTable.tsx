import { cn } from "@/lib/utils";

export type Column<T> = {
  key: string;
  header: string;
  align?: "left" | "right";
  className?: string;
  render: (row: T, index: number) => React.ReactNode;
};

/** Tabela simples no mesmo estilo da lista de posts do /admin. */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  dense = false,
  minWidth = 520,
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T, index: number) => string;
  dense?: boolean;
  /** Largura mínima em px antes de rolar horizontalmente */
  minWidth?: number;
}) {
  const pad = dense ? "px-3 py-2" : "px-4 py-3";
  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full text-left text-sm" style={{ minWidth }}>
        <thead className="bg-surface-alt">
          <tr className="text-xs font-semibold tracking-wide text-ink-muted uppercase">
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                className={cn(pad, c.align === "right" && "text-right", c.className)}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={rowKey(row, i)} className="border-t border-line hover:bg-surface-alt/60">
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={cn(pad, "align-middle", c.align === "right" && "text-right tabular-nums", c.className)}
                >
                  {c.render(row, i)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Barra proporcional para usar dentro de células (ex.: participação). */
export function InlineBar({ value, max, color = "bg-ink" }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0;
  return (
    <span className="block h-1.5 w-full overflow-hidden rounded-full bg-surface-alt" aria-hidden>
      <span className={cn("block h-full rounded-full", color)} style={{ width: `${pct}%` }} />
    </span>
  );
}
