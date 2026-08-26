import { after, userAgent, type NextRequest } from "next/server";
import { createHash } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { classifyChannel, hostOf } from "@/lib/attribution";

/**
 * Coleta first-party de analytics (ver lib/tracker.ts para o lado do browser).
 *
 * - Recebe lotes via sendBeacon (text/plain → sem preflight).
 * - Responde 204 imediatamente; grava no Supabase em `after()`.
 * - Anônimo por desenho: sem IP (só um hash em memória para rate limit),
 *   sem user-agent cru (só família de device/browser/os), sem cookies.
 * - Sem SUPABASE_SERVICE_ROLE_KEY no .env, aceita e descarta (dev local).
 */

export const runtime = "nodejs";

const MAX_BODY = 32 * 1024;
const MAX_EVENTS = 50;
const MAX_PARAM_KEYS = 20;
const NAME_RE = /^[a-z_]{2,40}$/;
const BOT_RE =
  /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|gtmetrix|preview|facebookexternalhit|whatsapp|telegram|curl|wget|python|java\//i;

type Incoming = {
  v?: number;
  sid?: string;
  s?: {
    path?: string;
    ref?: string;
    utm?: Record<string, string>;
    gclid?: boolean;
    sw?: number;
    sh?: number;
    lang?: string;
  };
  e?: Array<{ n?: string; p?: string; t?: string; d?: Record<string, unknown> }>;
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// ---------- rate limit best-effort (por instância) ----------
const buckets = new Map<string, { n: number; reset: number }>();
function allow(key: string, limit: number) {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.reset < now) {
    buckets.set(key, { n: 1, reset: now + 60_000 });
    if (buckets.size > 5000) buckets.clear();
    return true;
  }
  b.n += 1;
  return b.n <= limit;
}

function str(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t ? t.slice(0, max) : null;
}
function int(v: unknown, max: number): number | null {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) && n >= 0 ? Math.min(Math.round(n), max) : null;
}

function cleanParams(d: unknown): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  if (!d || typeof d !== "object") return out;
  let keys = 0;
  for (const [k, v] of Object.entries(d as Record<string, unknown>)) {
    if (keys >= MAX_PARAM_KEYS) break;
    if (!/^[a-z_][a-z0-9_]{0,39}$/.test(k)) continue;
    if (typeof v === "string") out[k] = v.slice(0, 200);
    else if (typeof v === "number" && Number.isFinite(v)) out[k] = v;
    else if (typeof v === "boolean") out[k] = v;
    else continue;
    keys += 1;
  }
  return out;
}

function deviceType(ua: ReturnType<typeof userAgent>, chMobile: string | null) {
  const t = ua.device.type;
  if (t === "mobile" || t === "wearable") return "mobile";
  if (t === "tablet") return "tablet";
  if (chMobile === "?1") return "mobile";
  return "desktop";
}

function family(name: string | undefined, map: Array<[RegExp, string]>, fallback = "outro") {
  if (!name) return fallback;
  for (const [re, label] of map) if (re.test(name)) return label;
  return fallback;
}

const BROWSERS: Array<[RegExp, string]> = [
  [/edge/i, "edge"],
  [/samsung/i, "samsung"],
  [/opera|opr/i, "opera"],
  [/chrome|chromium|crios/i, "chrome"],
  [/safari/i, "safari"],
  [/firefox|fxios/i, "firefox"],
  [/instagram|facebook|fban|fbav/i, "in-app"],
];
const OSES: Array<[RegExp, string]> = [
  [/android/i, "android"],
  [/ios|iphone|ipad/i, "ios"],
  [/windows/i, "windows"],
  [/mac/i, "macos"],
  [/linux|ubuntu|chrome os|chromium os/i, "linux"],
];

export async function POST(request: NextRequest) {
  const uaRaw = request.headers.get("user-agent") ?? "";
  if (!uaRaw || BOT_RE.test(uaRaw)) return new Response(null, { status: 204 });

  const ua = userAgent(request);
  if (ua.isBot) return new Response(null, { status: 204 });

  const len = Number(request.headers.get("content-length") ?? 0);
  if (len > MAX_BODY) return new Response(null, { status: 413 });

  let body: Incoming;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY) return new Response(null, { status: 413 });
    body = JSON.parse(text) as Incoming;
  } catch {
    return new Response(null, { status: 400 });
  }

  const sid = typeof body.sid === "string" && UUID_RE.test(body.sid) ? body.sid.toLowerCase() : null;
  if (!sid || !Array.isArray(body.e)) return new Response(null, { status: 400 });

  // Rate limit: por sessão e por rede (hash do IP só em memória, nunca gravado)
  const ipHash = createHash("sha256")
    .update(request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "local")
    .digest("hex")
    .slice(0, 16);
  if (!allow(`s:${sid}`, 120) || !allow(`ip:${ipHash}`, 600)) {
    return new Response(null, { status: 204 });
  }

  const events = body.e.slice(0, MAX_EVENTS).flatMap((ev) => {
    const name = str(ev?.n, 40);
    const path = str(ev?.p, 300);
    if (!name || !NAME_RE.test(name) || !path || !path.startsWith("/")) return [];
    return [
      {
        session_id: sid,
        name,
        path,
        title: str(ev?.t, 200),
        params: cleanParams(ev?.d),
      },
    ];
  });
  if (events.length === 0 && !body.s) return new Response(null, { status: 204 });

  // Sessão nova: monta a linha a partir dos sinais + headers da Vercel
  let session: Record<string, unknown> | null = null;
  if (body.s && typeof body.s === "object") {
    const s = body.s;
    const utm = s.utm && typeof s.utm === "object" ? s.utm : {};
    const siteHost = hostOf(process.env.NEXT_PUBLIC_SITE_URL) ?? request.nextUrl.hostname;
    const referrerHost = hostOf(str(s.ref, 500));
    const utmSource = str(utm.source, 100);
    const utmMedium = str(utm.medium, 100);
    const gclid = s.gclid === true;
    const h = request.headers;
    const city = h.get("x-vercel-ip-city");

    session = {
      id: sid,
      landing_path: str(s.path, 300) ?? "/",
      referrer_host: referrerHost,
      channel: classifyChannel({ gclid, utmSource, utmMedium, referrerHost, siteHost }),
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: str(utm.campaign, 150),
      utm_term: str(utm.term, 150),
      utm_content: str(utm.content, 150),
      has_gclid: gclid,
      device: deviceType(ua, h.get("sec-ch-ua-mobile")),
      browser: family(ua.browser.name, BROWSERS),
      os: family(ua.os.name, OSES),
      country: str(h.get("x-vercel-ip-country"), 2),
      region: str(h.get("x-vercel-ip-country-region"), 10),
      city: city ? str(safeDecode(city), 80) : null,
      screen_w: int(s.sw, 10000),
      screen_h: int(s.sh, 10000),
      lang: str(s.lang, 10),
    };
  }

  const supabase = createAdminClient();
  if (!supabase) return new Response(null, { status: 204 });

  after(async () => {
    try {
      if (session) {
        const { error } = await supabase
          .from("analytics_sessions")
          .upsert(session, { onConflict: "id", ignoreDuplicates: true });
        if (error) console.error("[collect] session", error.message);
      }
      if (events.length) {
        const { error } = await supabase.from("analytics_events").insert(events);
        if (error) {
          // Sessão pode não existir se o 1º lote se perdeu: cria um esqueleto e tenta de novo
          if (error.code === "23503") {
            await supabase.from("analytics_sessions").upsert(
              { id: sid, landing_path: events[0].path, channel: "direct" },
              { onConflict: "id", ignoreDuplicates: true }
            );
            const retry = await supabase.from("analytics_events").insert(events);
            if (retry.error) console.error("[collect] events retry", retry.error.message);
          } else {
            console.error("[collect] events", error.message);
          }
        }
      }
    } catch (err) {
      console.error("[collect] unexpected", err);
    }
  });

  return new Response(null, { status: 204 });
}

function safeDecode(v: string) {
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
}
