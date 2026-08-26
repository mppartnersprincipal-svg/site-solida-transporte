# 🚀 Go-live — Sólida Transporte

Checklist final para publicar o site. Ordem sugerida: **1 → 5**.
Marque cada item antes de apontar o domínio.

---

## 1. Supabase (antes do deploy)

- [ ] Rodar `supabase/migrations/0002_seed_posts.sql` no SQL Editor
      → cria os **10 posts migrados** (publicados) e as **3 pautas novas** (rascunhos)
- [ ] Conferir em `/admin`: 10 publicados + 3 rascunhos listados
- [ ] Revisar os 3 rascunhos no editor e publicar quando aprovar
      (⚠ o rascunho "Sua transportadora possui seguro de carga?" tem um lembrete
      no fim do texto para confirmar a cobertura da apólice antes de publicar)

## 2. Deploy na Vercel (passo a passo)

1. Acesse [vercel.com/new](https://vercel.com/new) logado com a conta que tem acesso
   ao GitHub `mppartnersprincipal-svg`
2. **Import** → selecione o repositório **`site-solida-transporte`** (autorize o
   acesso da Vercel ao GitHub se for a primeira vez)
3. Framework: a Vercel detecta **Next.js** sozinha — não mude nada de build
4. Em **Environment Variables**, cadastre (valores no `.env.local`):

   | Variável | Valor |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://khipnjfbxjgvmjvyxero.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (chave pública do painel Supabase) |
   | `NEXT_PUBLIC_SITE_URL` | `https://www.solidatransporte.com.br` |
   | `NEXT_PUBLIC_GTM_ID` | `GTM-MKR53GH3` |
   | `SUPABASE_SERVICE_ROLE_KEY` | (Supabase → Project Settings → API Keys → `service_role`) — **sem** `NEXT_PUBLIC_`; alimenta o `/dashboard` (coleta first-party). Exige a migration `supabase/migrations/0003_analytics.sql` rodada no SQL Editor |

   (deixe `NEXT_PUBLIC_GA4_ID` e `NEXT_PUBLIC_META_PIXEL_ID` **sem cadastrar** —
   GA4 e Pixel entram pelo GTM; cadastrá-los mediria em dobro)
5. **Deploy** → aguarde o build → teste tudo na URL `*.vercel.app` (checklist §4)

## 3. Apontar o domínio

1. Na Vercel: **Project → Settings → Domains** → adicione
   `solidatransporte.com.br` **e** `www.solidatransporte.com.br`
   (defina o `www` como principal — o outro redireciona sozinho)
2. No painel do registrador do domínio (onde o domínio foi comprado):
   - `www` → registro **CNAME** apontando para `cname.vercel-dns.com`
   - raiz (`@`) → registro **A** apontando para `76.76.21.21`
   (a tela da Vercel mostra exatamente esses valores — copie de lá em caso de dúvida)
3. Aguarde a propagação (minutos a algumas horas). A Vercel emite o
   **HTTPS/SSL automaticamente** quando o DNS propagar
4. ⚠ **Só troque o DNS depois de validar o checklist §4 na URL de preview** —
   enquanto o DNS antigo estiver ativo, o site atual continua no ar (zero downtime)

## 4. Checklist de conferência (na URL de preview, antes do DNS)

### Funcional / WhatsApp (conversão)
- [ ] Central de WhatsApp abre pelo header, botão flutuante, hero e CTA final
- [ ] Cada assunto abre o **número certo** com a mensagem pré-preenchida
      (⚠ validar os números com a Sólida — vieram do site antigo, §6.2 do plano)
- [ ] Página /contato: links por assunto e por unidade funcionam
- [ ] Botão flutuante visível em todas as páginas (desktop e mobile)

### Blog + Admin
- [ ] `/blog` lista os 10 posts, filtro por categoria e "Carregar mais" funcionam
- [ ] Abrir 2–3 posts: capa, conteúdo, CTA de WhatsApp e "Continue lendo" ok
- [ ] `/login` → entrar → criar post de teste → publicar → aparece no `/blog`
      em segundos → excluir o teste
- [ ] `/admin` inacessível sem login (redireciona para `/login`)

### SEO
- [ ] `https://…/sitemap.xml` responde e lista páginas + posts
- [ ] `https://…/robots.txt` responde (bloqueando /admin e /login)
- [ ] Compartilhar a home no WhatsApp → aparece título + imagem (Open Graph)
- [ ] Redirects 301: acessar `https://…/consulta-mdfe-como-fazer-de-forma-simples`
      → deve cair em `/blog/consulta-mdfe-como-fazer-de-forma-simples`
- [ ] Título e descrição corretos nas páginas principais (aba do navegador)

### LGPD
- [ ] Banner de cookies aparece na primeira visita, com "Aceitar" e "Só o essencial"
- [ ] `/politica-de-privacidade` e `/politica-de-cookies` no ar
      (⚠ pendente: CNPJ e e-mail do encarregado/DPO no texto — validar com a Sólida)
- [ ] **Nenhum** script de analytics carrega antes do aceite
      (F12 → Network → filtrar "googletagmanager" → só aparece após aceitar)

### Analytics (GTM)
- [ ] No GTM (`GTM-MKR53GH3`): tag GA4 + tag Meta Pixel configuradas e publicadas
- [ ] Acionador de evento personalizado **`whatsapp_click`** ligado às duas tags
      (variáveis de camada de dados: `subject`, `option`, `source`, `page`)
- [ ] Testar no modo Preview do GTM (lembrete: aceitar os cookies primeiro,
      senão o container não carrega) — clicar num link de WhatsApp e ver o
      evento chegar
- [ ] GA4 em tempo real mostrando visitas após o deploy

### Dashboard first-party (`/dashboard`)

- [ ] `SUPABASE_SERVICE_ROLE_KEY` cadastrada na Vercel (Production + Preview) e
      migrations `0003_analytics.sql` + `0004_analytics_visitors.sql` aplicadas
- [ ] Abrir o site num celular, clicar num botão da Central → em até 30 s o
      evento aparece em **Dashboard → Ao vivo** com cidade preenchida
- [ ] `/dashboard` sem login → redireciona para `/login`; após login cai no
      `/dashboard`; aba **Posts** continua abrindo o blog
- [ ] Filtros (período/origem) mudam a URL; "Jornadas" mostra a trilha do clique
- [ ] Banner "Só o essencial" → sessão continua contando, mas sem
      "já visitou antes" (sem `solida-v` no localStorage)
- [ ] Ao subir campanhas no Google Ads: pedir as UTMs geradas por grupo/anúncio
      (ver `CLAUDE.md` → "UTMs do Google Ads") e conferir a seção **Campanhas**

### Performance
- [ ] [PageSpeed Insights](https://pagespeed.web.dev) na URL de produção:
      meta **LCP < 2,5 s** no mobile (medir DEPOIS do deploy — localhost não vale)
- [ ] Imagens carregando em WebP/AVIF (next/image cuida disso)

### Responsivo / Acessibilidade
- [ ] Testar no celular real: menu drawer, WhatsApp sempre acessível, tabelas
      e cards sem estouro horizontal
- [ ] Navegação por teclado: Tab percorre o menu, "Pular para o conteúdo"
      aparece no primeiro Tab, modal fecha com Esc
- [ ] Zoom do navegador a 200% sem quebrar o layout

## 5. Pós-go-live (primeira semana)

- [x] Cadastrar o site no **Google Search Console** (propriedade de domínio)
      e enviar o `sitemap.xml` — feito 25/08/2026
- [ ] Conferir no Search Console se os redirects 301 estão sendo seguidos
- [ ] Medir Core Web Vitals reais no PageSpeed depois de 1–2 dias de cache
- [ ] Acompanhar o funil no GA4: `whatsapp_central_open` → `whatsapp_click`
      (qual assunto/origem converte mais)
- [ ] Publicar os 3 rascunhos revisados (1 por semana mantém o blog "vivo")

---

## ⚠ Copy pendente de validação com a Sólida (seção 12 do plano)

Itens já sinalizados no site que dependem de confirmação do cliente —
**me passe os dados validados que eu atualizo a copy**:

| Item | Onde está no site |
|---|---|
| Números de WhatsApp por assunto | Central (modal, /contato, footer) — vieram do site antigo |
| Número/responsável de jurídico | Hoje roteado p/ comercial GO (rastreamento confirmado: Luana, 62 3206-3513) |
| Cobertura do seguro de carga (RCTR-C/RCF-DC, limites) | Home, Diferenciais + rascunho do blog |
| Cidades atendidas em GO/DF e regiões de SP | Seção de rotas (Home, Como Funciona) |
| Marcos reais da história (timeline 1994→hoje) | /a-empresa |
| CNPJ + e-mail do encarregado (DPO) | /politica-de-privacidade |
| Endereços/telefones das unidades | /contato, footer, JSON-LD LocalBusiness |
| URL do LinkedIn | Footer e /contato (hoje `#`; Instagram ✅ já configurado) |
| Depoimentos reais (gravações) | lib/testimonials.ts (placeholders marcados) |
