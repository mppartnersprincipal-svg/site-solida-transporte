"use client";

import { useEffect, useState } from "react";
import { MapPin, Monitor, RefreshCw, Smartphone, Tablet } from "lucide-react";
import { getRecentEvents } from "@/app/(admin)/dashboard/actions";
import {
  fmtTime,
  labelChannel,
  labelEvent,
  labelPage,
  labelSource,
  labelSubject,
  type RecentRow,
} from "@/lib/analytics-types";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { cn } from "@/lib/utils";

const INTERVAL_MS = 30_000;

const BADGE: Record<string, string> = {
  whatsapp_click: "bg-whatsapp text-white",
  phone_click: "bg-brand-action text-white",
  whatsapp_central_open: "bg-ink text-white",
  page_view: "bg-surface-alt text-ink-body",
  page_leave: "bg-surface-alt text-ink-muted",
  click: "bg-line text-ink-body",
};

function detail(r: RecentRow) {
  const p = r.params ?? {};
  switch (r.name) {
    case "whatsapp_click":
      return [labelSubject(String(p.subject ?? "")), p.option, p.source ? labelSource(String(p.source)) : null]
        .filter(Boolean)
        .join(" · ");
    case "whatsapp_central_open":
      return labelSource(String(p.source ?? ""));
    case "phone_click":
      return String(p.label ?? p.phone ?? "");
    case "click":
      return String(p.track ?? p.text ?? p.href ?? "");
    case "page_leave":
      return p.duration_ms != null ? `${Math.round(Number(p.duration_ms) / 1000)} s · scroll ${p.max_scroll_pct ?? 0}%` : "";
    case "blog_post_view":
      return String(p.post_title ?? "");
    case "cookie_consent":
      return p.consent_choice === "accepted" ? "aceitou" : "só o essencial";
    default:
      return "";
  }
}

export function LiveFeed({ initial }: { initial: RecentRow[] }) {
  const [rows, setRows] = useState(initial);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      if (document.visibilityState === "hidden") return;
      setBusy(true);
      try {
        const next = await getRecentEvents(40);
        if (!cancelled) {
          setRows(next);
          setUpdatedAt(new Date());
        }
      } catch {
        // mantém a lista anterior
      } finally {
        if (!cancelled) setBusy(false);
      }
    };
    const id = window.setInterval(tick, INTERVAL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-xs text-ink-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className={cn("size-2 rounded-full bg-whatsapp", busy && "animate-pulse")} aria-hidden />
          {updatedAt ? `Atualizado às ${updatedAt.toLocaleTimeString("pt-BR")}` : "Ao vivo"}
        </span>
        <RefreshCw aria-hidden className={cn("size-3.5", busy && "animate-spin")} />
      </div>
      {!rows.length ? (
        <EmptyState compact title="Nenhum evento ainda" hint="Assim que alguém acessar o site, aparece aqui." />
      ) : (
        <ul className="max-h-[520px] space-y-1 overflow-y-auto pr-1 text-sm">
          {rows.map((r, i) => {
            const Device = r.device === "mobile" ? Smartphone : r.device === "tablet" ? Tablet : Monitor;
            return (
              <li
                key={`${r.ts}-${i}`}
                className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg px-2 py-1.5 hover:bg-surface-alt/70"
              >
                <span className="w-16 shrink-0 tabular-nums text-xs text-ink-muted">{fmtTime(r.ts)}</span>
                <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", BADGE[r.name] ?? "bg-surface-alt text-ink-body")}>
                  {labelEvent(r.name)}
                </span>
                <span className="min-w-0 flex-1 truncate text-ink-body" title={detail(r)}>
                  {detail(r) || labelPage(r.path)}
                </span>
                <span className="hidden items-center gap-2 text-xs text-ink-muted sm:inline-flex">
                  <span>{labelChannel(r.channel)}</span>
                  <Device aria-hidden className="size-3.5" />
                  {r.city ? (
                    <span className="inline-flex items-center gap-0.5">
                      <MapPin aria-hidden className="size-3" />
                      {r.city}
                    </span>
                  ) : null}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
