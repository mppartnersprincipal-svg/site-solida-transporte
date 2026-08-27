"use client";

import { useEffect, useRef } from "react";
import { trackMapsClick } from "@/lib/analytics";
import { collect } from "@/lib/tracker";

/**
 * Iframe do Google Maps com medição. Cliques dentro de um iframe não chegam
 * ao documento pai, então detectamos a interação pelo foco: quando a janela
 * perde o foco e o elemento ativo é este iframe, o visitante mexeu no mapa.
 * Dispara `maps_click` (via: "embed") uma vez por "entrada" no mapa e um
 * `click` genérico para o ranking "Tudo que foi clicado" do dashboard.
 */
export function TrackedMapEmbed({
  unit,
  source,
  ...rest
}: React.IframeHTMLAttributes<HTMLIFrameElement> & { unit: string; source: string }) {
  const ref = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let inside = false;
    const onBlur = () => {
      // em alguns browsers o activeElement só muda depois do blur — checar no próximo tick
      setTimeout(() => {
        if (document.activeElement !== ref.current || inside) return;
        inside = true;
        trackMapsClick({ unit, source, via: "embed" });
        const section = ref.current?.closest("section[id],[data-section]") as HTMLElement | null;
        collect("click", {
          tag: "iframe",
          track: `Mapa interativo: ${unit}`,
          text: `Mapa ${unit}`,
          href: "google.com",
          section: section?.getAttribute("data-section") || section?.id || undefined,
        });
      }, 0);
    };
    // voltou o foco para a página → a próxima interação conta de novo
    const onFocus = () => {
      inside = false;
    };
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
    };
  }, [unit, source]);

  return <iframe ref={ref} data-track={`Mapa interativo: ${unit}`} {...rest} />;
}
