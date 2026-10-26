"use client";

import { motion, useReducedMotion } from "framer-motion";
import { WhatsAppIcon } from "@/components/layout/WhatsAppIcon";
import { WhatsAppRHLink } from "@/components/vagas/WhatsAppRHLink";

/** Botão flutuante da LP de vagas: vai direto ao RH (sem a Central). */
export function WhatsAppRHFloat() {
  const reduceMotion = useReducedMotion();

  return (
    <div data-print="hide" className="fixed right-4 bottom-4 z-40 sm:right-6 sm:bottom-6">
      {!reduceMotion && (
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full bg-whatsapp"
          animate={{ scale: [1, 1.35], opacity: [0.45, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      <WhatsAppRHLink
        source="float"
        aria-label="Falar com o RH da Sólida no WhatsApp"
        title="Falar com o RH"
        className="relative flex size-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg shadow-black/25 transition-[background-color,transform] hover:scale-105 hover:bg-whatsapp-hover active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-whatsapp motion-reduce:hover:scale-100"
      >
        <WhatsAppIcon className="size-7" />
      </WhatsAppRHLink>
    </div>
  );
}
