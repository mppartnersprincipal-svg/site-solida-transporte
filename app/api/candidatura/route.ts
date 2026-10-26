import { type NextRequest } from "next/server";
import { createHash, randomUUID } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { createMailer } from "@/lib/mailer";
import {
  MAX_CURRICULO_BYTES,
  RH_EMAIL_PADRAO,
  detectarTipoCurriculo,
  mimeDoCurriculo,
  montarEmailCandidatura,
  nomeArquivoSeguro,
  validarCandidatura,
  type Candidatura,
  type OrigemCandidatura,
} from "@/lib/vagas";

/**
 * Candidatura da LP /trabalhe-conosco (multipart: campos + currículo opcional).
 *
 * 1. Valida tudo de novo (lib/vagas.ts) e identifica o arquivo pelos bytes.
 * 2. Em paralelo: e-mail para o RH com o currículo anexo (SMTP, lib/mailer.ts)
 *    e cópia de segurança no Supabase (tabela `candidaturas` + bucket privado).
 * 3. Sucesso se ao menos um dos dois funcionou; os dois falhando → 502 e o
 *    formulário oferece o WhatsApp do RH.
 *
 * Anti-spam: campo isca `site` (bot preenche → finge sucesso) + limite por IP.
 */

export const runtime = "nodejs";
export const maxDuration = 30;

/** Arquivo + campos + folga do multipart; a Vercel corta em 4,5 MB. */
const MAX_BODY = MAX_CURRICULO_BYTES + 256 * 1024;
const LIMITE_POR_IP = 5;
const JANELA_MS = 10 * 60_000;
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

// ---------- rate limit best-effort (por instância, igual ao /api/collect) ----------
const buckets = new Map<string, { n: number; reset: number }>();
function allow(key: string) {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.reset < now) {
    buckets.set(key, { n: 1, reset: now + JANELA_MS });
    if (buckets.size > 5000) buckets.clear();
    return true;
  }
  b.n += 1;
  return b.n <= LIMITE_POR_IP;
}

function json(body: object, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

type Arquivo = { nome: string; mime: string; bytes: Buffer };

function lerOrigem(form: FormData): OrigemCandidatura {
  const origem: OrigemCandidatura = {};
  for (const k of UTM_KEYS) {
    const v = form.get(k);
    if (typeof v === "string" && v.trim()) origem[k] = v.trim().slice(0, 150);
  }
  if (form.get("fbclid") === "1") origem.fbclid = "sim";
  return origem;
}

async function enviarEmail(c: Candidatura, arquivo: Arquivo | null, origem: OrigemCandidatura) {
  const mailer = createMailer();
  if (!mailer) throw new Error("SMTP_USER/SMTP_PASS ausentes");

  const { subject, text, html } = montarEmailCandidatura(c, { anexo: arquivo?.nome ?? null, origem });
  await mailer.transport.sendMail({
    from: { name: "Site Sólida — Vagas", address: mailer.from },
    to: process.env.CANDIDATURA_EMAIL_TO || RH_EMAIL_PADRAO,
    replyTo: c.email ?? undefined,
    subject,
    text,
    html,
    attachments: arquivo
      ? [{ filename: arquivo.nome, content: arquivo.bytes, contentType: arquivo.mime }]
      : [],
  });
}

async function salvarCopia(
  id: string,
  c: Candidatura,
  arquivo: Arquivo | null,
  origem: OrigemCandidatura
) {
  const supabase = createAdminClient();
  if (!supabase) throw new Error("SUPABASE_SERVICE_ROLE_KEY ausente");

  let path: string | null = null;
  if (arquivo) {
    path = `${new Date().toISOString().slice(0, 7)}/${id}-${arquivo.nome}`;
    const { error } = await supabase.storage
      .from("curriculos")
      .upload(path, arquivo.bytes, { contentType: arquivo.mime, upsert: false });
    if (error) throw new Error(`upload: ${error.message}`);
  }

  const { error } = await supabase.from("candidaturas").insert({
    id,
    vaga: c.vaga,
    nome: c.nome,
    telefone: c.telefone,
    email: c.email,
    bairro: c.bairro,
    mensagem: c.mensagem,
    curriculo_path: path,
    origem,
  });
  if (error) throw new Error(`insert: ${error.message}`);
  return supabase;
}

export async function POST(req: NextRequest) {
  const tamanho = Number(req.headers.get("content-length") || 0);
  if (tamanho > MAX_BODY) {
    return json({ ok: false, erro: "Arquivo grande demais. Envie um currículo de até 4 MB." }, 413);
  }

  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "local";
  const ipHash = createHash("sha256").update(ip).digest("hex").slice(0, 16);
  if (!allow(ipHash)) {
    return json({ ok: false, erro: "Muitas tentativas seguidas. Aguarde alguns minutos." }, 429);
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return json({ ok: false, erro: "Não foi possível ler o formulário." }, 400);
  }

  // Isca: campo escondido que só robô preenche. Finge sucesso e descarta.
  if (String(form.get("site") ?? "").trim()) return json({ ok: true });

  const campos: Record<string, unknown> = {};
  for (const k of ["nome", "telefone", "email", "bairro", "vaga", "mensagem", "consentimento"]) {
    campos[k] = form.get(k) ?? undefined;
  }
  const validacao = validarCandidatura(campos);
  if (!validacao.ok) return json({ ok: false, erros: validacao.erros }, 422);
  const c = validacao.dados;

  let arquivo: Arquivo | null = null;
  const file = form.get("curriculo");
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_CURRICULO_BYTES) {
      return json({ ok: false, erros: { curriculo: "O arquivo passa de 4 MB." } }, 422);
    }
    const bytes = Buffer.from(await file.arrayBuffer());
    const tipo = detectarTipoCurriculo(bytes, file.name);
    if (!tipo) {
      return json(
        { ok: false, erros: { curriculo: "Formato não aceito. Envie PDF, Word ou foto (JPG/PNG)." } },
        422
      );
    }
    arquivo = { nome: nomeArquivoSeguro(file.name, tipo), mime: mimeDoCurriculo(tipo), bytes };
  }

  const id = randomUUID();
  const origem = lerOrigem(form);
  const [email, copia] = await Promise.allSettled([
    enviarEmail(c, arquivo, origem),
    salvarCopia(id, c, arquivo, origem),
  ]);

  if (email.status === "rejected") {
    console.error("[candidatura] e-mail falhou", id, email.reason);
  }
  if (copia.status === "rejected") {
    console.error("[candidatura] cópia no Supabase falhou", id, copia.reason);
  }

  if (email.status === "rejected" && copia.status === "rejected") {
    return json(
      { ok: false, erro: "Não conseguimos enviar agora. Tente de novo ou chame o RH no WhatsApp." },
      502
    );
  }

  if (email.status === "fulfilled" && copia.status === "fulfilled") {
    const { error } = await copia.value.from("candidaturas").update({ email_enviado: true }).eq("id", id);
    if (error) console.error("[candidatura] marcar email_enviado falhou", id, error.message);
  }

  return json({ ok: true });
}
