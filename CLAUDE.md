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
- **GSAP (feito e revertido, 23/08/2026):** uma versão da `RoutesSection` com GSAP ScrollTrigger `scrub` (rota SP→GO→DF desenhada pelo scroll, caminhão na ponta, bidirecional) foi implementada, validada e **descartada a pedido do usuário** — voltou o loop original do Framer Motion e `gsap`/`@gsap/react` foram desinstalados. Se o assunto voltar, a implementação está no histórico desta data

## Arquitetura

```
app/(site)/         páginas públicas (layout com Header/Footer/WhatsAppFloat/CookieBanner)
app/(admin)/        área administrativa (Fase 3)
components/ui/      Container, Button (variants: primary/secondary/outline-light/whatsapp), SectionHeading
components/motion/  Reveal, Counter
components/layout/  Header, Footer, WhatsAppFloat, CookieBanner, WhatsAppIcon, SocialIcons, nav-links
components/whatsapp/ WhatsAppProvider (contexto+modal), WhatsAppModal, WhatsAppCTAButton
components/home/    13 seções da Home (inclui Solutions — split Armazenagem/Transporte ref. site antigo — e OperationGallery, mosaico de fotos reais)
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
| 3 | Blog + admin (tabelas/RLS/Storage, login, editor, ISR) | ✅ concluída |
| 4 | Depoimentos, SEO, analytics, acessibilidade, QA | ✅ concluída |
| 5 | Conteúdo e go-live (posts, redirects 301, domínio) | 🔶 dev concluído — aguardando ações do usuário (seed, Vercel, DNS) |

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
- Novos: `components/ui/PageHero.tsx` (hero interno; ganhou prop `image` na Fase 5 — foto real de fundo com opacity-40 + gradiente, mesmo tratamento do hero da Home; todas as 7 páginas internas usam fotos reais `public/assets/hero-*.jpg` vindas de `../assets/Solida-N-scaled.jpg`, e o FinalCta da Home usa `cta-frota.jpg`), `lib/units.ts` (unidades — dados da auditoria), assunto "juridico" no `lib/whatsapp.ts`, `DIFFERENTIALS` exportado de WhySolida
- Footer/Contato: Facebook real (facebook.com/solidatransporte); metadata por página
- QA visual em todas as páginas (obs.: screenshots full-page em headless mostram seções vazias — falso-negativo do `whileInView`; confirmar com scroll real)

### Fase 3 — concluída (21/08/2026)

- **Supabase (SQL em `supabase/migrations/0001_blog.sql` — o usuário roda no painel):** tabela `posts` (§2.3, com trigger de `updated_at`), tabela `categories` (seed: Frete, Logística, Fiscal, Institucional), bucket `post-images` público p/ leitura; RLS: leitura pública só de `status='published'`, escrita só autenticado (idem Storage)
- **Blog público:** `/blog` (PageHero + `BlogGrid` com filtro por categoria e "Carregar mais" — 1ª página via ISR, paginação/filtro via client Supabase no browser), `/blog/[slug]` (capa sobreposta ao header escuro, corpo `.post-body`, tags, CTA WhatsApp, "Continue lendo", JSON-LD BlogPosting, generateStaticParams + notFound)
- **ISR:** páginas do blog com `revalidate = 3600` + revalidação on-demand nas server actions (`/blog`, `/blog/[slug]`, slug antigo se mudou, e `/` p/ o BlogTeaser). **Páginas públicas usam `lib/supabase/public.ts`** (client anônimo SEM cookies — o client de `server.ts` forçaria render dinâmico e mataria o ISR)
- **Admin:** `/login` (card sobre fundo ink, Supabase Auth por e-mail/senha, `window.location.assign` após login p/ o proxy ver a sessão), `/admin` (tabela com status/contadores + `PostRowActions`: publicar/despublicar, ver, editar, excluir com confirm), `/admin/posts/novo` e `/admin/posts/[id]` (`PostEditor`: título → slug automático até edição manual, resumo, categoria com datalist da tabela categories, tags, upload de capa e imagens inline p/ Storage via browser client, Tiptap em `RichTextEditor` — Salvar rascunho / Publicar)
- **Server actions** em `app/(admin)/admin/actions.ts`: savePost (upsert + upsert da categoria digitada em `categories`; 23505 → msg de slug duplicado), setPostStatus, deletePost, signOut — todas com `requireUser()`
- **BlogTeaser da Home** agora é async: 3 últimos posts reais; mantém cards "Em breve" enquanto não houver post publicado (degrada com log se as tabelas não existirem)
- Novos: `lib/blog.ts` (tipos + queries compartilhadas server/browser), `slugify` em `lib/utils.ts`, `.post-body` em `globals.css` (tipografia do post, usada TAMBÉM dentro do editor), `remotePatterns` `*.supabase.co` no `next.config.ts`, deps Tiptap v3 (StarterKit já inclui Link — configurar via `StarterKit.configure({link})`, NÃO instalar extension-link junto; `immediatelyRender:false` + `shouldRerenderOnTransaction:true`)
- QA: build ok (17 rotas; admin ƒ dynamic, blog ○/● com ISR), smoke test em prod server: /blog 200, /login 200, slug inexistente 404, /admin → 307 /login
- **Pendente do usuário:** rodar o SQL no Supabase e criar o usuário do gerente no painel (Auth → Add user)

### Fase 4 — concluída (21/08/2026)

- **/depoimentos** (§5.6): cards com slot de vídeo ("Vídeo em gravação"), destaque, Antes/Com a Sólida, nome/empresa/anos — **dados placeholder em `lib/testimonials.ts`** (campos marcados com [colchetes]; trocar na Fase 5, foto opcional em `/public/assets/depoimentos/`, videoUrl = embed do YouTube). Home `Testimonials` consome o mesmo arquivo + link "Ver todos"; Depoimentos entrou no rodapé (`FOOTER_LINKS` em nav-links; header segue §4.2 sem ele)
- **SEO:** `metadataBase` + OG/Twitter defaults no root layout (imagem hero-sede); `alternates.canonical` em todas as páginas; `app/sitemap.ts` (estáticas + posts publicados via client público) e `app/robots.ts` (disallow /admin,/login); JSON-LD Organization no layout do site + LocalBusiness×3 no /contato (`lib/seo.ts`, componente `components/seo/JsonLd.tsx`); BlogPosting já existia (Fase 3). `NEXT_PUBLIC_SITE_URL` no .env (default www.solidatransporte.com.br)
- **Analytics (LGPD, opt-in):** caminho principal é o **GTM** — `NEXT_PUBLIC_GTM_ID=GTM-MKR53GH3` (já no .env.local; GA4 e Meta Pixel serão configurados DENTRO do container pelo usuário). `components/analytics/Analytics.tsx` só injeta o gtm.js **após aceite** no banner de cookies (que ganhou botão "Só o essencial"). Eventos chegam via **dataLayer**: `page_view` (inclui navegação SPA), `whatsapp_central_open` e `whatsapp_click`. GA4/PIXEL diretos continuam como fallback no .env mas NÃO devem ser preenchidos junto com o GTM (mediria em dobro). Verificado em runtime: sem script antes do aceite; gtm.js + eventos no dataLayer depois
- **Eventos WhatsApp** (`lib/analytics.ts`): `whatsapp_central_open` {source} ao abrir o modal (open(source) no provider; sources: header, header-mobile, menu-mobile, float, hero, cta-final, post, depoimentos, cta) e `whatsapp_click` {subject, option, source, page} em TODO link wa.me — modal, /contato e footer (via `components/whatsapp/WaTrackedLink.tsx`); no Meta também dispara evento padrão `Contact`
- **A11y (AA):** skip link "Pular para o conteúdo" (main#conteudo); focus trap + devolução de foco no modal da Central; Esc + foco gerenciado no drawer do header; `Reveal` ganhou prop `as` (motion.li) e TODAS as listas `ul > Reveal > li` viraram `<Reveal as="li">` (HTML válido — padrão a seguir em listas novas); scroller de depoimentos com tabIndex/aria-label
- **Performance:** fontes com `display: "swap"`; zero `<img>` cru (tudo next/image); analytics não carrega nada sem consentimento; hero já tinha `priority`
- QA: build ok (20 rotas, + /depoimentos /robots.txt /sitemap.xml), console limpo nas 8 páginas públicas, screenshots mobile/tablet/desktop ok. **Medir CWV reais (LCP < 2,5s) após deploy na Vercel** (localhost não representa)

### Fase 5 — dev concluído (21/08/2026)

- **Seed do blog** em `supabase/migrations/0002_seed_posts.sql` (usuário roda no painel): **10 posts migrados** do site antigo como published, com slugs/datas originais (4 vieram da doc `solidatransportedoc/…/04-blog.md`; 6 extraídos do site vivo via WebFetch) + **3 pautas novas do briefing como draft** (frete barato, seguro de carga — com lembrete [REVISAR] no texto p/ confirmar apólice —, fracionada x fechada). CTAs da Bsoft/Hivecloud dos originais removidos; fechos reescritos no tom Sólida. Capas originais copiadas p/ `public/assets/blog/` (4 posts têm; resto usa fallback do PostCard)
- **Redirects 301** no `next.config.ts`: os 10 slugs antigos (raiz do domínio, padrão WordPress) → `/blog/{slug}`, + `/blog/page/:n` → `/blog`. Os 212 posts de 2023–24 do CSV NÃO foram migrados (conteúdo de tema/demonstração e pautas velhas) — sem redirect, viram 404 (decisão consciente)
- **Git/GitHub:** push feito para `github.com/mppartnersprincipal-svg/site-solida-transporte` (PÚBLICO — repo definitivo escolhido pelo usuário; o privado `solida-site` criado antes ficou órfão e pode ser apagado). Branch master; commit único cobre Fases 3–5
- **GOLIVE.md** na raiz do projeto: passo a passo Vercel (import + 4 env vars: SUPABASE_URL/ANON_KEY/SITE_URL/GTM_ID — GA4/PIXEL diretos ficam de fora), apontamento de DNS (CNAME www → cname.vercel-dns.com; A @ → 76.76.21.21), checklist completo de conferência (WhatsApp, blog/admin, SEO, LGPD, GTM, performance, responsivo/a11y) e pós-go-live (Search Console, CWV, funil GA4)
- **Copy com dados validados:** BLOQUEADO no usuário — tabela de pendências no fim do GOLIVE.md (números WhatsApp, seguro, cidades, timeline, CNPJ/DPO, redes, depoimentos). Quando os dados chegarem, atualizar: lib/whatsapp.ts, lib/units.ts, lib/seo.ts, lib/testimonials.ts, /a-empresa (timeline), /politica-de-privacidade, footer/contato (redes)

## Revisão de copy — humanização (23/08/2026)

- Passada completa da skill **humanizer** em toda a copy pública (Home, A Empresa, Como Funciona, Segmentos, Diferenciais, Depoimentos, Footer, SEO description) — 45 trechos reescritos para o tom do ICP B2B (quem toca operação/logística)
- Removidos: regra de três em série ("rapidez, segurança e previsibilidade" repetida 6+ vezes), punchlines fabricadas ("Coleta é compromisso, não promessa"), "transportadora duvidosa" (3×), cadeias de dois-pontos, fragmentos corporativos vagos, CTAs genéricos, "especialista"/"obsessão"
- Mantidos: números concretos (32 anos, 2 a 3 dias úteis, mesmo CNPJ), headlines de marca ("Quem transporta com a Sólida, fica."), estrutura das seções
- Build validado após a revisão

## Fact-check da copy contra o briefing (23/08/2026)

- Toda a copy pública auditada contra as duas fontes: **Anotações IMPORTANTES Brifeing.pdf** (14 págs) e **solidatransportedocumentacaocompleta.md** (auditoria do site antigo)
- **Confirmados pelas fontes:** 32 anos, mesmo CNPJ desde a abertura, seguro de carga (existência), 2–3 dias úteis, não atrasa coleta, rotas SP⇄GO⇄DF (bidirecionais), 9 segmentos, listas evita/não transporta, argumento estoque enxuto, riscos do frete barato, FOB/CIF, fluxo Fabricante→Sólida→Lojista + 3 exemplos, capital/sede/frota próprios (verbatim), +12 agências nos principais polos, fundação 1º/07/1994 em Goiânia, endereços/telefones/e-mails das 3 unidades, todos os números de WhatsApp, rastreamento na frota, armazenagem como serviço
- **12 correções de overclaim** (afirmava mais que as fontes): "toda carga viaja segurada"→"trabalhamos com seguro de carga"; "galpões próprios nas três praças, sem depender de terceiros"→verbatim "capital, sede e frota próprios"; "nenhuma etapa na mão de terceiros" removido; rota inicial inventada na timeline 1994 → data real de fundação; "estamos gravando depoimentos"/"Vídeo em gravação"→"em breve" (gravação ainda não começou); "unidades próprias"→"unidades"; "alta temporada"→"demanda"
- Build validado

## Depoimentos REMOVIDOS (23/08/2026)

- Primeiro a seção foi oculta; depois, a pedido do usuário, foi **removida por completo**: deletados `app/(site)/depoimentos/`, `components/home/Testimonials.tsx`, `components/ui/Testimonial.tsx` (card com foto estilo photo-card, criado no mesmo dia) e `lib/testimonials.ts`; limpos os pontos em Home, FOOTER_LINKS, sitemap e o remotePattern do Unsplash no next.config (usado por depoimentos simulados de apresentação, também descartados)
- **Se voltar:** todo o código está no histórico do git desta data (última versão: cards escuros com foto + depoimentos fictícios para demo). `public/assets/hero-depoimentos.jpg` foi mantido

## Performance mobile ≤3s (23/08/2026)

- **next.config.ts:** `images.formats` (AVIF→WebP), `qualities [60,75]`
  (60 usado nos heros fill sob gradiente: Hero, PageHero, FinalCta),
  `minimumCacheTTL` 31d e `headers()` com `Cache-Control: immutable` p/
  `/assets/*` — **regra: substituiu um asset de public/, renomeie o arquivo**
- SVGs do create-next-app removidos de public/
- **Medições (build prod local):** Lighthouse mobile *simulado* — Home 85+,
  A Empresa 91, Blog 88 (a 1ª medição de cada página sofre com encode AVIF
  frio; na Vercel o edge cacheia). *Throttling real (devtools, Slow 4G+4x
  CPU)* — LCP ~2,4s nas páginas medidas. Meta LCP <2,5s ✅, CLS 0.
  Otimização opcional futura: LazyMotion/m. no framer (9 arquivos,
  ~15-20KB gz) — não foi necessária
- **Intro de vídeo (feita e removida):** uma intro fullscreen de 6,4s chegou a
  ser implementada, testada e commitada junto desta fase, mas o usuário não
  gostou e pediu remoção completa no mesmo dia (commit de remoção logo após o
  e2b3de5). Se voltar ao assunto, o commit e2b3de5 tem a implementação íntegra
  (IntroGate/IntroVideo, vídeos comprimidos, aprendizados de LCP/TBT no corpo
  do commit e na história dessa data)

## Pendências para validar com a Sólida (não bloqueiam dev)

- URL real de LinkedIn (hoje `#`); Instagram ✅ instagram.com/solidatransporte (footer, /contato, JSON-LD); Facebook veio da auditoria
- Confirmar números de WhatsApp por assunto (conferidos contra a auditoria em 23/08 — todos batem com o site antigo; falta confirmar se seguem ativos)
- Confirmar cobertura/apólice do seguro de carga e se a armazenagem está disponível nas 3 praças (copy do split Armazenagem cita Goiânia/Brasília/São Paulo)
- Número/responsável de rastreamento e jurídico (hoje roteados para coleta GO / comercial GO)
- Marcos intermediários da timeline de `/a-empresa` (fundação confirmada pela auditoria: 1º/07/1994; marcos "Expansão/Estrutura/Hoje" seguem narrativos)
- CNPJ e e-mail do encarregado (DPO) na Política de Privacidade + revisão jurídica
- Endereços/telefones das unidades (vieram da auditoria do site antigo; CEP de SP corrigido para 07.177-020)
- Depoimentos reais (gravação), fotos novas da operação, logo vetorial em alta

## Comandos

- `npm run dev` — porta 3000 (cai para 3001 se o outro projeto estiver rodando)
- `npm run build` — validar sempre antes de commitar fase
