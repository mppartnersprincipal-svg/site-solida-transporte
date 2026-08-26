# Trackeamento — GTM + GA4 + Google Ads

Guia passo a passo para medir **tudo** que acontece no site da Sólida
(www.solidatransporte.com.br) usando o container **GTM-MKR53GH3** já instalado.

O site já empurra todos os eventos para o `dataLayer` (código em
`lib/analytics.ts`). O trabalho aqui é só de configuração nas contas Google.

---

## 0. O que o site envia (catálogo de eventos)

| Evento (`dataLayer`) | Quando dispara | Parâmetros | Uso |
|---|---|---|---|
| `page_view` | Todo carregamento e toda troca de rota (SPA) | `page_path`, `page_location`, `page_title` | Pageview do GA4 + remarketing Ads |
| `cookie_consent` | Clique no banner de cookies | `consent_choice` = `accepted` \| `essential` | Taxa de aceite |
| `whatsapp_central_open` | Abriu o modal da Central de WhatsApp | `source` (header, float, hero, cta-final, post…), `page` | Conversão **secundária** Ads |
| `whatsapp_click` | Clique em QUALQUER link wa.me | `subject` (cotacao, coleta, rastreamento, financeiro, outros, unidade), `option` (região/atendente), `source` (modal, footer, contato), `page` | **Conversão principal** Ads + evento-chave GA4 |
| `phone_click` | Clique em `tel:` (/contato) | `phone`, `label` (cidade), `source`, `page` | Conversão Ads (ligação) |
| `email_click` | Clique em `mailto:` | `email`, `source`, `page` | GA4 |
| `social_click` | Instagram / Facebook / LinkedIn | `network`, `source` (footer, contato), `page` | GA4 |
| `maps_click` | "Ver no mapa" de uma unidade | `unit`, `page` | GA4 |
| `blog_post_view` | Abriu um post | `post_slug`, `post_title`, `post_category` | GA4 (conteúdo) |
| `blog_filter` | Filtrou categoria no /blog | `post_category` | GA4 |
| `blog_load_more` | "Carregar mais artigos" | `post_category`, `loaded_count` | GA4 |

Além desses, o container adiciona (sem código): **scroll depth** (25/50/75/90%),
**cliques de saída** (`click_outbound`) e **downloads** (`file_download`).

**LGPD / Consent Mode v2:** nada carrega antes do "Aceitar" no banner. O site
envia `consent default = denied` no primeiro render e `consent update = granted`
antes do gtm.js quando o usuário aceita. Quem clica "Só o essencial" não é
medido (decisão do projeto — sem cookies de medição sem consentimento).

---

## 1. Google Analytics 4

1. [analytics.google.com](https://analytics.google.com) → **Administrador → Criar → Propriedade**
   - Nome: `Sólida Transporte`; fuso `Brasil (GMT-3)`; moeda `BRL`
   - Categoria: Transporte e logística; tamanho: pequena/média
2. **Fluxo de dados → Web** → URL `https://www.solidatransporte.com.br`, nome `Site`
   - **Desative** "Medição aprimorada → Visualizações de página" NÃO é possível; em vez disso a Google tag no GTM já vai com `send_page_view=false` (o site envia o próprio `page_view`, inclusive nas navegações SPA). Deixe o restante da Medição aprimorada ligado (cliques de saída e rolagem já vêm pelo GTM; pode desligar "Rolagem" e "Cliques de saída" na medição aprimorada para não duplicar).
3. Copie o **ID de medição** (`G-XXXXXXXXXX`).
4. **Administrador → Configurações de dados → Coleta de dados** → ativar **Sinais do Google** (remarketing e dados demográficos).
5. **Administrador → Configurações de dados → Retenção** → 14 meses.
6. Depois que os eventos começarem a chegar (24–48h), em **Administrador → Eventos** marque como **Evento-chave** (key event):
   - `whatsapp_click` ✅ (principal)
   - `phone_click` ✅
   - `whatsapp_central_open` (opcional — funil)
7. **Administrador → Definições personalizadas → Dimensões personalizadas** (escopo Evento) — sem isso os parâmetros não aparecem nos relatórios:

   | Nome da dimensão | Parâmetro do evento |
   |---|---|
   | Origem do CTA | `source` |
   | Assunto WhatsApp | `subject` |
   | Opção WhatsApp | `option` |
   | Página do evento | `page` |
   | Escolha de consentimento | `consent_choice` |
   | Telefone | `phone` |
   | Rede social | `network` |
   | Unidade | `unit` |
   | Categoria do post | `post_category` |
   | Slug do post | `post_slug` |
   | Percentual de rolagem | `percent_scrolled` |
   | URL do link | `link_url` |

8. **Administrador → Vinculações do produto → Google Ads** → vincular a conta de Ads (permite importar os eventos-chave como conversões e usar públicos do GA4 no Ads).

---

## 2. Google Ads

1. [ads.google.com](https://ads.google.com) → **Metas → Conversões → Nova ação de conversão → Site** → informe o domínio → **"Adicionar uma ação de conversão manualmente"**. Crie 3 ações:

   | Nome | Categoria | Ação | Valor | Contagem |
   |---|---|---|---|---|
   | WhatsApp – clique | Lead / Contato | **Principal** | (opcional) | Uma por clique |
   | Telefone – clique | Lead / Contato | Principal ou Secundária | — | Uma |
   | WhatsApp – abriu a Central | Visualização de página | **Secundária** (só observação) | — | Uma |

2. Em cada ação → **Configurar a tag → Usar o Google Tag Manager** → anote o
   **ID de conversão** (`AW-XXXXXXXXXX`, o mesmo para as 3) e o **Rótulo de conversão** de cada uma.
3. (Opcional, mas recomendado) **Ferramentas → Gerenciador de público → Suas fontes de dados → Tag do Google Ads** → ativar a coleta de remarketing. O ID é o mesmo `AW-…`.
4. **Ferramentas → Contas vinculadas → Google Analytics (GA4)** → aceitar a vinculação.

---

## 3. Importar o container no GTM

1. [tagmanager.google.com](https://tagmanager.google.com) → container **GTM-MKR53GH3** → **Administrador → Importar container**
2. Arquivo: `gtm/gtm-container-solida.json` (esta pasta)
3. Espaço de trabalho: **Novo** (ex.: "GA4 + Ads") · Opção: **Mesclar → Sobrescrever tags/gatilhos/variáveis conflitantes**
4. Confirme. Você verá **20 tags, 16 gatilhos, 22 variáveis**.
5. Em **Variáveis → Variáveis definidas pelo usuário**, confira as 5 constantes (**já preenchidas no JSON em 26/08/2026** — GA4 `G-TQHKY7G5TL`, Ads `17712344467` (sem o prefixo AW- — o GTM adiciona sozinho) + 3 rótulos; só ajustar se algum ID mudar):

   | Variável | Valor |
   |---|---|
   | `CONST - GA4 Measurement ID` | `G-…` (passo 1.3) |
   | `CONST - Google Ads Conversion ID` | só o número do `AW-…` (passo 2.2), **sem o prefixo AW-** |
   | `CONST - Ads Label - whatsapp_click` | rótulo da ação "WhatsApp – clique" |
   | `CONST - Ads Label - phone_click` | rótulo de "Telefone – clique" |
   | `CONST - Ads Label - whatsapp_central_open` | rótulo de "WhatsApp – abriu a Central" |

6. Se já existir alguma tag GA4/Ads criada à mão no container, **pause ou apague** para não medir em dobro (o import não remove nada que já existia).

### O que vem no container

- **Google Tag – GA4** (Inicialização, `send_page_view=false`) + **GA4 – page_view** no evento `page_view` do site
- 1 tag GA4 por evento do catálogo + `scroll_depth`, `click_outbound`, `file_download`
- **Ads – Conversion Linker** (Inicialização) e **Ads – Remarketing** (todo `page_view`)
- **3 tags de conversão Ads**: WhatsApp click (principal), Phone click, Central open

---

## 4. Testar (antes de publicar)

1. No GTM → **Visualizar** → URL `https://www.solidatransporte.com.br` → conectar (Tag Assistant).
2. Na aba do site: **aceite os cookies** (sem isso o GTM nem carrega — correto).
3. Confira no Tag Assistant:
   - evento `page_view` → disparou "Google Tag – GA4", "GA4 – page_view", "Ads – Remarketing"
   - navegue para /contato pelo menu → novo `page_view` (SPA)
   - clique no botão flutuante → `whatsapp_central_open` → tag GA4 + conversão Ads secundária
   - escolha "Quero fazer uma cotação → Goiânia" → `whatsapp_click` com `subject=cotacao`, `option=Goiânia e região (Luana)`, `source=modal` → tag GA4 + **conversão Ads principal**
   - em /contato clique no telefone → `phone_click`
   - role a Home → `scroll_depth` 25/50/75/90
   - Aba **Consent** do Tag Assistant: `analytics_storage` / `ad_storage` = **Granted** após o aceite
4. GA4 → **Relatórios → Tempo real** (ou Administrador → DebugView) deve mostrar os eventos.
5. Tudo ok → **Enviar → Publicar** o container.
6. Google Ads → Conversões: o status sai de "Inativo" para "Sem conversões recentes" e depois "Registrando conversões" após os primeiros cliques reais (pode levar até 24h).

---

## 5. Relatórios úteis no GA4 (depois de 1 semana)

- **Funil de WhatsApp** (Explorar → Funil): `page_view` → `whatsapp_central_open` → `whatsapp_click`, com detalhamento por `source` → mostra qual CTA converte mais.
- **Assunto mais pedido**: evento `whatsapp_click` × dimensão `subject` / `option`.
- **Aquisição → Aquisição de tráfego** com o evento-chave `whatsapp_click` → qual canal (Google Ads, orgânico, Instagram) traz contato.
- **Engajamento → Páginas** + `blog_post_view` × `post_category` → conteúdo que mais engaja.
- **Rolagem**: `scroll_depth` por `page_path` → onde as pessoas param de ler.

---

## Regenerar o JSON

O arquivo é gerado por `gtm/gen-container.mjs` (não editar o JSON à mão):

```
node gtm/gen-container.mjs gtm/gtm-container-solida.json
```
