/**
 * Eventos de analytics — plano §10.
 *
 * Caminho principal: **GTM** (NEXT_PUBLIC_GTM_ID). Tudo que o site sabe vai
 * para o `dataLayer`; GA4, Google Ads e Meta Pixel são configurados DENTRO do
 * container (ver `gtm/TRACKING.md` e o export `gtm/gtm-container-solida.json`).
 *
 * LGPD: os scripts só carregam após consentimento no banner de cookies; antes
 * disso (ou sem as chaves no .env) as funções são no-op silencioso.
 *
 * Catálogo de eventos (nome → parâmetros):
 * - page_view            { page_path, page_location, page_title }  — inclui navegação SPA
 * - cookie_consent       { consent_choice: "accepted" | "essential" }
 * - whatsapp_central_open{ source, page }                — abriu o modal da Central
 * - whatsapp_click       { subject, option?, source, page } — CONVERSÃO PRINCIPAL
 * - phone_click          { phone, label, source, page }  — CONVERSÃO SECUNDÁRIA
 * - email_click          { email, source, page }
 * - social_click         { network, source, page }
 * - maps_click           { unit, page }
 * - blog_post_view       { post_slug, post_title, post_category }
 * - blog_filter          { post_category }
 * - blog_load_more       { post_category, loaded_count }
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    _fbq?: unknown;
  }
}

/** Google Tag Manager — GA4, Google Ads e Meta Pixel são configurados DENTRO do container. */
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
/** Integração direta (fallback) — só usar se NÃO estiver gerenciando pelo GTM. */
export const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export const CONSENT_KEY = "solida-cookie-consent";
export const CONSENT_EVENT = "solida-consent-change";

export type ConsentState = { accepted: boolean; at: number };

export function readConsent(): ConsentState | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    return raw ? (JSON.parse(raw) as ConsentState) : null;
  } catch {
    return null;
  }
}

export function writeConsent(accepted: boolean) {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ accepted, at: Date.now() }));
  } catch {
    // storage indisponível — segue sem persistir
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

/** Empurra um evento para o dataLayer (consumido pelas tags no GTM). */
function pushDataLayer(payload: Record<string, unknown>) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

/**
 * Google Consent Mode v2 — usa a assinatura `gtag('consent', ...)` empurrando
 * `arguments` no dataLayer (é assim que o GTM lê o consentimento).
 * Chamar `default` ANTES de carregar o gtm.js e `update` quando o usuário decidir.
 */
export function pushConsent(command: "default" | "update", granted: boolean) {
  if (typeof window === "undefined") return;
  const state = granted ? "granted" : "denied";
  const payload = {
    ad_storage: state,
    ad_user_data: state,
    ad_personalization: state,
    analytics_storage: state,
    functionality_storage: "granted",
    security_storage: "granted",
    ...(command === "default" ? { wait_for_update: 500 } : {}),
  };
  window.dataLayer = window.dataLayer || [];
  // O GTM reconhece consent quando o push é um objeto `arguments`
  // (mesmo formato do snippet oficial `function gtag(){dataLayer.push(arguments)}`).
  window.dataLayer.push(toArguments("consent", command, payload));
}

function toArguments(...args: unknown[]): IArguments {
  void args;
  // eslint-disable-next-line prefer-rest-params
  return arguments;
}

type Params = Record<string, string | number | boolean | undefined>;

function withPage(params: Params): Params {
  return { ...params, page: window.location.pathname };
}

/** Evento genérico — dataLayer (GTM) + integrações diretas, se existirem. */
export function trackEvent(name: string, params?: Params) {
  if (typeof window === "undefined") return;
  pushDataLayer({ event: name, ...(params ?? {}) });
  window.gtag?.("event", name, params ?? {});
  window.fbq?.("trackCustom", name, params ?? {});
}

/** Decisão no banner de cookies (só chega ao GTM quando aceita — é o esperado). */
export function trackConsent(accepted: boolean) {
  if (typeof window === "undefined") return;
  pushDataLayer({
    event: "cookie_consent",
    consent_choice: accepted ? "accepted" : "essential",
  });
}

/**
 * Clique em link de WhatsApp (conversão principal do site).
 * subject = assunto da Central (cotacao, coleta...); option = 2º nível
 * (região/atendente); source = onde o clique aconteceu (modal, contato,
 * footer, unidade, post...).
 */
export function trackWhatsAppClick({
  subject,
  option,
  source,
}: {
  subject: string;
  option?: string;
  source: string;
}) {
  if (typeof window === "undefined") return;
  const params = withPage({ subject, ...(option ? { option } : {}), source });
  // GTM: tags GA4 + Google Ads (conversão) + Meta disparadas por "whatsapp_click".
  pushDataLayer({ event: "whatsapp_click", ...params });
  window.gtag?.("event", "whatsapp_click", params);
  window.fbq?.("track", "Contact", params);
  window.fbq?.("trackCustom", "WhatsAppClick", params);
}

/** Abertura da Central de WhatsApp (modal) — mede o funil antes do clique. */
export function trackWhatsAppOpen(source: string) {
  if (typeof window === "undefined") return;
  const params = withPage({ source });
  pushDataLayer({ event: "whatsapp_central_open", ...params });
  window.gtag?.("event", "whatsapp_central_open", params);
  window.fbq?.("trackCustom", "WhatsAppCentralOpen", params);
}

/** Clique em `tel:` (conversão secundária — ligação). */
export function trackPhoneClick({
  phone,
  label,
  source,
}: {
  phone: string;
  label?: string;
  source: string;
}) {
  if (typeof window === "undefined") return;
  const params = withPage({ phone, ...(label ? { label } : {}), source });
  pushDataLayer({ event: "phone_click", ...params });
  window.gtag?.("event", "phone_click", params);
  window.fbq?.("track", "Contact", params);
}

/** Clique em `mailto:`. */
export function trackEmailClick({ email, source }: { email: string; source: string }) {
  if (typeof window === "undefined") return;
  const params = withPage({ email, source });
  pushDataLayer({ event: "email_click", ...params });
  window.gtag?.("event", "email_click", params);
}

/** Clique em rede social (instagram, facebook, linkedin). */
export function trackSocialClick({ network, source }: { network: string; source: string }) {
  if (typeof window === "undefined") return;
  const params = withPage({ network: network.toLowerCase(), source });
  pushDataLayer({ event: "social_click", ...params });
  window.gtag?.("event", "social_click", params);
}

/** Clique em "Ver no mapa" de uma unidade. */
export function trackMapsClick(unit: string) {
  if (typeof window === "undefined") return;
  const params = withPage({ unit });
  pushDataLayer({ event: "maps_click", ...params });
  window.gtag?.("event", "maps_click", params);
}

/** Visualização de um post do blog (com metadados que o page_view não tem). */
export function trackBlogPostView({
  slug,
  title,
  category,
}: {
  slug: string;
  title: string;
  category?: string | null;
}) {
  if (typeof window === "undefined") return;
  const params = {
    post_slug: slug,
    post_title: title,
    post_category: category ?? "(sem categoria)",
  };
  pushDataLayer({ event: "blog_post_view", ...params });
  window.gtag?.("event", "blog_post_view", params);
}

/** Filtro de categoria no /blog. */
export function trackBlogFilter(category: string | null) {
  trackEvent("blog_filter", { post_category: category ?? "todas" });
}

/** "Carregar mais artigos" no /blog. */
export function trackBlogLoadMore(category: string | null, loadedCount: number) {
  trackEvent("blog_load_more", {
    post_category: category ?? "todas",
    loaded_count: loadedCount,
  });
}
