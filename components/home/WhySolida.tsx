import {
  Award,
  BadgeCheck,
  Clock,
  Eye,
  HeartHandshake,
  ShieldCheck,
  Warehouse,
  Zap,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

export const DIFFERENTIALS = [
  {
    Icon: Award,
    title: "32 anos de mercado",
    text: "Experiência e especialização no mesmo tipo de operação.",
  },
  {
    Icon: BadgeCheck,
    title: "Mesmo CNPJ desde a fundação",
    text: "Solidez, segurança e credibilidade.",
  },
  {
    Icon: Clock,
    title: "Rapidez na coleta",
    text: "Alta previsibilidade; não costumamos atrasar a coleta.",
  },
  {
    Icon: Zap,
    title: "Rapidez na entrega",
    text: "2 a 3 dias úteis após a coleta.",
  },
  {
    Icon: Warehouse,
    title: "Estrutura e frota próprias",
    text: "Capacidade real para atender a demanda.",
  },
  {
    Icon: ShieldCheck,
    title: "Seguro de carga",
    text: "Sua mercadoria protegida.",
  },
  {
    Icon: HeartHandshake,
    title: "Atendimento próximo",
    text: "Suporte humano e contato direto com a empresa.",
  },
  {
    Icon: Eye,
    title: "Transparência total",
    text: "Você acompanha localização, andamento, coleta, ocorrências e situação do transporte.",
  },
];

export function WhySolida() {
  return (
    <section className="bg-ink py-16 text-white sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Por que a Sólida"
          title="Por que empresas confiam a operação à Sólida"
          dark
        />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {DIFFERENTIALS.map(({ Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.06}>
              <li className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors duration-300 hover:border-brand/40 hover:bg-white/10">
                <Icon className="size-7 text-brand" aria-hidden />
                <h3 className="mt-4 text-base font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{text}</p>
              </li>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
