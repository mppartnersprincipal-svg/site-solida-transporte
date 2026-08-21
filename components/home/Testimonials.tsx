import Link from "next/link";
import { Quote } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { buttonClasses } from "@/components/ui/Button";
import { TESTIMONIALS } from "@/lib/testimonials";

/** Seção de depoimentos da Home — dados (placeholder) em lib/testimonials.ts. */
export function Testimonials() {
  return (
    <section className="bg-surface-alt py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Depoimentos"
          title="Quem transporta com a Sólida, fica."
        />
        {/* Swipe nativo no mobile (scroll-snap); grid no desktop.
            tabIndex permite rolar a lista pelo teclado. */}
        <ul
          tabIndex={0}
          aria-label="Depoimentos de clientes (role para o lado no celular)"
          className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-action md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0"
        >
          {TESTIMONIALS.map((t, i) => (
            <Reveal
              key={i}
              as="li"
              delay={i * 0.1}
              className="flex w-[85%] shrink-0 snap-center flex-col rounded-2xl border border-line bg-white p-6 md:w-auto md:shrink"
            >
              <Quote className="size-7 text-brand-action/40" aria-hidden />
              <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-body italic">
                “{t.highlight}”
              </p>
              <footer className="mt-5 border-t border-line pt-4">
                <p className="text-sm font-bold text-ink">{t.name}</p>
                <p className="text-xs text-ink-muted">{t.company}</p>
              </footer>
            </Reveal>
          ))}
        </ul>
        <Reveal className="mt-10 text-center" delay={0.2}>
          <Link href="/depoimentos" className={buttonClasses("secondary", "md")}>
            Ver todos os depoimentos
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
