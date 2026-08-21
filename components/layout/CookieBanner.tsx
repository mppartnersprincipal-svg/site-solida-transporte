"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";

const CONSENT_KEY = "solida-cookie-consent";

/** Banner de consentimento de cookies (LGPD). */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    try {
      if (!localStorage.getItem(CONSENT_KEY)) setVisible(true);
    } catch {
      // storage indisponível (ex.: modo privado) — não exibe o banner
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify({ accepted: true, at: Date.now() }));
    } catch {
      // sem storage, apenas fecha nesta visita
    }
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
            site. Ao continuar navegando, você concorda com a nossa{" "}
            <Link
              href="/politica-de-cookies"
              className="font-semibold text-brand-action underline-offset-2 hover:underline"
            >
              Política de Cookies
            </Link>
            .
          </p>
          <div className="mt-3 shrink-0 sm:mt-0">
            <Button size="md" onClick={accept}>
              Aceitar
            </Button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
