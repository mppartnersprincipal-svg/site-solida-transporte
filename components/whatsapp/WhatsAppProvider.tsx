"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { WhatsAppModal } from "@/components/whatsapp/WhatsAppModal";
import { trackWhatsAppOpen } from "@/lib/analytics";

type WhatsAppContextValue = {
  isOpen: boolean;
  /** Abre a Central; `source` identifica a origem no analytics (header, float, cta...). */
  open: (source?: string) => void;
  close: () => void;
};

const WhatsAppContext = createContext<WhatsAppContextValue | null>(null);

export function WhatsAppProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback((source: string = "cta") => {
    trackWhatsAppOpen(source);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close]);

  return (
    <WhatsAppContext.Provider value={value}>
      {children}
      <WhatsAppModal isOpen={isOpen} onClose={close} />
    </WhatsAppContext.Provider>
  );
}

export function useWhatsApp() {
  const ctx = useContext(WhatsAppContext);
  if (!ctx) {
    throw new Error("useWhatsApp deve ser usado dentro de <WhatsAppProvider>");
  }
  return ctx;
}
