"use client";

import { useEffect, useRef, type ReactNode } from "react";

/*
  Efeito máquina de escrever da headline do hero.

  O texto completo vai no HTML (SEO e no-JS intactos; sem JS a headline é
  estática). No mount, um único setInterval revela os caracteres escrevendo
  opacity direto no DOM — sem re-render do React e sem animações CSS por
  caractere (a 1ª versão usava 77 animações com delay e o tick contínuo do
  animation engine estourava o TBT mobile). O h1 usa contain para o recalc
  de cada passo ficar restrito a ele. O caret é um ::after no caractere
  com .type-current (CSS em globals.css).
*/

const CHARS_PER_STEP = 2;
const STEP_MS = 56;
const START_DELAY_MS = 250;
const CARET_LINGER_MS = 1600;

export type TypeSegment = { text: string; className?: string };

export function TypeReveal({ segments }: { segments: TypeSegment[] }) {
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const chars = Array.from(root.querySelectorAll<HTMLElement>(".type-char"));
    if (chars.length === 0) return;

    for (const c of chars) c.style.opacity = "0";

    let i = 0;
    let current: HTMLElement | null = null;
    let interval = 0;
    const timers: number[] = [];

    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        for (let n = 0; n < CHARS_PER_STEP && i < chars.length; n += 1, i += 1) {
          chars[i].style.opacity = "";
          current?.classList.remove("type-current");
          current = chars[i];
          current.classList.add("type-current");
        }
        if (i >= chars.length) {
          window.clearInterval(interval);
          timers.push(
            window.setTimeout(
              () => current?.classList.remove("type-current"),
              CARET_LINGER_MS,
            ),
          );
        }
      }, STEP_MS);
    }, START_DELAY_MS);
    timers.push(start);

    return () => {
      window.clearInterval(interval);
      timers.forEach((t) => window.clearTimeout(t));
      for (const c of chars) {
        c.style.opacity = "";
        c.classList.remove("type-current");
      }
    };
  }, []);

  const label = segments.map((s) => s.text).join("");
  const rendered: ReactNode[] = segments.map((segment, si) => (
    <span key={si} className={segment.className}>
      {Array.from(segment.text).map((char, ci) => (
        <span key={ci} className="type-char">
          {char}
        </span>
      ))}
    </span>
  ));

  return (
    <span ref={rootRef} aria-label={label}>
      <span aria-hidden>{rendered}</span>
    </span>
  );
}
