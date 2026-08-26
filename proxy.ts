import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Convenção do Next 16: proxy.ts substitui o antigo middleware.ts.
// Protege a área administrativa e mantém a sessão do Supabase renovada.
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/login"],
};
