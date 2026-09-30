// Configuração automática de e-mail do domínio (pedido do TI, 30/09/2026).
// O autoconfig da KingHost devolve o modelo sem preencher, então o site
// publica as fichas certas para os programas de e-mail detectarem sozinhos:
// - Thunderbird e outros: GET /mail/config-v1.1.xml (formato Mozilla)
// - Outlook clássico: POST /autodiscover/autodiscover.xml (formato POX)
// Só servem se os registros autoconfig/autodiscover do DNS apontarem para a Vercel.

export const MAIL_DOMAIN = "solidatransporte.com.br";

const IMAP = { host: "imap.kinghost.net", port: 993 } as const;
const SMTP = { host: "smtp.kinghost.net", port: 465 } as const;

const EMAIL_PATTERN = /<EMailAddress>\s*([^<\s]+)\s*<\/EMailAddress>/i;
const LOCAL_PART = /^[a-z0-9._%+-]+$/;

export function buildMozillaConfigXml(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<clientConfig version="1.1">
  <emailProvider id="${MAIL_DOMAIN}">
    <domain>${MAIL_DOMAIN}</domain>
    <displayName>Sólida Transporte</displayName>
    <displayShortName>Sólida</displayShortName>
    <incomingServer type="imap">
      <hostname>${IMAP.host}</hostname>
      <port>${IMAP.port}</port>
      <socketType>SSL</socketType>
      <authentication>password-cleartext</authentication>
      <username>%EMAILADDRESS%</username>
    </incomingServer>
    <outgoingServer type="smtp">
      <hostname>${SMTP.host}</hostname>
      <port>${SMTP.port}</port>
      <socketType>SSL</socketType>
      <authentication>password-cleartext</authentication>
      <username>%EMAILADDRESS%</username>
    </outgoingServer>
  </emailProvider>
</clientConfig>
`;
}

/** E-mail do pedido do Outlook, só se for do domínio da Sólida; senão null. */
export function extractAutodiscoverEmail(body: string): string | null {
  const match = EMAIL_PATTERN.exec(body);
  if (!match) return null;
  const email = match[1].toLowerCase();
  const [local, domain, ...rest] = email.split("@");
  if (rest.length > 0 || domain !== MAIL_DOMAIN || !LOCAL_PART.test(local ?? "")) return null;
  return email;
}

function protocolXml(type: "IMAP" | "SMTP", host: string, port: number, login: string | null): string {
  const loginXml = login ? `\n        <LoginName>${login}</LoginName>` : "";
  return `      <Protocol>
        <Type>${type}</Type>
        <Server>${host}</Server>
        <Port>${port}</Port>
        <DomainRequired>off</DomainRequired>${loginXml}
        <SPA>off</SPA>
        <SSL>on</SSL>
        <AuthRequired>on</AuthRequired>
      </Protocol>`;
}

export function buildAutodiscoverXml(email: string | null): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<Autodiscover xmlns="http://schemas.microsoft.com/exchange/autodiscover/responseschema/2006">
  <Response xmlns="http://schemas.microsoft.com/exchange/autodiscover/outlook/responseschema/2006a">
    <Account>
      <AccountType>email</AccountType>
      <Action>settings</Action>
${protocolXml("IMAP", IMAP.host, IMAP.port, email)}
${protocolXml("SMTP", SMTP.host, SMTP.port, email)}
    </Account>
  </Response>
</Autodiscover>
`;
}
