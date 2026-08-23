import type { ReactNode } from "react";

/*
  Efeito máquina de escrever SEM JavaScript: o texto completo vai no HTML
  (SEO e no-JS intactos) e cada caractere é um <span> que aparece via
  animação CSS com delay incremental (.type-char em globals.css). Como os
  caracteres sempre ocupam o espaço (só a opacity muda), não há layout
  shift; e como é um Server Component, não adiciona nada ao bundle.
*/

/*
  Ritmo: revela em passos de 2 caracteres (56ms) — mesma velocidade visual de
  28ms/char, mas com metade dos eventos de animação. Cada start de animação
  custa um style recalc; com 77 chars individuais o TBT mobile estourava.
*/
const CHARS_PER_STEP = 2;
const STEP_MS = 56;

export type TypeSegment = { text: string; className?: string };

export function TypeReveal({
  segments,
  startDelayMs = 300,
}: {
  segments: TypeSegment[];
  startDelayMs?: number;
}) {
  const label = segments.map((s) => s.text).join("");
  const totalChars = segments.reduce((n, s) => n + s.text.length, 0);
  const caretDelayMs =
    startDelayMs + Math.ceil(totalChars / CHARS_PER_STEP) * STEP_MS;

  let charIndex = 0;
  const rendered: ReactNode[] = segments.map((segment, si) => (
    <span key={si} className={segment.className}>
      {Array.from(segment.text).map((char) => {
        const step = Math.floor(charIndex / CHARS_PER_STEP);
        const delay = startDelayMs + step * STEP_MS;
        charIndex += 1;
        return (
          <span
            key={charIndex}
            className="type-char"
            style={{ animationDelay: `${delay}ms` }}
          >
            {char}
          </span>
        );
      })}
    </span>
  ));

  return (
    <span aria-label={label}>
      <span aria-hidden>
        {rendered}
        <span
          aria-hidden
          className="type-caret"
          style={{ animationDelay: `${caretDelayMs}ms` }}
        />
      </span>
    </span>
  );
}
