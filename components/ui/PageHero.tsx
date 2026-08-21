import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

/** Hero escuro padrão das páginas internas. */
export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-ink py-16 text-white sm:py-24">
      <div
        aria-hidden
        className="absolute -top-24 right-0 size-80 rounded-full bg-brand-action/10 blur-3xl"
      />
      <Container className="relative">
        <Reveal>
          <p className="mb-3 text-xs font-semibold tracking-[0.18em] uppercase text-brand">
            {eyebrow}
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="max-w-3xl text-3xl font-bold leading-tight text-white text-balance sm:text-4xl lg:text-5xl">
            {title}
          </h1>
        </Reveal>
        {subtitle ? (
          <Reveal delay={0.16}>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
              {subtitle}
            </p>
          </Reveal>
        ) : null}
      </Container>
    </section>
  );
}
