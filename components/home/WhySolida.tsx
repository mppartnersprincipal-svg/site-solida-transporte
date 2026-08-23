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
    text: "Três décadas fazendo o mesmo tipo de operação, na mesma rota.",
  },
  {
    Icon: BadgeCheck,
    title: "Mesmo CNPJ desde a fundação",
    text: "Empresa que não troca de nome nem de CNPJ para recomeçar do zero.",
  },
  {
    Icon: Clock,
    title: "Rapidez na coleta",
    text: "Não costumamos atrasar coleta. Agendou, pode programar a expedição.",
  },
  {
    Icon: Zap,
    title: "Rapidez na entrega",
    text: "2 a 3 dias úteis após a coleta.",
  },
  {
    Icon: Warehouse,
    title: "Estrutura e frota próprias",
    text: "Capital, sede e frota próprios, com estrutura para atender a sua demanda.",
  },
  {
    Icon: ShieldCheck,
    title: "Seguro de carga",
    text: "Trabalhamos com seguro de carga para proteger a sua mercadoria.",
  },
  {
    Icon: HeartHandshake,
    title: "Atendimento próximo",
    text: "Contato direto com a nossa equipe, da cotação à entrega.",
  },
  {
    Icon: Eye,
    title: "Transparência total",
    text: "Você sabe onde a carga está e é avisado de qualquer ocorrência no caminho.",
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
            <Reveal key={title} delay={i * 0.06} as="li" className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors duration-300 hover:border-brand/40 hover:bg-white/10">
                <Icon className="size-7 text-brand" aria-hidden />
                <h3 className="mt-4 text-base font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{text}</p>
              </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
