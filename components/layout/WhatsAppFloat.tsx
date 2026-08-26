"use client";

import { motion, useReducedMotion } from "framer-motion";
import { WhatsAppIcon } from "@/components/layout/WhatsAppIcon";
import { useWhatsApp } from "@/components/whatsapp/WhatsAppProvider";

/** Botão flutuante de WhatsApp com pulsar discreto (todas as páginas). */
export function WhatsAppFloat() {
  const { open } = useWhatsApp();
  const reduceMotion = useReducedMotion();

  return (
    <div className="fixed right-4 bottom-4 z-40 sm:right-6 sm:bottom-6">
      {/* Anel de pulso */}
      {!reduceMotion && (
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full bg-whatsapp"
          animate={{ scale: [1, 1.35], opacity: [0.45, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      <motion.button
        onClick={() => open("float")}
        aria-label="Falar com a Sólida no WhatsApp"
        data-track="Abrir Central: Botão flutuante"
        title="Fale com a Sólida"
        className="relative flex size-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg shadow-black/25 transition-colors hover:bg-whatsapp-hover cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-whatsapp"
        whileHover={reduceMotion ? undefined : { scale: 1.06 }}
        whileTap={reduceMotion ? undefined : { scale: 0.95 }}
      >
        <WhatsAppIcon className="size-7" />
      </motion.button>
    </div>
  );
}
