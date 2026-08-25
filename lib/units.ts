import { WHATSAPP_NUMBERS, waLink } from "@/lib/whatsapp";

/**
 * Unidades da Sólida — dados do site atual (auditoria em solidatransportedoc).
 * TODO: validar endereços/telefones com a Sólida antes do go-live.
 */
export type Unit = {
  city: string;
  role: string;
  address: string;
  phoneLabel: string;
  phoneHref: string;
  email: string;
  waHref: string;
  mapsUrl: string;
};

const MATRIZ_MAPS_CID = "18042131085687874547";
/** Link da matriz no Google Maps (abre a ficha da empresa). */
export const MATRIZ_MAPS_URL = `https://maps.google.com/?cid=${MATRIZ_MAPS_CID}`;

export const UNITS: Unit[] = [
  {
    city: "Goiânia - GO",
    role: "Matriz",
    address:
      "Av. Desvio Bucareste, 550, Qd. 256, Lt. 07, Jd. Novo Mundo, Goiânia-GO, CEP 74.703-100",
    phoneLabel: "(62) 3206-8100",
    phoneHref: "tel:+556232068100",
    email: "comercial@solidatransporte.com.br",
    waHref: waLink(WHATSAPP_NUMBERS.goianiaComercial, "Olá! Vim pelo site da Sólida."),
    mapsUrl: MATRIZ_MAPS_URL,
  },
  {
    city: "Guarulhos - SP",
    role: "Filial São Paulo",
    address:
      "Rua Piracura, nº 113, Bairro Jardim Fátima, Guarulhos-SP, CEP 07.177-020",
    phoneLabel: "(11) 3936-1258",
    phoneHref: "tel:+551139361258",
    email: "coletasp@solidatransporte.com.br",
    waHref: waLink(WHATSAPP_NUMBERS.coletaSP, "Olá! Vim pelo site da Sólida."),
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent("Rua Piracura, 113, Jardim Fátima, Guarulhos - SP, 07177-020"),
  },
  {
    city: "Brasília - DF",
    role: "Filial Distrito Federal",
    address:
      "STRC Trecho 2, conj. E, Lt. 03, Galpão 3, Bairro Guará, Brasília-DF, CEP 71.225-525",
    phoneLabel: "(61) 3361-7772",
    phoneHref: "tel:+556133617772",
    email: "comercialdf@solidatransporte.com.br",
    waHref: waLink(WHATSAPP_NUMBERS.brasiliaComercial, "Olá! Vim pelo site da Sólida."),
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent("STRC Trecho 2 Conjunto E Lote 3, Guará, Brasília - DF, 71225-525"),
  },
];

/** Ficha da matriz no Google Maps (CID do perfil "Sólida Transporte"). */
export const MATRIZ_MAP_EMBED =
  `https://www.google.com/maps?cid=${MATRIZ_MAPS_CID}&hl=pt-BR&output=embed`;
