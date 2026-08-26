/**
 * Paleta dos gráficos do dashboard — segue os tokens do @theme (globals.css).
 * Recharts recebe cor via prop, então usamos os hex dos tokens (não CSS vars
 * dentro de <svg fill> para manter compatibilidade com export/print).
 */
export const CHART = {
  ink: "#0e0e0e",
  brand: "#e10600",
  brandSoft: "#fca5a5",
  whatsapp: "#25d366",
  muted: "#6b7280",
  line: "#e5e7eb",
  surfaceAlt: "#f7f7f8",
  amber: "#f59e0b",
  blue: "#3b82f6",
  violet: "#8b5cf6",
  teal: "#14b8a6",
} as const;

/** Sequência categórica (donuts/barras com várias séries). */
export const CATEGORICAL = [
  CHART.ink,
  CHART.brand,
  CHART.whatsapp,
  CHART.blue,
  CHART.amber,
  CHART.violet,
  CHART.teal,
  CHART.muted,
];

/** Cores fixas por canal, para a origem ter sempre a mesma cor em todo o painel. */
export const CHANNEL_COLORS: Record<string, string> = {
  google_ads: CHART.brand,
  google_organic: CHART.ink,
  other_search: CHART.blue,
  social: CHART.violet,
  referral: CHART.amber,
  direct: CHART.muted,
};

export const DEVICE_COLORS: Record<string, string> = {
  mobile: CHART.brand,
  desktop: CHART.ink,
  tablet: CHART.blue,
  desconhecido: CHART.muted,
};

export const TOOLTIP_STYLE = {
  contentStyle: {
    borderRadius: 12,
    border: `1px solid ${CHART.line}`,
    boxShadow: "0 8px 24px rgba(14,14,14,0.08)",
    fontSize: 13,
    fontFamily: "var(--font-sans)",
  },
  labelStyle: { color: CHART.ink, fontWeight: 600 },
  itemStyle: { color: "#1f2937" },
};
