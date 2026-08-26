import {
  Award,
  BadgeCheck,
  Clock,
  Eye,
  HeartHandshake,
  Leaf,
  ShieldCheck,
  Truck,
  Warehouse,
  Zap,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card3D } from "@/components/ui/animated-3d-card";
import { Reveal } from "@/components/motion/Reveal";

export const DIFFERENTIALS = [
  {
    Icon: Award,
    title: "32 anos de mercado",
  },
  {
    Icon: BadgeCheck,
    title: "Mesmo CNPJ desde a fundação",
  },
  {
    Icon: Clock,
    title: "Rapidez na coleta",
  },
  {
    Icon: Zap,
    title: "Rapidez na entrega",
  },
  {
    Icon: Warehouse,
    title: "Estrutura e frota próprias",
  },
  {
    Icon: ShieldCheck,
    title: "Seguro de carga",
  },
  {
    Icon: Truck,
    title: "Seguro de frota",
  },
  {
    Icon: Leaf,
    title: "Seguro ambiental",
  },
  {
    Icon: HeartHandshake,
    title: "Atendimento próximo",
  },
  {
    Icon: Eye,
    title: "Transparência total",
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
          {DIFFERENTIALS.map(({ Icon, title }, i) => (
            <Reveal key={title} delay={i * 0.06} as="li" className="h-full">
              <Card3D className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors duration-300 hover:border-brand/40 hover:bg-white/10">
                <Icon className="size-7 text-brand" aria-hidden />
                <h3 className="mt-4 text-base font-bold text-white">{title}</h3>
              </Card3D>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
