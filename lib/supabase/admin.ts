import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase com a SERVICE ROLE — ignora RLS. Uso EXCLUSIVO no servidor
 * (Route Handlers / server actions); nunca importar em client components.
 * Hoje só o /api/collect usa, para gravar analytics_sessions/analytics_events.
 *
 * Retorna null se a chave não estiver no .env — o coletor então não grava
 * (o site continua funcionando normalmente).
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  return createSupabaseClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
