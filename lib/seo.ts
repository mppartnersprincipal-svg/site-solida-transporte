/**
 * SEO — URL canônica do site e dados estruturados (plano §10).
 * NEXT_PUBLIC_SITE_URL deve apontar para o domínio final em produção.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.solidatransporte.com.br";

export const SITE_NAME = "Sólida Transporte";

export const SITE_DESCRIPTION =
  "Há 32 anos transportando cargas fracionadas entre São Paulo, Goiás e Distrito Federal com rapidez, segurança e previsibilidade.";

// TODO: validar URL de LinkedIn com a Sólida (Facebook veio da auditoria)
export const SOCIAL_URLS = [
  "https://facebook.com/solidatransporte",
  "https://www.instagram.com/solidatransporte/",
];

/** Organization — injetado em todas as páginas públicas (layout do site). */
export const ORGANIZATION_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/assets/solida-logo-200x70-1.png`,
  description: SITE_DESCRIPTION,
  foundingDate: "1994",
  sameAs: SOCIAL_URLS,
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: "+55-62-3206-8100",
      areaServed: "BR",
      availableLanguage: "Portuguese",
    },
  ],
};

/**
 * LocalBusiness das 3 unidades — injetado na página de Contato.
 * Endereços da auditoria do site atual (validar antes do go-live).
 */
export const LOCAL_BUSINESS_JSONLD = [
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#unidade-goiania`,
    name: `${SITE_NAME} — Matriz Goiânia`,
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
    url: `${SITE_URL}/contato`,
    telephone: "+55-62-3206-8100",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. Desvio Bucareste, 550, Qd. 256, Lt. 07 — Jardim Novo Mundo",
      addressLocality: "Goiânia",
      addressRegion: "GO",
      postalCode: "74703-100",
      addressCountry: "BR",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#unidade-guarulhos`,
    name: `${SITE_NAME} — Filial São Paulo (Guarulhos)`,
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
    url: `${SITE_URL}/contato`,
    telephone: "+55-11-3936-1258",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Rua Piracura, 113 — Jardim Fátima",
      addressLocality: "Guarulhos",
      addressRegion: "SP",
      postalCode: "07177-020",
      addressCountry: "BR",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#unidade-brasilia`,
    name: `${SITE_NAME} — Filial Distrito Federal`,
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
    url: `${SITE_URL}/contato`,
    telephone: "+55-61-3361-7772",
    address: {
      "@type": "PostalAddress",
      streetAddress: "STRC Trecho 2, conj. E, Lt. 03, Galpão 3 — Guará",
      addressLocality: "Brasília",
      addressRegion: "DF",
      postalCode: "71225-525",
      addressCountry: "BR",
    },
  },
];
