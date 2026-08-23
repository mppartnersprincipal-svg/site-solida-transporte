import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, MapPin, PackageCheck, Route } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { WhatsAppCTAButton } from "@/components/whatsapp/WhatsAppCTAButton";

const SOLUTIONS = [
  {
    index: "01",
    title: "Armazenagem",
    text: "Guardamos seu estoque em Goiânia, Brasília ou São Paulo e despachamos conforme os pedidos entram.",
    href: "/como-funciona",
    image: "/assets/solucao-armazenagem.jpg",
    alt: "Colaborador da Sólida movimentando caixas com paleteira dentro do galpão",
    position: "object-[35%_center]",
    features: [
      { icon: MapPin, label: "Goiânia · Brasília · São Paulo" },
      { icon: PackageCheck, label: "Despacho conforme os pedidos entram" },
    ],
  },
  {
    index: "02",
    title: "Transporte",
    text: "Carga fracionada entre Goiás, DF e São Paulo com coleta no prazo e entrega em 2 a 3 dias úteis.",
    href: "/diferenciais",
    image: "/assets/solucao-transporte.jpg",
    alt: "Carreta da Sólida Transporte estacionada na doca do galpão",
    position: "object-center",
    features: [
      { icon: Route, label: "SP ⇄ GO ⇄ DF, fracionada" },
      { icon: Clock, label: "Entrega em 2 a 3 dias úteis" },
    ],
  },
];

export function Solutions() {
  return (
    <section aria-label="Nossas soluções" className="bg-ink py-16 sm:py-24">
      <Container>
        <SectionHeading
          dark
          eyebrow="Nós temos a solução"
          title="Armazenagem e transporte na mesma operação"
          subtitle="Sua carga pode ficar guardada conosco, viajar conosco — ou os dois, sem trocar de operador no meio do caminho."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {SOLUTIONS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.12}>
              <Link
                href={s.href}
                className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10 transition-colors duration-300 hover:bg-white/8 hover:ring-white/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={s.image}
                    alt={s.alt}
                    fill
                    sizes="(min-width: 768px) 44vw, 100vw"
                    className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${s.position}`}
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent"
                    aria-hidden
                  />
                  <span
                    aria-hidden
                    className="font-display absolute right-5 bottom-3 text-6xl font-extrabold text-white/25 sm:text-7xl"
                  >
                    {s.index}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-7 sm:p-9">
                  <h3 className="font-display text-2xl font-extrabold tracking-tight text-white uppercase sm:text-3xl">
                    {s.title}
                  </h3>
                  <span
                    aria-hidden
                    className="mt-4 block h-1 w-14 bg-brand-action transition-all duration-500 group-hover:w-24"
                  />
                  <p className="mt-4 text-sm leading-relaxed text-white/75 sm:text-base">
                    {s.text}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {s.features.map((f) => (
                      <li
                        key={f.label}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white/8 px-3 py-1.5 text-xs font-medium text-white/85 ring-1 ring-white/10"
                      >
                        <f.icon className="size-3.5 shrink-0 text-brand" aria-hidden />
                        {f.label}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-white">
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

        <Reveal delay={0.2} className="mt-10 flex flex-col items-center gap-4 text-center sm:mt-12 sm:flex-row sm:justify-between sm:text-left">
          <p className="max-w-xl text-sm text-white/70 sm:text-base">
            Precisa dos dois? Fale com a Central e montamos a operação completa,
            do estoque à entrega no lojista.
          </p>
          <WhatsAppCTAButton variant="whatsapp" size="md" source="solucoes" className="shrink-0">
            Falar com a Central
          </WhatsAppCTAButton>
        </Reveal>
      </Container>
    </section>
  );
}
