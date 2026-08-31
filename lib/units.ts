import { WA_DEFAULT_MESSAGE, WHATSAPP_NUMBERS, waLink } from "@/lib/whatsapp";

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

/** Endereço da filial de Guarulhos para o Google Maps. */
const GUARULHOS_MAPS_QUERY = "Rua Piracura, 113, Jardim Fátima, Guarulhos - SP, 07177-020";
/** Link da filial de Guarulhos no Google Maps. */
export const GUARULHOS_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(GUARULHOS_MAPS_QUERY);

/** Endereço da filial de Brasília como o Google Maps a reconhece (link enviado pela Sólida). */
const BRASILIA_MAPS_QUERY =
  "STRC Trecho 02 Galpão 02 Conjunto E Lote 03, Plano Piloto, Brasília - DF, 71225-525";
/** Link da filial de Brasília no Google Maps (abre rota/ficha). */
export const BRASILIA_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(BRASILIA_MAPS_QUERY);

export const UNITS: Unit[] = [
  {
    city: "Goiânia - GO",
    role: "Matriz",
    address:
      "Av. Desvio Bucareste, 550, Qd. 256, Lt. 07, Jd. Novo Mundo, Goiânia-GO, CEP 74.703-100",
    phoneLabel: "(62) 3206-8100",
    phoneHref: "tel:+556232068100",
    email: "comercial@solidatransporte.com.br",
    waHref: waLink(WHATSAPP_NUMBERS.goianiaComercial, WA_DEFAULT_MESSAGE),
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
    waHref: waLink(WHATSAPP_NUMBERS.coletaSP, WA_DEFAULT_MESSAGE),
    mapsUrl: GUARULHOS_MAPS_URL,
  },
  {
    city: "Brasília - DF",
    role: "Filial Distrito Federal",
    address:
      "STRC Trecho 2, conj. E, Lt. 03, Galpão 3, Bairro Guará, Brasília-DF, CEP 71.225-525",
    phoneLabel: "(61) 3361-7772",
    phoneHref: "tel:+556133617772",
    email: "comercialdf@solidatransporte.com.br",
    waHref: waLink(WHATSAPP_NUMBERS.brasiliaComercial, WA_DEFAULT_MESSAGE),
    mapsUrl: BRASILIA_MAPS_URL,
  },
];

/** Ficha da matriz no Google Maps (CID do perfil "Sólida Transporte"). */
export const MATRIZ_MAP_EMBED =
  `https://www.google.com/maps?cid=${MATRIZ_MAPS_CID}&hl=pt-BR&output=embed`;

/** Mapa da filial de Brasília (embed por endereço, sem chave de API). */
export const BRASILIA_MAP_EMBED =
  "https://www.google.com/maps?q=" + encodeURIComponent(BRASILIA_MAPS_QUERY) + "&hl=pt-BR&output=embed";

/** Mapa da filial de Guarulhos (embed por endereço, sem chave de API). */
export const GUARULHOS_MAP_EMBED =
  "https://www.google.com/maps?q=" + encodeURIComponent(GUARULHOS_MAPS_QUERY) + "&hl=pt-BR&output=embed";
