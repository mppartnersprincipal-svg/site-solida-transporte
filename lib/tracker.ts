/**
 * Coletor first-party (lado do browser) — alimenta o /dashboard.
 *
 * Anônimo por desenho: sem cookie, sem localStorage, sem identificador
 * persistente. O id de sessão é um UUID aleatório guardado só em
 * sessionStorage (morre ao fechar a aba; renova após 30 min parado).
 * Roda SEMPRE (não depende do banner de cookies) porque não trata dado pessoal.
 *
 * O que envia para /api/collect:
 * - page_view  { sw, sh, ref_host? }         a cada rota (load + SPA)
 * - page_leave { duration_ms, max_scroll_pct } ao sair da página/aba
 * - click      { tag, text, href, track, section, x_pct, y_pct } em todo link/botão
 * - eventos nomeados vindos de lib/analytics.ts via collect() (whatsapp_click,
 *   whatsapp_central_open, phone_click, blog_post_view…)
 */

const ENDPOINT = "/api/collect";
const SESSION_KEY = "solida-s";
const SESSION_TTL_MS = 30 * 60 * 1000;
const FLUSH_EVERY_MS = 5000;
const FLUSH_AT = 10;
const MAX_BATCH_BYTES = 60 * 1024;
const EXCLUDED_PREFIXES = ["/admin", "/dashboard", "/login", "/api"];
const BOT_RE = /bot|crawl|spider|headless|lighthouse|pagespeed|gtmetrix/i;

type Params = Record<string, string | number | boolean | undefined>;
type QueuedEvent = { n: string; p: string; t?: string; d?: Params };
type StoredSession = {
  id: string;
  last: number;
  init: {
    path: string;
    ref: string;
    utm: Record<string, string>;
    gclid: boolean;
    sw: number;
    sh: number;
    lang: string;
  } | null;
};

let started = false;
let enabled = false;
let session: StoredSession | null = null;
let queue: QueuedEvent[] = [];
let timer: number | null = null;

// estado da página atual
let currentPath: string | null = null;
let visibleSince: number | null = null;
let accumulatedMs = 0;
let maxScroll = 0;
let pageEnded = false;
let scrollScheduled = false;

function isExcluded(path: string) {
  return EXCLUDED_PREFIXES.some((p) => path === p || path.startsWith(p + "/"));
}

function canRun() {
  if (typeof window === "undefined") return false;
  if (navigator.webdriver) return false;
  if (BOT_RE.test(navigator.userAgent)) return false;
  return !isExcluded(window.location.pathname);
}

function readSession(): StoredSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as StoredSession) : null;
  } catch {
    return null;
  }
}

function writeSession(s: StoredSession) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
  } catch {
    // sem storage — a sessão vive só em memória
  }
}

function newSession(): StoredSession {
  const q = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const k of ["source", "medium", "campaign", "term", "content"]) {
    const v = q.get("utm_" + k);
    if (v) utm[k] = v.slice(0, 150);
  }
  return {
    id: crypto.randomUUID(),
    last: Date.now(),
    init: {
      path: window.location.pathname,
      ref: document.referrer || "",
      utm,
      gclid: q.has("gclid") || q.has("gbraid") || q.has("wbraid"),
      sw: window.screen?.width ?? 0,
      sh: window.screen?.height ?? 0,
      lang: navigator.language || "",
    },
  };
}

function ensureSession(): StoredSession {
  const now = Date.now();
  if (session && now - session.last < SESSION_TTL_MS) {
    session.last = now;
    return session;
  }
  const stored = readSession();
  session = stored && now - stored.last < SESSION_TTL_MS ? { ...stored, last: now } : newSession();
  writeSession(session);
  return session;
}

function send(payload: string) {
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "text/plain" });
      if (navigator.sendBeacon(ENDPOINT, blob)) return;
    }
    fetch(ENDPOINT, {
      method: "POST",
      body: payload,
      keepalive: true,
      headers: { "Content-Type": "text/plain" },
    }).catch(() => {});
  } catch {
    // rede indisponível — descarta silenciosamente
  }
}

function flush() {
  if (timer !== null) {
    window.clearTimeout(timer);
    timer = null;
  }
  if (!queue.length && !(session && session.init)) return;
  const s = ensureSession();
  const batch: { v: number; sid: string; s?: StoredSession["init"]; e: QueuedEvent[] } = {
    v: 1,
    sid: s.id,
    e: queue,
  };
  if (s.init) batch.s = s.init;
  queue = [];

  let payload = JSON.stringify(batch);
  while (payload.length > MAX_BATCH_BYTES && batch.e.length > 1) {
    batch.e = batch.e.slice(0, Math.ceil(batch.e.length / 2));
    payload = JSON.stringify(batch);
  }
  send(payload);

  if (s.init) {
    s.init = null;
    writeSession(s);
  }
}

function enqueue(ev: QueuedEvent) {
  if (!enabled) return;
  ensureSession();
  queue.push(ev);
  if (queue.length >= FLUSH_AT) flush();
  else if (timer === null) timer = window.setTimeout(flush, FLUSH_EVERY_MS);
}

/** Evento nomeado (chamado por lib/analytics.ts). */
export function collect(name: string, params?: Params) {
  if (!enabled) return;
  const d: Params = {};
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined || k === "page") continue;
      d[k] = typeof v === "string" ? v.slice(0, 200) : v;
    }
  }
  enqueue({ n: name, p: window.location.pathname, d });
}

// ---------- tempo visível + scroll ----------
function onVisible() {
  if (visibleSince === null) visibleSince = performance.now();
}
function onHidden() {
  if (visibleSince !== null) {
    accumulatedMs += performance.now() - visibleSince;
    visibleSince = null;
  }
}
function measureScroll() {
  scrollScheduled = false;
  const doc = document.documentElement;
  const total = Math.max(doc.scrollHeight, document.body?.scrollHeight ?? 0);
  if (total <= 0) return;
  const pct = Math.min(100, Math.round(((window.scrollY + window.innerHeight) / total) * 100));
  if (pct > maxScroll) maxScroll = pct;
}
function onScroll() {
  if (scrollScheduled) return;
  scrollScheduled = true;
  requestAnimationFrame(measureScroll);
}

/** Fecha a página atual (page_leave). Idempotente até o próximo trackPageView. */
export function endPage() {
  if (!enabled || currentPath === null || pageEnded) return;
  onHidden();
  measureScroll();
  pageEnded = true;
  enqueue({
    n: "page_leave",
    p: currentPath,
    d: { duration_ms: Math.round(accumulatedMs), max_scroll_pct: maxScroll },
  });
}

/** Abre uma página (load inicial ou navegação SPA). */
export function trackPageView(path: string, title: string) {
  if (!enabled) return;
  if (isExcluded(path)) {
    endPage();
    currentPath = null;
    return;
  }
  if (currentPath !== null && !pageEnded) endPage();

  currentPath = path;
  accumulatedMs = 0;
  maxScroll = 0;
  pageEnded = false;
  visibleSince = document.visibilityState === "visible" ? performance.now() : null;
  requestAnimationFrame(measureScroll);

  const s = ensureSession();
  const d: Params = { sw: window.innerWidth, sh: window.innerHeight };
  if (s.init === null && document.referrer) {
    const refHost = hostOnly(document.referrer);
    if (refHost && refHost !== window.location.hostname) d.ref_host = refHost;
  }
  enqueue({ n: "page_view", p: path, t: title.slice(0, 200), d });
}

function hostOnly(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

// ---------- cliques ----------
const CLICK_SELECTOR = "a,button,[role=button],[data-track],input[type=submit],summary";

function onClick(e: MouseEvent) {
  const target = e.target as Element | null;
  const el = target?.closest?.(CLICK_SELECTOR) as HTMLElement | null;
  if (!el) return;

  const d: Params = { tag: el.tagName.toLowerCase() };
  const track = el.getAttribute("data-track") || el.id || el.getAttribute("aria-label");
  if (track) d.track = track.slice(0, 120);

  const text = (el.textContent || "").replace(/\s+/g, " ").trim();
  if (text) d.text = text.slice(0, 80);

  const rawHref = (el as HTMLAnchorElement).getAttribute?.("href");
  if (rawHref) d.href = describeHref(rawHref);

  const section = el.closest("section[id],[data-section]") as HTMLElement | null;
  const sectionId = section?.getAttribute("data-section") || section?.id;
  if (sectionId) d.section = sectionId.slice(0, 60);

  if (window.innerWidth > 0 && window.innerHeight > 0) {
    d.x_pct = Math.round((e.clientX / window.innerWidth) * 100);
    d.y_pct = Math.round((e.clientY / window.innerHeight) * 100);
  }

  enqueue({ n: "click", p: window.location.pathname, d });
}

function describeHref(href: string) {
  if (/^(tel|mailto):/i.test(href)) return href.slice(0, 120);
  try {
    const u = new URL(href, window.location.origin);
    if (u.hostname === window.location.hostname) return (u.pathname + u.hash).slice(0, 200);
    if (/wa\.me|whatsapp\.com/i.test(u.hostname)) return "wa.me";
    return u.hostname;
  } catch {
    return href.slice(0, 120);
  }
}

// ---------- ciclo de vida ----------
function onVisibilityChange() {
  if (document.visibilityState === "hidden") {
    endPage();
    flush();
  } else if (currentPath !== null) {
    // voltou para a aba: reabre a MESMA página sem novo page_view
    pageEnded = false;
    accumulatedMs = 0;
    onVisible();
  }
}

function onPageHide() {
  endPage();
  flush();
}

/** Inicializa uma única vez (chamado pelo <Collector /> no layout público). */
export function initTracker() {
  if (started) return;
  started = true;
  enabled = canRun();
  if (!enabled) return;

  ensureSession();
  document.addEventListener("click", onClick, { capture: true, passive: true });
  document.addEventListener("visibilitychange", onVisibilityChange);
  window.addEventListener("pagehide", onPageHide);
  window.addEventListener("scroll", onScroll, { passive: true });
}

export function isCollecting() {
  return enabled;
}
