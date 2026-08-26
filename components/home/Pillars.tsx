import { CalendarClock, Headset, Medal, ShieldCheck, Zap } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

const PILLARS = [
  {
    Icon: Zap,
    title: "Rapidez",
    text: "Entrega em 2 a 3 dias úteis após a coleta em capitais e regiões metropolitanas (3 a 4 no interior), em qualquer sentido das rotas SP ⇄ GO ⇄ DF e na cidade do Rio de Janeiro.",
  },
  {
    Icon: ShieldCheck,
    title: "Segurança",
    text: "Trabalhamos com seguro de carga. Se algo acontecer no caminho, você tem a quem recorrer.",
  },
  {
    Icon: CalendarClock,
    title: "Previsibilidade",
    text: "Coleta no prazo e entrega dentro do combinado. Você consegue prometer data para o seu cliente.",
  },
  {
    Icon: Medal,
    title: "Experiência",
    text: "32 anos transportando cargas entre Goiás, DF e São Paulo, e também na cidade do Rio de Janeiro.",
  },
  {
    Icon: Headset,
    title: "Atendimento",
    text: "Atendimento próximo, com gente de verdade do outro lado. Precisou de algo, é só chamar no WhatsApp.",
  },
];

export function Pillars() {
  return (
    <section className="bg-surface-alt py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Nossos pilares"
          title="O que sustenta a operação há 32 anos"
        />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {PILLARS.map(({ Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.08} as="li" className="group h-full rounded-2xl border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-action/30 hover:shadow-lg hover:shadow-brand-action/5">
                <span className="flex size-12 items-center justify-center rounded-xl bg-brand-tint text-brand-action transition-transform duration-300 group-hover:scale-110">
                  <Icon className="size-6" aria-hidden />
                </span>
                <h3 className="mt-4 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{text}</p>
              </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
