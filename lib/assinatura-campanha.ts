/**
 * Campanha automática da assinatura de e-mail (27/10/2026).
 *
 * A opção "Automática" do gerador (public/assinatura/gerador.html) cola na assinatura dois endereços
 * fixos: /assinatura/campanha-do-mes.jpg (imagem) e /assinatura/campanha (link). As duas rotas leem
 * daqui qual campanha vale no mês de Brasília — a troca mensal deixa de exigir recolar a assinatura
 * em cada computador. Banners gerados por `../Assinatura de Email/banners.py` (banner-<slug>.jpg).
 *
 * Campanha nova: banner no banners.py + entrada em CAMPANHAS + mês em POR_MES.
 * Sem imports de propósito: roda no `node --test` (tests/assinatura-campanha.test.mjs).
 */

const SITE = "https://www.solidatransporte.com.br/?utm_source=email&utm_medium=assinatura";
const TELEMEDICINA = "https://brcarga.com.br/telemedicina/";

export const CAMPANHAS = {
  "setembro-amarelo": { link: TELEMEDICINA },
  "outubro-rosa": { link: SITE },
  "novembro-azul": { link: TELEMEDICINA },
  /** Meses sem campanha */
  institucional: { link: SITE },
} as const;

export type SlugCampanha = keyof typeof CAMPANHAS;

/** Mês (1–12) → campanha. Mês fora da lista = institucional. */
const POR_MES: Partial<Record<number, SlugCampanha>> = {
  9: "setembro-amarelo",
  10: "outubro-rosa",
  11: "novembro-azul",
};

function mesEmBrasilia(agora: Date) {
  return Number(
    new Intl.DateTimeFormat("en-US", { timeZone: "America/Sao_Paulo", month: "numeric" }).format(agora)
  );
}

export function campanhaDoMes(agora: Date = new Date()) {
  const slug: SlugCampanha = POR_MES[mesEmBrasilia(agora)] ?? "institucional";
  return { slug, banner: `/assinatura/banner-${slug}.jpg`, link: CAMPANHAS[slug].link };
}
