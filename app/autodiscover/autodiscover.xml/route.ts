import { buildAutodiscoverXml, extractAutodiscoverEmail } from "@/lib/mail-autoconfig";

// Autodiscover (formato POX) para o Outlook clássico achar IMAP/SMTP sozinho.
// /Autodiscover/Autodiscover.xml (maiúsculas) chega aqui por rewrite no next.config.
const MAX_BODY_BYTES = 10_000;

function xmlResponse(email: string | null): Response {
  return new Response(buildAutodiscoverXml(email), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}

export async function POST(request: Request): Promise<Response> {
  const body = await request.text().catch(() => "");
  return xmlResponse(body.length > MAX_BODY_BYTES ? null : extractAutodiscoverEmail(body));
}

export function GET(): Response {
  return xmlResponse(null);
}
