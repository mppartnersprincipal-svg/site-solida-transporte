/**
 * Central de WhatsApp — roteamento por assunto (plano §6).
 * Números vindos do site atual (§6.2) — VALIDAR com a Sólida antes do go-live.
 */

export const WHATSAPP_NUMBERS = {
  /** Goiânia (Luana) — Comercial */
  goianiaComercial: "556232063513",
  /** Brasília (Ana Paula) — Comercial */
  brasiliaComercial: "5561996532064",
  /** Financeiro / Faturas (GO) */
  financeiro: "556232063742",
  /** Coleta / Agendamento (GO) */
  coletaGO: "556232063800",
  /** São Paulo — Coleta */
  coletaSP: "551139368284",
} as const;

export function waLink(number: string, message: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/** Mensagem padrão de todos os CTAs do site (pedido do cliente, 31/08/2026). */
export const WA_DEFAULT_MESSAGE =
  "Olá, vim do site e gostaria de fazer uma cotação!";

export type WaOption = {
  label: string;
  description?: string;
  href: string;
};

export type WaSubject = {
  id: string;
  label: string;
  description: string;
  /** Link direto (assunto sem escolha de região) */
  href?: string;
  /** Segundo nível: escolha de região/destino */
  options?: WaOption[];
};

export const WA_SUBJECTS: WaSubject[] = [
  {
    id: "cotacao",
    label: "Quero fazer uma cotação",
    description: "Fale com o comercial da sua região",
    options: [
      {
        label: "Goiânia e região (Luana)",
        href: waLink(WHATSAPP_NUMBERS.goianiaComercial, WA_DEFAULT_MESSAGE),
      },
      {
        label: "Brasília e região (Ana Paula)",
        href: waLink(WHATSAPP_NUMBERS.brasiliaComercial, WA_DEFAULT_MESSAGE),
      },
    ],
  },
  {
    id: "coleta",
    label: "Solicitar coleta",
    description: "Agende a coleta da sua mercadoria",
    href: waLink(WHATSAPP_NUMBERS.coletaSP, WA_DEFAULT_MESSAGE),
  },
  {
    id: "rastreamento",
    label: "Rastrear uma carga",
    description: "Acompanhe onde está a sua mercadoria",
    href: waLink(WHATSAPP_NUMBERS.goianiaComercial, WA_DEFAULT_MESSAGE),
  },
  {
    id: "outros",
    label: "Falar com outro departamento",
    description: "Outros assuntos e atendimento geral",
    href: waLink(WHATSAPP_NUMBERS.goianiaComercial, WA_DEFAULT_MESSAGE),
  },
];
