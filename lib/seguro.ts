/**
 * Dados da página /seguro.
 *
 * TROCA MENSAL DA CARTA DE ADIMPLÊNCIA (a Sólida manda uma nova todo mês):
 * 1. Substituir `public/seguro/carta-de-adimplencia.pdf` pelo PDF novo (mesmo nome)
 * 2. Atualizar `CARTA_EMITIDA_EM` abaixo com a data que está escrita na carta
 *
 * Só publicar dados do CERTIFICADO. Limites de garantia, endereços dos
 * depósitos e condições da apólice são sigilosos (pedido do cliente, 08/10/2026).
 */

/** Data de emissão da carta vigente (AAAA-MM-DD), como escrita no PDF. */
export const CARTA_EMITIDA_EM = "2026-10-07";

/** `?v=` muda a cada carta para o navegador não mostrar a versão antiga do cache. */
export const CARTA_URL = `/seguro/carta-de-adimplencia.pdf?v=${CARTA_EMITIDA_EM}`;

export const SEGURADORA = "Yelum Seguros S.A. (Grupo HDI)";

/** Vigência das apólices, conforme o certificado. */
export const VIGENCIA = { inicio: "2026-07-31", fim: "2027-07-31" };

export const COBERTURAS = [
  {
    sigla: "RCTR-C",
    nome: "Responsabilidade Civil do Transportador Rodoviário de Carga",
    resumo:
      "Seguro obrigatório que protege a mercadoria em caso de acidente com o veículo: colisão, capotagem, tombamento, incêndio ou explosão.",
    itens: [
      "Colisão, capotagem, abalroamento e tombamento",
      "Incêndio ou explosão no veículo e nos pontos de parada da viagem",
      "Avarias: quebra, queda, amassamento, água de chuva e contato com outras mercadorias",
      "Operações de carga e descarga",
    ],
  },
  {
    sigla: "RC-DC",
    nome: "Responsabilidade Civil do Transportador por Desvio de Carga",
    resumo:
      "Protege a mercadoria contra roubo, furto e desaparecimento, na estrada e também enquanto ela está nas nossas unidades.",
    itens: [
      "Roubo e furto da carga durante o trajeto",
      "Apropriação indébita, estelionato e extorsão",
      "Roubo com a carga dentro das nossas unidades",
    ],
  },
] as const;

/** "2026-10-07" → "07/10/2026" (sem passar por Date, para não sofrer com fuso). */
export function formatarData(iso: string) {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}
