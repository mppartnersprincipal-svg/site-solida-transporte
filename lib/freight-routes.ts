/**
 * Rotas de frete — landing pages por rota para as campanhas de Google Ads
 * (páginas /frete/[slug]). Headline e copy casam com as palavras-chave
 * anunciadas (relatório de palavras-chave/termos de pesquisa de 31/08/2026:
 * "transportadora" converte mais que "frete"; as duas direções da rota
 * aparecem nas buscas).
 *
 * Regras de copy (CLAUDE.md): prazo SEMPRE qualificado — 2 a 3 dias úteis
 * capital e região metropolitana, 3 a 4 interior, após a coleta, algumas
 * cidades do interior têm prazo maior; sem promessa de preço; sem
 * armazenagem; seguro = "trabalhamos com seguro de carga".
 */

export type FreightRouteFaq = { q: string; a: string };

export type FreightRoute = {
  slug: string;
  /** Eyebrow do hero, ex.: "Rota São Paulo → Goiânia" */
  corridor: string;
  /** H1 — precisa bater com a palavra-chave anunciada */
  headline: string;
  /** <title> (o template do layout acrescenta "| Sólida Transporte") */
  metaTitle: string;
  metaDescription: string;
  heroSubtitle: string;
  /** Parágrafo-resposta direto no topo (SEO/GEO: responde a busca em um bloco citável) */
  answer: string;
  /** Parágrafo que cobre as variações de busca da rota, em linguagem natural */
  variations: string;
  /** Card de prazo */
  deadline: {
    capitalLabel: string;
    interiorLabel?: string;
  };
  steps: { title: string; text: string }[];
  /** city das unidades em lib/units.ts que apoiam a rota (ordem: origem, destino) */
  unitCities: string[];
  /** Observação exibida junto às unidades (ex.: RJ sem unidade própria) */
  unitsNote?: string;
  faq: FreightRouteFaq[];
  /** slugs de outras rotas relacionadas */
  related: string[];
};

export const FREIGHT_ROUTES: FreightRoute[] = [
  {
    slug: "sao-paulo-para-goiania",
    corridor: "Rota São Paulo → Goiânia",
    headline: "Transportadora de São Paulo para Goiânia",
    metaTitle: "Transportadora de São Paulo para Goiânia — frete fracionado",
    metaDescription:
      "Frete fracionado de São Paulo para Goiânia e Aparecida de Goiânia em 2 a 3 dias úteis após a coleta. Frota própria, seguro de carga e rastreamento. Peça sua cotação pelo WhatsApp.",
    heroSubtitle:
      "Frete fracionado de São Paulo para Goiânia e Aparecida de Goiânia em 2 a 3 dias úteis após a coleta, com frota própria, seguro de carga e rastreamento do início ao fim.",
    answer:
      "A Sólida Transporte faz frete fracionado de São Paulo para Goiânia há 32 anos, com o mesmo CNPJ. A coleta acontece em São Paulo e região metropolitana pela filial de Guarulhos, a carga segue no corredor SP ⇄ GO e a entrega em Goiânia e Aparecida de Goiânia sai em 2 a 3 dias úteis após a coleta. Transportamos cargas fracionadas de fabricantes e distribuidores para lojistas, com seguro de carga e acompanhamento em cada etapa.",
    variations:
      "É a mesma operação para quem procura frete de São Paulo para Goiânia, carga de SP para Goiânia ou transportadora São Paulo x Goiânia: coleta pontual na origem, transferência no corredor e distribuição na chegada — sem repasse para terceiros no meio do caminho.",
    deadline: {
      capitalLabel: "Goiânia e região metropolitana, incluindo Aparecida de Goiânia",
      interiorLabel: "Interior de Goiás — algumas cidades têm prazo maior",
    },
    steps: [
      {
        title: "Coleta em São Paulo",
        text: "Você agenda e a equipe da filial de Guarulhos coleta na capital e na região metropolitana dentro do prazo combinado, com a documentação conferida antes de sair.",
      },
      {
        title: "Transferência no corredor SP ⇄ GO",
        text: "A carga segue em frota própria, com seguro de carga e rastreamento, direto para a nossa estrutura em Goiânia.",
      },
      {
        title: "Entrega em Goiânia e Aparecida",
        text: "Distribuição aos destinatários em 2 a 3 dias úteis após a coleta na capital e região metropolitana; interior de Goiás em 3 a 4 dias úteis.",
      },
    ],
    unitCities: ["Guarulhos - SP", "Goiânia - GO"],
    faq: [
      {
        q: "Qual o prazo do frete de São Paulo para Goiânia?",
        a: "2 a 3 dias úteis após a coleta para Goiânia e região metropolitana (incluindo Aparecida de Goiânia). Para o interior de Goiás, 3 a 4 dias úteis — algumas cidades têm prazo maior.",
      },
      {
        q: "Em que região de São Paulo vocês coletam?",
        a: "Na capital e na região metropolitana de São Paulo. A coleta é feita pela nossa filial de Guarulhos, no Jardim Fátima.",
      },
      {
        q: "Que tipo de carga vocês transportam nessa rota?",
        a: "Cargas fracionadas de empresas: fabricantes e distribuidores abastecendo lojistas e revendedores. Atendemos nove segmentos, de autopeças a suplementos.",
      },
      {
        q: "A carga viaja com seguro e rastreamento?",
        a: "Sim. Trabalhamos com seguro de carga e você acompanha a mercadoria do início ao fim, com aviso de qualquer ocorrência na hora.",
      },
      {
        q: "A Sólida faz armazenagem?",
        a: "Não. Somos transportadora: nossos galpões são ponto de chegada e despacho das cargas, não depósito para estocar mercadoria.",
      },
      {
        q: "Como peço uma cotação?",
        a: "Pelo WhatsApp. Toque em qualquer botão de cotação desta página e fale direto com o comercial da rota — sem formulário e sem espera.",
      },
    ],
    related: ["goiania-para-sao-paulo", "sao-paulo-para-goias", "sao-paulo-para-brasilia"],
  },
  {
    slug: "goiania-para-sao-paulo",
    corridor: "Rota Goiânia → São Paulo",
    headline: "Transportadora de Goiânia para São Paulo",
    metaTitle: "Transportadora de Goiânia para São Paulo — frete fracionado",
    metaDescription:
      "Frete fracionado de Goiânia para São Paulo em 2 a 3 dias úteis após a coleta. Matriz própria em Goiânia, frota própria, seguro de carga e rastreamento. Cotação pelo WhatsApp.",
    heroSubtitle:
      "Frete fracionado de Goiânia e Aparecida de Goiânia para São Paulo em 2 a 3 dias úteis após a coleta, com matriz própria em Goiânia e frota própria na rota.",
    answer:
      "A Sólida Transporte leva cargas fracionadas de Goiânia para São Paulo há 32 anos. A coleta é feita em Goiânia e Aparecida de Goiânia pela matriz, no Jardim Novo Mundo, e a entrega na capital paulista e região metropolitana sai em 2 a 3 dias úteis após a coleta — interior de São Paulo em 3 a 4 dias úteis. A carga segue com seguro e rastreamento, e você acompanha cada etapa.",
    variations:
      "Se você buscou frete de Goiânia para São Paulo, carga de Goiânia para SP ou transportadora Goiânia x São Paulo, a operação é essa: coleta pontual na Grande Goiânia, transferência no corredor GO ⇄ SP e distribuição na chegada, tudo com a mesma equipe.",
    deadline: {
      capitalLabel: "Capital paulista e região metropolitana",
      interiorLabel: "Interior de São Paulo — algumas cidades têm prazo maior",
    },
    steps: [
      {
        title: "Coleta em Goiânia",
        text: "Você agenda e a equipe da matriz coleta em Goiânia e Aparecida de Goiânia dentro do prazo combinado — coleta marcada é coleta feita.",
      },
      {
        title: "Transferência no corredor GO ⇄ SP",
        text: "A carga segue em frota própria, com seguro de carga e rastreamento, direto para a nossa filial em Guarulhos.",
      },
      {
        title: "Entrega em São Paulo",
        text: "Distribuição aos destinatários em 2 a 3 dias úteis após a coleta na capital e região metropolitana; interior paulista em 3 a 4 dias úteis.",
      },
    ],
    unitCities: ["Goiânia - GO", "Guarulhos - SP"],
    faq: [
      {
        q: "Qual o prazo do frete de Goiânia para São Paulo?",
        a: "2 a 3 dias úteis após a coleta para a capital e região metropolitana de São Paulo. Para o interior paulista, 3 a 4 dias úteis — algumas cidades têm prazo maior.",
      },
      {
        q: "Vocês coletam em Aparecida de Goiânia?",
        a: "Sim. A coleta cobre Goiânia e a região metropolitana, incluindo Aparecida de Goiânia, e é feita pela equipe da nossa matriz, no Jardim Novo Mundo.",
      },
      {
        q: "Que tipo de carga vocês transportam nessa rota?",
        a: "Cargas fracionadas de empresas: fabricantes e distribuidores de Goiás abastecendo clientes e revendedores em São Paulo. Atendemos nove segmentos.",
      },
      {
        q: "A carga viaja com seguro e rastreamento?",
        a: "Sim. Trabalhamos com seguro de carga e você acompanha a mercadoria do início ao fim, com aviso de qualquer ocorrência na hora.",
      },
      {
        q: "A Sólida faz armazenagem?",
        a: "Não. Somos transportadora: nossos galpões são ponto de chegada e despacho das cargas, não depósito para estocar mercadoria.",
      },
      {
        q: "Como peço uma cotação?",
        a: "Pelo WhatsApp. Toque em qualquer botão de cotação desta página e fale direto com o comercial de Goiânia — sem formulário e sem espera.",
      },
    ],
    related: ["sao-paulo-para-goiania", "sao-paulo-para-goias", "brasilia-para-sao-paulo"],
  },
  {
    slug: "sao-paulo-para-goias",
    corridor: "Rota São Paulo → Goiás",
    headline: "Transportadora de São Paulo para Goiás",
    metaTitle: "Transportadora de São Paulo para Goiás — frete fracionado",
    metaDescription:
      "Frete fracionado de São Paulo para Goiás: Goiânia e região em 2 a 3 dias úteis, interior em 3 a 4 após a coleta. Frota própria, seguro de carga e rastreamento. Cotação pelo WhatsApp.",
    heroSubtitle:
      "Frete fracionado de São Paulo para todo o corredor de Goiás: Goiânia e região metropolitana em 2 a 3 dias úteis e interior goiano em 3 a 4, sempre contados após a coleta.",
    answer:
      "A Sólida Transporte faz frete fracionado de São Paulo para Goiás há 32 anos, com o mesmo CNPJ. A coleta acontece na capital paulista e região metropolitana, e a entrega em Goiânia e Aparecida de Goiânia sai em 2 a 3 dias úteis após a coleta; no interior de Goiás, em 3 a 4 dias úteis — algumas cidades têm prazo maior. A operação usa frota própria, com seguro de carga, rastreamento e agências nos principais polos atendidos.",
    variations:
      "Quem procura frete de São Paulo para Goiás, carga de SP para o interior goiano ou transportadora SP x GO encontra aqui a mesma operação: coleta pontual na origem, transferência no corredor SP ⇄ GO e distribuição a partir da nossa estrutura em Goiânia.",
    deadline: {
      capitalLabel: "Goiânia e região metropolitana, incluindo Aparecida de Goiânia",
      interiorLabel: "Interior de Goiás — algumas cidades têm prazo maior",
    },
    steps: [
      {
        title: "Coleta em São Paulo",
        text: "Você agenda e a equipe da filial de Guarulhos coleta na capital e na região metropolitana dentro do prazo combinado, com a documentação conferida antes de sair.",
      },
      {
        title: "Transferência no corredor SP ⇄ GO",
        text: "A carga segue em frota própria, com seguro de carga e rastreamento, para a nossa matriz em Goiânia — base da distribuição no estado.",
      },
      {
        title: "Distribuição em Goiás",
        text: "Goiânia e região metropolitana recebem em 2 a 3 dias úteis após a coleta; o interior goiano, em 3 a 4 dias úteis — algumas cidades têm prazo maior.",
      },
    ],
    unitCities: ["Guarulhos - SP", "Goiânia - GO"],
    faq: [
      {
        q: "Vocês entregam no interior de Goiás?",
        a: "Sim. O prazo para o interior goiano é de 3 a 4 dias úteis após a coleta — algumas cidades têm prazo maior. Consulte a sua cidade de destino pelo WhatsApp.",
      },
      {
        q: "Qual o prazo para Goiânia e região?",
        a: "2 a 3 dias úteis após a coleta para Goiânia e região metropolitana, incluindo Aparecida de Goiânia.",
      },
      {
        q: "Que tipo de carga vocês transportam nessa rota?",
        a: "Cargas fracionadas de empresas: fabricantes e distribuidores abastecendo lojistas e revendedores em Goiás. Atendemos nove segmentos, de autopeças a suplementos.",
      },
      {
        q: "A carga viaja com seguro e rastreamento?",
        a: "Sim. Trabalhamos com seguro de carga e você acompanha a mercadoria do início ao fim, com aviso de qualquer ocorrência na hora.",
      },
      {
        q: "A Sólida faz armazenagem?",
        a: "Não. Somos transportadora: nossos galpões são ponto de chegada e despacho das cargas, não depósito para estocar mercadoria.",
      },
      {
        q: "Como peço uma cotação?",
        a: "Pelo WhatsApp. Toque em qualquer botão de cotação desta página, informe origem, destino e tipo de mercadoria e o comercial responde direto.",
      },
    ],
    related: ["sao-paulo-para-goiania", "goiania-para-sao-paulo", "sao-paulo-para-brasilia"],
  },
  {
    slug: "sao-paulo-para-brasilia",
    corridor: "Rota São Paulo → Brasília",
    headline: "Transportadora de São Paulo para Brasília",
    metaTitle: "Transportadora de São Paulo para Brasília — frete fracionado",
    metaDescription:
      "Frete fracionado de São Paulo para Brasília e Distrito Federal em 2 a 3 dias úteis após a coleta, com filial própria no DF, seguro de carga e rastreamento. Cotação pelo WhatsApp.",
    heroSubtitle:
      "Frete fracionado de São Paulo para Brasília e o Distrito Federal em 2 a 3 dias úteis após a coleta, com filial própria no Guará e frota própria na rota.",
    answer:
      "A Sólida Transporte faz frete fracionado de São Paulo para Brasília com estrutura própria nas duas pontas: a coleta acontece na capital paulista e região metropolitana pela filial de Guarulhos, e a distribuição no Distrito Federal parte da nossa filial no Guará. A entrega em Brasília e no DF sai em 2 a 3 dias úteis após a coleta, com seguro de carga e rastreamento do início ao fim.",
    variations:
      "Para quem busca frete de SP para Brasília, carga de São Paulo para o DF ou transportadora SP x Brasília, a operação é a mesma: coleta pontual na origem, transferência no corredor SP ⇄ DF e distribuição na chegada, com a mesma equipe respondendo do início ao fim.",
    deadline: {
      capitalLabel: "Brasília e Distrito Federal",
    },
    steps: [
      {
        title: "Coleta em São Paulo",
        text: "Você agenda e a equipe da filial de Guarulhos coleta na capital e na região metropolitana dentro do prazo combinado, com a documentação conferida antes de sair.",
      },
      {
        title: "Transferência no corredor SP ⇄ DF",
        text: "A carga segue em frota própria, com seguro de carga e rastreamento, direto para a nossa filial no Guará.",
      },
      {
        title: "Entrega em Brasília e no DF",
        text: "Distribuição aos destinatários em 2 a 3 dias úteis após a coleta, com você acompanhando cada etapa.",
      },
    ],
    unitCities: ["Guarulhos - SP", "Brasília - DF"],
    faq: [
      {
        q: "Qual o prazo do frete de São Paulo para Brasília?",
        a: "2 a 3 dias úteis após a coleta para Brasília e o Distrito Federal.",
      },
      {
        q: "Vocês têm estrutura própria em Brasília?",
        a: "Sim. A distribuição no DF parte da nossa filial no Guará (STRC Trecho 2), com equipe própria da Sólida.",
      },
      {
        q: "Que tipo de carga vocês transportam nessa rota?",
        a: "Cargas fracionadas de empresas: fabricantes e distribuidores abastecendo lojistas e revendedores no DF. Atendemos nove segmentos.",
      },
      {
        q: "A carga viaja com seguro e rastreamento?",
        a: "Sim. Trabalhamos com seguro de carga e você acompanha a mercadoria do início ao fim, com aviso de qualquer ocorrência na hora.",
      },
      {
        q: "A Sólida faz armazenagem?",
        a: "Não. Somos transportadora: nossos galpões são ponto de chegada e despacho das cargas, não depósito para estocar mercadoria.",
      },
      {
        q: "Como peço uma cotação?",
        a: "Pelo WhatsApp. Toque em qualquer botão de cotação desta página e fale direto com o comercial da rota — sem formulário e sem espera.",
      },
    ],
    related: ["brasilia-para-sao-paulo", "sao-paulo-para-goiania", "sao-paulo-para-goias"],
  },
  {
    slug: "brasilia-para-sao-paulo",
    corridor: "Rota Brasília → São Paulo",
    headline: "Transportadora de Brasília para São Paulo",
    metaTitle: "Transportadora de Brasília para São Paulo — frete fracionado",
    metaDescription:
      "Frete fracionado de Brasília para São Paulo em 2 a 3 dias úteis após a coleta. Filial própria no DF, frota própria, seguro de carga e rastreamento. Cotação pelo WhatsApp.",
    heroSubtitle:
      "Frete fracionado de Brasília e do Distrito Federal para São Paulo em 2 a 3 dias úteis após a coleta, com filial própria no Guará cuidando da coleta.",
    answer:
      "A Sólida Transporte leva cargas fracionadas de Brasília para São Paulo com estrutura própria nas duas pontas. A coleta no Distrito Federal é feita pela nossa filial no Guará, e a entrega na capital paulista e região metropolitana sai em 2 a 3 dias úteis após a coleta — interior de São Paulo em 3 a 4 dias úteis. A carga segue em frota própria, com seguro de carga e rastreamento.",
    variations:
      "Se você buscou frete de Brasília para São Paulo, carga do DF para SP ou transportadora Brasília x São Paulo, a operação é essa: coleta pontual no DF, transferência no corredor DF ⇄ SP e distribuição na chegada pela filial de Guarulhos.",
    deadline: {
      capitalLabel: "Capital paulista e região metropolitana",
      interiorLabel: "Interior de São Paulo — algumas cidades têm prazo maior",
    },
    steps: [
      {
        title: "Coleta no Distrito Federal",
        text: "Você agenda e a equipe da filial do Guará coleta em Brasília e no DF dentro do prazo combinado — coleta marcada é coleta feita.",
      },
      {
        title: "Transferência no corredor DF ⇄ SP",
        text: "A carga segue em frota própria, com seguro de carga e rastreamento, direto para a nossa filial em Guarulhos.",
      },
      {
        title: "Entrega em São Paulo",
        text: "Distribuição aos destinatários em 2 a 3 dias úteis após a coleta na capital e região metropolitana; interior paulista em 3 a 4 dias úteis.",
      },
    ],
    unitCities: ["Brasília - DF", "Guarulhos - SP"],
    faq: [
      {
        q: "Qual o prazo do frete de Brasília para São Paulo?",
        a: "2 a 3 dias úteis após a coleta para a capital e região metropolitana de São Paulo. Para o interior paulista, 3 a 4 dias úteis — algumas cidades têm prazo maior.",
      },
      {
        q: "De onde parte a coleta no DF?",
        a: "Da nossa filial no Guará (STRC Trecho 2), com equipe própria da Sólida cobrindo Brasília e o Distrito Federal.",
      },
      {
        q: "Que tipo de carga vocês transportam nessa rota?",
        a: "Cargas fracionadas de empresas: fabricantes e distribuidores do DF abastecendo clientes e revendedores em São Paulo. Atendemos nove segmentos.",
      },
      {
        q: "A carga viaja com seguro e rastreamento?",
        a: "Sim. Trabalhamos com seguro de carga e você acompanha a mercadoria do início ao fim, com aviso de qualquer ocorrência na hora.",
      },
      {
        q: "A Sólida faz armazenagem?",
        a: "Não. Somos transportadora: nossos galpões são ponto de chegada e despacho das cargas, não depósito para estocar mercadoria.",
      },
      {
        q: "Como peço uma cotação?",
        a: "Pelo WhatsApp. Toque em qualquer botão de cotação desta página e fale direto com o comercial de Brasília — sem formulário e sem espera.",
      },
    ],
    related: ["sao-paulo-para-brasilia", "goiania-para-sao-paulo", "sao-paulo-para-goiania"],
  },
  {
    slug: "sao-paulo-para-rio-de-janeiro",
    corridor: "Rota São Paulo → Rio de Janeiro",
    headline: "Transportadora de São Paulo para o Rio de Janeiro",
    metaTitle: "Transportadora de São Paulo para o Rio de Janeiro — frete fracionado",
    metaDescription:
      "Frete fracionado de São Paulo para a cidade do Rio de Janeiro em 2 a 3 dias úteis após a coleta, com frota própria, seguro de carga e rastreamento. Cotação pelo WhatsApp.",
    heroSubtitle:
      "Frete fracionado de São Paulo para a cidade do Rio de Janeiro em 2 a 3 dias úteis após a coleta, com frota própria, seguro de carga e rastreamento do início ao fim.",
    answer:
      "A Sólida Transporte faz frete fracionado de São Paulo para a cidade do Rio de Janeiro. A coleta acontece na capital paulista e região metropolitana pela filial de Guarulhos, e a entrega na capital fluminense sai em 2 a 3 dias úteis após a coleta. Transportamos cargas fracionadas de fabricantes e distribuidores para lojistas, com seguro de carga e acompanhamento em cada etapa.",
    variations:
      "Para quem busca frete de SP para o Rio de Janeiro, carga de São Paulo para o RJ ou transportadora SP x Rio, a operação é a mesma dos nossos corredores: coleta pontual na origem, transferência e distribuição na chegada. No estado do Rio, o atendimento é focado na capital.",
    deadline: {
      capitalLabel: "Cidade do Rio de Janeiro (capital)",
    },
    steps: [
      {
        title: "Coleta em São Paulo",
        text: "Você agenda e a equipe da filial de Guarulhos coleta na capital e na região metropolitana dentro do prazo combinado, com a documentação conferida antes de sair.",
      },
      {
        title: "Transferência para o Rio",
        text: "A carga segue com seguro de carga e rastreamento, e você acompanha a viagem do início ao fim.",
      },
      {
        title: "Entrega na capital fluminense",
        text: "Distribuição aos destinatários na cidade do Rio de Janeiro em 2 a 3 dias úteis após a coleta.",
      },
    ],
    unitCities: ["Guarulhos - SP"],
    unitsNote:
      "No Rio de Janeiro o atendimento é focado na capital. A coleta e o comercial da rota ficam com a equipe de São Paulo.",
    faq: [
      {
        q: "Qual o prazo do frete de São Paulo para o Rio de Janeiro?",
        a: "2 a 3 dias úteis após a coleta para entregas na cidade do Rio de Janeiro.",
      },
      {
        q: "Vocês atendem o interior do estado do Rio?",
        a: "O atendimento no estado do Rio de Janeiro é focado na capital. Consulte o comercial pelo WhatsApp sobre o seu destino específico.",
      },
      {
        q: "Que tipo de carga vocês transportam nessa rota?",
        a: "Cargas fracionadas de empresas: fabricantes e distribuidores abastecendo lojistas e revendedores na capital fluminense. Atendemos nove segmentos.",
      },
      {
        q: "A carga viaja com seguro e rastreamento?",
        a: "Sim. Trabalhamos com seguro de carga e você acompanha a mercadoria do início ao fim, com aviso de qualquer ocorrência na hora.",
      },
      {
        q: "A Sólida faz armazenagem?",
        a: "Não. Somos transportadora: nossos galpões são ponto de chegada e despacho das cargas, não depósito para estocar mercadoria.",
      },
      {
        q: "Como peço uma cotação?",
        a: "Pelo WhatsApp. Toque em qualquer botão de cotação desta página e fale direto com o comercial da rota — sem formulário e sem espera.",
      },
    ],
    related: ["sao-paulo-para-goiania", "sao-paulo-para-brasilia", "sao-paulo-para-goias"],
  },
];

export function getFreightRoute(slug: string) {
  return FREIGHT_ROUTES.find((r) => r.slug === slug);
}
