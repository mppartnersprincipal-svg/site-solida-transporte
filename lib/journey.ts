import {
  fmtDuration,
  labelPage,
  labelSource,
  labelSubject,
  type TrailEvent,
} from "@/lib/analytics-types";

/**
 * Resume a trilha bruta de eventos de uma sessão em passos legíveis:
 * "Home (48 s)" → "Abriu a Central (botão flutuante)" → "Pedir cotação › Goiânia".
 */
export type JourneyStep = {
  kind: "page" | "central" | "whatsapp" | "phone" | "maps" | "email" | "social" | "blog";
  label: string;
  detail?: string;
  ts: string;
};

export function summarizeTrail(trail: TrailEvent[]): JourneyStep[] {
  const steps: JourneyStep[] = [];
  let lastPage: JourneyStep | null = null;

  for (const e of trail) {
    const p = e.params ?? {};
    switch (e.name) {
      case "page_view": {
        lastPage = { kind: "page", label: labelPage(e.path, e.title), ts: e.ts };
        steps.push(lastPage);
        break;
      }
      case "page_leave": {
        const target = lastPage && steps[steps.length - 1] === lastPage ? lastPage : findPage(steps, e.path);
        if (target && p.duration_ms != null) target.detail = fmtDuration(Number(p.duration_ms));
        break;
      }
      case "whatsapp_central_open":
        steps.push({ kind: "central", label: "Abriu a Central", detail: labelSource(String(p.source ?? "")), ts: e.ts });
        break;
      case "whatsapp_click":
        steps.push({
          kind: "whatsapp",
          label: labelSubject(String(p.subject ?? "")),
          detail: [p.option, p.source ? labelSource(String(p.source)) : null].filter(Boolean).join(" · "),
          ts: e.ts,
        });
        break;
      case "phone_click":
        steps.push({ kind: "phone", label: `Ligou: ${p.label ?? p.phone ?? ""}`, ts: e.ts });
        break;
      case "maps_click":
        steps.push({
          kind: "maps",
          label: `${p.via === "embed" ? "Mexeu no mapa" : "Abriu o mapa"}: ${p.unit ?? ""}`,
          detail: labelSource(String(p.source ?? "")),
          ts: e.ts,
        });
        break;
      case "email_click":
        steps.push({ kind: "email", label: "E-mail", detail: String(p.email ?? ""), ts: e.ts });
        break;
      case "social_click":
        steps.push({ kind: "social", label: `Rede: ${p.network ?? ""}`, ts: e.ts });
        break;
      case "blog_post_view":
        if (lastPage && !lastPage.label.startsWith("/")) break; // já rotulado pelo page_view
        steps.push({ kind: "blog", label: String(p.post_title ?? p.post_slug ?? "Post"), ts: e.ts });
        break;
      default:
        break;
    }
  }
  return steps;
}

function findPage(steps: JourneyStep[], path: string) {
  for (let i = steps.length - 1; i >= 0; i--) {
    if (steps[i].kind === "page" && !steps[i].detail && steps[i].label === labelPage(path)) return steps[i];
  }
  return null;
}

/** Só os cliques genéricos, para a visão expandida. */
export function genericClicks(trail: TrailEvent[]) {
  return trail
    .filter((e) => e.name === "click")
    .map((e) => ({
      ts: e.ts,
      label: String(e.params?.track ?? e.params?.text ?? e.params?.href ?? "clique"),
      page: labelPage(e.path, e.title),
    }));
}
