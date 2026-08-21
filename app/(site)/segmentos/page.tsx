import type { Metadata } from "next";
import {
  Bike,
  Cog,
  Dumbbell,
  Home,
  Monitor,
  Smartphone,
  Sparkles,
  UtensilsCrossed,
  Wine,
  XCircle,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { WhatsAppCTAButton } from "@/components/whatsapp/WhatsAppCTAButton";

export const metadata: Metadata = {
  title: "Segmentos",
  alternates: { canonical: "/segmentos" },
  description:
    "Segmentos que a Sólida atende melhor: acessórios para celular, autopeças, cosméticos, suplementação, informática, alimentos, vinhos e mais — cargas fracionadas entre SP, GO e DF.",
};

const SEGMENTS = [
  {
    Icon: Smartphone,
    label: "Acessórios para celular",
    text: "Giro alto e reposição constante: revendedores não podem esperar semanas pela mercadoria.",
  },
  {
    Icon: Cog,
    label: "Autopeças",
    text: "Reposição rápida para as lojas não perderem venda — peça parada é carro parado no cliente.",
  },
  {
    Icon: Bike,
    label: "Acessórios para motos",
    text: "Volumes menores, muitos destinatários e demanda contínua nas três praças.",
  },
  {
    Icon: Sparkles,
    label: "Cosméticos",
    text: "Produtos de valor agregado que exigem manuseio cuidadoso e prazo confiável.",
  },
  {
    Icon: Home,
    label: "Automação residencial",
    text: "Equipamentos sensíveis que precisam chegar íntegros e no prazo da instalação.",
  },
  {
    Icon: Dumbbell,
    label: "Suplementação animal e alimentar",
    text: "Vários pedidos menores para vários lojistas — o fluxo ideal da carga fracionada.",
  },
  {
    Icon: Monitor,
    label: "Equipamentos de informática",
    text: "Mercadoria de alto valor que não pode ficar na mão de transportadora duvidosa.",
  },
  {
    Icon: UtensilsCrossed,
    label: "Alimentos",
    text: "Reposição frequente e previsível para o varejo não trabalhar com estoque parado.",
  },
  {
    Icon: Wine,
    label: "Vinhos",
    text: "Carga frágil e valiosa: seguro de carga e cuidado no manuseio fazem a diferença.",
  },
];

const AVOID = [
  "Chapas de metal",
  "Perfis e estruturas metálicas",
  "Tintas",
  "Pneus e rodas",
  "Eletrodomésticos",
  "Móveis",
];

const FORBIDDEN = ["Remédios", "Explosivos", "Armas"];

export default function SegmentosPage() {
  return (
    <>
      <PageHero
        eyebrow="Segmentos"
        title="Segmentos que a Sólida atende melhor"
        subtitle="Feito para quem envia caixas e volumes menores, com envios recorrentes e diversos destinatários — do fabricante ou distribuidor direto para o lojista."
      />

      {/* Grid de segmentos com dor/solução */}
      <section className="bg-surface py-16 sm:py-24">
        <Container>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SEGMENTS.map(({ Icon, label, text }, i) => (
              <Reveal key={label} delay={i * 0.06} as="li" className="group h-full rounded-2xl border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-action/30 hover:shadow-lg hover:shadow-brand-action/5">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-brand-tint text-brand-action transition-transform duration-300 group-hover:scale-110">
                    <Icon className="size-6" aria-hidden />
                  </span>
                  <h2 className="mt-4 text-base font-bold">{label}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{text}</p>
                </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* O que não transportamos */}
      <section className="bg-surface-alt py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Transparência"
            title="O que não transportamos"
            subtitle="Para ganharmos tempo — o seu e o nosso — somos diretos sobre o que não se encaixa na nossa operação."
          />
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-2xl border border-line bg-white p-7">
                <h3 className="text-base font-bold">Evitamos transportar</h3>
                <p className="mt-1 text-xs text-ink-muted">
                  Cargas fora do perfil fracionado da nossa operação
                </p>
                <ul className="mt-4 grid grid-cols-2 gap-2.5">
                  {AVOID.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-ink-body">
                      <XCircle className="size-4 shrink-0 text-ink-muted" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="h-full rounded-2xl border-2 border-brand-action/30 bg-brand-tint/40 p-7">
                <h3 className="text-base font-bold">Não transportamos</h3>
                <p className="mt-1 text-xs text-ink-muted">
                  Sem exceção, por segurança e conformidade legal
                </p>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {FORBIDDEN.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm font-semibold text-ink">
                      <XCircle className="size-4 shrink-0 text-brand-action" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-surface py-16 text-center sm:py-20">
        <Container>
          <Reveal>
            <h2 className="mx-auto max-w-xl text-2xl font-bold sm:text-3xl text-balance">
              Seu segmento está aqui — ou parecido com estes?
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-7">
            <WhatsAppCTAButton variant="whatsapp" size="lg">
              Fale no WhatsApp
            </WhatsAppCTAButton>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
