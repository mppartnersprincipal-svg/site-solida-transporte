"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NAV_LINKS } from "@/components/layout/nav-links";
import { cn } from "@/lib/utils";

/** Fração da largura visível percorrida a cada clique nas setas. */
const SCROLL_STEP = 0.7;
/** Folga (px) para arredondamento de subpixel ao detectar as bordas. */
const EDGE_TOLERANCE = 2;

function isActiveLink(href: string, pathname: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

/**
 * Navegação desktop com rolagem horizontal: quando os links não cabem entre o
 * logo e os botões, aparecem setas e um degradê na borda com conteúdo oculto.
 */
export function DesktopNav() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateEdges = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > EDGE_TOLERANCE);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - EDGE_TOLERANCE);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateEdges();
    el.addEventListener("scroll", updateEdges, { passive: true });
    const observer = new ResizeObserver(updateEdges);
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);
    return () => {
      el.removeEventListener("scroll", updateEdges);
      observer.disconnect();
    };
  }, [updateEdges]);

  // Garante que o link da página atual fique visível ao navegar
  useEffect(() => {
    const active = scrollerRef.current?.querySelector<HTMLElement>('[aria-current="page"]');
    active?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [pathname]);

  const scrollByStep = (direction: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction * el.clientWidth * SCROLL_STEP,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  const arrowClasses =
    "absolute top-1/2 z-10 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-ink text-white/80 ring-1 ring-white/15 transition-colors hover:bg-white/10 hover:text-white cursor-pointer focus-visible:outline-2 focus-visible:outline-white";

  return (
    <nav aria-label="Navegação principal" className="relative hidden min-w-0 flex-1 lg:block">
      <div
        ref={scrollerRef}
        className={cn(
          "scrollbar-none overflow-x-auto overscroll-x-contain scroll-px-10",
          canScrollLeft && canScrollRight && "nav-fade-both",
          canScrollLeft && !canScrollRight && "nav-fade-left",
          !canScrollLeft && canScrollRight && "nav-fade-right"
        )}
      >
        {/* w-max + mx-auto: centraliza quando cabe e rola a partir do início quando não cabe */}
        <ul className="mx-auto flex w-max items-center gap-6 px-1 py-2">
          {NAV_LINKS.map((link) => {
            const active = isActiveLink(link.href, pathname);
            return (
              <li key={link.href} className="shrink-0">
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "whitespace-nowrap text-sm font-medium transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white",
                    active ? "text-white" : "text-white/70"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Setas ficam fora da ordem de tabulação: por teclado, o Tab já rola até cada link */}
      {canScrollLeft ? (
        <button
          type="button"
          tabIndex={-1}
          aria-label="Ver itens anteriores do menu"
          onClick={() => scrollByStep(-1)}
          className={cn(arrowClasses, "left-0")}
        >
          <ChevronLeft className="size-4" aria-hidden />
        </button>
      ) : null}
      {canScrollRight ? (
        <button
          type="button"
          tabIndex={-1}
          aria-label="Ver mais itens do menu"
          onClick={() => scrollByStep(1)}
          className={cn(arrowClasses, "right-0")}
        >
          <ChevronRight className="size-4" aria-hidden />
        </button>
      ) : null}
    </nav>
  );
}
