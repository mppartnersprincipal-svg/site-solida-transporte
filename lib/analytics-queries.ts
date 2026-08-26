import "server-only";
import { createClient } from "@/lib/supabase/server";
import { CHANNELS, type Channel } from "@/lib/attribution";
import type {
  BlogRow,
  ButtonRow,
  CampaignRow,
  ChannelRow,
  ClickRow,
  ConsentRow,
  DailyRow,
  DeviceRow,
  FunnelRow,
  GeoRow,
  HeatmapRow,
  JourneyRow,
  KpisRow,
  PageRow,
  PhoneRow,
  RecentRow,
  VisitorRow,
  WhatsAppRow,
} from "@/lib/analytics-types";

/**
 * Leitura do dashboard — Server Components chamam as funções SQL
 * `analytics_*` via RPC com o client autenticado (RLS: só logado lê).
 */

export type Period = "hoje" | "7d" | "30d" | "90d" | "custom";

export type Range = {
  period: Period;
  from: Date;
  to: Date;
  /** null = todas as origens */
  channel: Channel | null;
  label: string;
  /** "de"/"ate" em YYYY-MM-DD (só quando custom) */
  de?: string;
  ate?: string;
};

const TZ = "America/Sao_Paulo";

/** Meia-noite (hora de Brasília) do dia `d` deslocado em `offsetDays`. */
function brMidnight(d: Date, offsetDays = 0): Date {
  const ymd = d.toLocaleDateString("en-CA", { timeZone: TZ }); // YYYY-MM-DD
  const [y, m, day] = ymd.split("-").map(Number);
  // Brasília não tem horário de verão desde 2019: UTC-3 fixo
  return new Date(Date.UTC(y, m - 1, day + offsetDays, 3, 0, 0));
}

function parseYmd(s: string | undefined): Date | null {
  if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const [y, m, d] = s.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d, 3, 0, 0));
  return Number.isNaN(date.getTime()) ? null : date;
}

function fmtBr(d: Date) {
  return d.toLocaleDateString("pt-BR", { timeZone: TZ, day: "2-digit", month: "2-digit" });
}

export type SearchParams = Record<string, string | string[] | undefined>;

export function getRange(sp: SearchParams): Range {
  const one = (k: string) => (Array.isArray(sp[k]) ? sp[k]?.[0] : sp[k]) as string | undefined;
  const periodRaw = one("periodo");
  const channelRaw = one("origem");
  const channel = CHANNELS.includes(channelRaw as Channel) ? (channelRaw as Channel) : null;
  const now = new Date();
  const tomorrow = brMidnight(now, 1);

  if (periodRaw === "custom") {
    const from = parseYmd(one("de"));
    const toDay = parseYmd(one("ate"));
    if (from && toDay && from <= toDay) {
      const to = new Date(toDay.getTime() + 24 * 3600 * 1000);
      return {
        period: "custom",
        from,
        to,
        channel,
        label: `${fmtBr(from)} a ${fmtBr(toDay)}`,
        de: one("de"),
        ate: one("ate"),
      };
    }
  }
  if (periodRaw === "hoje") {
    return { period: "hoje", from: brMidnight(now), to: tomorrow, channel, label: "Hoje" };
  }
  const days = periodRaw === "7d" ? 7 : periodRaw === "90d" ? 90 : 30;
  const period: Period = periodRaw === "7d" ? "7d" : periodRaw === "90d" ? "90d" : "30d";
  return {
    period,
    from: brMidnight(now, -(days - 1)),
    to: tomorrow,
    channel,
    label: `Últimos ${days} dias`,
  };
}

/** Mesmo tamanho de janela, imediatamente antes (para deltas nos KPIs). */
export function previousRange(r: Range): Range {
  const len = r.to.getTime() - r.from.getTime();
  return { ...r, from: new Date(r.from.getTime() - len), to: r.from, label: "período anterior" };
}

type RpcArgs = Record<string, string | number | boolean | null>;

async function rpc<T>(fn: string, args: RpcArgs): Promise<T[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc(fn, args);
  if (error) {
    console.error(`[dashboard] ${fn}:`, error.message);
    return [];
  }
  return (data ?? []) as T[];
}

function base(r: Range): RpcArgs {
  return { p_from: r.from.toISOString(), p_to: r.to.toISOString(), p_channel: r.channel };
}

export async function getKpis(r: Range): Promise<KpisRow> {
  const rows = await rpc<KpisRow>("analytics_kpis", base(r));
  return (
    rows[0] ?? {
      sessions: 0,
      page_views: 0,
      avg_session_ms: 0,
      avg_page_ms: 0,
      wa_clicks: 0,
      phone_clicks: 0,
      wa_sessions: 0,
      conv_rate: 0,
    }
  );
}
export const getDaily = (r: Range) => rpc<DailyRow>("analytics_daily", base(r));
export const getHeatmap = (r: Range) => rpc<HeatmapRow>("analytics_heatmap", base(r));
export const getByChannel = (r: Range) =>
  rpc<ChannelRow>("analytics_by_channel", {
    p_from: r.from.toISOString(),
    p_to: r.to.toISOString(),
  });
export const getByDevice = (r: Range) => rpc<DeviceRow>("analytics_by_device", base(r));
export const getTopPages = (r: Range, limit = 20) =>
  rpc<PageRow>("analytics_top_pages", { ...base(r), p_limit: limit });
export const getGeo = (r: Range, limit = 30) =>
  rpc<GeoRow>("analytics_geo", { ...base(r), p_limit: limit });
export const getCampaigns = (r: Range) =>
  rpc<CampaignRow>("analytics_campaigns", {
    p_from: r.from.toISOString(),
    p_to: r.to.toISOString(),
  });
export const getWhatsApp = (r: Range) => rpc<WhatsAppRow>("analytics_whatsapp", base(r));
export const getPhone = (r: Range) => rpc<PhoneRow>("analytics_phone", base(r));
export const getClicks = (r: Range, limit = 30) =>
  rpc<ClickRow>("analytics_clicks", { ...base(r), p_limit: limit });
export const getBlog = (r: Range, limit = 20) =>
  rpc<BlogRow>("analytics_blog", { ...base(r), p_limit: limit });
export const getFunnel = (r: Range) => rpc<FunnelRow>("analytics_funnel", base(r));
export const getButtons = (r: Range) => rpc<ButtonRow>("analytics_buttons", base(r));
export const getJourneys = (r: Range, onlyConverted = true, limit = 50) =>
  rpc<JourneyRow>("analytics_journeys", {
    ...base(r),
    p_only_converted: onlyConverted,
    p_limit: limit,
  });
export const getRecent = (limit = 50) => rpc<RecentRow>("analytics_recent", { p_limit: limit });
export const getVisitors = (r: Range) => rpc<VisitorRow>("analytics_visitors", base(r));
export const getConsent = (r: Range) =>
  rpc<ConsentRow>("analytics_consent", {
    p_from: r.from.toISOString(),
    p_to: r.to.toISOString(),
  });

/** Monta a query string atual com alterações (para links que preservam os filtros). */
export function withParams(sp: SearchParams, changes: Record<string, string | null>): string {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    const val = Array.isArray(v) ? v[0] : v;
    if (val) p.set(k, val);
  }
  for (const [k, v] of Object.entries(changes)) {
    if (v === null) p.delete(k);
    else p.set(k, v);
  }
  const qs = p.toString();
  return qs ? `?${qs}` : "";
}
