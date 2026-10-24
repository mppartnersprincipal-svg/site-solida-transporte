/**
 * Controle de acesso da área administrativa (/admin, /dashboard) e das
 * escritas do cadastro de assinaturas.
 *
 * - Admin = usuário logado no Supabase cujo e-mail está em ADMIN_EMAILS
 *   (lista separada por vírgula, sem diferenciar maiúsculas). Ter conta no
 *   Supabase Auth NÃO basta.
 * - Falha fechada: sem ADMIN_EMAILS configurada, ninguém é admin.
 *
 * Sem dependências de Node de propósito: também é importado pelo proxy.ts.
 */

/** Query string usada no /login quando alguém logado não está na allowlist. */
export const ACCESS_DENIED_PARAM = "acesso";
export const ACCESS_DENIED_VALUE = "negado";

function adminEmails(): Set<string> {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return new Set(
    raw
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
  );
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return adminEmails().has(email.trim().toLowerCase());
}
