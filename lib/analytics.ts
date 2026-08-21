/**
 * Eventos de analytics (GA4 + Meta Pixel) — plano §10.
 * Os scripts só carregam após consentimento no banner de cookies (LGPD);
 * antes disso (ou sem as chaves no .env) as funções são no-op silencioso.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    _fbq?: unknown;
  }
}

/** Google Tag Manager — GA4 e Meta Pixel são configurados DENTRO do container. */
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

/** Evento genérico — dataLayer (GTM) + integrações diretas, se existirem. */
export function trackEvent(name: string, params?: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  pushDataLayer({ event: name, ...(params ?? {}) });
  window.gtag?.("event", name, params ?? {});
  window.fbq?.("trackCustom", name, params ?? {});
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
  const params = {
    subject,
    ...(option ? { option } : {}),
    source,
    page: window.location.pathname,
  };
  // GTM: crie uma tag disparada pelo evento "whatsapp_click" (GA4 e Meta).
  // No Meta, vale mapear também para o evento padrão "Contact".
  pushDataLayer({ event: "whatsapp_click", ...params });
  window.gtag?.("event", "whatsapp_click", params);
  window.fbq?.("track", "Contact", params);
  window.fbq?.("trackCustom", "WhatsAppClick", params);
}

/** Abertura da Central de WhatsApp (modal) — mede o funil antes do clique. */
export function trackWhatsAppOpen(source: string) {
  if (typeof window === "undefined") return;
  const params = { source, page: window.location.pathname };
  pushDataLayer({ event: "whatsapp_central_open", ...params });
  window.gtag?.("event", "whatsapp_central_open", params);
  window.fbq?.("trackCustom", "WhatsAppCentralOpen", params);
}
