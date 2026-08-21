import { Quote } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

/**
 * PLACEHOLDER — substituir por depoimentos reais na Fase 4/5.
 * O briefing indica clientes antigos dispostos a gravar.
 */
const TESTIMONIALS = [
  {
    quote:
      "Depoimento de cliente real em gravação — reposição rápida, coleta pontual e atendimento próximo.",
    name: "Cliente Sólida",
    detail: "Distribuidor · parceiro de longa data",
  },
  {
    quote:
      "Depoimento de cliente real em gravação — segurança e transparência em todo o percurso da carga.",
    name: "Cliente Sólida",
    detail: "Indústria · cargas fracionadas",
  },
  {
    quote:
      "Depoimento de cliente real em gravação — previsibilidade que permitiu trabalhar com estoque enxuto.",
    name: "Cliente Sólida",
    detail: "Comércio B2B · SP ⇄ GO",
  },
];

export function Testimonials() {
  return (
    <section className="bg-surface-alt py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Depoimentos"
          title="Quem transporta com a Sólida, fica."
        />
        {/* Swipe nativo no mobile (scroll-snap); grid no desktop */}
        <ul className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
          {TESTIMONIALS.map((t, i) => (
            <Reveal
              key={i}
              delay={i * 0.1}
              className="w-[85%] shrink-0 snap-center md:w-auto md:shrink"
            >
              <li className="flex h-full flex-col rounded-2xl border border-line bg-white p-6">
                <Quote className="size-7 text-brand-action/40" aria-hidden />
                <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-body italic">
                  “{t.quote}”
                </p>
                <footer className="mt-5 border-t border-line pt-4">
                  <p className="text-sm font-bold text-ink">{t.name}</p>
                  <p className="text-xs text-ink-muted">{t.detail}</p>
                </footer>
              </li>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
