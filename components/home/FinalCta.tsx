import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { WhatsAppCTAButton } from "@/components/whatsapp/WhatsAppCTAButton";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-ink py-16 text-white sm:py-24">
      {/* Foto real da frota na sede, escurecida para manter o contraste */}
      <Image
        src="/assets/cta-frota.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-30"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-ink via-ink/70 to-ink"
      />
      {/* Acento discreto em vermelho */}
      <div
        aria-hidden
        className="absolute -top-32 right-0 size-96 rounded-full bg-brand-action/15 blur-3xl"
      />
      <Container className="relative text-center">
        <Reveal>
          <h2 className="mx-auto max-w-2xl text-3xl font-bold text-white text-balance sm:text-4xl">
            Precisa transportar entre SP, Goiás e DF?
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/70 sm:text-lg">
            Fale agora com nosso time comercial pelo WhatsApp e receba sua
            cotação.
          </p>
        </Reveal>
        <Reveal delay={0.2} className="mt-8">
          <WhatsAppCTAButton variant="whatsapp" size="lg" source="cta-final">
            Pedir cotação no WhatsApp
          </WhatsAppCTAButton>
        </Reveal>
      </Container>
    </section>
  );
}
