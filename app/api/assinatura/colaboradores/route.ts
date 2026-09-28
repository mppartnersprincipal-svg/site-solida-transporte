import { type NextRequest } from "next/server";
import { createHash } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { COLUNAS, UUID_RE, validarColaborador } from "@/lib/assinatura-colaboradores";

/**
 * Cadastro de colaboradores do gerador de assinatura (/assinatura).
 *
 * - GET lista todos (mesmos dados que já saem nas assinaturas).
 * - POST cria, PUT ?id= edita, DELETE ?id= remove.
 * - SEM SENHA por decisão do cliente (28/09/2026): qualquer um com o link altera.
 *   Proteção só contra abuso em massa: validação + limite por rede e teto global.
 * - Tabela com RLS e sem policies: só a service role (este arquivo) acessa.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY = 4 * 1024;

// ---------- rate limit best-effort (por instância), igual ao /api/collect ----------
const buckets = new Map<string, { n: number; reset: number }>();
function allow(key: string, limit: number) {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.reset < now) {
    buckets.set(key, { n: 1, reset: now + 60_000 });
    if (buckets.size > 5000) buckets.clear();
    return true;
  }
  b.n += 1;
  return b.n <= limit;
}

function json(status: number, body: { ok: boolean; data?: unknown; error?: string }) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

// Na Vercel, x-real-ip é definido pela plataforma (não pelo cliente)
function ipHash(request: NextRequest) {
  return createHash("sha256")
    .update(request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for") ?? "local")
    .digest("hex")
    .slice(0, 16);
}

/** null = liberado; senão a Response 429. Escrita: 20/min por rede + teto global de 60/min
 *  (o global não depende do IP informado, então trocar o header não abre alteração em massa). */
function limitarEscrita(request: NextRequest): Response | null {
  const porRede = allow(`w:${ipHash(request)}`, 20);
  const global = allow("w:*", 60);
  if (!porRede || !global) return json(429, { ok: false, error: "Muitas alterações seguidas. Espere um minuto." });
  return null;
}

async function lerCorpo(request: NextRequest): Promise<unknown> {
  const len = Number(request.headers.get("content-length") ?? 0);
  if (len > MAX_BODY) return json(413, { ok: false, error: "Dados grandes demais." });
  try {
    const text = await request.text();
    if (text.length > MAX_BODY) return json(413, { ok: false, error: "Dados grandes demais." });
    return JSON.parse(text);
  } catch {
    return json(400, { ok: false, error: "Dados inválidos." });
  }
}

function idDaUrl(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id") ?? "";
  return UUID_RE.test(id) ? id.toLowerCase() : null;
}

export async function GET(request: NextRequest) {
  if (!allow(`r:${ipHash(request)}`, 120)) return json(429, { ok: false, error: "Muitas requisições." });
  const supabase = createAdminClient();
  if (!supabase) return json(503, { ok: false, error: "Banco de dados indisponível." });

  const { data, error } = await supabase
    .from("assinatura_colaboradores")
    .select(COLUNAS)
    .order("filial")
    .order("nome");
  if (error) {
    console.error("[assinatura] list", error.message);
    return json(500, { ok: false, error: "Não consegui carregar a lista." });
  }
  return json(200, { ok: true, data });
}

export async function POST(request: NextRequest) {
  const negado = limitarEscrita(request);
  if (negado) return negado;
  const body = await lerCorpo(request);
  if (body instanceof Response) return body;
  const v = validarColaborador(body);
  if (!v.ok) return json(400, { ok: false, error: v.error });

  const supabase = createAdminClient();
  if (!supabase) return json(503, { ok: false, error: "Banco de dados indisponível." });
  const { data, error } = await supabase.from("assinatura_colaboradores").insert(v.data).select(COLUNAS).single();
  if (error) {
    console.error("[assinatura] insert", error.message);
    return json(500, { ok: false, error: "Não consegui salvar. Tente de novo." });
  }
  return json(201, { ok: true, data });
}

export async function PUT(request: NextRequest) {
  const negado = limitarEscrita(request);
  if (negado) return negado;
  const id = idDaUrl(request);
  if (!id) return json(400, { ok: false, error: "Colaborador inválido." });
  const body = await lerCorpo(request);
  if (body instanceof Response) return body;
  const v = validarColaborador(body);
  if (!v.ok) return json(400, { ok: false, error: v.error });

  const supabase = createAdminClient();
  if (!supabase) return json(503, { ok: false, error: "Banco de dados indisponível." });
  const { data, error } = await supabase
    .from("assinatura_colaboradores")
    .update(v.data)
    .eq("id", id)
    .select(COLUNAS)
    .maybeSingle();
  if (error) {
    console.error("[assinatura] update", error.message);
    return json(500, { ok: false, error: "Não consegui salvar. Tente de novo." });
  }
  if (!data) return json(404, { ok: false, error: "Esse colaborador não existe mais. Recarregue a página." });
  return json(200, { ok: true, data });
}

export async function DELETE(request: NextRequest) {
  const negado = limitarEscrita(request);
  if (negado) return negado;
  const id = idDaUrl(request);
  if (!id) return json(400, { ok: false, error: "Colaborador inválido." });

  const supabase = createAdminClient();
  if (!supabase) return json(503, { ok: false, error: "Banco de dados indisponível." });
  const { data, error } = await supabase.from("assinatura_colaboradores").delete().eq("id", id).select("id");
  if (error) {
    console.error("[assinatura] delete", error.message);
    return json(500, { ok: false, error: "Não consegui remover. Tente de novo." });
  }
  if (!data?.length) return json(404, { ok: false, error: "Esse colaborador não existe mais. Recarregue a página." });
  return json(200, { ok: true, data: { id } });
}
