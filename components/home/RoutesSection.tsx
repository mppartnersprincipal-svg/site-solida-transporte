"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Truck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

const CITIES = [
  { code: "RJ", name: "Rio de Janeiro (cidade)" },
  { code: "SP", name: "São Paulo" },
  { code: "GO", name: "Goiás" },
  { code: "DF", name: "Distrito Federal" },
];

export function RoutesSection() {
  const reduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  // A animação só inicia quando a barra entra na tela — senão o loop já
  // estaria no meio do trajeto quando o usuário rolasse até aqui
  const inView = useInView(trackRef, { once: true, amount: 0.5 });

  return (
    <section className="bg-surface py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Rotas de atuação"
          title="Especialistas na rota que o seu negócio usa"
          subtitle="São Paulo ⇄ Goiás, São Paulo ⇄ Distrito Federal e a cidade do Rio de Janeiro. Concentramos nossa operação nesses corredores para entregar mais rápido e com mais previsibilidade do que quem tenta atender o Brasil inteiro."
        />

        {/* Barra de rotas RJ · SP ⇄ GO ⇄ DF com caminhão animado */}
        <Reveal>
          <div className="relative mx-auto max-w-3xl px-2 py-8">
            <div className="relative flex items-center justify-between">
              {/* Linha do trajeto + caminhão percorrendo */}
              <div
                ref={trackRef}
                aria-hidden
                className="absolute inset-x-8 top-1/2 -translate-y-1/2 sm:inset-x-10"
              >
                <div className="h-0.5 bg-line" />
                {!reduceMotion && inView && (
                  <motion.span
                    className="absolute -top-3 text-brand-action"
                    initial={{ left: "2%", scaleX: 1 }}
                    animate={{
                      // ida RJ → DF, pausa e volta DF → RJ com o caminhão espelhado
                      left: ["2%", "90%", "90%", "2%", "2%"],
                      scaleX: [1, 1, -1, -1, 1],
                    }}
                    transition={{
                      duration: 11,
                      times: [0, 0.45, 0.5, 0.95, 1],
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Truck className="size-6" />
                  </motion.span>
                )}
              </div>

              {CITIES.map((city) => (
                <div key={city.code} className="relative flex flex-col items-center gap-2">
                  <span className="flex size-14 items-center justify-center rounded-full border-2 border-brand-action bg-surface text-base font-bold text-ink shadow-sm sm:size-16">
                    {city.code}
                  </span>
                  <span className="text-xs font-medium text-ink-muted sm:text-sm">
                    {city.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
