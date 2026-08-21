import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase anônimo, SEM cookies — para páginas públicas do blog.
 * Não usar o client de server.ts nessas páginas: cookies() força render
 * dinâmico e quebraria o ISR. A RLS garante que este cliente só enxerga
 * posts com status = 'published'.
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
