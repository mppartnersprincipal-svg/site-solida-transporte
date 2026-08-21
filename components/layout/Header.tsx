"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/components/layout/nav-links";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { WhatsAppIcon } from "@/components/layout/WhatsAppIcon";
import { useWhatsApp } from "@/components/whatsapp/WhatsAppProvider";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  const drawerCloseRef = useRef<HTMLButtonElement>(null);

  // Drawer: fecha com Esc, foca o botão de fechar ao abrir e devolve o foco (AA)
  useEffect(() => {
    if (!drawerOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    drawerCloseRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, [drawerOpen]);

  const { open } = useWhatsApp();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 12);
  });

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-white/10 bg-ink/95 backdrop-blur transition-shadow",
        scrolled && "shadow-lg shadow-black/20"
      )}
    >
      <Container
        className={cn(
          "flex items-center justify-between gap-4 transition-[padding] duration-300",
          scrolled ? "py-2.5" : "py-4"
        )}
      >
        <Link
          href="/"
          aria-label="Sólida Transporte — página inicial"
          className="shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <Image
            src="/assets/solida-white-retina.png"
            alt="Sólida Transporte"
            width={150}
            height={53}
            priority
            className={cn("h-auto transition-[width] duration-300", scrolled ? "w-28" : "w-32 sm:w-36")}
          />
        </Link>

        {/* Navegação desktop */}
        <nav aria-label="Navegação principal" className="hidden lg:block">
          <ul className="flex items-center gap-6">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white",
                      active ? "text-white" : "text-white/70"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="whatsapp"
            size="md"
            onClick={() => open("header")}
            className="max-sm:hidden"
          >
            <WhatsAppIcon className="size-4" />
            Falar no WhatsApp
          </Button>

          {/* CTA de WhatsApp sempre visível no mobile */}
          <button
            onClick={() => open("header-mobile")}
            aria-label="Falar no WhatsApp"
            className="inline-flex size-11 items-center justify-center rounded-full bg-whatsapp text-white transition-colors hover:bg-whatsapp-hover sm:hidden cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-whatsapp"
          >
            <WhatsAppIcon className="size-5" />
          </button>

          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir menu"
            aria-expanded={drawerOpen}
            className="inline-flex size-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 lg:hidden cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
          >
            <Menu className="size-6" aria-hidden />
          </button>
        </div>
      </Container>

      {/* Drawer mobile — portal para fora do stacking context do header sticky */}
      {mounted &&
        createPortal(
          <AnimatePresence>
        {drawerOpen ? (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              aria-label="Fechar menu"
              tabIndex={-1}
              className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navegação"
              className="absolute inset-y-0 right-0 flex w-full max-w-xs flex-col bg-ink p-6"
              initial={reduceMotion ? false : { x: "100%" }}
              animate={{ x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { x: "100%" }}
              transition={{ duration: 0.28, ease: [0.21, 0.65, 0.36, 1] }}
            >
              <div className="mb-8 flex items-center justify-between">
                <Image
                  src="/assets/solida-white-retina.png"
                  alt="Sólida Transporte"
                  width={120}
                  height={42}
                  className="h-auto w-28"
                />
                <button
                  ref={drawerCloseRef}
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Fechar menu"
                  className="inline-flex size-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
                >
                  <X className="size-6" aria-hidden />
                </button>
              </div>

              <nav aria-label="Navegação principal (mobile)" className="flex-1">
                <ul className="flex flex-col gap-1">
                  {NAV_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setDrawerOpen(false)}
                        className="block rounded-lg px-3 py-3 text-lg font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <Button
                variant="whatsapp"
                size="lg"
                className="w-full"
                onClick={() => {
                  setDrawerOpen(false);
                  open("menu-mobile");
                }}
              >
                <WhatsAppIcon className="size-5" />
                Falar no WhatsApp
              </Button>
            </motion.div>
          </motion.div>
        ) : null}
          </AnimatePresence>,
          document.body
        )}
    </header>
  );
}
