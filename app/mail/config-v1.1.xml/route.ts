import { buildMozillaConfigXml } from "@/lib/mail-autoconfig";

// Ficha de configuração de e-mail no formato Mozilla (Thunderbird e afins).
// Também responde em /.well-known/autoconfig/mail/config-v1.1.xml (rewrite no next.config).
export const dynamic = "force-static";

export function GET(): Response {
  return new Response(buildMozillaConfigXml(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "X-Robots-Tag": "noindex",
    },
  });
}
