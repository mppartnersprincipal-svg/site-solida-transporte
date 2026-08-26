"use client";

import { motion, useReducedMotion } from "framer-motion";
import { fmtInt } from "@/lib/analytics-types";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { CHART } from "./chartTheme";

const COLORS = [CHART.ink, CHART.brandSoft, CHART.whatsapp];

/** Funil em barras horizontais decrescentes, com % do topo e taxa entre etapas. */
export function FunnelBars({ steps }: { steps: Array<{ label: string; value: number }> }) {
  const reduceMotion = useReducedMotion();
  const top = steps[0]?.value ?? 0;
  if (!top) return <EmptyState compact hint="" />;

  return (
    <ol className="space-y-4">
      {steps.map((s, i) => {
        const pct = Math.round((s.value / top) * 100);
        const prev = i > 0 ? steps[i - 1].value : null;
        const stepRate = prev ? Math.round((s.value / prev) * 100) : null;
        return (
          <li key={s.label}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
              <span className="font-semibold text-ink">{s.label}</span>
              <span className="tabular-nums text-ink-muted">
                <span className="font-bold text-ink">{fmtInt(s.value)}</span> · {pct}%
                {stepRate !== null ? <span className="ml-1 text-xs">({stepRate}% da etapa anterior)</span> : null}
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-surface-alt">
              <motion.div
                className="h-full rounded-full"
                style={{ background: COLORS[i % COLORS.length] }}
                initial={reduceMotion ? false : { width: 0 }}
                whileInView={{ width: `${Math.max(pct, 1)}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.12, ease: [0.21, 0.65, 0.36, 1] }}
              />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
