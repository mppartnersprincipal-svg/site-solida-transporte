import { campanhaDoMes } from "@/lib/assinatura-campanha";

// Link da imagem da campanha na assinatura "Automática": endereço fixo, destino muda com o mês.
export const dynamic = "force-dynamic";

export function GET(): Response {
  return new Response(null, {
    status: 302,
    headers: {
      Location: campanhaDoMes().link,
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "X-Robots-Tag": "noindex",
    },
  });
}
