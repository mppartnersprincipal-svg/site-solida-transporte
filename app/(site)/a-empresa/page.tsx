import type { Metadata } from "next";
import Image from "next/image";
import { Award, BadgeCheck, Flag, MapPinned, ShieldCheck, Truck, Warehouse } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Counter } from "@/components/motion/Counter";
import { WhatsAppCTAButton } from "@/components/whatsapp/WhatsAppCTAButton";

export const metadata: Metadata = {
  title: "A Empresa",
  alternates: { canonical: "/a-empresa" },
  description:
    "Há 32 anos a Sólida Transporte movimenta cargas fracionadas entre SP, Goiás e DF: mesmo CNPJ desde a fundação, estrutura e frota próprias.",
};

const SEALS = [
  { Icon: BadgeCheck, label: "Mesmo CNPJ desde a fundação" },
  { Icon: ShieldCheck, label: "Seguro de carga" },
  { Icon: Award, label: "32 anos de mercado" },
];

// TODO: validar datas e marcos reais da história com a Sólida (plano §5.2)
const TIMELINE = [
  {
    Icon: Flag,
    year: "1994",
    title: "Fundação em Goiânia",
    text: "A Sólida nasce com um propósito simples: levar cargas fracionadas com rapidez, segurança e previsibilidade.",
  },
  {
    Icon: Truck,
    year: "Expansão",
    title: "Filiais em São Paulo e Brasília",
    text: "A operação se consolida nos corredores SP ⇄ GO ⇄ DF, com unidades próprias nas três praças.",
  },
  {
    Icon: Warehouse,
    year: "Estrutura",
    title: "Sede, capital e frota próprios",
    text: "Investimento contínuo em estrutura e capacidade operacional para atender a demanda com regularidade.",
  },
  {
    Icon: MapPinned,
    year: "Hoje",
    title: "Mais de 12 agências nos principais polos",
    text: "Três décadas depois, seguimos com o mesmo CNPJ e a mesma obsessão: você sempre sabe onde está a sua carga.",
  },
];

export default function AEmpresaPage() {
  return (
    <>
      <PageHero
        eyebrow="A Empresa"
        title="32 anos movimentando o comércio entre SP, Goiás e DF."
        subtitle="A Sólida Transporte nasceu com um propósito simples: levar cargas fracionadas com rapidez, segurança e previsibilidade. Mais de três décadas depois, seguimos com o mesmo CNPJ desde a fundação: sinal de solidez, estabilidade e compromisso com quem confia na gente."
      />

      {/* Missão + estrutura própria */}
      <section className="bg-surface py-16 sm:py-24">
        <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="mb-3 text-xs font-semibold tracking-[0.18em] uppercase text-brand-action">
              Nossa missão
            </p>
            <h2 className="text-2xl font-bold sm:text-3xl text-balance">
              Ser a parceira de confiança que conecta indústrias, distribuidores
              e lojistas
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink-body sm:text-lg">
              Por meio de um transporte rápido, seguro e transparente. Capital,
              sede e frota próprios: estrutura e capacidade operacional para
              atender sua demanda com regularidade: matriz em Goiânia e filiais
              em São Paulo e no Distrito Federal.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2.5">
              {SEALS.map(({ Icon, label }) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-alt px-4 py-2 text-sm font-semibold text-ink"
                >
                  <Icon className="size-4.5 text-brand-action" aria-hidden />
                  {label}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.15} className="relative">
            <div className="overflow-hidden rounded-2xl">
              <Image
                src="/assets/sede-frota.jpg"
                alt="Sede da Sólida Transporte em Goiânia, com caminhão da frota própria"
                width={1200}
                height={640}
                className="h-auto w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 left-5 rounded-2xl bg-ink px-5 py-4 text-white shadow-xl sm:left-8">
              <p className="text-2xl font-bold">
                <Counter to={32} suffix=" anos" className="text-white" />
              </p>
              <p className="text-xs text-white/70">com o mesmo CNPJ</p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Timeline */}
      <section className="bg-surface-alt py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Nossa história"
            title="De 1994 até hoje, sempre na mesma rota"
          />
          <ol className="relative mx-auto max-w-2xl border-l-2 border-line pl-8">
            {TIMELINE.map(({ Icon, year, title, text }, i) => (
              <Reveal key={title} delay={i * 0.1} as="li" className="relative pb-10 last:pb-0">
                  <span
                    aria-hidden
                    className="absolute -left-[45px] flex size-8 items-center justify-center rounded-full border-2 border-brand-action bg-white text-brand-action"
                  >
                    <Icon className="size-4" />
                  </span>
                  <p className="text-xs font-bold tracking-[0.18em] uppercase text-brand-action">
                    {year}
                  </p>
                  <h3 className="mt-1 text-lg font-bold">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{text}</p>
                </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-surface py-16 text-center sm:py-20">
        <Container>
          <Reveal>
            <h2 className="mx-auto max-w-xl text-2xl font-bold sm:text-3xl text-balance">
              Quer uma transportadora com história para contar, e prazo para
              cumprir?
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-7">
            <WhatsAppCTAButton variant="whatsapp" size="lg">
              Fale com a Sólida no WhatsApp
            </WhatsAppCTAButton>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
