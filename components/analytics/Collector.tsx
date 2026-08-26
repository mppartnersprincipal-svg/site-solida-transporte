"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initTracker, trackPageView } from "@/lib/tracker";

/**
 * Coleta first-party anônima para o /dashboard (ver lib/tracker.ts).
 * Independente do GTM/consentimento — não usa cookies nem dados pessoais.
 * Montar SÓ no layout do grupo (site); nunca no (admin).
 */
export function Collector() {
  const pathname = usePathname();

  useEffect(() => {
    initTracker();
  }, []);

  useEffect(() => {
    // document.title ainda pode ser o da rota anterior no instante da troca —
    // espera o próximo tick para ler o título já atualizado.
    const id = window.setTimeout(() => trackPageView(pathname, document.title), 0);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
