import { type NextRequest } from "next/server";
import { campanhaDoMes } from "@/lib/assinatura-campanha";

// Imagem da campanha da assinatura "Automática": endereço fixo, conteúdo muda com o mês
// (lib/assinatura-campanha.ts). Devolve os bytes do banner estático em vez de redirecionar —
// alguns leitores de e-mail lidam mal com imagem que redireciona.
// Cache de 1 h: a virada do mês aparece em até 1 h (mais o cache de quem recebe, ex. proxy do Gmail).
export const dynamic = "force-dynamic";

const CACHE = "public, max-age=3600, s-maxage=3600";

export async function GET(req: NextRequest): Promise<Response> {
  const banner = new URL(campanhaDoMes().banner, req.nextUrl.origin);
  try {
    const res = await fetch(banner, { cache: "no-store" });
    if (!res.ok) throw new Error(`banner ${res.status}`);
    return new Response(res.body, {
      headers: { "Content-Type": "image/jpeg", "Cache-Control": CACHE, "X-Robots-Tag": "noindex" },
    });
  } catch (err) {
    console.error("[assinatura] campanha-do-mes: servindo por redirect", banner.pathname, err);
    return Response.redirect(banner, 302);
  }
}
