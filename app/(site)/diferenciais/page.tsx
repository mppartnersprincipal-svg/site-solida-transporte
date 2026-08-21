import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { DIFFERENTIALS } from "@/components/home/WhySolida";
import { PriceValue } from "@/components/home/PriceValue";
import { WhatsAppCTAButton } from "@/components/whatsapp/WhatsAppCTAButton";

export const metadata: Metadata = {
  title: "Diferenciais",
  alternates: { canonical: "/diferenciais" },
  description:
    "Oito motivos para transportar com a Sólida: 32 anos de mercado, mesmo CNPJ desde a fundação, rapidez na coleta e na entrega, frota própria, seguro de carga, atendimento próximo e transparência total.",
};

export default function DiferenciaisPage() {
  return (
    <>
      <PageHero
        eyebrow="Diferenciais"
        title="Oito motivos para transportar com a Sólida"
        subtitle="Não competimos pelo frete mais barato: competimos pelo equilíbrio entre preço, segurança, previsibilidade e velocidade."
      />

      {/* 8 diferenciais numerados */}
      <section className="bg-surface py-16 sm:py-24">
        <Container>
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {DIFFERENTIALS.map(({ Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 0.07} as="li" className="group relative h-full rounded-2xl border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-action/30 hover:shadow-lg hover:shadow-brand-action/5">
                  <span
                    aria-hidden
                    className="absolute top-5 right-5 font-display text-3xl font-bold text-line transition-colors duration-300 group-hover:text-brand-action/25"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex size-12 items-center justify-center rounded-xl bg-brand-tint text-brand-action transition-transform duration-300 group-hover:scale-110">
                    <Icon className="size-6" aria-hidden />
                  </span>
                  <h2 className="mt-4 text-base font-bold">{title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{text}</p>
                </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* Preço x valor (mesmo bloco da Home) */}
      <PriceValue />

      {/* CTA */}
      <section className="bg-surface-alt py-16 text-center sm:py-20">
        <Container>
          <Reveal>
            <h2 className="mx-auto max-w-xl text-2xl font-bold sm:text-3xl text-balance">
              Pronto para transportar com quem entrega valor de verdade?
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-7">
            <WhatsAppCTAButton variant="whatsapp" size="lg">
              Pedir cotação no WhatsApp
            </WhatsAppCTAButton>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
