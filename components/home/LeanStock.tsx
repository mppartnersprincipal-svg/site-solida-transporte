import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

const BULLETS = [
  "Reduz estoque parado",
  "Reduz capital imobilizado",
  "Reposições menores e frequentes",
  "Mais previsibilidade",
];

export function LeanStock() {
  return (
    <section className="bg-surface py-16 sm:py-24">
      <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="mb-3 text-xs font-semibold tracking-[0.18em] uppercase text-brand-action">
            Estoque enxuto
          </p>
          <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl text-balance">
            Rapidez que enxuga o seu estoque
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink-body sm:text-lg">
            Com uma logística rápida e previsível para reposição, seu cliente
            não precisa comprar estoque para o mês inteiro. Isso significa menos
            capital parado, reposições menores e mais frequentes e muito mais
            previsibilidade.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {BULLETS.map((bullet, i) => (
              <Reveal key={bullet} delay={0.1 + i * 0.07} as="li" className="flex items-center gap-2.5 text-sm font-medium text-ink">
                  <CheckCircle2 className="size-5 shrink-0 text-brand-action" aria-hidden />
                  {bullet}
                </Reveal>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.15} className="relative">
          <div className="overflow-hidden rounded-2xl">
            <Image
              src="/assets/frota-detalhe.jpg"
              alt="Baú de caminhão da frota da Sólida Transporte com a marca da empresa"
              width={1200}
              height={640}
              className="h-auto w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-5 left-5 rounded-2xl bg-ink px-5 py-4 text-white shadow-xl sm:left-8">
            <p className="text-2xl font-bold">
              2–3 <span className="text-base font-semibold text-brand">dias úteis</span>
            </p>
            <p className="text-xs text-white/70">entrega após a coleta</p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
