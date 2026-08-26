"use client";

import { useReducedMotion } from "framer-motion";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fmtDay, fmtInt, type DailyRow } from "@/lib/analytics-types";
import { CHART, TOOLTIP_STYLE } from "./chartTheme";

/** Visitas por dia (área) + cliques no WhatsApp (linha, eixo direito). */
export function DailyAreaChart({ data }: { data: DailyRow[] }) {
  const reduceMotion = useReducedMotion();
  const rows = data.map((d) => ({ ...d, label: fmtDay(d.day) }));
  const many = rows.length > 45;

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={rows} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id="dash-sessions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART.ink} stopOpacity={0.18} />
              <stop offset="100%" stopColor={CHART.ink} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={CHART.line} vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: CHART.muted }}
            tickLine={false}
            axisLine={false}
            interval={many ? Math.ceil(rows.length / 10) : "preserveStartEnd"}
            minTickGap={16}
          />
          <YAxis
            yAxisId="left"
            allowDecimals={false}
            tick={{ fontSize: 11, fill: CHART.muted }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            allowDecimals={false}
            tick={{ fontSize: 11, fill: CHART.whatsapp }}
            tickLine={false}
            axisLine={false}
            width={32}
          />
          <Tooltip
            {...TOOLTIP_STYLE}
            formatter={(value, name) => [fmtInt(Number(value)), String(name)]}
          />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="sessions"
            name="Visitas"
            stroke={CHART.ink}
            strokeWidth={2}
            fill="url(#dash-sessions)"
            isAnimationActive={!reduceMotion}
            animationDuration={900}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="wa_clicks"
            name="Cliques no WhatsApp"
            stroke={CHART.whatsapp}
            strokeWidth={2.5}
            dot={rows.length <= 31 ? { r: 3, strokeWidth: 0, fill: CHART.whatsapp } : false}
            isAnimationActive={!reduceMotion}
            animationDuration={900}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
