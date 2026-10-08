import type { Metadata } from "next";
import { BadgeCheck, CalendarCheck, Check, Download, FileText, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { buttonClasses } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { WhatsAppCTAButton } from "@/components/whatsapp/WhatsAppCTAButton";
import {
  CARTA_EMITIDA_EM,
  CARTA_URL,
  CERTIFICADO_URL,
  COBERTURAS,
  SEGURADORA,
  VIGENCIA,
  formatarData,
} from "@/lib/seguro";

export const metadata: Metadata = {
  title: "Seguro de Carga",
  alternates: { canonical: "/seguro" },
  description:
    "A carga transportada pela Sólida viaja segurada (RCTR-C e RC-DC) e o seguro está em dia: veja a carta de adimplência emitida pela seguradora todo mês.",
};

export default function SeguroPage() {
  return (
    <>
      <PageHero
        image="/assets/hero-sede.jpg"
        eyebrow="Seguro de carga"
        title="Sua carga viaja segurada, e o seguro está em dia"
        subtitle="Dizer que tem seguro é fácil. Aqui você vê a carta da seguradora que comprova que estamos com o pagamento em dia, atualizada todo mês."
      />

      {/* Status: seguro em dia + carta de adimplência */}
      <section className="bg-surface py-16 sm:py-24">
        <Container>
          <Reveal className="mx-auto max-w-3xl rounded-2xl border border-line bg-white p-6 sm:p-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-brand-tint text-brand-action">
                <BadgeCheck className="size-7" aria-hidden />
              </span>
              <div>
                <h2 className="text-2xl font-bold sm:text-3xl">Seguro em dia</h2>
                <p className="mt-3 text-ink-body">
                  A apólice mostra que o seguro foi contratado. A <strong>carta de adimplência</strong> vai
                  além: é o documento em que a própria seguradora declara que a Sólida não tem nenhuma fatura
                  de seguro em aberto. Ela é emitida todo mês e publicada aqui.
                </p>
                <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-ink-muted">Carta emitida em</dt>
                    <dd className="mt-1 font-semibold">{formatarData(CARTA_EMITIDA_EM)}</dd>
                  </div>
                  <div>
                    <dt className="text-ink-muted">Seguradora</dt>
                    <dd className="mt-1 font-semibold">{SEGURADORA}</dd>
                  </div>
                </dl>
                <a
                  href={CARTA_URL}
                  target="_blank"
                  rel="noopener"
                  data-track="Carta de adimplência (PDF)"
                  className={buttonClasses("primary", "lg") + " mt-8"}
                >
                  <FileText className="size-5" aria-hidden />
                  Ver carta de adimplência (PDF)
                </a>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Coberturas (dados do certificado) */}
      <section className="bg-surface-alt py-16 sm:py-24">
        <Container>
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold sm:text-3xl text-balance">O que o seguro cobre</h2>
            <p className="mt-3 text-ink-body">
              A Sólida Transporte e suas filiais têm duas apólices vigentes, válidas para toda carga que
              transportamos.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {COBERTURAS.map((c, i) => (
              <Reveal key={c.sigla} delay={i * 0.1} className="h-full rounded-2xl border border-line bg-white p-6 sm:p-8">
                <span className="flex size-12 items-center justify-center rounded-xl bg-brand-tint text-brand-action">
                  <ShieldCheck className="size-6" aria-hidden />
                </span>
                <h3 className="mt-4 font-display text-xl font-bold">{c.sigla}</h3>
                <p className="text-sm text-ink-muted">{c.nome}</p>
                <p className="mt-4 text-ink-body">{c.resumo}</p>
                <ul className="mt-5 space-y-2.5 text-sm">
                  {c.itens.map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <Check className="mt-0.5 size-4 shrink-0 text-brand-action" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>

          <Reveal className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-2xl border border-line bg-white p-5">
              <CalendarCheck className="mt-0.5 size-5 shrink-0 text-brand-action" aria-hidden />
              <div className="text-sm">
                <p className="font-semibold">Vigência</p>
                <p className="mt-1 text-ink-body">
                  {formatarData(VIGENCIA.inicio)} a {formatarData(VIGENCIA.fim)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-line bg-white p-5">
              <FileText className="mt-0.5 size-5 shrink-0 text-brand-action" aria-hidden />
              <div className="text-sm">
                <p className="font-semibold">Condições da apólice</p>
                <p className="mt-1 text-ink-body">
                  Coberturas e limites de garantia no certificado emitido pela seguradora.
                </p>
                <a
                  href={CERTIFICADO_URL}
                  target="_blank"
                  rel="noopener"
                  data-track="Certificado de seguro (PDF)"
                  className="mt-2 inline-flex items-center gap-1.5 font-semibold text-brand-action hover:text-brand-hover"
                >
                  <Download className="size-4" aria-hidden />
                  Baixar certificado (PDF)
                </a>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-surface py-16 text-center sm:py-20">
        <Container>
          <Reveal>
            <h2 className="mx-auto max-w-xl text-2xl font-bold sm:text-3xl text-balance">
              Precisa de algum documento do seguro para o cadastro da sua empresa?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-ink-body">Fale com a gente que providenciamos.</p>
          </Reveal>
          <Reveal delay={0.1} className="mt-7">
            <WhatsAppCTAButton variant="whatsapp" size="lg" source="seguro">
              Falar no WhatsApp
            </WhatsAppCTAButton>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
