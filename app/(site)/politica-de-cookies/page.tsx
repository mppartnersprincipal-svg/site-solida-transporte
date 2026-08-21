import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Política de Cookies",
  description:
    "Quais cookies o site da Sólida Transporte utiliza, para que servem e como você pode gerenciá-los.",
};

const heading = "mt-10 text-xl font-bold sm:text-2xl";
const paragraph = "mt-4 text-base leading-relaxed text-ink-body";
const list = "mt-4 list-disc space-y-2 pl-6 text-base leading-relaxed text-ink-body";

export default function PoliticaDeCookiesPage() {
  return (
    <>
      <PageHero
        eyebrow="LGPD"
        title="Política de Cookies"
        subtitle="O que são cookies, quais utilizamos neste site e como você pode gerenciá-los."
      />

      <section className="bg-surface py-16 sm:py-20">
        <Container className="max-w-3xl">
          <article>
            <p className="text-sm text-ink-muted">Última atualização: agosto de 2026</p>

            <h2 className={heading}>1. O que são cookies</h2>
            <p className={paragraph}>
              Cookies são pequenos arquivos de texto armazenados no seu
              navegador quando você visita um site. Eles servem para lembrar
              preferências, entender como o site é usado e melhorar a sua
              experiência. Tecnologias semelhantes, como o armazenamento local
              (localStorage), cumprem funções parecidas e também são cobertas
              por esta política.
            </p>

            <h2 className={heading}>2. O que usamos neste site</h2>
            <ul className={list}>
              <li>
                <strong>Essenciais:</strong> registramos no armazenamento local
                do seu navegador a sua escolha no aviso de cookies, para não
                exibi-lo de novo a cada visita. Sem tratamento adicional.
              </li>
              <li>
                <strong>Estatísticas e marketing (quando ativos):</strong>{" "}
                ferramentas como Google Analytics e Meta Pixel podem ser usadas
                para medir visitas, entender a origem dos acessos e o desempenho
                de campanhas. Esses cookies só são utilizados mediante o seu
                consentimento no aviso exibido no site.
              </li>
            </ul>

            <h2 className={heading}>3. Como gerenciar cookies</h2>
            <p className={paragraph}>
              Você pode apagar ou bloquear cookies a qualquer momento nas
              configurações do seu navegador (Chrome, Firefox, Safari, Edge —
              procure por &ldquo;privacidade&rdquo; ou &ldquo;cookies&rdquo; nas
              configurações). Ao bloquear cookies essenciais, algumas
              funcionalidades do site podem deixar de funcionar corretamente.
            </p>

            <h2 className={heading}>4. Mais informações</h2>
            <p className={paragraph}>
              Para entender como tratamos dados pessoais de forma geral,
              consulte a nossa{" "}
              <a
                href="/politica-de-privacidade"
                className="font-semibold text-brand-action underline-offset-2 hover:underline"
              >
                Política de Privacidade
              </a>
              . Dúvidas? Fale com a gente pelo e-mail{" "}
              <a
                href="mailto:comercial@solidatransporte.com.br"
                className="font-semibold text-brand-action underline-offset-2 hover:underline"
              >
                comercial@solidatransporte.com.br
              </a>
              .
            </p>
          </article>
        </Container>
      </section>
    </>
  );
}
