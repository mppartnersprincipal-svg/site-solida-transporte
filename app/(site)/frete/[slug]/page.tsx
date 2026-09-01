import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Boxes,
  Building2,
  CalendarClock,
  Eye,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { WhatsAppCTAButton } from "@/components/whatsapp/WhatsAppCTAButton";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/seo";
import { UNITS } from "@/lib/units";
import { FREIGHT_ROUTES, getFreightRoute } from "@/lib/freight-routes";

export async function generateStaticParams() {
  return FREIGHT_ROUTES.map((route) => ({ slug: route.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/frete/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const route = getFreightRoute(slug);
  if (!route) return { title: "Rota não encontrada" };

  return {
    title: route.metaTitle,
    description: route.metaDescription,
    alternates: { canonical: `/frete/${route.slug}` },
    openGraph: {
      title: `${route.metaTitle} | Sólida Transporte`,
      description: route.metaDescription,
    },
  };
}

/** Selos de confiança repetidos em todas as rotas (fatos confirmados). */
const TRUST_ITEMS = [
  { Icon: CalendarClock, text: "32 anos de rota com o mesmo CNPJ" },
  { Icon: Truck, text: "Capital, sede e frota próprios" },
  { Icon: ShieldCheck, text: "Trabalhamos com seguro de carga" },
  { Icon: Eye, text: "Você acompanha a carga do início ao fim" },
];

export default async function FreightRoutePage({
  params,
}: PageProps<"/frete/[slug]">) {
  const { slug } = await params;
  const route = getFreightRoute(slug);
  if (!route) notFound();

  const url = `${SITE_URL}/frete/${route.slug}`;
  const units = route.unitCities
    .map((city) => UNITS.find((u) => u.city === city))
    .filter((u) => u !== undefined);
  const related = route.related
    .map((relatedSlug) => getFreightRoute(relatedSlug))
    .filter((r) => r !== undefined);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${url}#service`,
      name: route.headline,
      serviceType: "Transporte rodoviário de carga fracionada",
      provider: { "@id": `${SITE_URL}/#organization` },
      url,
      description: route.metaDescription,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: route.faq.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Rotas de frete", item: `${SITE_URL}/frete` },
        { "@type": "ListItem", position: 3, name: route.headline, item: url },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHero
        image="/assets/cta-frota.jpg"
        eyebrow={route.corridor}
        title={route.headline}
        subtitle={route.heroSubtitle}
      />

      {/* Resposta direta + selos + CTA */}
      <section className="bg-surface py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <p className="text-lg leading-relaxed text-ink-body">{route.answer}</p>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-5 text-base leading-relaxed text-ink-muted">
                {route.variations}
              </p>
            </Reveal>
            <Reveal delay={0.14} className="mt-8">
              <ul className="grid gap-3 sm:grid-cols-2">
                {TRUST_ITEMS.map(({ Icon, text }) => (
                  <li
                    key={text}
                    className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4 text-sm font-medium text-ink-body"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-tint text-brand-action">
                      <Icon className="size-4.5" aria-hidden />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.2} className="mt-8 text-center">
              <WhatsAppCTAButton variant="whatsapp" size="lg" source="frete-topo">
                Pedir cotação no WhatsApp
              </WhatsAppCTAButton>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Prazo em destaque */}
      <section className="bg-surface-alt py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Prazo de entrega"
            title="Prazo que dá para programar a operação"
            subtitle="Prazos contados em dias úteis a partir da coleta."
          />
          <Reveal className="mx-auto max-w-xl">
            <div className="rounded-2xl bg-ink p-8 text-center text-white">
              <p className="text-3xl font-bold">
                2 a 3 <span className="text-brand">dias úteis</span>
              </p>
              <p className="mt-2 text-sm text-white/70">{route.deadline.capitalLabel}</p>
              {route.deadline.interiorLabel ? (
                <>
                  <p className="mt-5 text-xl font-bold">
                    3 a 4 <span className="text-brand">dias úteis</span>
                  </p>
                  <p className="mt-1 text-sm text-white/70">{route.deadline.interiorLabel}</p>
                </>
              ) : null}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Como funciona nesta rota */}
      <section className="bg-surface py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Como funciona"
            title="Da coleta à entrega nesta rota"
          />
          <ol className="mx-auto grid max-w-4xl gap-5 md:grid-cols-3">
            {route.steps.map(({ title, text }, i) => (
              <Reveal
                key={title}
                delay={i * 0.1}
                as="li"
                className="relative h-full rounded-2xl border border-line bg-white p-6 pt-8"
              >
                <span
                  aria-hidden
                  className="absolute -top-5 left-6 flex size-10 items-center justify-center rounded-full bg-brand-action font-display text-lg font-bold text-white shadow-md"
                >
                  {i + 1}
                </span>
                <h3 className="text-base font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{text}</p>
              </Reveal>
            ))}
          </ol>
          <Reveal delay={0.2} className="mt-10 text-center">
            <Link
              href="/como-funciona"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-action hover:text-brand-hover"
            >
              Ver a operação completa de cargas fracionadas
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Reveal>
        </Container>
      </section>

      {/* Unidades que apoiam a rota */}
      <section className="bg-surface-alt py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Estrutura na rota"
            title="Unidades da Sólida nesta rota"
            subtitle={
              route.unitsNote ??
              "Estrutura própria nas duas pontas: quem coleta e quem entrega é a mesma empresa."
            }
          />
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            {units.map((unit, i) => (
              <Reveal key={unit.city} delay={i * 0.1}>
                <article className="h-full rounded-2xl border border-line bg-white p-7">
                  <p className="flex items-center gap-2 text-xs font-bold tracking-[0.18em] uppercase text-brand-action">
                    <Building2 className="size-4" aria-hidden />
                    {unit.role}
                  </p>
                  <h3 className="mt-2 text-xl font-bold">{unit.city}</h3>
                  <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-ink-muted">
                    <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
                    {unit.address}
                  </p>
                  <p className="mt-2 flex items-center gap-2 text-sm text-ink-body">
                    <Phone className="size-4 shrink-0" aria-hidden />
                    {unit.phoneLabel}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Perguntas frequentes */}
      <section className="bg-surface py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Perguntas frequentes"
            title={`Dúvidas sobre o frete ${route.corridor.replace("Rota ", "")}`}
          />
          <div className="mx-auto flex max-w-3xl flex-col gap-3">
            {route.faq.map(({ q, a }, i) => (
              <Reveal key={q} delay={i * 0.05}>
                <details className="group rounded-2xl border border-line bg-white p-5 open:border-brand-action/40">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-bold text-ink [&::-webkit-details-marker]:hidden">
                    {q}
                    <span
                      aria-hidden
                      className="text-xl font-normal text-brand-action transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">{a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Outras rotas */}
      <section className="bg-surface-alt py-16 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Outras rotas" title="Também fazemos" />
          <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-3">
            {related.map((r, i) => (
              <Reveal key={r.slug} delay={i * 0.08}>
                <Link
                  href={`/frete/${r.slug}`}
                  className="group flex h-full flex-col justify-between rounded-2xl border border-line bg-white p-6 transition-colors hover:border-brand-action/50"
                >
                  <div>
                    <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.14em] uppercase text-ink-muted">
                      <Boxes className="size-4 text-brand-action" aria-hidden />
                      Frete fracionado
                    </p>
                    <h3 className="mt-2 text-base font-bold group-hover:text-brand-action">
                      {r.headline}
                    </h3>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-action">
                    Ver rota
                    <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA final */}
      <section className="bg-surface py-16 text-center sm:py-20">
        <Container>
          <Reveal>
            <h2 className="mx-auto max-w-xl text-2xl font-bold sm:text-3xl text-balance">
              Precisa despachar nessa rota? Peça sua cotação agora.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mx-auto mt-3 max-w-lg text-base text-ink-muted">
              Sem formulário: você fala direto com o comercial no WhatsApp e recebe
              o retorno com prazo e condições da sua carga.
            </p>
          </Reveal>
          <Reveal delay={0.14} className="mt-7">
            <WhatsAppCTAButton variant="whatsapp" size="lg" source="frete-cta-final">
              Pedir cotação no WhatsApp
            </WhatsAppCTAButton>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
