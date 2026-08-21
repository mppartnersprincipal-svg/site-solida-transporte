"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { readConsent, writeConsent } from "@/lib/analytics";

/**
 * Banner de consentimento de cookies (LGPD). O aceite libera o carregamento
 * de GA4/Meta Pixel (components/analytics/Analytics.tsx); "Só o essencial"
 * mantém o site 100% funcional sem scripts de medição.
 */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    try {
      if (!readConsent()) setVisible(true);
    } catch {
      // storage indisponível (ex.: modo privado) — não exibe o banner
    }
  }, []);

  const decide = (accepted: boolean) => {
    writeConsent(accepted);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          role="region"
          aria-label="Aviso de cookies"
          className="fixed inset-x-4 bottom-20 z-40 mx-auto max-w-2xl rounded-2xl border border-line bg-white p-4 shadow-2xl sm:bottom-6 sm:flex sm:items-center sm:gap-6 sm:p-5"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.35, ease: [0.21, 0.65, 0.36, 1] }}
        >
          <p className="text-sm text-ink-body">
            Usamos cookies para melhorar sua experiência e medir o desempenho do
            site. Saiba mais na nossa{" "}
            <Link
              href="/politica-de-cookies"
              className="font-semibold text-brand-action underline-offset-2 hover:underline"
            >
              Política de Cookies
            </Link>
            .
          </p>
          <div className="mt-3 flex shrink-0 items-center gap-2 sm:mt-0">
            <button
              onClick={() => decide(false)}
              className="cursor-pointer rounded-full px-4 py-2.5 text-sm font-semibold text-ink-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-action"
            >
              Só o essencial
            </button>
            <Button size="md" onClick={() => decide(true)}>
              Aceitar
            </Button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
