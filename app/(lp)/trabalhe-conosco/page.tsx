import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Check, HeartHandshake, MapPin, Truck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { WhatsAppIcon } from "@/components/layout/WhatsAppIcon";
import { CandidatarButton } from "@/components/vagas/CandidatarButton";
import { CandidaturaForm } from "@/components/vagas/CandidaturaForm";
import { WhatsAppRHFloat } from "@/components/vagas/WhatsAppRHFloat";
import { WhatsAppRHLink } from "@/components/vagas/WhatsAppRHLink";
import { ORGANIZATION_JSONLD, SITE_NAME, SITE_URL } from "@/lib/seo";
import { VAGAS, VAGAS_LOCAL, VAGAS_PUBLICADAS_EM } from "@/lib/vagas";
import { cn } from "@/lib/utils";

const TITULO = "Trabalhe conosco: vagas em Goiânia";
const DESCRICAO =
  "A Sólida Transporte está contratando em Goiânia: auxiliar de escritório, ajudante de motorista e motorista categoria D com MOPP. Envie seu currículo pelo site ou pelo WhatsApp do RH.";

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRICAO,
  alternates: { canonical: "/trabalhe-conosco" },
  openGraph: {
    title: `${TITULO} | ${SITE_NAME}`,
    description: DESCRICAO,
    url: "/trabalhe-conosco",
    images: [{ url: "/assets/op-equipe.jpg", width: 1800, height: 1200, alt: "Equipe da Sólida Transporte" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITULO} | ${SITE_NAME}`,
    description: DESCRICAO,
    images: ["/assets/op-equipe.jpg"],
  },
};

const MOTIVOS = [
  { icon: BadgeCheck, titulo: "32 anos de mercado", texto: "Empresa goiana, sólida de verdade, com matriz em Goiânia." },
  { icon: Truck, titulo: "Frota própria", texto: "Operação entre Goiás, São Paulo, Distrito Federal e Rio." },
  { icon: HeartHandshake, titulo: "Seguro de vida da equipe", texto: "Quem trabalha na Sólida tem seguro de vida." },
];

const PASSOS = [
  "Escolha a vaga e preencha seus dados",
  "Anexe o currículo (PDF, Word ou foto), se tiver",
  "O RH analisa e chama quem tem o perfil",
];

/** Google for Jobs: uma vaga por item, todas na matriz. */
const JOBS_JSONLD = VAGAS.map((v) => ({
  "@context": "https://schema.org",
  "@type": "JobPosting",
  title: v.titulo,
  description: `<p>${v.resumo}</p><p>Requisitos:</p><ul>${v.requisitos.map((r) => `<li>${r}</li>`).join("")}</ul>`,
  datePosted: VAGAS_PUBLICADAS_EM,
  hiringOrganization: { "@type": "Organization", name: SITE_NAME, sameAs: SITE_URL },
  jobLocation: {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. Desvio Bucareste, 550, Qd. 256, Lt. 07, Jd. Novo Mundo",
      addressLocality: "Goiânia",
      addressRegion: "GO",
      postalCode: "74703-100",
      addressCountry: "BR",
    },
  },
  directApply: true,
}));

export default function TrabalheConoscoPage() {
  return (
    <>
      {/* Topo enxuto: logo + RH */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/95 backdrop-blur">
        <Container className="flex items-center justify-between gap-4 py-3">
          <Link
            href="/"
            aria-label="Sólida Transporte, página inicial"
            className="shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <Image src="/assets/solida-white-retina.png" alt="Sólida Transporte" width={150} height={53} priority className="h-auto w-28 sm:w-32" />
          </Link>
          <WhatsAppRHLink source="header" className={buttonClasses("whatsapp", "md")}>
            <WhatsAppIcon className="size-5" />
            <span className="max-sm:hidden">Falar com o RH</span>
            <span className="sm:hidden">RH</span>
          </WhatsAppRHLink>
        </Container>
      </header>

      <main id="conteudo" className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-ink text-white">
          <Image
            src="/assets/op-equipe.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            quality={60}
            className="object-cover object-center opacity-45"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink to-transparent" />
          <Container className="relative py-16 sm:py-24 lg:py-28">
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold tracking-[0.14em] uppercase">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-60 motion-reduce:animate-none" />
                  <span className="relative inline-flex size-2 rounded-full bg-brand" />
                </span>
                {VAGAS.length} vagas abertas
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-5 max-w-2xl text-4xl leading-[1.05] font-bold text-white text-balance sm:text-5xl lg:text-6xl">
                Estamos contratando em <span className="text-brand">Goiânia</span>
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
                Venha trabalhar na matriz da Sólida Transporte, há 32 anos na estrada. Deixe seu currículo aqui em
                2 minutos ou chame o RH direto no WhatsApp.
              </p>
            </Reveal>
            <Reveal delay={0.24} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#candidatura"
                data-track="Enviar currículo (Topo)"
                className={cn(buttonClasses("primary", "lg"), "transition-[background-color,transform,box-shadow] hover:scale-[1.02] hover:shadow-lg hover:shadow-brand-action/30 motion-reduce:hover:scale-100")}
              >
                Enviar meu currículo
              </a>
              <WhatsAppRHLink source="hero" className={buttonClasses("outline-light", "lg")}>
                <WhatsAppIcon className="size-5" />
                Chamar o RH no WhatsApp
              </WhatsAppRHLink>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="mt-8 flex items-center gap-2 text-sm text-white/60">
                <MapPin className="size-4 text-brand" aria-hidden />
                Jd. Novo Mundo, Goiânia - GO
              </p>
            </Reveal>
          </Container>
        </section>

        {/* Vagas */}
        <section id="vagas" className="bg-surface-alt py-16 sm:py-24">
          <Container>
            <Reveal className="max-w-2xl">
              <p className="text-xs font-semibold tracking-[0.18em] text-brand-action uppercase">Vagas abertas</p>
              <h2 className="mt-2 text-3xl font-bold text-balance sm:text-4xl">Escolha a sua e se candidate</h2>
            </Reveal>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {VAGAS.map((v, i) => (
                <Reveal
                  key={v.id}
                  delay={i * 0.08}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white p-6 transition-[box-shadow,transform,border-color] hover:-translate-y-1 hover:border-ink/15 hover:shadow-xl hover:shadow-black/5 motion-reduce:hover:translate-y-0 sm:p-7"
                >
                  <span aria-hidden className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-brand-action transition-transform duration-300 group-hover:scale-x-100" />
                  <span aria-hidden className="font-display text-sm font-bold text-brand-action">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-display text-xl leading-snug font-bold">{v.titulo}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-muted">
                    <MapPin className="size-3.5" aria-hidden />
                    {VAGAS_LOCAL}
                  </p>
                  <p className="mt-4 text-sm text-ink-body">{v.resumo}</p>
                  <p className="mt-5 text-xs font-semibold tracking-wide text-ink uppercase">Requisitos</p>
                  <ul className="mt-2.5 mb-7 space-y-2 text-sm">
                    {v.requisitos.map((r) => (
                      <li key={r} className="flex gap-2.5">
                        <Check className="mt-0.5 size-4 shrink-0 text-brand-action" aria-hidden />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto">
                    <CandidatarButton vagaId={v.id} titulo={v.titulo} />
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* Candidatura */}
        <section id="candidatura" className="scroll-mt-20 bg-surface py-16 sm:py-24">
          <Container className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
            <div>
              <Reveal>
                <p className="text-xs font-semibold tracking-[0.18em] text-brand-action uppercase">Candidatura</p>
                <h2 className="mt-2 text-3xl font-bold text-balance sm:text-4xl">Deixe seus dados com o RH</h2>
                <p className="mt-4 max-w-md text-ink-body">
                  O formulário vai direto para o e-mail do RH da Sólida, com o seu currículo anexo.
                </p>
              </Reveal>

              <ol className="mt-8 space-y-4">
                {PASSOS.map((p, i) => (
                  <Reveal as="li" key={p} delay={0.08 * i} className="flex items-start gap-4">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ink font-display text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="pt-1.5 text-ink-body">{p}</span>
                  </Reveal>
                ))}
              </ol>

              <Reveal delay={0.2} className="mt-10 rounded-2xl border border-whatsapp/30 bg-whatsapp/5 p-6">
                <p className="font-display text-lg font-bold">Prefere o WhatsApp?</p>
                <p className="mt-1 text-sm text-ink-body">
                  Mande seu nome, a vaga que quer e o currículo (ou uma foto dele) para o RH.
                </p>
                <WhatsAppRHLink source="formulario" className={cn(buttonClasses("whatsapp", "md"), "mt-5")}>
                  <WhatsAppIcon className="size-5" />
                  (62) 99636-3830
                </WhatsAppRHLink>
              </Reveal>
            </div>

            <Reveal delay={0.1} className="relative rounded-3xl border border-line bg-white p-6 shadow-2xl shadow-black/[0.06] sm:p-9">
              <span aria-hidden className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-brand-action to-transparent" />
              <CandidaturaForm />
            </Reveal>
          </Container>
        </section>

        {/* Por que a Sólida */}
        <section className="bg-ink py-16 text-white sm:py-20">
          <Container>
            <Reveal>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">Por que trabalhar na Sólida</h2>
            </Reveal>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {MOTIVOS.map(({ icon: Icon, titulo, texto }, i) => (
                <Reveal key={titulo} delay={i * 0.08} className="border-t border-white/15 pt-5">
                  <Icon className="size-6 text-brand" aria-hidden />
                  <h3 className="mt-3 text-lg font-bold text-white">{titulo}</h3>
                  <p className="mt-1 text-sm text-white/65">{texto}</p>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-ink py-8 pb-24 text-sm text-white/55 sm:pb-8">
        <Container className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Sólida Transporte · Av. Desvio Bucareste, 550, Jd. Novo Mundo, Goiânia-GO</p>
          <nav aria-label="Links do rodapé" className="flex gap-5">
            <Link href="/" className="hover:text-white">
              Site da Sólida
            </Link>
            <Link href="/politica-de-privacidade" className="hover:text-white">
              Privacidade
            </Link>
          </nav>
        </Container>
      </footer>

      <WhatsAppRHFloat />
      <JsonLd data={[ORGANIZATION_JSONLD, ...JOBS_JSONLD]} />
    </>
  );
}
