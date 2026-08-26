@AGENTS.md

# Site Sólida Transporte — Contexto do Projeto

> **Regra de trabalho:** ao completar cada fase do roadmap, atualizar este arquivo
> com um resumo do que foi feito antes de iniciar a fase seguinte.

## O que é

Novo site institucional da **Sólida Transporte** — transportadora especializada em
cargas fracionadas entre São Paulo, Goiás, Distrito Federal e a **cidade** do Rio de Janeiro (32 anos de mercado).
**A Sólida NÃO faz armazenagem** — é só transportadora; o galpão é apenas ponto de chegada e despacho.
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
- **Prazo de entrega (regra do cliente, 26/08/2026):** 2 a 3 dias úteis = capital e região metropolitana; interior = 3 a 4 dias úteis após a coleta (alguns interiores têm prazo maior). Toda copy nova deve seguir isso — nunca citar "2 a 3 dias" sem a qualificação
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
components/home/    12 seções da Home (inclui OperationGallery, mosaico de fotos reais; a seção Solutions Armazenagem/Transporte foi REMOVIDA em 25/08/2026)
lib/whatsapp.ts     números e assuntos da Central de WhatsApp (§6.2 do plano)
lib/supabase/       client.ts (browser), server.ts (RSC/actions), public.ts (ISR), proxy.ts (sessão), admin.ts (SERVICE ROLE, server-only)
lib/tracker.ts      coletor first-party anônimo (browser) → POST /api/collect
lib/attribution.ts  classifyChannel(): google_ads / google_organic / other_search / social / referral / direct
app/api/collect/    Route Handler que grava analytics_sessions/analytics_events (service role)
app/(admin)/dashboard/  painel de comportamento dos visitantes (Fases D1–D4)
proxy.ts            protege /admin/* e /dashboard/*, redireciona /login → /dashboard (convenção Next 16)
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
| 5 | Conteúdo e go-live (posts, redirects 301, domínio) | ✅ concluída — **site no ar em 25/08/2026** |
| D1 | Dashboard: schema Supabase + ingestão `/api/collect` + coletor first-party | ✅ concluída (26/08/2026) — **aguarda migration 0003 + service role key** |
| D2 | Dashboard: shell (abas Posts/Dashboard), filtros, KPIs, gráficos principais | ✅ concluída (26/08/2026) |
| D3 | Dashboard: botões nomeados, jornadas, heatmap, geografia, campanhas, blog, funil, ao vivo | ⏳ aguardando "ok" |
| D4 | Dashboard: QA, performance, políticas LGPD, docs, deploy | ⏳ |

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

- **7 páginas** com a copy das §5.2–5.8: `/a-empresa` (missão, selos, foto, timeline 1994→hoje), `/como-funciona` (fluxo Fabricante→Sólida→Lojista, 4 passos, destaque 2–3 dias, FOB x CIF), `/segmentos` (9 cards dor/solução; bloco "o que não transportamos" removido em 2026-08-25), `/diferenciais` (8 numerados + PriceValue reutilizado), `/contato` (Central inline com 6 assuntos incl. Jurídico, unidades reais com endereço/tel/e-mail/mapa embed da matriz, redes), `/politica-de-privacidade` e `/politica-de-cookies` (LGPD, corrige o 404 do site antigo)
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

### Go-live — concluído (25/08/2026)

- **Produção:** `https://www.solidatransporte.com.br` na Vercel (projeto `site-solida-transporte`, repo GitHub público de mesmo nome; raiz → 308 para www). Env vars na Vercel: SUPABASE_URL, SUPABASE_ANON_KEY, SITE_URL, GTM_ID (GA4/PIXEL diretos NÃO cadastrados — entram pelo GTM)
- **DNS na KingHost** (zona do `.com.br`; nameservers e e-mail continuam lá — NÃO trocar NS): A `@` → 216.198.79.1; AAAA `@` removido; CNAME `www` → 7f6902d9908dc9b9.vercel-dns-017.com; TXT `@` google-site-verification adicionado. MX/SPF/DKIM/DMARC e subdomínios (mail, smtp, imap, webmail, cotacao, mysql…) intocados
- `solidatransporte.com` (sem .br) é outro domínio, no HostGator, suspenso — não usado
- **Supabase:** migrations 0001 e 0002 rodadas (blog com 10 posts públicos no sitemap)
- **Search Console:** propriedade de Domínio `solidatransporte.com.br` verificada por TXT; `sitemap.xml` enviado com sucesso (19 URLs). Os 16 sitemaps Yoast do site antigo (404 hoje) devem ser removidos do painel; ~212 posts/tags/categorias antigos viram 404 (decisão consciente)
- **Ainda pendente (usuário):** configurar GA4 + Meta Pixel dentro do GTM-MKR53GH3; PageSpeed na URL real; testar e-mail @solidatransporte.com.br após a troca de DNS; avaliar despublicar o post "case-de-sucesso-…bsoft-tms…" (case de terceiro migrado); dados a validar com a Sólida (LinkedIn `#`, CNPJ/DPO, seguro, timeline, WhatsApp)

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
- **Se voltar:** a rota `/depoimentos`, a seção da Home e `lib/testimonials.ts` (placeholders) estão no histórico do git (versões pré-remoção, commit db369b4^). Já o card com foto (`components/ui/Testimonial.tsx`) e os depoimentos simulados NUNCA foram commitados — existiram só na working tree de 23/08; recriar se necessário. `public/assets/hero-depoimentos.jpg` foi mantido

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

### Trackeamento GTM + GA4 + Google Ads — 26/08/2026

- **Guia completo em `gtm/TRACKING.md`** (criar propriedade GA4, ações de conversão no Ads, importar container, testar, publicar). Container importável em `gtm/gtm-container-solida.json`, gerado por `gtm/gen-container.mjs` (20 tags, 16 gatilhos, 22 variáveis — **não editar o JSON à mão**, regenerar). Após importar, o usuário preenche 5 constantes `CONST - *` (ID GA4, ID Ads e 3 rótulos de conversão)
- **Catálogo de eventos do dataLayer** documentado no topo de `lib/analytics.ts`: `page_view` (com `page_title`), `cookie_consent`, `whatsapp_central_open`, `whatsapp_click` (conversão principal), `phone_click` (conversão secundária), `email_click`, `social_click`, `maps_click`, `blog_post_view`, `blog_filter`, `blog_load_more`. Scroll/outbound/download vêm de gatilhos nativos do GTM
- **Consent Mode v2** (`pushConsent` em `lib/analytics.ts`): `default=denied` no mount do `Analytics`, `update=granted` antes do gtm.js quando há aceite. Push é um objeto `arguments` (helper `toArguments`) — GTM não reconhece consent como objeto simples. Regra mantida: nada carrega sem aceite
- **Google Tag no GTM usa `send_page_view=false`** — o site envia o próprio `page_view` (load + SPA). Se alguém criar uma tag GA4 à mão com pageview automático, mede em dobro
- Novos componentes: `components/analytics/TrackedLink.tsx` (tel/mailto/social/maps — prop `track={{kind,...}}`) e `PostViewTracker.tsx` (dispara `blog_post_view` no post). Usados em /contato, Footer, políticas e `/blog/[slug]`. Links de WhatsApp continuam com `WaTrackedLink`
- **Padrão para novos links:** wa.me → `WaTrackedLink`; tel/mailto/rede/mapa → `TrackedLink`; ação nova → adicionar função em `lib/analytics.ts`, linha no catálogo, gatilho+tag no `gen-container.mjs` e linha na tabela do `TRACKING.md`
- **Configuração nas contas Google — CONCLUÍDA e publicada em 26/08/2026:**
  - GA4: propriedade nova `Sólida Transporte` (ID 551826887, stream `G-TQHKY7G5TL`), vinculada à conta Ads. Eventos principais marcados: `whatsapp_click`, `phone_click`, `whatsapp_central_open`. 9 dimensões personalizadas (escopo evento): source, subject, option, page, post_category, network, unit, percent_scrolled, consent_choice
  - Google Ads: conta antiga reaproveitada (`339-219-3354`, conversion ID `17712344467` — **sem prefixo AW- no GTM**, ele adiciona sozinho). 3 ações de conversão criadas (rótulos no `gen-container.mjs`)
  - **Armadilha resolvida:** o `AW-17712344467` estava COMBINADO na "Tag do Google" do site antigo (`G-HJNXDMQD09`, propriedades "Site de São Paulo"/"Site DF e GO"), então o site novo mandava dados para os GA4 antigos. Foi separado numa tag própria **"Google Ads – Sólida" (`GT-MQDT5BXQ`)** com destino Ads. Tag Assistant deve mostrar `GTM-MKR53GH3 | G-TQHKY7G5TL | GT-MQDT5BXQ` — se voltar a aparecer `G-HJNXDMQD09`, a combinação voltou
  - Container GTM publicado (versão "GA4 + Google Ads"). Validado no Tag Assistant: page_view (load + SPA), consent default→update, whatsapp_central_open, whatsapp_click, phone_click, scroll_depth, remarketing, conversion linker e as 3 conversões Ads
  - Decisão: números de telefone do rodapé continuam abrindo WhatsApp (`whatsapp_click` subject=unidade source=footer); `tel:` real só em /contato

### Pós-go-live: Search Console + redirects por tráfego real — 26/08/2026

- Search Console já verificado (propriedade de domínio), sitemap enviado, home indexada. Site antigo deixou ~1.060 URLs indexadas que vão cair como 404 (esperado)
- **Export de Desempenho (3 meses) em `../solidatransporte.com.br-Performance-on-Search-2026-08-26/` (raiz do projeto, FORA do repo público)** (466 URLs, 2.432 cliques — 87% são busca de marca "solida transportes"). Cruzamento com o site novo revelou 404 em páginas com tráfego → `next.config.ts` ganhou `LEGACY_PAGES` (rastreamento 604 cliques → `/contato#rastreamento`, cotação, coleta, fatura → âncoras da Central; os cards de /contato têm `id={subject.id}` + `scroll-mt-28`) e `LEGACY_POST_SLUGS` (26 posts antigos com ≥3 cliques → `/blog`)
- **Posts antigos com tráfego: NÃO remigrar (decisão do usuário, 26/08/2026).** Ficam com o redirect para `/blog`. Não voltar a propor
- **Histórico do git reescrito em 26/08/2026** (`git filter-repo`, force-push autorizado pelo usuário) para apagar o export do Search Console que tinha entrado por engano no repo público. Regra: exports/dados do cliente ficam na raiz do projeto, fora de `solida-site/` (`.gitignore` cobre `*Performance-on-Search*`)
- **Decisões do usuário sobre pendências (26/08/2026):** Meta Pixel será criado e adicionado no GTM pelo próprio usuário; LinkedIn, CNPJ/DPO, depoimentos reais e timeline NÃO serão adicionados; **único dado que ainda entra: número de WhatsApp do RJ** (usuário vai fornecer) → aplicar em `lib/whatsapp.ts` (opção RJ em cotação/coleta) e revisar footer/contato
- **PageSpeed real (26/08/2026, mobile, Moto G Power emulado):** Desempenho 95, A11y 96, Práticas 100, SEO 100 — FCP 1,0s, **LCP 2,6s** (0,1s acima da meta; é a foto do hero), TBT 60ms, CLS 0,073. Decisão: não otimizar agora; reavaliar com dado de campo (CrUX) no Search Console → Core Web Vitals em ~28 dias. Se o LCP de campo ficar ruim, pré-carregar variante menor do hero (`sizes` mais justo)

## Dashboard `/dashboard` — comportamento dos visitantes (plano aprovado 26/08/2026)

**Decisões do usuário:** coleta **first-party no Supabase** (GTM/GA4/Ads intocados); coleta **sempre ativa e anônima** (sem cookie, sem IP, sem ID persistente — só `sessionStorage`, renova após 30 min parado); **sem** API de custo do Ads (pago × orgânico vem de gclid/utm/referrer); `/dashboard` usa o **mesmo login** do `/admin`. Requisito reforçado: **todo clique com o NOME do botão e de onde veio** (ex.: "Google Ads · campanha X → Home → Central aberta (flutuante) → Pedir cotação › Goiânia") — seções "Botões da Central" e "Jornadas" na D3. Gráficos: Recharts (entra na D2).

**UTMs do Google Ads — decisão do usuário (26/08/2026):** as campanhas ainda NÃO existem. O usuário **não quer** sufixo/modelo de acompanhamento na conta inteira; prefere **UTM manual por grupo de anúncios/anúncio**. Fluxo combinado: quando for criar as campanhas, ele passa os nomes reais de cada campanha/grupo e a IA **gera as URLs finais com UTM** para ele colar. Padrão a usar: `utm_source=google&utm_medium=cpc&utm_campaign=<campanha>&utm_content=<grupo-ou-anuncio>&utm_term={keyword}` (slug sem acento/espaço — é assim que aparece no dashboard); marcação automática (gclid) fica ligada. O coletor identifica Ads pelo `gclid` mesmo sem UTM; as UTMs só dão nome à campanha/grupo. **Não voltar a propor sufixo de conta.**

### Fase D1 — concluída (26/08/2026)

- **Migration `supabase/migrations/0003_analytics.sql`** (usuário roda no SQL Editor): `analytics_sessions` (id gerado no browser, landing, referrer_host, `channel`, utm_*, has_gclid, device/browser/os, country/region/city dos headers da Vercel, tela, contadores, `converted`) + `analytics_events` (session_id, ts, name, path, title, `params jsonb`); trigger `analytics_bump_session` mantém contadores; RLS: `select` só `authenticated`, **sem** policy de escrita (só service role grava). **17 funções** `analytics_*` (kpis, daily, heatmap, by_channel, by_device, top_pages, geo, campaigns, whatsapp, phone, clicks, blog, funnel, buttons, journeys, recent, purge) — execute só p/ `authenticated`/`service_role`; datas em America/Sao_Paulo. Retenção: `analytics_purge(13)` (pg_cron opcional, comentado no fim do SQL)
- **`app/api/collect/route.ts`** (nodejs): body `text/plain` `{v, sid, s?, e[]}` via sendBeacon; valida tamanho/nomes, descarta bots (regex + `userAgent().isBot`), rate limit em memória por sid e por hash de IP (nunca gravado), geo de `x-vercel-ip-*`, device/browser/os via `userAgent()` do `next/server` (só famílias), `classifyChannel()` de `lib/attribution.ts`; responde 204 e grava em `after()` com `lib/supabase/admin.ts` (service role). Sem `SUPABASE_SERVICE_ROLE_KEY` → 204 sem gravar. Se o 1º lote da sessão se perdeu (FK 23503), cria sessão-esqueleto `direct` e regrava
- **`lib/tracker.ts`** + **`components/analytics/Collector.tsx`** (montado em `app/(site)/layout.tsx`, nunca no `(admin)`): não roda em /admin, /dashboard, /login, /api, `navigator.webdriver` ou UA de bot; fila com flush em 10 eventos / 5 s / `visibilitychange→hidden` / `pagehide`; eventos: `page_view` {sw, sh, ref_host}, `page_leave` {duration_ms = tempo VISÍVEL, max_scroll_pct}, `click` em `a,button,[role=button],[data-track],input[type=submit],summary` {tag, text≤80, href (interno path+hash / externo host / "wa.me" / tel: / mailto:), track = data-track ?? id ?? aria-label, section, x_pct, y_pct}
- **`lib/analytics.ts`:** `pushDataLayer()` agora também chama `collect()` para todo evento exceto `page_view` → whatsapp_central_open, whatsapp_click, phone_click, email/social/maps_click, blog_* e cookie_consent chegam no Supabase sem mudar os call sites. GTM continua condicionado ao consentimento
- **Auth/rotas:** `proxy.ts` matcher inclui `/dashboard/:path*`; `lib/supabase/proxy.ts` protege `/dashboard` e manda `/login` logado → `/dashboard`; `LoginForm` idem; `robots.ts` disallow `/dashboard` e `/api/`. Placeholder `app/(admin)/dashboard/page.tsx` ("em construção") até a D2
- Dep nova: `server-only`. Docs: `.env.example` (`SUPABASE_SERVICE_ROLE_KEY`), `GOLIVE.md` (5ª env var na Vercel), `gtm/TRACKING.md` (nota: container não muda)
- **QA:** tsc ok, lint só com os 5 avisos pré-existentes, build ok (31 rotas, blog segue ISR, `/api/collect` ƒ). Smoke em `next start`: 204 lote válido, 204 bot, 400 body inválido, `/dashboard` → 307 `/login`. **Playwright (Chromium, UA Android, `navigator.webdriver` mascarado):** lote com `s` {gclid:true, utm campanha/termo}, `page_view`, `click` "Falar no WhatsApp", `whatsapp_central_open`, `click` no assunto, `whatsapp_click` {unidade/Goiânia - GO/footer}, `page_leave` {3035 ms, 93 %}. Lembrete p/ testes headless: o coletor se desliga com `navigator.webdriver=true` (proteção contra bots) — mascarar no `addInitScript`
- **Migration 0003 APLICADA em produção em 26/08/2026 pelo conector Supabase (MCP)** — o conector agora está autorizado na conta dona do projeto `khipnjfbxjgvmjvyxero` (antes apontava para outra org). Validado com transação de teste (rollback): trigger, kpis, buttons, funnel, journeys ok. Hardening extra (também no arquivo): `analytics_bump_session` e `analytics_purge` **não** executáveis por `authenticated` (purge só `service_role` → o botão de limpeza da D2 deve usar `createAdminClient()`); `set_updated_at` da 0001 recebeu o mesmo revoke. Advisor restante (pré-existente, fora do escopo): "Leaked password protection" desativado no Auth
- **Pendente do usuário:** copiar a `service_role` key para `SUPABASE_SERVICE_ROLE_KEY` no `.env.local` e na Vercel (Production + Preview) — nenhum conector expõe chaves secretas. Sem isso o site funciona igual, só não grava

### Fase D2 — concluída (26/08/2026)

- **D1 em produção:** push feito, deploy validado — sessão real gravada com geo da Vercel (BR/GO/Goiânia), depois apagada. `SUPABASE_SERVICE_ROLE_KEY` cadastrada na Vercel (Production + Preview) pelo usuário
- **Shell:** `components/admin/AdminShell.tsx` (header escuro + abas **Dashboard**/`/dashboard` e **Posts**/`/admin` + Ver site + e-mail + Sair) usado por `app/(admin)/admin/layout.tsx` e `app/(admin)/dashboard/layout.tsx` (`wide` = max-w-7xl)
- **Dados:** `lib/analytics-queries.ts` (server-only; `getRange(searchParams)` → período `hoje|7d|30d|90d|custom` + `origem`, meia-noite de Brasília = UTC-3 fixo; `previousRange()` p/ deltas; wrappers `getKpis/getDaily/getByChannel/getByDevice/getTopPages/getGeo/getCampaigns/getWhatsApp/getPhone/getClicks/getBlog/getFunnel/getButtons/getJourneys/getRecent` via `supabase.rpc`, retornam `[]` + `console.error` em falha) e `lib/analytics-types.ts` (tipos das linhas + rótulos pt-BR: `CHANNEL_LABELS`, `DEVICE_LABELS`, `SUBJECT_LABELS` (de `WA_SUBJECTS`), `SOURCE_LABELS`, `EVENT_LABELS`, `FUNNEL_LABELS`, `PAGE_LABELS` + `fmtInt/fmtPct/fmtDuration/fmtDateTime/fmtDay`)
- **UI (`components/dashboard/`):** `DashboardFilters` (client; chips de período + datas custom + select de origem → `router.replace` com `useTransition`; estado na URL `?periodo=&de=&ate=&origem=`), `KpiCard` (count-up com framer `animate`, delta vs período anterior, respeita reduced-motion — sem setState síncrono em effect), `KpiGrid` (**client**, porque passa ícones lucide ao KpiCard — RSC não aceita função como prop), `ChartCard` (Reveal + título/descrição), `DataTable` + `InlineBar`, `EmptyState`, `Skeleton/CardSkeleton/KpiSkeleton`; gráficos em `charts/`: `DailyAreaChart` (ComposedChart: área sessões + linha wa_clicks eixo direito), `DonutChart` (total no centro, legenda com %, tabela `sr-only`; **container query `@lg`** — em card estreito a legenda vai para baixo), `HorizontalBars` (ranking), `chartTheme.ts` (hex dos tokens; `CHANNEL_COLORS`/`DEVICE_COLORS` fixos)
- **Página `/dashboard`** (`force-dynamic`, `await searchParams`, `Promise.all` de 8 rpcs): filtros → 7 KPIs → Visitas por dia (2/3) + Origem (1/3; **ignora o filtro de origem**, avisado na descrição) → Dispositivo · WhatsApp por assunto · Telefone por unidade (3 donuts) → Páginas mais vistas (barras) + tabela tempo/scroll por página. `loading.tsx` com skeletons
- Dep nova: `recharts` 3.10. `/login` logado agora cai no `/dashboard`
- **QA:** tsc/lint limpos (só o aviso antigo do LoginForm); build ok. Playwright com usuário temporário de QA (criado e apagado via `auth.admin` com a service role) e **seed sintético de 220 sessões/865 eventos marcado `utm_content='qa-seed'` (apagado ao final — banco voltou a 0)**: login → `/dashboard`, filtros mudam a URL sem reload (`?periodo=7d&origem=google_ads`), donuts/barras/tabela ok, aba Posts ok, mobile ok, zero erros de console. Para repetir: reutilizar o SQL de seed (no histórico desta data) e o script `qa-user.cjs`. Lembrete: screenshots full-page em headless não mostram seções abaixo da dobra (Reveal/whileInView) — rolar antes de capturar

## Pendências para validar com a Sólida (não bloqueiam dev)

- URL real de LinkedIn (hoje `#`); Instagram ✅ instagram.com/solidatransporte (footer, /contato, JSON-LD); Facebook veio da auditoria
- Confirmar números de WhatsApp por assunto (conferidos contra a auditoria em 23/08 — todos batem com o site antigo; falta confirmar se seguem ativos)
- Confirmar cobertura/apólice do seguro de carga e se a armazenagem está disponível nas 3 praças (copy do split Armazenagem cita Goiânia/Brasília/São Paulo)
- Número/responsável de jurídico (hoje roteado para comercial GO). Rastreamento confirmado em 26/08/2026: Luana (62) 3206-3513
- Marcos intermediários da timeline de `/a-empresa` (fundação confirmada pela auditoria: 1º/07/1994; marcos "Expansão/Estrutura/Hoje" seguem narrativos)
- CNPJ e e-mail do encarregado (DPO) na Política de Privacidade + revisão jurídica
- Endereços/telefones das unidades (vieram da auditoria do site antigo; CEP de SP corrigido para 07.177-020)
- Depoimentos reais (gravação), fotos novas da operação, logo vetorial em alta

## Comandos

- `npm run dev` — porta 3000 (cai para 3001 se o outro projeto estiver rodando)
- `npm run build` — validar sempre antes de commitar fase

### Ajustes de conteúdo — 25/08/2026

- **Sem armazenagem:** seção `Solutions` (cards Armazenagem/Transporte) removida da Home e arquivo deletado. Galpão descrito apenas como ponto de chegada e despacho (OperationGallery, CompanyCarousel).
- **Cobertura:** cidade do Rio de Janeiro (só a capital) incluída em Hero, RoutesSection (nó RJ), Pillars, HowItWorks, FinalCta, Footer, `lib/seo.ts`, títulos em `app/layout.tsx`, A Empresa, Como Funciona, Segmentos, Privacidade e CTA do blog.
- **Pendente validar com a Sólida:** qual número da Central de WhatsApp atende cotação/coleta no RJ (`lib/whatsapp.ts` continua só com GO/DF/SP).
