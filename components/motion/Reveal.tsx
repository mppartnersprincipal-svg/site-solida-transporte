"use client";

import { motion, useReducedMotion } from "framer-motion";

type RevealTag = "div" | "li" | "span" | "section";

const MOTION_TAGS = {
  div: motion.div,
  li: motion.li,
  span: motion.span,
  section: motion.section,
} as const;

/**
 * Entrada por scroll (fade + slide-up). Use `delay` para efeito stagger
 * entre itens de um grid. Respeita prefers-reduced-motion.
 * `as="li"` mantém o HTML válido dentro de <ul>/<ol> (acessibilidade).
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: RevealTag;
}) {
  const reduceMotion = useReducedMotion();
  const MotionTag = MOTION_TAGS[as];

  return (
    <MotionTag
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.21, 0.65, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}
