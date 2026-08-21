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
        href: waLink(
          WHATSAPP_NUMBERS.goianiaComercial,
          "Olá! Quero uma cotação de frete de [origem] para [destino]. Tipo de mercadoria: ___"
        ),
      },
      {
        label: "Brasília e região (Ana Paula)",
        href: waLink(
          WHATSAPP_NUMBERS.brasiliaComercial,
          "Olá! Quero uma cotação de frete de [origem] para [destino]. Tipo de mercadoria: ___"
        ),
      },
    ],
  },
  {
    id: "coleta",
    label: "Solicitar coleta",
    description: "Agende a coleta da sua mercadoria",
    options: [
      {
        label: "Goiás / Distrito Federal",
        href: waLink(
          WHATSAPP_NUMBERS.coletaGO,
          "Olá! Quero solicitar uma coleta. Endereço de coleta: ___"
        ),
      },
      {
        label: "São Paulo",
        href: waLink(
          WHATSAPP_NUMBERS.coletaSP,
          "Olá! Quero solicitar uma coleta. Endereço de coleta: ___"
        ),
      },
    ],
  },
  {
    id: "rastreamento",
    label: "Rastrear uma carga",
    description: "Acompanhe onde está a sua mercadoria",
    href: waLink(
      WHATSAPP_NUMBERS.coletaGO,
      "Olá! Quero rastrear uma carga. Nota fiscal ou CT-e: ___"
    ),
  },
  {
    id: "financeiro",
    label: "Financeiro e faturas",
    description: "Boletos, faturas e pagamentos",
    href: waLink(
      WHATSAPP_NUMBERS.financeiro,
      "Olá! Preciso de ajuda com uma fatura/boleto."
    ),
  },
  {
    id: "juridico",
    label: "Jurídico",
    description: "Assuntos jurídicos e contratuais",
    // TODO: validar número do responsável jurídico com a Sólida
    href: waLink(
      WHATSAPP_NUMBERS.goianiaComercial,
      "Olá! Preciso falar sobre um assunto jurídico."
    ),
  },
  {
    id: "outros",
    label: "Falar com outro departamento",
    description: "Outros assuntos e atendimento geral",
    href: waLink(WHATSAPP_NUMBERS.goianiaComercial, "Olá! Preciso de ajuda com: ___"),
  },
];
