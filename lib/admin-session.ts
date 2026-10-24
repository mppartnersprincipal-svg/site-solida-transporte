import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin-access";

/**
 * true se a requisição tem sessão do Supabase de um e-mail da allowlist
 * ADMIN_EMAILS. Para Route Handlers (o proxy só cobre /admin e /dashboard).
 * Qualquer falha ao verificar = sem acesso.
 */
export async function hasAdminSession(): Promise<boolean> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return false;
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    return !error && isAdminEmail(user?.email);
  } catch {
    return false;
  }
}
