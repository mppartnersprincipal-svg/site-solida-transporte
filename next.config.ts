import type { NextConfig } from "next";

// No site antigo (WordPress) os posts ficavam na RAIZ do domínio (/{slug}/).
// Redirects 301 preservam o ranqueamento dos posts migrados para /blog/{slug}.
const MIGRATED_POST_SLUGS = [
  "tipos-de-transportador-etc-tac-ctc-entenda-as-diferencas",
  "o-emissor-de-mdfe-gratuito-ainda-existe-entenda",
  "como-ganhar-dinheiro-com-caminhao-confira-5-dicas",
  "cnpj-com-letras-saiba-o-que-vai-mudar-com-o-cnpj-alfanumerico",
  "transporte-de-mudancas-tudo-o-que-voce-precisa-saber",
  "consulta-mdfe-como-fazer-de-forma-simples",
  "como-identificar-e-pra-que-serve-uma-chave-de-acesso-do-cte",
  "nao-emitir-manifesto-da-multa-veja-o-que-diz-a-legislacao",
  "quais-estados-exigem-o-mdfe-intermunicipal",
  "case-de-sucesso-como-o-bsoft-tms-ajudou-a-f-a-s-logistica-a-crescer",
];

// Páginas institucionais do site antigo com tráfego real (Search Console,
// jun–ago/2026) → assunto correspondente da Central de WhatsApp em /contato.
const LEGACY_PAGES: Record<string, string> = {
  "rastreamento-de-mercadorias": "/contato#rastreamento", // 604 cliques/3 meses
  "cotacao-de-frete-rodoviario": "/contato#cotacao",
  "pedido-de-coleta": "/contato#coleta",
  "pagamento-de-fatura": "/contato", // assunto Financeiro removido da Central em 31/08/2026
};

// Posts antigos NÃO migrados mas que ainda recebiam cliques do Google
// (≥3 cliques em 3 meses no Search Console, 26/08/2026). Vão para /blog em
// vez de 404 para não perder o visitante; se algum valer remigrar, tirar
// daqui e adicionar em MIGRATED_POST_SLUGS. Demais URLs antigas → 404.
const LEGACY_POST_SLUGS = [
  "icms-interestadual-no-transporte-de-cargas-saiba-como-calcular",
  "conheca-os-principais-tipos-de-tratores-agricolas-solida-transporte-news",
  "precisa-emitir-ciot-para-frota-propria",
  "conheca-12-tipos-de-caminhoes-e-suas-caracteristicas",
  "como-emitir-cte-pelo-emissor-do-sebrae-gratuito",
  "como-consultar-dados-de-veiculo-na-base-renavam",
  "o-que-e-consulta-de-cte-e-como-fazer-isso-confira-aqui",
  "rastreamento-em-tempo-real-logistica-moderna-com-iot-e-gps-solida-transporte-news",
  "quais-sao-os-3-tipos-de-canais-de-distribuicao",
  "o-diesel-s500-vai-acabar-veja-como-se-preparar",
  "o-que-e-estoque-de-contingencia-e-como-fazer",
  "o-que-e-como-emitir-calculadora-de-rpa-e-tabelas-2025",
  "como-funciona-e-quais-suas-vantagens",
  "veja-como-a-pwx-transportes-ganhou-tempo-com-o-bsoft-tms",
  "entenda-todas-as-regras-para-o-transporte-de-alimentos",
  "motoristas-autonomos-vao-precisar-emitir-nfse",
  "rejeicao-mdfe-veja-o-que-significa-e-como-resolver",
  "como-se-registrar-na-antt-confira-o-passo-a-passo",
  "11-motivos-para-adquirir-o-bsoft-tms",
  "o-que-e-como-cobrar-e-qual-a-diferenca-de-frete",
  "anulacao-de-frete-entenda-como-e-feito-o-processo",
  "confira-a-nova-lei-se-ele-estiver-vencido",
  "escavadeira-de-esteira-vantagens-de-alugar-ao-inves-de-comprar-solida-transporte-news",
  "locker-como-funciona-este-servico-para-retirada-de-produtos",
  "descubra-qual-a-capacidade-de-peso-e-carga-dos-caminhoes",
  "estrategia-de-distribuicao-intensiva-exclusiva-ou-seletiva-como-escolher",
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...MIGRATED_POST_SLUGS.map((slug) => ({
        source: `/${slug}`,
        destination: `/blog/${slug}`,
        permanent: true,
      })),
      ...Object.entries(LEGACY_PAGES).map(([slug, destination]) => ({
        source: `/${slug}`,
        destination,
        permanent: true,
      })),
      ...LEGACY_POST_SLUGS.map((slug) => ({
        source: `/${slug}`,
        destination: "/blog",
        permanent: true,
      })),
      // Rota de listagem antiga com "page/N" (paginação do WordPress)
      {
        source: "/blog/page/:page",
        destination: "/blog",
        permanent: true,
      },
    ];
  },
  // Evita que o Turbopack detecte lockfiles fora do projeto como raiz
  turbopack: {
    root: __dirname,
  },
  // Capas e imagens dos posts vêm do Supabase Storage (bucket post-images)
  images: {
    // AVIF primeiro: ~30–40% menor que WebP nos heros fotográficos
    formats: ["image/avif", "image/webp"],
    // Next 16 exige declarar qualities não-default; 60 é usado nos heros
    // fill 100vw que ficam sob gradiente/opacity (degradação invisível)
    qualities: [60, 75],
    minimumCacheTTL: 2678400, // 31 dias — capas do Supabase mudam por URL
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async headers() {
    return [
      {
        // Assets estáticos de public/ (fotos, vídeos da intro, logos).
        // Na Vercel o default é max-age=0; immutable é seguro porque a regra
        // do projeto é: substituiu um asset → renomeia o arquivo.
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
