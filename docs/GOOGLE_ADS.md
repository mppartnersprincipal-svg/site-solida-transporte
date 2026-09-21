# Google Ads no dashboard

A seção **Google Ads** de `/dashboard` consulta a API oficial e mostra investimento,
impressões, cliques, CTR, CPC médio, conversões, custo por conversão e desempenho
por campanha. Usa o mesmo login administrativo do site.

## Configurar a conexão

1. No [Centro de API do Google Ads](https://developers.google.com/google-ads/api/docs/get-started/dev-token),
   obtenha um **developer token** autorizado a consultar a conta de produção.
2. Configure um cliente OAuth no Google Cloud seguindo o
   [guia oficial](https://developers.google.com/google-ads/api/docs/oauth/overview).
   Autorize uma conta Google que tenha acesso à conta anunciante, com o escopo
   `https://www.googleapis.com/auth/adwords` e acesso offline para obter um **refresh token**.
   O [guia do OAuth Playground](https://developers.google.com/google-ads/api/docs/oauth/playground)
   explica como gerar esse token usando seu próprio client ID e client secret.
3. Preencha as variáveis abaixo em `.env.local` para desenvolvimento e nas variáveis
   de ambiente do projeto Vercel para produção. Reinicie o servidor local ou faça
   um novo deploy depois de salvar as variáveis na Vercel.

| Variável | Valor |
| --- | --- |
| `GOOGLE_ADS_CUSTOMER_ID` | ID da conta anunciante. A conta registrada no projeto é `339-219-3354`; confirme que continua sendo a conta desejada. Aceita ID com ou sem hífens. |
| `GOOGLE_ADS_DEVELOPER_TOKEN` | Developer token do Centro de API. |
| `GOOGLE_ADS_CLIENT_ID` | Client ID do cliente OAuth. |
| `GOOGLE_ADS_CLIENT_SECRET` | Client secret do mesmo cliente OAuth. |
| `GOOGLE_ADS_REFRESH_TOKEN` | Refresh token gerado com esse cliente e autorizado pelo usuário com acesso à conta. |
| `GOOGLE_ADS_LOGIN_CUSTOMER_ID` | Opcional: ID da conta de administrador (MCC) pela qual o usuário acessa a conta anunciante. |
| `GOOGLE_ADS_API_VERSION` | Opcional: `v25` é o padrão. Atualizar conforme o [calendário de versões do Google](https://developers.google.com/google-ads/api/docs/sunset-dates). |

Essas variáveis são privadas: não usar `NEXT_PUBLIC_`, não colocar chaves no código
e não versionar `.env.local`. O ID `AW-…`, GTM e GA4 não substituem as credenciais
de leitura da API. A integração só consulta relatórios; não altera campanhas.

4. Entre em `/dashboard` e abra **Google Ads**. Confira o nome da conta, a moeda,
   as datas e uma campanha com atividade contra o painel do Google Ads.

Sem credenciais, a seção informa que a conexão está pendente. Se a autorização
falhar ou o serviço estiver indisponível, a seção mostra um erro sem substituir
os resultados por zeros. As demais seções continuam funcionando.

## Como interpretar os números

- O período selecionado vale para o Google Ads. As datas são inclusivas e o Google
  usa o fuso da conta, exibido na seção. O filtro **Origem** é usado nas métricas
  do site; os relatórios do Google Ads sempre abrangem a conta de anúncios.
- Os totais vêm do relatório da conta e a tabela vem do relatório de campanhas,
  incluindo campanhas pausadas/removidas que tenham resultados no período.
  Todos os lotes da resposta são lidos; não há corte nas primeiras 50 campanhas.
- Investimento é `cost_micros / 1.000.000`, formatado na moeda da conta.
  CTR = cliques / impressões; CPC = custo / cliques; CPA = custo / conversões.
  Razões sem denominador são exibidas como `—`.
- **Conversões** correspondem a `metrics.conversions`, conforme as ações incluídas
  nessa coluna do Google Ads. Podem ser fracionárias por causa da atribuição.
  Não são a mesma medida que os cliques no WhatsApp capturados pelo site.
- A seção **Campanhas de anúncios no site** usa o coletor próprio (gclid/UTM) e pode
  divergir do Google Ads por atribuição, consentimento e processamento dos dados.
- Os relatórios são consultados ao abrir/atualizar a página ou mudar os filtros.
  Dados recentes podem ser revisados pelo Google depois do processamento.

## Validação técnica

`npm run test:google-ads` cobre a leitura da API com respostas simuladas, incluindo
datas, valores monetários, conversões fracionárias, lotes, configuração e erros.
Execute também `npm run lint` e `npm run build`.

A validação com uma conta real depende das credenciais e deve comparar o mesmo
período, fuso e coluna de conversões nos dois painéis.

Referências: [REST e SearchStream](https://developers.google.com/google-ads/api/rest/common/search),
[autenticação e cabeçalhos](https://developers.google.com/google-ads/api/rest/auth),
[intervalos de datas](https://developers.google.com/google-ads/api/docs/query/date-ranges).
