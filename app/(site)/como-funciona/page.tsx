import type { Metadata } from "next";
import {
  ArrowRight,
  Boxes,
  Clock,
  Eye,
  Factory,
  PackageCheck,
  Store,
  Truck,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { WhatsAppCTAButton } from "@/components/whatsapp/WhatsAppCTAButton";

export const metadata: Metadata = {
  title: "Como Funciona",
  alternates: { canonical: "/como-funciona" },
  description:
    "Como funciona a operação de cargas fracionadas da Sólida: coleta pontual, consolidação nos corredores SP ⇄ GO ⇄ DF e entrega em 2 a 3 dias úteis.",
};

const FLOW = [
  {
    Icon: Factory,
    title: "Fabricante / Distribuidor",
    text: "Você produz ou distribui, e precisa repor o estoque de vários clientes com frequência.",
  },
  {
    Icon: Truck,
    title: "Sólida",
    text: "Coletamos, consolidamos e transportamos suas cargas fracionadas nos corredores SP ⇄ GO ⇄ DF.",
  },
  {
    Icon: Store,
    title: "Lojista",
    text: "Seus clientes recebem em 2 a 3 dias úteis, com informação em todo o percurso.",
  },
];

const EXAMPLES = [
  "Fábrica de acessórios de celular abastecendo revendedores em Goiás e DF",
  "Distribuidora de autopeças repondo o estoque de lojas toda semana",
  "Indústria de suplementos entregando para dezenas de lojistas",
];

const STEPS = [
  {
    Icon: Clock,
    title: "Coleta pontual",
    text: "Buscamos sua mercadoria no prazo combinado. Coleta é compromisso, não promessa.",
  },
  {
    Icon: Boxes,
    title: "Consolidação e transporte",
    text: "Sua carga fracionada segue nos corredores SP ⇄ GO ⇄ DF com segurança e rastreabilidade.",
  },
  {
    Icon: PackageCheck,
    title: "Distribuição aos destinatários",
    text: "Entregamos aos seus destinatários em 2 a 3 dias úteis após a coleta.",
  },
  {
    Icon: Eye,
    title: "Acompanhamento e transparência",
    text: "Você acompanha coleta, andamento, ocorrências e a situação do transporte do início ao fim.",
  },
];

export default function ComoFuncionaPage() {
  return (
    <>
      <PageHero
        eyebrow="Como funciona"
        title="Como funciona a nossa operação de cargas fracionadas"
        subtitle="Do fabricante ao lojista, sem complicação: coleta pontual, consolidação nos corredores SP ⇄ GO ⇄ DF e entrega com acompanhamento em 2 a 3 dias úteis."
      />

      {/* Fluxo Fabricante → Sólida → Lojista */}
      <section className="bg-surface py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="O modelo"
            title="Fabricante ou distribuidor → Sólida → lojista"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {FLOW.map(({ Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 0.12} className="relative">
                <div className="h-full rounded-2xl border border-line bg-white p-6 text-center">
                  <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-brand-tint text-brand-action">
                    <Icon className="size-7" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-lg font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{text}</p>
                </div>
                {i < FLOW.length - 1 && (
                  <ArrowRight
                    aria-hidden
                    className="absolute top-1/2 -right-5 z-10 hidden size-6 -translate-y-1/2 text-brand-action md:block"
                  />
                )}
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2} className="mx-auto mt-10 max-w-2xl">
            <div className="rounded-2xl bg-surface-alt p-6">
              <p className="text-sm font-semibold tracking-wide text-ink uppercase">
                Exemplos reais desse fluxo
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                {EXAMPLES.map((example) => (
                  <li key={example} className="flex items-start gap-2.5 text-sm text-ink-body">
                    <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-action" />
                    {example}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 4 blocos da operação */}
      <section className="bg-surface-alt py-16 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Passo a passo" title="Da coleta à entrega" />
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 0.1} as="li" className="relative h-full rounded-2xl border border-line bg-white p-6 pt-8">
                  <span
                    aria-hidden
                    className="absolute -top-5 left-6 flex size-10 items-center justify-center rounded-full bg-brand-action font-display text-lg font-bold text-white shadow-md"
                  >
                    {i + 1}
                  </span>
                  <Icon className="size-6 text-brand-action" aria-hidden />
                  <h3 className="mt-3 text-base font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{text}</p>
                </Reveal>
            ))}
          </ol>

          {/* Prazo em destaque */}
          <Reveal delay={0.2} className="mx-auto mt-12 max-w-xl">
            <div className="rounded-2xl bg-ink p-8 text-center text-white">
              <p className="text-3xl font-bold">
                2 a 3 <span className="text-brand">dias úteis</span>
              </p>
              <p className="mt-2 text-sm text-white/70">
                Entrega após a coleta, com informação em todo o percurso.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* FOB x CIF */}
      <section className="bg-surface py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Conteúdo rápido"
            title="FOB x CIF: quem paga o frete?"
            subtitle="Dois modelos, uma diferença essencial, e o motivo de o FOB combinar com o perfil da Sólida."
          />
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            <Reveal>
              <article className="h-full rounded-2xl border-2 border-brand-action/30 bg-brand-tint/40 p-7">
                <p className="text-xs font-bold tracking-[0.18em] uppercase text-brand-action">
                  FOB · Free on Board
                </p>
                <h3 className="mt-2 text-xl font-bold">O comprador paga o frete</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-body">
                  Quem compra escolhe a transportadora e assume o frete a partir
                  da coleta. É o modelo ideal para lojistas e distribuidores que
                  compram com frequência nos corredores SP ⇄ GO ⇄ DF: eles
                  ganham controle sobre prazo, custo e qualidade do transporte.
                  Por isso o FOB combina com o perfil da Sólida.
                </p>
              </article>
            </Reveal>
            <Reveal delay={0.1}>
              <article className="h-full rounded-2xl border border-line bg-white p-7">
                <p className="text-xs font-bold tracking-[0.18em] uppercase text-ink-muted">
                  CIF · Cost, Insurance and Freight
                </p>
                <h3 className="mt-2 text-xl font-bold">O vendedor paga o frete</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-body">
                  Quem vende embute o frete no preço e escolhe a transportadora.
                  O comprador recebe sem se preocupar com a logística, mas
                  também sem controle sobre prazo e qualidade da entrega.
                </p>
              </article>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-surface-alt py-16 text-center sm:py-20">
        <Container>
          <Reveal>
            <h2 className="mx-auto max-w-xl text-2xl font-bold sm:text-3xl text-balance">
              Sua operação se encaixa nesse fluxo?
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-7">
            <WhatsAppCTAButton variant="whatsapp" size="lg">
              Falar com um especialista no WhatsApp
            </WhatsAppCTAButton>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
