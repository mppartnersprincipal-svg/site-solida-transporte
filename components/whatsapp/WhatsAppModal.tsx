"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  Calculator,
  ChevronRight,
  MapPin,
  MessageCircle,
  PackageSearch,
  Truck,
  X,
} from "lucide-react";
import { WA_SUBJECTS, type WaSubject } from "@/lib/whatsapp";
import { trackWhatsAppClick } from "@/lib/analytics";

const SUBJECT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  cotacao: Calculator,
  coleta: Truck,
  rastreamento: PackageSearch,
  outros: MessageCircle,
};

export function WhatsAppModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [activeSubject, setActiveSubject] = useState<WaSubject | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Fecha com Esc, trava o scroll do body, foca o botão de fechar,
  // prende o Tab dentro do diálogo e devolve o foco ao fechar (AA)
  useEffect(() => {
    if (!isOpen) return;
    setActiveSubject(null);
    const previousFocus = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([tabindex="-1"])'
          )
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && (active === first || !dialogRef.current.contains(active))) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [isOpen, onClose]);

  const itemClasses =
    "flex w-full items-center gap-3 rounded-xl border border-line bg-white p-4 text-left " +
    "transition-colors hover:border-whatsapp hover:bg-whatsapp/5 cursor-pointer " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-whatsapp";

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <button
            aria-label="Fechar"
            tabIndex={-1}
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Central de WhatsApp da Sólida"
            className="relative w-full max-w-md rounded-t-2xl bg-surface-alt p-5 shadow-2xl sm:m-4 sm:rounded-2xl sm:p-6"
            initial={reduceMotion ? false : { opacity: 0, y: 32, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.21, 0.65, 0.36, 1] }}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] uppercase text-whatsapp">
                  WhatsApp
                </p>
                <h2 className="mt-1 text-xl font-bold text-ink">
                  {activeSubject ? activeSubject.label : "Olá! Como podemos ajudar?"}
                </h2>
                <p className="mt-1 text-sm text-ink-muted">
                  {activeSubject
                    ? "Escolha a região para falar com a pessoa certa."
                    : "Escolha o assunto e fale direto com quem resolve."}
                </p>
              </div>
              <button
                ref={closeButtonRef}
                onClick={onClose}
                aria-label="Fechar central de WhatsApp"
                className="rounded-full p-2 text-ink-muted transition-colors hover:bg-line hover:text-ink cursor-pointer focus-visible:outline-2 focus-visible:outline-brand-action"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>

            {activeSubject?.options ? (
              <div className="flex flex-col gap-3">
                {activeSubject.options.map((option) => (
                  <a
                    key={option.label}
                    href={option.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={itemClasses}
                    data-track={`Central: ${activeSubject.label} › ${option.label}`}
                    onClick={() => {
                      trackWhatsAppClick({
                        subject: activeSubject.id,
                        option: option.label,
                        source: "modal",
                      });
                      onClose();
                    }}
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-whatsapp/10 text-whatsapp">
                      <MapPin className="size-5" aria-hidden />
                    </span>
                    <span className="flex-1 font-semibold text-ink">{option.label}</span>
                    <ChevronRight className="size-4 shrink-0 text-ink-muted" aria-hidden />
                  </a>
                ))}
                <button
                  onClick={() => setActiveSubject(null)}
                  className="mt-1 inline-flex items-center gap-2 self-start rounded-full px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink cursor-pointer focus-visible:outline-2 focus-visible:outline-brand-action"
                >
                  <ArrowLeft className="size-4" aria-hidden />
                  Voltar aos assuntos
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {WA_SUBJECTS.map((subject) => {
                  const Icon = SUBJECT_ICONS[subject.id] ?? MessageCircle;
                  const inner = (
                    <>
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-whatsapp/10 text-whatsapp">
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <span className="flex-1">
                        <span className="block font-semibold text-ink">{subject.label}</span>
                        <span className="block text-sm text-ink-muted">
                          {subject.description}
                        </span>
                      </span>
                      <ChevronRight className="size-4 shrink-0 text-ink-muted" aria-hidden />
                    </>
                  );

                  return subject.options ? (
                    <button
                      key={subject.id}
                      className={itemClasses}
                      data-track={`Central: ${subject.label}`}
                      onClick={() => setActiveSubject(subject)}
                    >
                      {inner}
                    </button>
                  ) : (
                    <a
                      key={subject.id}
                      href={subject.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={itemClasses}
                      data-track={`Central: ${subject.label}`}
                      onClick={() => {
                        trackWhatsAppClick({ subject: subject.id, source: "modal" });
                        onClose();
                      }}
                    >
                      {inner}
                    </a>
                  );
                })}
              </div>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
