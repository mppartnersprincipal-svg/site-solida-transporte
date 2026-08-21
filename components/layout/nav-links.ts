export const NAV_LINKS = [
  { label: "Início", href: "/" },
  { label: "A Empresa", href: "/a-empresa" },
  { label: "Como Funciona", href: "/como-funciona" },
  { label: "Segmentos", href: "/segmentos" },
  { label: "Diferenciais", href: "/diferenciais" },
  { label: "Blog", href: "/blog" },
  { label: "Contato", href: "/contato" },
] as const;

/** Rodapé inclui Depoimentos (fora do menu principal, conforme §4.2 do plano). */
export const FOOTER_LINKS = [
  { label: "Início", href: "/" },
  { label: "A Empresa", href: "/a-empresa" },
  { label: "Como Funciona", href: "/como-funciona" },
  { label: "Segmentos", href: "/segmentos" },
  { label: "Diferenciais", href: "/diferenciais" },
  { label: "Depoimentos", href: "/depoimentos" },
  { label: "Blog", href: "/blog" },
  { label: "Contato", href: "/contato" },
] as const;
