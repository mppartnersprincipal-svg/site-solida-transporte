import type { Metadata } from "next";
import Image from "next/image";
import {
  BadgeCheck,
  Clock,
  Eye,
  HeartHandshake,
  Mail,
  MapPin,
  PackageSearch,
  Phone,
  Route,
  ShieldCheck,
  Target,
  Truck,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Counter } from "@/components/motion/Counter";
import { WhatsAppCTAButton } from "@/components/whatsapp/WhatsAppCTAButton";
import { WhatsAppIcon } from "@/components/layout/WhatsAppIcon";
import { WaTrackedLink } from "@/components/whatsapp/WaTrackedLink";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { CitiesExplorer } from "@/components/apresentacao/CitiesExplorer";
import { CitiesPrintList } from "@/components/apresentacao/CitiesPrintList";
import { UNITS } from "@/lib/units";
import { SERVED_CITIES } from "@/lib/cities";
import { TRACKING_URL } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Apresentação Comercial",
  alternates: { canonical: "/apresentacao" },
  description:
    "Apresentação comercial da Sólida Transporte: 32 anos de cargas fracionadas entre SP, Goiás, DF e Rio de Janeiro, 365 cidades atendidas, unidades, prazos e horários.",
};

const TOTAL_CITIES = SERVED_CITIES.length;

const NUMBERS = [
  { value: 32, suffix: " anos", label: "de mercado, com o mesmo CNPJ" },
  { value: TOTAL_CITIES, suffix: "", label: "cidades atendidas em GO, DF, SP e RJ" },
  { value: 3, suffix: "", label: "unidades: Goiânia, Guarulhos e Brasília" },
];

const PILLARS = [
  {
    Icon: Target,
    title: "Missão",
    text: "Entregar confiança em cada carga: prazo que dá para confiar, carga inteira e informação em todas as etapas, com frota própria e tecnologia de rastreamento.",
  },
  {
    Icon: Eye,
    title: "Visão",
    text: "Ser a transportadora de referência nos corredores SP ⇄ GO ⇄ DF e Rio de Janeiro, construindo parcerias de longo prazo com indústrias, distribuidores e lojistas.",
  },
  {
    Icon: HeartHandshake,
    title: "Valores",
    text: "Ética, seriedade e transparência. Rapidez sem improviso. Fidelidade ao cliente e qualidade constante, há três décadas.",
  },
];

const SERVICE_POINTS = [
  {
    Icon: Truck,
    title: "Carga fracionada com frota própria",
    text: "Coleta pontual na origem, transferência no corredor e distribuição na chegada, sem repasse para terceiros no meio do caminho.",
  },
  {
    Icon: Route,
    title: "Corredores SP ⇄ GO ⇄ DF e Rio de Janeiro",
    text: "Partindo de Guarulhos, atendemos Goiás e o Distrito Federal. Partindo de Goiânia, atendemos São Paulo e a região metropolitana do Rio.",
  },
  {
    Icon: ShieldCheck,
    title: "Seguro de carga",
    text: "Trabalhamos com seguro de carga, seguro de frota e seguro ambiental. Matérias-primas, embalagens e produtos acabados de diversos setores.",
  },
  {
    Icon: PackageSearch,
    title: "Rastreamento do início ao fim",
    text: "Você acompanha a carga no portal de rastreamento e, se houver qualquer ocorrência no caminho, fica sabendo na hora.",
  },
];

const HOURS = [
  { day: "Segunda a sexta", time: "08h às 18h" },
  { day: "Sábado", time: "Fechado" },
  { day: "Domingo", time: "Fechado" },
];

export default function ApresentacaoPage() {
  return (
    <>
      <PageHero
        image="/assets/hero-sede.jpg"
        eyebrow="Apresentação comercial"
        title="Sólida Transporte: cargas fracionadas entre SP, Goiás, DF e Rio de Janeiro há 32 anos."
        subtitle="Quem somos, o que fazemos, onde estamos e as 365 cidades que atendemos. A sua encomenda é o nosso maior compromisso."
      />

      {/* Números */}
      <section className="border-b border-line bg-surface">
        <Container>
          <ul className="grid divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {NUMBERS.map((n, i) => (
              <Reveal key={n.label} delay={i * 0.1} as="li" className="px-2 py-7 text-center sm:py-9">
                <Counter
                  to={n.value}
                  suffix={n.suffix}
                  className="font-display text-4xl font-bold text-ink sm:text-5xl"
                />
                <p className="mt-2 text-sm text-ink-muted">{n.label}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* Sobre */}
      <section className="bg-surface py-16 sm:py-24">
        <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="mb-3 text-xs font-semibold tracking-[0.18em] uppercase text-brand-action">
              Sobre nós
            </p>
            <h2 className="text-2xl font-bold sm:text-3xl text-balance">
              Uma empresa sólida, no nome e na prática
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink-body sm:text-lg">
              Fundada em 1994 em Goiânia, a Sólida Transporte transporta cargas fracionadas
              para indústrias, distribuidores e lojistas. Com matriz em Goiânia e filiais em
              Guarulhos e Brasília, a empresa tem frota, sede e capital próprios.
            </p>
            <p className="mt-4 text-base leading-relaxed text-ink-body sm:text-lg">
              Em três décadas, mantivemos o mesmo CNPJ e o mesmo jeito de trabalhar: ética,
              rapidez e seriedade, com tecnologia de rastreamento e veículos adequados para
              cada tipo de carga. Você sempre sabe onde a sua mercadoria está.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {[
                "Mesmo CNPJ desde 1994",
                "Frota própria",
                "Seguro de carga",
                "Rastreamento online",
              ].map((seal) => (
                <li
                  key={seal}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-alt px-3 py-1.5 text-xs font-semibold text-ink"
                >
                  <BadgeCheck className="size-3.5 text-brand-action" aria-hidden />
                  {seal}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="relative col-span-2 aspect-[16/9] overflow-hidden rounded-2xl">
                <Image
                  src="/assets/sede-frota.jpg"
                  alt="Frota da Sólida Transporte estacionada na sede, em Goiânia"
                  fill
                  sizes="(min-width: 1024px) 560px, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                  src="/assets/op-equipe.jpg"
                  alt="Equipe da Sólida na operação"
                  fill
                  sizes="(min-width: 1024px) 280px, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                  src="/assets/op-galpao.jpg"
                  alt="Galpão de despacho da Sólida com mercadorias conferidas"
                  fill
                  sizes="(min-width: 1024px) 280px, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Missão, visão e valores */}
      <section className="bg-surface-alt py-16 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Uma empresa sólida" title="Missão, visão e valores" />
          <ul className="grid gap-6 md:grid-cols-3">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.1} as="li" className="h-full rounded-2xl border border-line bg-white p-6 sm:p-7">
                <span className="flex size-11 items-center justify-center rounded-xl bg-brand-tint text-brand-action">
                  <p.Icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-xl font-bold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted sm:text-base">{p.text}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* Serviços */}
      <section className="bg-surface py-16 sm:py-24">
        <Container className="grid items-start gap-10 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-2">
            <SectionHeading
              align="left"
              eyebrow="Nossos serviços"
              title="Transporte rodoviário de carga fracionada"
              subtitle="Frota moderna e bem mantida, cobrindo desde matérias-primas até produtos acabados, com segurança e pontualidade."
            />
            <Reveal className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/assets/op-carga.jpg"
                alt="Carregamento de mercadorias em caminhão da Sólida"
                fill
                sizes="(min-width: 1024px) 420px, 100vw"
                className="object-cover"
              />
            </Reveal>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2 lg:col-span-3">
            {SERVICE_POINTS.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08} as="li" className="h-full rounded-2xl border border-line bg-white p-6">
                <s.Icon className="size-6 text-brand-action" aria-hidden />
                <h3 className="mt-3 text-base font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{s.text}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* Cidades atendidas */}
      <section id="cidades" className="scroll-mt-24 bg-surface-alt py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Cidades atendidas"
            title={`${TOTAL_CITIES} cidades em Goiás, Distrito Federal, São Paulo e Rio de Janeiro`}
            subtitle="Escolha de onde a carga parte, busque pelo nome da cidade ou filtre por estado. Cidades do interior fora da lista podem ser atendidas sob consulta."
          />
          <Reveal className="print:hidden">
            <CitiesExplorer />
          </Reveal>
          <CitiesPrintList />
        </Container>
      </section>

      {/* Prazos e horários */}
      <section className="bg-surface py-16 sm:py-24">
        <Container className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <Reveal className="rounded-2xl bg-ink p-7 text-white sm:p-9">
            <p className="mb-3 text-xs font-semibold tracking-[0.18em] uppercase text-brand">
              Prazos de entrega
            </p>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Prazo que dá para confiar
            </h2>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-white/5 p-5">
                <dt className="font-display text-3xl font-bold text-white">2 a 3</dt>
                <dd className="mt-1 text-sm text-white/75">
                  dias úteis após a coleta para <strong className="text-white">capital e região metropolitana</strong>
                </dd>
              </div>
              <div className="rounded-xl bg-white/5 p-5">
                <dt className="font-display text-3xl font-bold text-white">3 a 4</dt>
                <dd className="mt-1 text-sm text-white/75">
                  dias úteis após a coleta para o <strong className="text-white">interior</strong>
                </dd>
              </div>
            </dl>
            <p className="mt-5 text-sm text-white/60">
              Algumas cidades do interior têm prazo maior. Confirme o prazo da sua rota com o comercial.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="rounded-2xl border border-line bg-white p-7 sm:p-9">
            <p className="mb-3 text-xs font-semibold tracking-[0.18em] uppercase text-brand-action">
              Horários de funcionamento
            </p>
            <h2 className="text-2xl font-bold sm:text-3xl">Quando a Sólida atende</h2>
            <ul className="mt-6 divide-y divide-line">
              {HOURS.map((h) => (
                <li key={h.day} className="flex items-center justify-between gap-4 py-3.5 text-sm">
                  <span className="flex items-center gap-2.5 font-semibold text-ink">
                    <Clock className="size-4 text-ink-muted" aria-hidden />
                    {h.day}
                  </span>
                  <span className={h.time === "Fechado" ? "text-ink-muted" : "text-ink-body"}>
                    {h.time}
                  </span>
                </li>
              ))}
            </ul>
            <a
              href={TRACKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-track="Portal de rastreamento (Apresentação)"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-action hover:text-brand-hover"
            >
              <PackageSearch className="size-4" aria-hidden />
              Rastrear uma carga no portal
            </a>
          </Reveal>
        </Container>
      </section>

      {/* Unidades */}
      <section className="bg-surface-alt py-16 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Onde estamos" title="Matriz em Goiânia, filiais em Guarulhos e Brasília" />
          <ul className="grid gap-6 md:grid-cols-3">
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
                    track={{ kind: "phone", phone: unit.phoneHref.replace("tel:", ""), label: unit.city, source: "apresentacao" }}
                    className="inline-flex items-center gap-2.5 text-ink-body transition-colors hover:text-ink"
                  >
                    <Phone className="size-4 text-ink-muted" aria-hidden />
                    {unit.phoneLabel}
                  </TrackedLink>
                  <TrackedLink
                    href={`mailto:${unit.email}`}
                    track={{ kind: "email", email: unit.email, source: "apresentacao" }}
                    className="inline-flex items-center gap-2.5 break-all text-ink-body transition-colors hover:text-ink"
                  >
                    <Mail className="size-4 shrink-0 text-ink-muted" aria-hidden />
                    {unit.email}
                  </TrackedLink>
                  <WaTrackedLink
                    href={unit.waHref}
                    subject="unidade"
                    option={unit.city}
                    source="apresentacao"
                    className="inline-flex items-center gap-2.5 font-semibold text-ink transition-colors hover:text-whatsapp"
                  >
                    <WhatsAppIcon className="size-4 text-whatsapp" />
                    WhatsApp da unidade
                  </WaTrackedLink>
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* CTA final */}
      <section className="relative overflow-hidden bg-ink py-16 text-white sm:py-24">
        <Image
          src="/assets/cta-frota.jpg"
          alt=""
          fill
          sizes="100vw"
          quality={60}
          className="object-cover opacity-30"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-ink via-ink/70 to-ink" />
        <Container className="relative text-center">
          <Reveal>
            <h2 className="mx-auto max-w-2xl text-3xl font-bold text-white text-balance sm:text-4xl">
              Vamos transportar juntos?
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-4 max-w-xl text-base text-white/70 sm:text-lg">
              Mande no WhatsApp o que você envia e para onde. O comercial responde com a cotação.
            </p>
          </Reveal>
          <Reveal delay={0.2} className="mt-8">
            <WhatsAppCTAButton variant="whatsapp" size="lg" source="apresentacao">
              Pedir cotação no WhatsApp
            </WhatsAppCTAButton>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
