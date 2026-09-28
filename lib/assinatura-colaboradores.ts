/**
 * Cadastro de colaboradores do gerador de assinatura (public/assinatura/gerador.html).
 * Validação pura (sem I/O) — usada pela rota /api/assinatura/colaboradores.
 */

export const FILIAIS = ["SP", "DF", "GO"] as const;
export type Filial = (typeof FILIAIS)[number];

export type Colaborador = {
  id: string;
  filial: Filial;
  nome: string;
  cargo: string | null;
  cidade: string | null;
  fone: string | null;
  ramal: string | null;
  whatsapp: string | null;
  email: string;
  rotulo: string | null;
  /** Preenchido = excluído (fica na área "Excluídos" do gerador e pode ser restaurado). */
  excluido_em: string | null;
};

export type ColaboradorInput = Omit<Colaborador, "id" | "excluido_em">;

export const COLUNAS = "id, filial, nome, cargo, cidade, fone, ramal, whatsapp, email, rotulo, excluido_em";

const LIMITES = { nome: 80, cargo: 60, cidade: 60, fone: 30, ramal: 10, whatsapp: 30, email: 120, rotulo: 80 } as const;
const EMAIL_RE = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/;
const FONE_RE = /^[\d\s()+-]*$/;
const RAMAL_RE = /^\d*$/;
export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Resultado = { ok: true; data: ColaboradorInput } | { ok: false; error: string };

function texto(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim().replace(/\s+/g, " ");
  return t || null;
}

/** Valida e normaliza o corpo vindo do gerador. Campos vazios viram null. */
export function validarColaborador(body: unknown): Resultado {
  if (!body || typeof body !== "object") return { ok: false, error: "Dados inválidos." };
  const b = body as Record<string, unknown>;

  const filial = texto(b.filial)?.toUpperCase();
  if (!filial || !(FILIAIS as readonly string[]).includes(filial)) return { ok: false, error: "Escolha a filial." };

  const campos = {
    nome: texto(b.nome),
    cargo: texto(b.cargo),
    cidade: texto(b.cidade),
    fone: texto(b.fone),
    ramal: texto(b.ramal),
    whatsapp: texto(b.whatsapp),
    email: texto(b.email)?.toLowerCase() ?? null,
    rotulo: texto(b.rotulo),
  };

  if (!campos.nome) return { ok: false, error: "Preencha o nome." };
  if (!campos.email) return { ok: false, error: "Preencha o e-mail." };
  for (const [k, max] of Object.entries(LIMITES)) {
    const v = campos[k as keyof typeof campos];
    if (v && v.length > max) return { ok: false, error: `O campo ${k} passou de ${max} caracteres.` };
  }
  if (!EMAIL_RE.test(campos.email)) return { ok: false, error: "E-mail inválido." };
  if (campos.fone && !FONE_RE.test(campos.fone)) return { ok: false, error: "Telefone só pode ter números, espaço, ( ) e -." };
  if (campos.whatsapp && !FONE_RE.test(campos.whatsapp)) return { ok: false, error: "WhatsApp só pode ter números, espaço, ( ) e -." };
  if (campos.ramal && !RAMAL_RE.test(campos.ramal)) return { ok: false, error: "Ramal só pode ter números." };

  return { ok: true, data: { filial: filial as Filial, ...campos, nome: campos.nome, email: campos.email } };
}
