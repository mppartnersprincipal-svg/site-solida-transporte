import "server-only";
import { createClient } from "@/lib/supabase/server";
import { fetchGoogleAdsReport } from "@/lib/google-ads-api";
import type { Range } from "@/lib/analytics-queries";
import type { GoogleAdsReport } from "@/lib/google-ads-types";

export async function getGoogleAdsReport(range: Range): Promise<GoogleAdsReport> {
  // A API usa credenciais do servidor: validar a sessão antes de buscar dados,
  // independentemente da proteção de rota feita pelo proxy.
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      return { status: "error", message: "Entre novamente no painel para consultar o Google Ads." };
    }
  } catch {
    return { status: "error", message: "Não foi possível verificar seu acesso. Entre novamente no painel." };
  }
  return fetchGoogleAdsReport(range);
}
