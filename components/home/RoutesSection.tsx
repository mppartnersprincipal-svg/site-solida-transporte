"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Truck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

// Ordem visual: RJ isolado (só entregas locais) e SP no centro dos corredores GO ⇄ SP ⇄ DF
const CITIES = [
  { code: "RJ", name: "Rio de Janeiro" },
  { code: "GO", name: "Goiás" },
  { code: "SP", name: "São Paulo" },
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
          subtitle="Atendemos apenas dois corredores rodoviários: São Paulo ⇄ Goiás e São Paulo ⇄ Distrito Federal, além de entregas dentro da cidade do Rio de Janeiro. Não interligamos Goiás a Distrito Federal nem Rio de Janeiro a São Paulo. Concentramos nossa operação nessas rotas para entregar mais rápido e com mais previsibilidade do que quem tenta atender o Brasil inteiro."
        />

        {/* Barra de rotas: RJ isolado (só entregas locais) · GO ⇄ SP ⇄ DF com caminhão saindo de SP */}
        <Reveal>
          <div className="relative mx-auto max-w-3xl px-2 py-8">
            <div className="relative grid grid-cols-4">
              {/* Linha do trajeto + caminhão percorrendo */}
              <div
                ref={trackRef}
                aria-hidden
                // 4 colunas iguais → centros em 12,5% / 37,5% / 62,5% / 87,5%; top = metade do círculo (size-14/16)
                className="absolute inset-x-[12.5%] top-7 -translate-y-1/2 sm:top-8"
              >
                {/* Linha contínua de ponta a ponta, atrás dos círculos */}
                <div className="h-1 w-full rounded-full bg-brand-action/30" />
                {!reduceMotion && inView && (
                  <motion.span
                    className="absolute -top-3.5 text-brand-action"
                    initial={{ left: "60%", scaleX: 1 }}
                    animate={{
                      // SP → DF, volta a SP, SP → GO e volta a SP. Sempre parte de SP:
                      // GO e DF não se conectam entre si, e o RJ fica fora do trajeto
                      left: ["60%", "90%", "90%", "60%", "60%", "31%", "31%", "60%", "60%"],
                      scaleX: [1, 1, -1, -1, -1, -1, 1, 1, 1],
                    }}
                    transition={{
                      duration: 16,
                      times: [0, 0.22, 0.25, 0.47, 0.5, 0.72, 0.75, 0.97, 1],
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Truck className="size-6" />
                  </motion.span>
                )}
              </div>

              {CITIES.map((city) => (
                <div key={city.code} className="relative z-10 flex flex-col items-center gap-2">
                  <span className="flex size-14 items-center justify-center rounded-full border-2 border-brand-action bg-surface text-base font-bold text-ink shadow-sm sm:size-16">
                    {city.code}
                  </span>
                  <span className="text-center text-xs font-medium text-ink-muted sm:text-sm">
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
