import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildAutodiscoverXml,
  buildMozillaConfigXml,
  extractAutodiscoverEmail,
} from "../lib/mail-autoconfig.ts";

const request = (email) => `<?xml version="1.0" encoding="utf-8"?>
<Autodiscover xmlns="http://schemas.microsoft.com/exchange/autodiscover/outlook/requestschema/2006">
  <Request>
    <EMailAddress>${email}</EMailAddress>
    <AcceptableResponseSchema>http://schemas.microsoft.com/exchange/autodiscover/outlook/responseschema/2006a</AcceptableResponseSchema>
  </Request>
</Autodiscover>`;

test("ficha Mozilla traz IMAP 993 e SMTP 465 da KingHost com SSL", () => {
  const xml = buildMozillaConfigXml();

  assert.match(xml, /<incomingServer type="imap">[\s\S]*<hostname>imap\.kinghost\.net<\/hostname>[\s\S]*<port>993<\/port>[\s\S]*<socketType>SSL<\/socketType>/);
  assert.match(xml, /<outgoingServer type="smtp">[\s\S]*<hostname>smtp\.kinghost\.net<\/hostname>[\s\S]*<port>465<\/port>[\s\S]*<socketType>SSL<\/socketType>/);
  assert.match(xml, /<username>%EMAILADDRESS%<\/username>/);
  assert.doesNotMatch(xml, /%SERVER\//);
});

test("extrai o e-mail do pedido de autodiscover do Outlook", () => {
  assert.equal(extractAutodiscoverEmail(request("Coleta@SolidaTransporte.com.br")), "coleta@solidatransporte.com.br");
});

test("ignora e-mail de outro domínio ou malformado", () => {
  assert.equal(extractAutodiscoverEmail(request("alguem@gmail.com")), null);
  assert.equal(extractAutodiscoverEmail(request("<script>@solidatransporte.com.br")), null);
  assert.equal(extractAutodiscoverEmail("lixo"), null);
});

test("autodiscover responde IMAP e SMTP com o e-mail como login", () => {
  const xml = buildAutodiscoverXml("coleta@solidatransporte.com.br");

  assert.match(xml, /<Type>IMAP<\/Type>\s*<Server>imap\.kinghost\.net<\/Server>\s*<Port>993<\/Port>/);
  assert.match(xml, /<Type>SMTP<\/Type>\s*<Server>smtp\.kinghost\.net<\/Server>\s*<Port>465<\/Port>/);
  assert.equal((xml.match(/<LoginName>coleta@solidatransporte\.com\.br<\/LoginName>/g) ?? []).length, 2);
});

test("autodiscover sem e-mail válido omite o login", () => {
  assert.doesNotMatch(buildAutodiscoverXml(null), /<LoginName>/);
});
