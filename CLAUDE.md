@AGENTS.md

# Site Sólida Transporte — Contexto do Projeto

> **Regra de trabalho:** ao completar cada fase do roadmap, atualizar este arquivo
> com um resumo do que foi feito antes de iniciar a fase seguinte.

## O que é

Novo site institucional da **Sólida Transporte** — transportadora especializada em
cargas fracionadas entre São Paulo, Goiás e Distrito Federal (32 anos de mercado).
Plano completo em `../PLANONOVOSITESOLIDA.md` (copy, sitemap, paleta, roadmap).
Briefing e auditoria do site atual em `../Briefing Solida Transporte/` e
`../solidatransportedoc/`. Fotos e logos originais em `../assets/`.

**Objetivo de conversão:** todo o site leva o visitante ao **WhatsApp certo por
assunto** (Central de WhatsApp). Sem formulário de cotação, sem guerra de preço.

## Stack e decisões travadas

- **Next.js 16.3.2** (App Router, Turbopack) + TypeScript + **Tailwind v4** + Framer Motion
- **Supabase**: Auth (login do gerente), Postgres (posts do blog), Storage (imagens) — projeto `khipnjfbxjgvmjvyxero`, credenciais no `.env.local`
- Deploy previsto: Vercel
- **Atenção (Next 16):** `middleware.ts` virou **`proxy.ts`**; `cookies()` é async; docs locais em `node_modules/next/dist/docs/`
- **Atenção (Tailwind v4):** não existe `tailwind.config.ts` — tokens em `app/globals.css` via `@theme`; estilos base DEVEM ficar em `@layer base` (fora de layer eles vencem as utilities)
- lucide-react **não tem ícones de marcas** — WhatsApp/Instagram/LinkedIn/Facebook são SVGs inline em `components/layout/`

## Design system

- **Cores** (tokens em `globals.css`): `brand` #FF0000 (só acentos/detalhes), `brand-action` #E10600 (botões/links), `brand-hover` #B00000, `brand-tint` #FFF5F5, `ink` #0E0E0E (header/footer/hero/títulos), `ink-body` #1F2937, `ink-muted` #6B7280, `line` #E5E7EB, `surface` #FFF, `surface-alt` #F7F7F8, `whatsapp` #25D366 (só botões de WhatsApp)
- **Regra de ouro:** vermelho com parcimônia — base branca/off-white + grafite; nada de grandes áreas de #FF0000
- **Tipografia:** Sora (títulos, `font-display`) + Inter (texto, `font-sans`) via next/font
- **Animações:** entrada por scroll com stagger (`components/motion/Reveal.tsx`), contadores (`Counter.tsx`), sempre respeitando `prefers-reduced-motion`

## Arquitetura

```
app/(site)/         páginas públicas (layout com Header/Footer/WhatsAppFloat/CookieBanner)
app/(admin)/        área administrativa (Fase 3)
components/ui/      Container, Button (variants: primary/secondary/outline-light/whatsapp), SectionHeading
components/motion/  Reveal, Counter
components/layout/  Header, Footer, WhatsAppFloat, CookieBanner, WhatsAppIcon, SocialIcons, nav-links
components/whatsapp/ WhatsAppProvider (contexto+modal), WhatsAppModal, WhatsAppCTAButton
components/home/    11 seções da Home
lib/whatsapp.ts     números e assuntos da Central de WhatsApp (§6.2 do plano)
lib/supabase/       client.ts (browser), server.ts (RSC/actions), proxy.ts (sessão)
proxy.ts            protege /admin/*, redireciona /login (convenção Next 16)
```

- CTAs de WhatsApp abrem o **modal da Central** via `useWhatsApp()` (provider no layout do grupo site) ou o componente pronto `WhatsAppCTAButton`
- Drawer mobile do header renderiza via **portal para o body** (senão o stacking context do header sticky quebra a pintura)

## Roadmap e status

| Fase | Escopo | Status |
|---|---|---|
| 0 | Setup: Next+TS+Tailwind+Framer, tokens, estrutura, base Supabase | ✅ concluída |
| 1 | Layout global + Home completa | ✅ concluída |
| 2 | Páginas institucionais (A Empresa, Como Funciona, Segmentos, Diferenciais, Contato, Privacidade, Cookies) | ✅ concluída |
| 3 | Blog + admin (tabelas/RLS/Storage, login, editor, ISR) | ⏳ aguardando ok |
| 4 | Depoimentos, SEO, analytics, acessibilidade, QA | pendente |
| 5 | Conteúdo e go-live (posts, redirects 301, domínio) | pendente |

### Fase 0 — concluída (21/08/2026)

- Projeto `solida-site` criado (create-next-app, Tailwind v4, ESLint)
- Design tokens e fontes configurados; favicon da Sólida em `app/icon.png`
- Estrutura de pastas do plano montada; logos copiados para `public/assets/`
- Base Supabase: clients browser/server, `proxy.ts` com proteção de `/admin`,
  `.env.example` + `.env.local` preenchido e conexão testada (200 OK)

### Fase 1 — concluída (21/08/2026)

- **Globais:** Header sticky (encolhe ao rolar; mobile = ícone WhatsApp sempre visível + drawer), Footer 4 colunas (§4.3), botão flutuante com pulso, banner de cookies LGPD (localStorage)
- **Central de WhatsApp:** modal acessível com 5 assuntos e números da §6.2; cotação/coleta têm 2º nível por região; mensagens pré-preenchidas
- **Home:** 11 seções com a copy exata da §5.1 — hero (foto real da sede) + barra de confiança, rotas SP⇄GO⇄DF com caminhão animado, 5 pilares, estoque enxuto, como funciona, 9 segmentos, 8 diferenciais (seção escura), preço x valor, depoimentos (placeholder), blog (placeholder), CTA final
- QA visual feito em desktop e mobile (headless browser); bugs de stacking/layer corrigidos

### Fase 2 — concluída (21/08/2026)

- **7 páginas** com a copy das §5.2–5.8: `/a-empresa` (missão, selos, foto, timeline 1994→hoje), `/como-funciona` (fluxo Fabricante→Sólida→Lojista, 4 passos, destaque 2–3 dias, FOB x CIF), `/segmentos` (9 cards dor/solução + bloco "o que não transportamos"), `/diferenciais` (8 numerados + PriceValue reutilizado), `/contato` (Central inline com 6 assuntos incl. Jurídico, unidades reais com endereço/tel/e-mail/mapa embed da matriz, redes), `/politica-de-privacidade` e `/politica-de-cookies` (LGPD, corrige o 404 do site antigo)
- Novos: `components/ui/PageHero.tsx` (hero interno), `lib/units.ts` (unidades — dados da auditoria), assunto "juridico" no `lib/whatsapp.ts`, `DIFFERENTIALS` exportado de WhySolida
- Footer/Contato: Facebook real (facebook.com/solidatransporte); metadata por página
- QA visual em todas as páginas (obs.: screenshots full-page em headless mostram seções vazias — falso-negativo do `whileInView`; confirmar com scroll real)

## Pendências para validar com a Sólida (não bloqueiam dev)

- URLs reais de Instagram/LinkedIn (hoje `#`; Facebook veio da auditoria)
- Confirmar números de WhatsApp por assunto (§6.2 veio do site antigo)
- Número/responsável de rastreamento e jurídico (hoje roteados para coleta GO / comercial GO)
- Datas/marcos reais da timeline de `/a-empresa` (1994 é derivado dos "32 anos")
- CNPJ e e-mail do encarregado (DPO) na Política de Privacidade + revisão jurídica
- Endereços/telefones das unidades (vieram da auditoria do site antigo; CEP de SP corrigido para 07.177-020)
- Depoimentos reais (gravação), fotos novas da operação, logo vetorial em alta

## Comandos

- `npm run dev` — porta 3000 (cai para 3001 se o outro projeto estiver rodando)
- `npm run build` — validar sempre antes de commitar fase
