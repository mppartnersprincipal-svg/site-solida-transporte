import type { Metadata } from "next";
import {
  Calculator,
  ChevronRight,
  Mail,
  MapPin,
  MessageCircle,
  PackageSearch,
  Phone,
  Receipt,
  Truck,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { WhatsAppIcon } from "@/components/layout/WhatsAppIcon";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
} from "@/components/layout/SocialIcons";
import { WA_SUBJECTS } from "@/lib/whatsapp";
import { BRASILIA_MAP_EMBED, GUARULHOS_MAP_EMBED, MATRIZ_MAP_EMBED, UNITS } from "@/lib/units";
import { TrackedMapEmbed } from "@/components/analytics/TrackedMapEmbed";
import { WaTrackedLink } from "@/components/whatsapp/WaTrackedLink";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { JsonLd } from "@/components/seo/JsonLd";
import { LOCAL_BUSINESS_JSONLD } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contato",
  alternates: { canonical: "/contato" },
  description:
    "Fale com a Sólida Transporte pelo WhatsApp certo para o seu assunto (cotação, coleta, rastreamento, financeiro ou jurídico) ou visite nossas unidades em Goiânia, Guarulhos e Brasília.",
};

const SUBJECT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  cotacao: Calculator,
  coleta: Truck,
  rastreamento: PackageSearch,
  financeiro: Receipt,
  outros: MessageCircle,
};

// TODO: validar URL de LinkedIn com a Sólida (Facebook veio da auditoria)
const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/solidatransporte/", Icon: InstagramIcon },
  { label: "LinkedIn", href: "#", Icon: LinkedInIcon },
  { label: "Facebook", href: "https://facebook.com/solidatransporte", Icon: FacebookIcon },
];

export default function ContatoPage() {
  return (
    <>
      {/* LocalBusiness das 3 unidades (plano §10) */}
      <JsonLd data={LOCAL_BUSINESS_JSONLD} />
      <PageHero
        image="/assets/hero-contato.jpg"
        eyebrow="Contato"
        title="Olá! Como podemos ajudar?"
        subtitle="Escolha o assunto e fale direto com quem resolve, sem transferência e sem espera. Cada botão abre o WhatsApp certo com a mensagem já preparada."
      />

      {/* Central de WhatsApp */}
      <section className="bg-surface py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Central de WhatsApp"
            title="Fale com a pessoa certa para o seu assunto"
          />
          <ul className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
            {WA_SUBJECTS.map((subject, i) => {
              const Icon = SUBJECT_ICONS[subject.id] ?? MessageCircle;
              return (
                <Reveal key={subject.id} delay={i * 0.07} as="li" className="h-full rounded-2xl border border-line bg-white p-6">
                    {/* id = âncora dos redirects do site antigo (/contato#rastreamento etc.) */}
                    <div id={subject.id} className="flex scroll-mt-28 items-start gap-4">
                      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-whatsapp/10 text-whatsapp">
                        <Icon className="size-6" aria-hidden />
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-base font-bold">{subject.label}</h3>
                        <p className="mt-0.5 text-sm text-ink-muted">
                          {subject.description}
                        </p>
                      </div>
                    </div>

                    {subject.options ? (
                      <div className="mt-4 flex flex-col gap-2.5">
                        {subject.options.map((option) => (
                          <WaTrackedLink
                            key={option.label}
                            href={option.href}
                            subject={subject.id}
                            option={option.label}
                            source="contato"
                            className="flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-3 text-sm font-semibold text-ink transition-colors hover:border-whatsapp hover:bg-whatsapp/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-whatsapp"
                          >
                            <span className="inline-flex items-center gap-2">
                              <WhatsAppIcon className="size-4 text-whatsapp" />
                              {option.label}
                            </span>
                            <ChevronRight className="size-4 shrink-0 text-ink-muted" aria-hidden />
                          </WaTrackedLink>
                        ))}
                      </div>
                    ) : (
                      <WaTrackedLink
                        href={subject.href ?? "#"}
                        subject={subject.id}
                        source="contato"
                        className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-3 text-sm font-semibold text-ink transition-colors hover:border-whatsapp hover:bg-whatsapp/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-whatsapp"
                      >
                        <span className="inline-flex items-center gap-2">
                          <WhatsAppIcon className="size-4 text-whatsapp" />
                          Abrir conversa no WhatsApp
                        </span>
                        <ChevronRight className="size-4 shrink-0 text-ink-muted" aria-hidden />
                      </WaTrackedLink>
                    )}
                  </Reveal>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* Unidades */}
      <section className="bg-surface-alt py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Unidades"
            title="Onde a Sólida está"
            subtitle="Matriz em Goiânia e filiais em Guarulhos e Brasília: presença própria nas três pontas da rota."
          />
          <ul className="grid gap-6 lg:grid-cols-3">
            {UNITS.map((unit, i) => (
              <Reveal key={unit.city} delay={i * 0.1} as="li" className="flex h-full flex-col rounded-2xl border border-line bg-white p-6">
                  <p className="text-xs font-semibold tracking-[0.18em] uppercase text-brand-action">
                    {unit.role}
                  </p>
                  <h3 className="mt-1 text-lg font-bold">{unit.city}</h3>
                  <p className="mt-3 flex items-start gap-2.5 text-sm leading-relaxed text-ink-body">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-brand-action" aria-hidden />
                    {unit.address}
                  </p>
                  <div className="mt-4 flex flex-1 flex-col gap-2 text-sm">
                    <TrackedLink
                      href={unit.phoneHref}
                      track={{ kind: "phone", phone: unit.phoneHref.replace("tel:", ""), label: unit.city, source: "contato" }}
                      className="inline-flex items-center gap-2.5 text-ink-body transition-colors hover:text-ink"
                    >
                      <Phone className="size-4 text-ink-muted" aria-hidden />
                      {unit.phoneLabel}
                    </TrackedLink>
                    <TrackedLink
                      href={`mailto:${unit.email}`}
                      track={{ kind: "email", email: unit.email, source: "contato" }}
                      className="inline-flex items-center gap-2.5 break-all text-ink-body transition-colors hover:text-ink"
                    >
                      <Mail className="size-4 shrink-0 text-ink-muted" aria-hidden />
                      {unit.email}
                    </TrackedLink>
                    <WaTrackedLink
                      href={unit.waHref}
                      subject="unidade"
                      option={unit.city}
                      source="contato"
                      className="inline-flex items-center gap-2.5 font-semibold text-ink transition-colors hover:text-whatsapp"
                    >
                      <WhatsAppIcon className="size-4 text-whatsapp" />
                      WhatsApp da unidade
                    </WaTrackedLink>
                  </div>
                  <TrackedLink
                    href={unit.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    track={{ kind: "maps", unit: unit.city, source: "contato" }}
                    className="mt-5 inline-flex items-center gap-1.5 self-start rounded-full border border-ink/20 px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-action"
                  >
                    Ver no mapa
                    <ChevronRight className="size-4" aria-hidden />
                  </TrackedLink>
                </Reveal>
            ))}
          </ul>

          {/* Mapas: matriz e filiais */}
          <Reveal delay={0.15} className="mt-10">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <figure className="overflow-hidden rounded-2xl border border-line">
                <TrackedMapEmbed
                  unit="Goiânia - GO"
                  source="contato"
                  src={MATRIZ_MAP_EMBED}
                  title="Mapa da matriz da Sólida Transporte em Goiânia"
                  className="h-80 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
                <figcaption className="border-t border-line px-4 py-3 text-sm font-semibold text-ink">
                  Matriz · Goiânia - GO
                </figcaption>
              </figure>
              <figure className="overflow-hidden rounded-2xl border border-line">
                <TrackedMapEmbed
                  unit="Guarulhos - SP"
                  source="contato"
                  src={GUARULHOS_MAP_EMBED}
                  title="Mapa da filial da Sólida Transporte em Guarulhos"
                  className="h-80 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
                <figcaption className="border-t border-line px-4 py-3 text-sm font-semibold text-ink">
                  Filial São Paulo · Guarulhos - SP
                </figcaption>
              </figure>
              <figure className="overflow-hidden rounded-2xl border border-line">
                <TrackedMapEmbed
                  unit="Brasília - DF"
                  source="contato"
                  src={BRASILIA_MAP_EMBED}
                  title="Mapa da filial da Sólida Transporte em Brasília"
                  className="h-80 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
                <figcaption className="border-t border-line px-4 py-3 text-sm font-semibold text-ink">
                  Filial Distrito Federal · Brasília - DF
                </figcaption>
              </figure>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Redes sociais */}
      <section className="bg-surface py-16 text-center sm:py-20">
        <Container>
          <Reveal>
            <h2 className="text-2xl font-bold sm:text-3xl">
              Acompanhe a Sólida nas redes
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-6">
            <div className="flex justify-center gap-4">
              {SOCIALS.map(({ label, href, Icon }) => (
                <TrackedLink
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  track={{ kind: "social", network: label, source: "contato" }}
                  className="flex size-12 items-center justify-center rounded-full border border-line text-ink-body transition-colors hover:border-ink hover:bg-ink hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-action"
                >
                  <Icon className="size-5" />
                </TrackedLink>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
