import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Route } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { WhatsAppCTAButton } from "@/components/whatsapp/WhatsAppCTAButton";
import { FREIGHT_ROUTES } from "@/lib/freight-routes";

export const metadata: Metadata = {
  title: "Rotas de frete fracionado",
  alternates: { canonical: "/frete" },
  description:
    "Rotas de frete fracionado da Sólida Transporte entre São Paulo, Goiás, Distrito Federal e a cidade do Rio de Janeiro. Escolha a sua rota e peça a cotação pelo WhatsApp.",
};

export default function FretePage() {
  return (
    <>
      <PageHero
        image="/assets/cta-frota.jpg"
        eyebrow="Rotas de frete"
        title="Frete fracionado nas rotas SP, GO, DF e RJ"
        subtitle="Escolha a rota da sua carga: cada página traz prazo, como funciona a operação e o WhatsApp do comercial responsável — há 32 anos com o mesmo CNPJ."
      />

      <section className="bg-surface py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Escolha a rota"
            title="Para onde vai a sua carga?"
          />
          <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FREIGHT_ROUTES.map((route, i) => (
              <Reveal key={route.slug} delay={i * 0.06}>
                <Link
                  href={`/frete/${route.slug}`}
                  className="group flex h-full flex-col justify-between rounded-2xl border border-line bg-white p-6 transition-colors hover:border-brand-action/50"
                >
                  <div>
                    <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.14em] uppercase text-ink-muted">
                      <Route className="size-4 text-brand-action" aria-hidden />
                      {route.corridor.replace("Rota ", "")}
                    </p>
                    <h2 className="mt-2 text-lg font-bold group-hover:text-brand-action">
                      {route.headline}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                      {route.metaDescription}
                    </p>
                  </div>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-action">
                    Ver prazos e pedir cotação
                    <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-surface-alt py-16 text-center sm:py-20">
        <Container>
          <Reveal>
            <h2 className="mx-auto max-w-xl text-2xl font-bold sm:text-3xl text-balance">
              Não achou a sua rota? Fale com o comercial.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-7">
            <WhatsAppCTAButton variant="whatsapp" size="lg" source="frete-cta-final">
              Pedir cotação no WhatsApp
            </WhatsAppCTAButton>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
