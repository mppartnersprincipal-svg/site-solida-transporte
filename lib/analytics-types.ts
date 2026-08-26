/**
 * Tipos das linhas retornadas pelas funções `analytics_*` do Supabase
 * (supabase/migrations/0003_analytics.sql) e rótulos humanos usados no
 * /dashboard. Sem dependência de servidor — pode ser importado em client
 * components.
 */
import type { Channel } from "@/lib/attribution";
import { WA_SUBJECTS } from "@/lib/whatsapp";

export type { Channel };

export type KpisRow = {
  sessions: number;
  page_views: number;
  avg_session_ms: number;
  avg_page_ms: number;
  wa_clicks: number;
  phone_clicks: number;
  wa_sessions: number;
  conv_rate: number;
};

export type DailyRow = { day: string; sessions: number; page_views: number; wa_clicks: number };
export type HeatmapRow = { dow: number; hour: number; sessions: number };
export type ChannelRow = { channel: Channel; sessions: number; wa_clicks: number };
export type DeviceRow = { device: string; sessions: number };
export type PageRow = {
  path: string;
  title: string | null;
  views: number;
  avg_ms: number;
  avg_scroll: number;
};
export type GeoRow = {
  country: string | null;
  region: string | null;
  city: string | null;
  sessions: number;
  wa_clicks: number;
};
export type CampaignRow = {
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  sessions: number;
  wa_clicks: number;
  conv_rate: number | null;
};
export type WhatsAppRow = {
  subject: string | null;
  option: string | null;
  source: string | null;
  clicks: number;
};
export type PhoneRow = {
  phone: string | null;
  label: string | null;
  source: string | null;
  clicks: number;
};
export type ClickRow = {
  label: string | null;
  tag: string | null;
  href: string | null;
  clicks: number;
  sessions: number;
};
export type BlogRow = {
  post_slug: string;
  post_title: string | null;
  post_category: string | null;
  views: number;
  avg_ms: number;
  avg_scroll: number;
};
export type FunnelRow = { step: string; sessions: number };
export type ButtonRow = {
  kind: "whatsapp_click" | "phone_click" | "maps_click";
  subject: string | null;
  option: string | null;
  source: string | null;
  channel: Channel;
  clicks: number;
  sessions: number;
};
export type TrailEvent = {
  ts: string;
  name: string;
  path: string;
  title: string | null;
  params: Record<string, string | number | boolean>;
};
export type JourneyRow = {
  id: string;
  started_at: string;
  last_seen_at: string;
  channel: Channel;
  utm_campaign: string | null;
  utm_term: string | null;
  device: string | null;
  browser: string | null;
  os: string | null;
  region: string | null;
  city: string | null;
  landing_path: string;
  referrer_host: string | null;
  converted: boolean;
  trail: TrailEvent[];
};
export type RecentRow = {
  ts: string;
  session_id: string;
  name: string;
  path: string;
  params: Record<string, string | number | boolean>;
  channel: Channel;
  device: string | null;
  city: string | null;
  region: string | null;
};

// ---------- Rótulos ----------

export const CHANNEL_LABELS: Record<Channel, string> = {
  google_ads: "Google Ads",
  google_organic: "Google orgânico",
  other_search: "Outros buscadores",
  social: "Redes sociais",
  referral: "Outros sites",
  direct: "Direto",
};

export const CHANNEL_ORDER: Channel[] = [
  "google_ads",
  "google_organic",
  "other_search",
  "social",
  "referral",
  "direct",
];

export const DEVICE_LABELS: Record<string, string> = {
  mobile: "Celular",
  tablet: "Tablet",
  desktop: "Computador",
  desconhecido: "Desconhecido",
};

/** subject do whatsapp_click → nome do botão da Central */
export const SUBJECT_LABELS: Record<string, string> = Object.fromEntries(
  WA_SUBJECTS.map((s) => [s.id, s.label])
);
SUBJECT_LABELS.unidade = "WhatsApp da unidade";
SUBJECT_LABELS.juridico = "Jurídico";

/** source do whatsapp_click / whatsapp_central_open → onde o clique aconteceu */
export const SOURCE_LABELS: Record<string, string> = {
  header: "Botão do cabeçalho",
  "header-mobile": "Ícone do cabeçalho (celular)",
  "menu-mobile": "Menu (celular)",
  float: "Botão flutuante",
  hero: "Topo da Home",
  "cta-final": "CTA final da página",
  post: "Post do blog",
  depoimentos: "Depoimentos",
  cta: "CTA no meio da página",
  modal: "Central de WhatsApp",
  contato: "Página Contato",
  footer: "Rodapé",
};

export const EVENT_LABELS: Record<string, string> = {
  page_view: "Abriu página",
  page_leave: "Saiu da página",
  click: "Clique",
  whatsapp_central_open: "Abriu a Central de WhatsApp",
  whatsapp_click: "Clicou no WhatsApp",
  phone_click: "Clicou no telefone",
  email_click: "Clicou no e-mail",
  social_click: "Clicou em rede social",
  maps_click: "Abriu o mapa",
  blog_post_view: "Leu post do blog",
  blog_filter: "Filtrou o blog",
  blog_load_more: "Carregou mais posts",
  cookie_consent: "Respondeu o banner de cookies",
};

export const FUNNEL_LABELS: Record<string, string> = {
  page_view: "Visitou o site",
  whatsapp_central_open: "Abriu a Central de WhatsApp",
  whatsapp_click: "Clicou para falar no WhatsApp",
};

export const PAGE_LABELS: Record<string, string> = {
  "/": "Home",
  "/a-empresa": "A Empresa",
  "/como-funciona": "Como Funciona",
  "/segmentos": "Segmentos",
  "/diferenciais": "Diferenciais",
  "/contato": "Contato",
  "/blog": "Blog",
  "/politica-de-privacidade": "Política de Privacidade",
  "/politica-de-cookies": "Política de Cookies",
};

export function labelChannel(c: string | null | undefined) {
  return (c && CHANNEL_LABELS[c as Channel]) || c || "—";
}
export function labelDevice(d: string | null | undefined) {
  return (d && DEVICE_LABELS[d]) || d || "Desconhecido";
}
export function labelSubject(s: string | null | undefined) {
  return (s && SUBJECT_LABELS[s]) || s || "—";
}
export function labelSource(s: string | null | undefined) {
  return (s && SOURCE_LABELS[s]) || s || "—";
}
export function labelEvent(n: string) {
  return EVENT_LABELS[n] || n;
}
export function labelPage(path: string, title?: string | null) {
  if (PAGE_LABELS[path]) return PAGE_LABELS[path];
  if (path.startsWith("/blog/")) return title ? title.replace(/ \| Sólida Transporte$/, "") : path;
  return title ? title.replace(/ \| Sólida Transporte$/, "") : path;
}

// ---------- Formatação pt-BR ----------

const nf = new Intl.NumberFormat("pt-BR");
export function fmtInt(n: number | null | undefined) {
  return nf.format(Math.round(Number(n ?? 0)));
}
export function fmtPct(n: number | null | undefined, digits = 1) {
  return `${Number(n ?? 0).toLocaleString("pt-BR", { maximumFractionDigits: digits })}%`;
}
/** 4200 → "4 s"; 75000 → "1 min 15 s" */
export function fmtDuration(ms: number | null | undefined) {
  const s = Math.round(Number(ms ?? 0) / 1000);
  if (s < 60) return `${s} s`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  if (m < 60) return r ? `${m} min ${r} s` : `${m} min`;
  const h = Math.floor(m / 60);
  return `${h} h ${m % 60} min`;
}
export function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
export function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
export function fmtDay(isoDate: string) {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("pt-BR", {
    timeZone: "UTC",
    day: "2-digit",
    month: "short",
  });
}
