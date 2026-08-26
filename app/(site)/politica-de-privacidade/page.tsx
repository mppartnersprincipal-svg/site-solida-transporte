import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { TrackedLink } from "@/components/analytics/TrackedLink";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  alternates: { canonical: "/politica-de-privacidade" },
  description:
    "Como a Sólida Transporte coleta, usa e protege seus dados pessoais, em conformidade com a LGPD (Lei nº 13.709/2018).",
};

// TODO: validar com a Sólida antes do go-live: CNPJ, e-mail do encarregado (DPO)
// e revisão jurídica do texto.

const heading = "mt-10 text-xl font-bold sm:text-2xl";
const paragraph = "mt-4 text-base leading-relaxed text-ink-body";
const list = "mt-4 list-disc space-y-2 pl-6 text-base leading-relaxed text-ink-body";

export default function PoliticaDePrivacidadePage() {
  return (
    <>
      <PageHero
        eyebrow="LGPD"
        title="Política de Privacidade"
        subtitle="Como coletamos, usamos e protegemos os seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018)."
      />

      <section className="bg-surface py-16 sm:py-20">
        <Container className="max-w-3xl">
          <article>
            <p className="text-sm text-ink-muted">Última atualização: agosto de 2026</p>

            <h2 className={heading}>1. Quem somos</h2>
            <p className={paragraph}>
              A <strong>Sólida Transporte</strong> é uma transportadora
              especializada em cargas fracionadas entre São Paulo, Goiás,
              Distrito Federal e a cidade do Rio de Janeiro, com matriz em Goiânia-GO (Av. Desvio Bucareste,
              550, Jd. Novo Mundo) e filiais em Guarulhos-SP e Brasília-DF. Para
              os fins desta política, a Sólida atua como{" "}
              <strong>controladora</strong> dos dados pessoais tratados por meio
              deste site.
            </p>

            <h2 className={heading}>2. Quais dados coletamos</h2>
            <ul className={list}>
              <li>
                <strong>Dados fornecidos por você:</strong> ao entrar em contato
                pelos botões de WhatsApp, telefone ou e-mail, você pode nos
                informar nome, empresa, telefone, e-mail, segmento de atuação e
                detalhes da carga (origem, destino, tipo de mercadoria).
              </li>
              <li>
                <strong>Dados de navegação:</strong> informações coletadas por
                cookies e tecnologias semelhantes, como páginas visitadas,
                origem do acesso e interações com o site (ver a nossa{" "}
                <a
                  href="/politica-de-cookies"
                  className="font-semibold text-brand-action underline-offset-2 hover:underline"
                >
                  Política de Cookies
                </a>
                ).
              </li>
              <li>
                <strong>Estatísticas de navegação anônimas:</strong> páginas
                visitadas, tempo em cada página, cliques em botões, origem da
                visita, tipo de dispositivo e cidade aproximada, registrados sem
                cookies, sem endereço IP e sem dados que identifiquem você. Um
                código aleatório, sem dados pessoais, pode ficar no seu
                navegador por até 13 meses apenas para distinguir visitas novas
                de recorrentes — ele não é usado se você escolher &ldquo;Só o
                essencial&rdquo; no aviso de cookies. Base legal: legítimo
                interesse (art. 7º, IX, da LGPD). Retenção: 13 meses.
              </li>
            </ul>

            <h2 className={heading}>3. Para que usamos os seus dados</h2>
            <ul className={list}>
              <li>Responder solicitações de cotação, coleta, rastreamento e atendimento;</li>
              <li>Executar e acompanhar os serviços de transporte contratados;</li>
              <li>Melhorar o site, a comunicação e a experiência de atendimento;</li>
              <li>Medir o desempenho de campanhas e canais de aquisição;</li>
              <li>Cumprir obrigações legais, regulatórias e fiscais do setor de transporte.</li>
            </ul>

            <h2 className={heading}>4. Bases legais</h2>
            <p className={paragraph}>
              Tratamos dados pessoais com fundamento nas bases legais previstas
              no art. 7º da LGPD, em especial: <strong>execução de contrato</strong>{" "}
              ou de procedimentos preliminares (cotações e contratação do
              transporte), <strong>cumprimento de obrigação legal</strong>{" "}
              (documentação fiscal de transporte), <strong>legítimo interesse</strong>{" "}
              (melhoria dos serviços e comunicação com clientes) e{" "}
              <strong>consentimento</strong> (cookies não essenciais).
            </p>

            <h2 className={heading}>5. Compartilhamento</h2>
            <p className={paragraph}>
              Não vendemos os seus dados. Podemos compartilhá-los apenas com:
              prestadores de serviço que apoiam a nossa operação (hospedagem,
              ferramentas de análise e comunicação), autoridades públicas quando
              exigido por lei, e seguradoras no contexto do seguro de carga.
            </p>

            <h2 className={heading}>6. Atendimento via WhatsApp</h2>
            <p className={paragraph}>
              Os botões deste site abrem conversas no WhatsApp com mensagens
              pré-preenchidas. Ao usá-los, a conversa passa a ser regida também
              pela política de privacidade do WhatsApp (Meta). Os dados que você
              compartilhar na conversa são usados exclusivamente para o
              atendimento da sua solicitação.
            </p>

            <h2 className={heading}>7. Seus direitos (art. 18 da LGPD)</h2>
            <ul className={list}>
              <li>Confirmar a existência de tratamento e acessar os seus dados;</li>
              <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
              <li>Solicitar anonimização, bloqueio ou eliminação de dados desnecessários;</li>
              <li>Solicitar a portabilidade e informações sobre compartilhamento;</li>
              <li>Revogar o consentimento a qualquer momento.</li>
            </ul>

            <h2 className={heading}>8. Retenção e segurança</h2>
            <p className={paragraph}>
              Mantemos os dados apenas pelo tempo necessário às finalidades
              descritas ou pelos prazos exigidos por lei (como a guarda de
              documentos fiscais de transporte). Adotamos medidas técnicas e
              organizacionais adequadas para proteger os dados contra acessos
              não autorizados, perda ou alteração.
            </p>

            <h2 className={heading}>9. Contato do encarregado</h2>
            <p className={paragraph}>
              Para exercer os seus direitos ou tirar dúvidas sobre esta
              política, fale com o nosso encarregado de proteção de dados pelo
              e-mail{" "}
              <TrackedLink
                href="mailto:comercial@solidatransporte.com.br"
                track={{ kind: "email", email: "comercial@solidatransporte.com.br", source: "politica-privacidade" }}
                className="font-semibold text-brand-action underline-offset-2 hover:underline"
              >
                comercial@solidatransporte.com.br
              </TrackedLink>
              .
            </p>

            <h2 className={heading}>10. Atualizações</h2>
            <p className={paragraph}>
              Esta política pode ser atualizada a qualquer momento. A versão
              vigente estará sempre publicada nesta página, com a data da última
              atualização indicada no topo.
            </p>
          </article>
        </Container>
      </section>
    </>
  );
}
