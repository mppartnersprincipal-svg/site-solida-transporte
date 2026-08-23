import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

const STEPS = [
  {
    title: "Coleta pontual",
    text: "Se a coleta ficou marcada para hoje, ela sai hoje. Você programa a expedição sem susto.",
  },
  {
    title: "Transporte especializado",
    text: "Sua carga segue nos corredores SP ⇄ GO ⇄ DF, com seguro e rastreio do início ao fim.",
  },
  {
    title: "Entrega com acompanhamento",
    text: "Seus destinatários recebem em 2 a 3 dias úteis. Se houver qualquer ocorrência no caminho, você fica sabendo na hora.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-surface-alt py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Como funciona"
          title="Da indústria ao lojista, sem complicação"
        />
        <ol className="relative grid gap-6 md:grid-cols-3 md:gap-8">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.12} as="li" className="relative h-full rounded-2xl border border-line bg-white p-6 pt-8">
                <span
                  aria-hidden
                  className="absolute -top-5 left-6 flex size-10 items-center justify-center rounded-full bg-brand-action font-display text-lg font-bold text-white shadow-md"
                >
                  {i + 1}
                </span>
                <h3 className="text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{step.text}</p>
              </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
