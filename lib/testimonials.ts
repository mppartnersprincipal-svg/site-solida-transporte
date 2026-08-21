/**
 * Depoimentos — plano §5.6.
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║ PLACEHOLDERS — substituir pelos depoimentos reais.               ║
 * ║ Para cada cliente gravado/entrevistado, preencha os campos       ║
 * ║ abaixo e (opcional) adicione foto em /public/assets/depoimentos/ ║
 * ║ e o link do vídeo (YouTube) em videoUrl.                         ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

export type Testimonial = {
  /** Nome da pessoa (ex.: "João Silva") */
  name: string;
  /** Empresa e segmento (ex.: "PharmaVet · Suplementação animal") */
  company: string;
  /** Tempo de parceria (ex.: "Cliente há 12 anos") */
  years: string;
  /** Frase de destaque (aspas do card) */
  highlight: string;
  /** Problema que tinha antes da Sólida */
  before: string;
  /** O que mudou com a Sólida (velocidade, coleta, segurança, atendimento...) */
  after: string;
  /** Foto (ex.: "/assets/depoimentos/joao.jpg") — opcional */
  photo?: string;
  /** Vídeo do depoimento (YouTube embed) — opcional */
  videoUrl?: string;
};

// TODO(Fase 5): substituir pelos depoimentos reais dos clientes antigos
// (o briefing indica clientes dispostos a gravar). Priorizar quem tem
// mais anos de relação com a Sólida.
export const TESTIMONIALS: Testimonial[] = [
  {
    name: "[Nome do cliente]",
    company: "[Empresa] · Distribuidor",
    years: "[X] anos de parceria",
    highlight:
      "Depoimento real em gravação — reposição rápida, coleta pontual e atendimento próximo.",
    before:
      "[Problema que tinha antes: atrasos na coleta, falta de informação sobre a carga...]",
    after:
      "[O que mudou com a Sólida: entregas em 2–3 dias, previsibilidade para os clientes...]",
  },
  {
    name: "[Nome do cliente]",
    company: "[Empresa] · Indústria com cargas fracionadas",
    years: "[X] anos de parceria",
    highlight:
      "Depoimento real em gravação — segurança e transparência em todo o percurso da carga.",
    before: "[Problema que tinha antes: transportadora sem seguro, avarias...]",
    after: "[O que mudou com a Sólida: seguro de carga, acompanhamento total...]",
  },
  {
    name: "[Nome do cliente]",
    company: "[Empresa] · Comércio B2B — SP ⇄ GO",
    years: "[X] anos de parceria",
    highlight:
      "Depoimento real em gravação — previsibilidade que permitiu trabalhar com estoque enxuto.",
    before: "[Problema que tinha antes: estoque alto para compensar prazos...]",
    after: "[O que mudou com a Sólida: reposições menores e mais frequentes...]",
  },
];
