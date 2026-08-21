"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { WhatsAppModal } from "@/components/whatsapp/WhatsAppModal";

type WhatsAppContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const WhatsAppContext = createContext<WhatsAppContextValue | null>(null);

export function WhatsAppProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
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
