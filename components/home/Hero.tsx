import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Route, ShieldCheck, Timer } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { Counter } from "@/components/motion/Counter";
import { TypeReveal } from "@/components/motion/TypeReveal";
import { WhatsAppCTAButton } from "@/components/whatsapp/WhatsAppCTAButton";

const TRUST_ITEMS = [
  { Icon: Timer, label: "32 anos de mercado" },
  { Icon: BadgeCheck, label: "Mesmo CNPJ desde a fundação" },
  { Icon: ShieldCheck, label: "Seguro de carga" },
  { Icon: Route, label: "Rotas SP ⇄ GO ⇄ DF e cidade do RJ" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      {/* Foto real da sede/frota, já escurecida */}
      <Image
        src="/assets/hero-sede.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        quality={60}
        className="object-cover opacity-50"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/55 to-ink"
      />

      <Container className="relative">
        <div className="flex min-h-[560px] flex-col justify-center py-20 sm:min-h-[640px] sm:py-28">
          <Reveal>
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-wide text-white/90">
              <span className="size-1.5 rounded-full bg-brand" aria-hidden />
              Há <Counter to={32} className="font-bold text-white" /> anos na estrada
            </p>
          </Reveal>

          {/* Sem Reveal aqui: a própria digitação é a entrada (e roda sem JS) */}
          {/* contain: cada passo da digitação invalida só o h1, não a página */}
          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight text-white text-balance [contain:layout_paint_style] sm:text-5xl lg:text-6xl">
            <TypeReveal
              segments={[
                { text: "Sua carga entre São Paulo, Goiás, Distrito Federal e Rio de Janeiro: " },
                { text: "no prazo", className: "text-brand" },
                { text: ", com segurança." },
              ]}
            />
          </h1>

          <Reveal delay={0.2}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
              Levamos caixas e volumes menores de fabricantes e distribuidores até os lojistas. Coleta no dia combinado, entrega em 2 a 3 dias úteis em capitais e regiões metropolitanas (3 a 4 no interior; algumas cidades do interior têm prazo maior) e você sabendo onde a carga está em cada etapa.
            </p>
          </Reveal>

          <Reveal delay={0.3} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <WhatsAppCTAButton variant="whatsapp" size="lg" source="hero">
              Falar com o comercial no WhatsApp
            </WhatsAppCTAButton>
            <Link href="/a-empresa" className={buttonClasses("outline-light", "lg")}>
              Conheça a Sólida
            </Link>
          </Reveal>
        </div>

        {/* Barra de confiança */}
        <Reveal delay={0.15} className="relative border-t border-white/10 py-6">
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {TRUST_ITEMS.map(({ Icon, label }) => (
              <li key={label} className="flex items-center gap-2.5 text-sm text-white/80">
                <Icon className="size-5 shrink-0 text-brand" aria-hidden />
                {label}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
