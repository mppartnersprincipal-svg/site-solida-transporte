import { type NextRequest } from "next/server";
import { createHash, timingSafeEqual } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasAdminSession } from "@/lib/admin-session";
import { COLUNAS, COLUNAS_PUBLICAS, UUID_RE, validarColaborador } from "@/lib/assinatura-colaboradores";

/**
 * Cadastro de colaboradores do gerador de assinatura (/assinatura).
 *
 * - GET público: só colaboradores ATIVOS e só os campos que aparecem na assinatura
 *   (+ id e rótulo do menu). Com acesso de edição (abaixo), também devolve os excluídos.
 * - POST cria, PUT ?id= edita (só ativos), DELETE ?id= exclui, PATCH ?id= restaura.
 *   Exclusão é reversível: só marca excluido_em (migration 0007), nunca apaga a linha.
 * - Escrita: em 28/09/2026 o cliente pediu SEM LOGIN para a equipe; mantido sem login,
 *   mas desde 23/10/2026 (correção de segurança autorizada pelo Pedro) exige uma de:
 *     1. sessão de admin do Supabase (e-mail em ADMIN_EMAILS), ou
 *     2. código de acesso compartilhado com a equipe (env ASSINATURA_ACCESS_CODE),
 *        enviado no header x-assinatura-codigo e comparado em tempo constante.
 *   Falha fechada: sem ASSINATURA_ACCESS_CODE, só o admin logado consegue alterar.
 * - Proteção extra contra abuso: validação + limite por rede e teto global.
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

const HEADER_CODIGO = "x-assinatura-codigo";

/** Código válido? Sem a env configurada, nunca (falha fechada). */
function codigoValido(request: NextRequest): boolean {
  const esperado = process.env.ASSINATURA_ACCESS_CODE ?? "";
  const recebido = request.headers.get(HEADER_CODIGO) ?? "";
  if (!esperado || !recebido) return false;
  const a = createHash("sha256").update(recebido).digest();
  const b = createHash("sha256").update(esperado).digest();
  return timingSafeEqual(a, b);
}

async function podeEditar(request: NextRequest): Promise<boolean> {
  return codigoValido(request) || (await hasAdminSession());
}

/** null = autorizado; senão a Response 401. */
async function exigirEdicao(request: NextRequest): Promise<Response | null> {
  if (await podeEditar(request)) return null;
  return json(401, { ok: false, error: "Código de acesso inválido. Peça o código atual ao responsável." });
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
  // Código enviado e errado → 401 (o gerador pede de novo); sem código → lista pública
  const enviouCodigo = request.headers.has(HEADER_CODIGO);
  const completo = await podeEditar(request);
  if (enviouCodigo && !completo) {
    if (!allow(`f:${ipHash(request)}`, 10)) return json(429, { ok: false, error: "Muitas tentativas. Espere um minuto." });
    return json(401, { ok: false, error: "Código de acesso inválido." });
  }

  const supabase = createAdminClient();
  if (!supabase) return json(503, { ok: false, error: "Banco de dados indisponível." });

  const base = supabase.from("assinatura_colaboradores").select(completo ? COLUNAS : COLUNAS_PUBLICAS);
  const { data, error } = await (completo ? base : base.is("excluido_em", null))
    .order("filial")
    .order("nome");
  if (error) {
    console.error("[assinatura] list", error.message);
    return json(500, { ok: false, error: "Não consegui carregar a lista." });
  }
  return json(200, { ok: true, data });
}

export async function POST(request: NextRequest) {
  const negado = limitarEscrita(request) ?? (await exigirEdicao(request));
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
  const negado = limitarEscrita(request) ?? (await exigirEdicao(request));
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
    .is("excluido_em", null)
    .select(COLUNAS)
    .maybeSingle();
  if (error) {
    console.error("[assinatura] update", error.message);
    return json(500, { ok: false, error: "Não consegui salvar. Tente de novo." });
  }
  if (!data) return json(404, { ok: false, error: "Esse colaborador foi excluído ou não existe mais. Recarregue a página." });
  return json(200, { ok: true, data });
}

/** Marca/desmarca excluido_em. A linha nunca é apagada: exclusão sempre pode ser desfeita. */
async function marcarExclusao(request: NextRequest, excluir: boolean) {
  const negado = limitarEscrita(request) ?? (await exigirEdicao(request));
  if (negado) return negado;
  const id = idDaUrl(request);
  if (!id) return json(400, { ok: false, error: "Colaborador inválido." });

  const supabase = createAdminClient();
  if (!supabase) return json(503, { ok: false, error: "Banco de dados indisponível." });
  const base = supabase
    .from("assinatura_colaboradores")
    .update({ excluido_em: excluir ? new Date().toISOString() : null })
    .eq("id", id);
  const { data, error } = await (excluir ? base.is("excluido_em", null) : base.not("excluido_em", "is", null))
    .select(COLUNAS)
    .maybeSingle();
  if (error) {
    console.error(`[assinatura] ${excluir ? "excluir" : "restaurar"}`, error.message);
    return json(500, { ok: false, error: `Não consegui ${excluir ? "excluir" : "restaurar"}. Tente de novo.` });
  }
  if (!data) {
    const msg = excluir ? "Esse colaborador já foi excluído. Recarregue a página." : "Esse colaborador já está ativo. Recarregue a página.";
    return json(404, { ok: false, error: msg });
  }
  return json(200, { ok: true, data });
}

/** DELETE ?id= — exclui (vai para "Excluídos"). */
export async function DELETE(request: NextRequest) {
  return marcarExclusao(request, true);
}

/** PATCH ?id= — restaura um excluído. */
export async function PATCH(request: NextRequest) {
  return marcarExclusao(request, false);
}
