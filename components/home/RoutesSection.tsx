"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Truck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

const CITIES = [
  { code: "SP", name: "São Paulo" },
  { code: "GO", name: "Goiás" },
  { code: "DF", name: "Distrito Federal" },
];

export function RoutesSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-surface py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Rotas de atuação"
          title="Especialistas na rota que o seu negócio usa"
          subtitle="São Paulo ⇄ Goiás e São Paulo ⇄ Distrito Federal. Concentramos nossa operação nesses corredores para entregar mais rápido e com mais previsibilidade do que quem tenta atender o Brasil inteiro."
        />

        {/* Barra de rotas SP ⇄ GO ⇄ DF com caminhão animado */}
        <Reveal>
          <div className="relative mx-auto max-w-3xl px-2 py-8">
            <div className="relative flex items-center justify-between">
              {/* Linha do trajeto + caminhão percorrendo */}
              <div aria-hidden className="absolute inset-x-8 top-1/2 -translate-y-1/2 sm:inset-x-10">
                <div className="h-0.5 bg-line" />
                {!reduceMotion && (
                  <motion.span
                    className="absolute -top-3 text-brand-action"
                    animate={{ left: ["2%", "90%", "2%"] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
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
