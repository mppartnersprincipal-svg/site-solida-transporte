/**
 * Vagas da Sólida + regras da candidatura (LP /trabalhe-conosco, 26/10/2026).
 *
 * Fonte das vagas: áudios do dono de 23/10/2026
 * (`../Post Vaga de Emprego/transcricao-audios.md`). Para abrir/fechar vaga,
 * editar só a lista `VAGAS` — página, formulário, e-mail e JSON-LD leem daqui.
 *
 * Sem imports de propósito: o arquivo roda no browser, no servidor e no
 * `node --test` (tests/vagas.test.mjs).
 */

export type Vaga = {
  id: string;
  titulo: string;
  resumo: string;
  requisitos: string[];
};

export const VAGAS_LOCAL = "Goiânia - GO (matriz)";
/** Data em que as vagas foram abertas (JSON-LD `datePosted`). */
export const VAGAS_PUBLICADAS_EM = "2026-10-23";

export const VAGAS: Vaga[] = [
  {
    id: "auxiliar-escritorio",
    titulo: "Auxiliar de Escritório (Comercial Interno)",
    resumo: "Rotina do departamento comercial interno da matriz.",
    requisitos: [
      "Experiência com o sistema SSW",
      "Comunicação fluente",
      "Proatividade e trabalho em equipe",
      "Pontualidade",
    ],
  },
  {
    id: "ajudante-motorista",
    titulo: "Ajudante de Motorista",
    resumo: "Apoio ao motorista nas coletas e entregas.",
    requisitos: [
      "Disponibilidade para hora extra",
      "Pontualidade",
      "Trabalho em equipe",
    ],
  },
  {
    id: "motorista",
    titulo: "Motorista (categoria D + MOPP)",
    resumo: "Motorista com MOPP, o curso para transporte de produtos perigosos.",
    requisitos: [
      "CNH categoria D há mais de 1 ano",
      "Curso MOPP",
      "Experiência comprovada como motorista",
    ],
  },
];

export const RH_EMAIL_PADRAO = "rh@solidatransporte.com.br";

// ---------- Currículo ----------

/** Limite do arquivo: a Vercel recusa corpo acima de 4,5 MB. */
export const MAX_CURRICULO_BYTES = 4 * 1024 * 1024;
/** Fotos acima disso são reduzidas no navegador antes do envio. */
export const COMPRIMIR_FOTO_ACIMA_DE = 1.5 * 1024 * 1024;
export const CURRICULO_ACCEPT = ".pdf,.doc,.docx,.odt,.jpg,.jpeg,.png,.webp";

export type TipoCurriculo = "pdf" | "doc" | "docx" | "odt" | "jpg" | "png" | "webp";

const MIME: Record<TipoCurriculo, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  odt: "application/vnd.oasis.opendocument.text",
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export function mimeDoCurriculo(tipo: TipoCurriculo) {
  return MIME[tipo];
}

/**
 * Identifica o arquivo pelos primeiros bytes (não confia na extensão nem no
 * MIME do navegador). docx/odt são zip: aí a extensão desempata.
 */
export function detectarTipoCurriculo(bytes: Uint8Array, nome: string): TipoCurriculo | null {
  const ext = nome.toLowerCase().split(".").pop() ?? "";
  const comeca = (...sig: number[]) => sig.every((b, i) => bytes[i] === b);

  if (comeca(0x25, 0x50, 0x44, 0x46)) return "pdf"; // %PDF
  if (comeca(0xff, 0xd8, 0xff)) return "jpg";
  if (comeca(0x89, 0x50, 0x4e, 0x47)) return "png";
  if (comeca(0x52, 0x49, 0x46, 0x46) && bytes[8] === 0x57 && bytes[9] === 0x45) return "webp"; // RIFF....WE
  if (comeca(0xd0, 0xcf, 0x11, 0xe0)) return "doc"; // OLE (Word 97-2003)
  if (comeca(0x50, 0x4b, 0x03, 0x04)) {
    if (ext === "docx") return "docx";
    if (ext === "odt") return "odt";
  }
  return null;
}

/** Nome seguro para o anexo/Storage: sem acento, espaço ou caractere especial. */
export function nomeArquivoSeguro(nome: string, tipo: TipoCurriculo) {
  const base = nome
    .replace(/\.[^./\\]*$/, "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${base || "curriculo"}.${tipo}`;
}

// ---------- Validação ----------

export type Candidatura = {
  nome: string;
  telefone: string;
  email: string | null;
  bairro: string;
  vaga: string;
  mensagem: string | null;
};

export type ErrosCandidatura = Partial<Record<keyof Candidatura | "consentimento", string>>;

export type Validacao =
  | { ok: true; dados: Candidatura }
  | { ok: false; erros: ErrosCandidatura };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function texto(v: unknown, max: number) {
  return typeof v === "string" ? v.trim().replace(/\s+/g, " ").slice(0, max) : "";
}

/** Só dígitos, sem o 55 do Brasil. Aceita fixo (10) ou celular (11). */
export function normalizarTelefone(v: string) {
  let d = v.replace(/\D/g, "");
  if (d.length >= 12 && d.startsWith("55")) d = d.slice(2);
  return d.length === 10 || d.length === 11 ? d : null;
}

export function formatarTelefone(d: string) {
  return d.length === 11
    ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
    : `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
}

export function tituloDaVaga(id: string) {
  return VAGAS.find((v) => v.id === id)?.titulo ?? id;
}

/** Mesma regra no formulário (feedback imediato) e na API (a que vale). */
export function validarCandidatura(campos: Record<string, unknown>): Validacao {
  const erros: ErrosCandidatura = {};

  const nome = texto(campos.nome, 120);
  if (nome.length < 3 || !/\s/.test(nome)) erros.nome = "Informe seu nome completo.";

  const telefone = normalizarTelefone(texto(campos.telefone, 30));
  if (!telefone) erros.telefone = "Informe um WhatsApp ou telefone com DDD.";

  const email = texto(campos.email, 120).toLowerCase();
  if (email && !EMAIL_RE.test(email)) erros.email = "Confira o e-mail (ou deixe em branco).";

  const bairro = texto(campos.bairro, 120);
  if (bairro.length < 2) erros.bairro = "Informe o bairro e a cidade onde você mora.";

  const vaga = texto(campos.vaga, 40);
  if (!VAGAS.some((v) => v.id === vaga)) erros.vaga = "Escolha a vaga.";

  const mensagem =
    typeof campos.mensagem === "string" ? campos.mensagem.trim().slice(0, 1500) : "";

  const consentiu = campos.consentimento === true || campos.consentimento === "on";
  if (!consentiu) erros.consentimento = "Precisamos da sua autorização para enviar ao RH.";

  if (Object.keys(erros).length > 0) return { ok: false, erros };
  return {
    ok: true,
    dados: {
      nome,
      telefone: telefone!,
      email: email || null,
      bairro,
      vaga,
      mensagem: mensagem || null,
    },
  };
}

// ---------- E-mail para o RH ----------

export type OrigemCandidatura = Record<string, string>;

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Assunto + corpo (HTML e texto) do e-mail que chega ao RH. */
export function montarEmailCandidatura(
  c: Candidatura,
  { anexo, origem }: { anexo: string | null; origem: OrigemCandidatura }
) {
  const vaga = tituloDaVaga(c.vaga);
  const tel = formatarTelefone(c.telefone);
  const wa = `https://wa.me/55${c.telefone}`;

  const linhas: [string, string][] = [
    ["Vaga", vaga],
    ["Nome", c.nome],
    ["WhatsApp / telefone", tel],
    ["E-mail", c.email ?? "não informado"],
    ["Bairro / cidade", c.bairro],
    ["Currículo", anexo ? `anexo (${anexo})` : "não anexou"],
  ];
  const origemTxt = Object.entries(origem)
    .map(([k, v]) => `${k}: ${v}`)
    .join(" · ");

  const subject = `Candidatura: ${vaga} | ${c.nome}`;

  const text = [
    `Nova candidatura pelo site (solidatransporte.com.br/trabalhe-conosco)`,
    "",
    ...linhas.map(([k, v]) => `${k}: ${v}`),
    "",
    `Mensagem: ${c.mensagem ?? "(sem mensagem)"}`,
    "",
    `Chamar no WhatsApp: ${wa}`,
    origemTxt ? `Origem: ${origemTxt}` : "",
  ].join("\n");

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1f2937;max-width:560px">
<p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#e10600;font-weight:bold">Nova candidatura pelo site</p>
<h2 style="margin:0 0 16px;font-size:20px;color:#0e0e0e">${esc(vaga)}</h2>
<table cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%">
${linhas
  .map(
    ([k, v]) =>
      `<tr><td style="border-bottom:1px solid #e5e7eb;color:#6b7280;width:160px">${esc(k)}</td><td style="border-bottom:1px solid #e5e7eb;font-weight:bold">${esc(v)}</td></tr>`
  )
  .join("\n")}
</table>
<p style="margin:16px 0 4px;color:#6b7280">Mensagem</p>
<p style="margin:0;white-space:pre-wrap">${esc(c.mensagem ?? "(sem mensagem)")}</p>
<p style="margin:24px 0"><a href="${wa}" style="background:#25d366;color:#fff;text-decoration:none;padding:10px 18px;border-radius:999px;font-weight:bold">Chamar ${esc(c.nome.split(" ")[0])} no WhatsApp</a></p>
${origemTxt ? `<p style="margin:0;font-size:12px;color:#6b7280">Origem: ${esc(origemTxt)}</p>` : ""}
</div>`;

  return { subject, text, html };
}
