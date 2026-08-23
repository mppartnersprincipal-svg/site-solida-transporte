import type { Metadata } from "next";
import Image from "next/image";
import { CircleArrowRight, CircleX, Play, Quote } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { WhatsAppCTAButton } from "@/components/whatsapp/WhatsAppCTAButton";
import { TESTIMONIALS } from "@/lib/testimonials";

export const metadata: Metadata = {
  title: "Depoimentos",
  alternates: { canonical: "/depoimentos" },
  // Página fora da navegação e do sitemap enquanto os depoimentos são placeholder
  robots: { index: false, follow: true },
  description:
    "Quem transporta com a Sólida, fica. Depoimentos de distribuidores, indústrias e comércios B2B que confiam suas cargas fracionadas à Sólida há anos.",
};

export default function DepoimentosPage() {
  return (
    <>
      <PageHero
        image="/assets/hero-depoimentos.jpg"
        eyebrow="Depoimentos"
        title="Quem transporta com a Sólida, fica."
        subtitle="Clientes antigos contam o que mudou na operação deles depois que passaram a despachar com a Sólida."
      />

      <section className="bg-surface py-16 sm:py-24">
        <Container>
          <ul className="grid gap-8 lg:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal
                key={i}
                as="li"
                delay={i * 0.1}
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white"
              >
                {/* Slot de vídeo/foto do depoimento */}
                {t.videoUrl ? (
                  <div className="aspect-video">
                    <iframe
                      src={t.videoUrl}
                      title={`Depoimento de ${t.name}`}
                      className="h-full w-full"
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div
                    aria-hidden
                    className="flex aspect-video items-center justify-center bg-ink"
                  >
                    <span className="flex flex-col items-center gap-2 text-white/40">
                      <Play className="size-9" />
                      <span className="text-xs font-semibold tracking-wide uppercase">
                        Vídeo em breve
                      </span>
                    </span>
                  </div>
                )}

                <div className="flex flex-1 flex-col p-6">
                  <Quote className="size-7 text-brand-action/40" aria-hidden />
                  <blockquote className="mt-3 text-base leading-relaxed font-medium text-ink italic">
                    “{t.highlight}”
                  </blockquote>

                  <div className="mt-5 space-y-3 text-sm leading-relaxed">
                    <p className="flex items-start gap-2.5 text-ink-muted">
                      <CircleX
                        className="mt-0.5 size-4 shrink-0 text-ink-muted/60"
                        aria-hidden
                      />
                      <span>
                        <strong className="font-semibold text-ink">Antes:</strong>{" "}
                        {t.before}
                      </span>
                    </p>
                    <p className="flex items-start gap-2.5 text-ink-body">
                      <CircleArrowRight
                        className="mt-0.5 size-4 shrink-0 text-brand-action"
                        aria-hidden
                      />
                      <span>
                        <strong className="font-semibold text-ink">
                          Com a Sólida:
                        </strong>{" "}
                        {t.after}
                      </span>
                    </p>
                  </div>

                  <footer className="mt-auto flex items-center gap-3 border-t border-line pt-5">
                    {t.photo ? (
                      <Image
                        src={t.photo}
                        alt=""
                        width={44}
                        height={44}
                        className="size-11 rounded-full object-cover"
                      />
                    ) : (
                      <span
                        aria-hidden
                        className="flex size-11 items-center justify-center rounded-full bg-surface-alt font-bold text-ink-muted"
                      >
                        {t.name.replace(/[[\]]/g, "").charAt(0).toUpperCase()}
                      </span>
                    )}
                    <div>
                      <p className="text-sm font-bold text-ink">{t.name}</p>
                      <p className="text-xs text-ink-muted">{t.company}</p>
                      <p className="text-xs font-semibold text-brand-action">
                        {t.years}
                      </p>
                    </div>
                  </footer>
                </div>
              </Reveal>
            ))}
          </ul>

          <Reveal className="mt-10">
            <p className="mx-auto max-w-2xl rounded-2xl border border-dashed border-line bg-surface-alt px-6 py-5 text-center text-sm text-ink-muted">
              <strong className="font-semibold text-ink">Em breve:</strong>{" "}
              os depoimentos dos nossos clientes mais antigos entram aqui assim que forem gravados. Histórias de quem transporta com a Sólida há anos.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* CTA final */}
      <section className="bg-ink py-16 text-center text-white sm:py-20">
        <Container>
          <Reveal>
            <h2 className="text-2xl font-bold text-white text-balance sm:text-3xl">
              Quer ter a mesma experiência na sua operação?
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-3 max-w-xl text-white/75">
              Chame o comercial no WhatsApp e conte como a sua operação funciona hoje. A gente diz onde consegue ajudar.
            </p>
          </Reveal>
          <Reveal delay={0.2} className="mt-7">
            <WhatsAppCTAButton variant="whatsapp" source="depoimentos">
              Falar com a Sólida no WhatsApp
            </WhatsAppCTAButton>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
