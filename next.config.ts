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

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...MIGRATED_POST_SLUGS.map((slug) => ({
        source: `/${slug}`,
        destination: `/blog/${slug}`,
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
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
