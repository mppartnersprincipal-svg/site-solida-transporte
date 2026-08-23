"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Empilhadeira da Sólida (PNG recortado, carregando caixas) "entrando" no
 * hero: vem de fora do quadro pela direita, desacelera e para apoiada na
 * base da seção, com um leve balanço de frenagem. Fica atrás do texto e só
 * aparece em telas largas. Respeita prefers-reduced-motion.
 */
export function ForkliftEnter() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute right-[2%] bottom-0 hidden w-[clamp(360px,34vw,520px)] lg:block xl:right-[6%]"
      initial={reduceMotion ? false : { x: "110%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }
      }
    >
      <motion.div
        initial={false}
        animate={reduceMotion ? undefined : { rotate: [0, -1.2, 0.5, 0] }}
        transition={{ duration: 0.7, delay: 1.7, ease: "easeOut" }}
        style={{ transformOrigin: "50% 100%" }}
      >
        <Image
          src="/assets/empilhadeira.png"
          alt=""
          width={853}
          height={858}
          priority
          sizes="(min-width: 1024px) 520px, 0px"
          className="h-auto w-full translate-y-[21%]"
        />
      </motion.div>
    </motion.div>
  );
}
