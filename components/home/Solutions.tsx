import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

const SOLUTIONS = [
  {
    eyebrow: "Nós temos a solução",
    title: "Armazenagem",
    text: "Guardamos seu estoque em Goiânia, Brasília ou São Paulo e despachamos conforme os pedidos entram.",
    href: "/como-funciona",
    image: "/assets/solucao-armazenagem.jpg",
    alt: "Colaborador da Sólida movimentando caixas com paleteira dentro do galpão",
    position: "object-[35%_center]",
  },
  {
    eyebrow: "Nós temos a solução",
    title: "Transporte",
    text: "Carga fracionada entre Goiás, DF e São Paulo com coleta no prazo e entrega em 2 a 3 dias úteis.",
    href: "/diferenciais",
    image: "/assets/solucao-transporte.jpg",
    alt: "Carreta da Sólida Transporte estacionada na doca do galpão",
    position: "object-center",
  },
];

/** Referência: seção "Nós temos a solução" do site antigo — duas metades full-bleed. */
export function Solutions() {
  return (
    <section aria-label="Nossas soluções" className="bg-ink">
      <div className="grid md:grid-cols-2">
        {SOLUTIONS.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.12} y={0}>
            <Link
              href={s.href}
              className="group relative flex min-h-[420px] items-center overflow-hidden md:min-h-[560px] focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white"
            >
              <Image
                src={s.image}
                alt={s.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${s.position}`}
              />
              <div
                className="absolute inset-0 bg-ink/65 transition-colors duration-500 group-hover:bg-ink/55"
                aria-hidden
              />
              <div className="relative px-6 py-16 sm:px-12 lg:px-20">
                <p className="text-xs font-semibold tracking-[0.22em] text-white/80 uppercase">
                  {s.eyebrow}
                </p>
                <h2 className="font-display mt-2 text-4xl font-extrabold tracking-tight text-white uppercase sm:text-5xl lg:text-6xl">
                  {s.title}
                </h2>
                <span
                  aria-hidden
                  className="mt-5 block h-1 w-16 bg-brand-action transition-all duration-500 group-hover:w-28"
                />
                <p className="mt-5 min-h-[3lh] max-w-sm text-sm leading-relaxed text-white/80 sm:text-base">
                  {s.text}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white">
                  Saiba mais
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden
                  />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
