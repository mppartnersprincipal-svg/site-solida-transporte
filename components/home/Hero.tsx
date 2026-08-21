import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Route, ShieldCheck, Timer } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { Counter } from "@/components/motion/Counter";
import { WhatsAppCTAButton } from "@/components/whatsapp/WhatsAppCTAButton";

const TRUST_ITEMS = [
  { Icon: Timer, label: "32 anos de mercado" },
  { Icon: BadgeCheck, label: "Mesmo CNPJ desde a fundação" },
  { Icon: ShieldCheck, label: "Seguro de carga" },
  { Icon: Route, label: "Rotas SP ⇄ GO ⇄ DF" },
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

          <Reveal delay={0.1}>
            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight text-white text-balance sm:text-5xl lg:text-6xl">
              Sua carga fracionada entre São Paulo, Goiás e Distrito Federal:{" "}
              <span className="text-brand">no prazo</span>, com segurança.
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
              Há 32 anos movimentando cargas menores com coleta pontual, entrega
              em 2 a 3 dias úteis e informação em todo o percurso. Você sempre
              sabe onde está a sua mercadoria.
            </p>
          </Reveal>

          <Reveal delay={0.3} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <WhatsAppCTAButton variant="whatsapp" size="lg" source="hero">
              Falar com um especialista no WhatsApp
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
