"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, FileUp, Loader2, Paperclip, X } from "lucide-react";
import { Button, buttonClasses } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/layout/WhatsAppIcon";
import { VAGA_EVENT } from "@/components/vagas/CandidatarButton";
import { WhatsAppRHLink } from "@/components/vagas/WhatsAppRHLink";
import { trackCandidatura } from "@/lib/analytics";
import {
  COMPRIMIR_FOTO_ACIMA_DE,
  CURRICULO_ACCEPT,
  MAX_CURRICULO_BYTES,
  VAGAS,
  validarCandidatura,
  type ErrosCandidatura,
} from "@/lib/vagas";
import { cn } from "@/lib/utils";

type Erros = ErrosCandidatura & { curriculo?: string };
type Estado = "idle" | "enviando" | "enviado";

const ORIGEM_KEY = "solida-vagas-origem";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
const ORDEM_CAMPOS = ["vaga", "nome", "telefone", "email", "bairro", "curriculo", "consentimento"];
const FOTO_MAX_LADO = 2000;

/** UTMs do anúncio: lidas na chegada e guardadas na aba (sobrevivem a recarregar). */
function capturarOrigem(): Record<string, string> {
  try {
    const q = new URLSearchParams(window.location.search);
    const daUrl: Record<string, string> = {};
    for (const k of UTM_KEYS) {
      const v = q.get(k);
      if (v) daUrl[k] = v.slice(0, 150);
    }
    if (q.get("fbclid")) daUrl.fbclid = "1";
    if (Object.keys(daUrl).length > 0) {
      sessionStorage.setItem(ORIGEM_KEY, JSON.stringify(daUrl));
      return daUrl;
    }
    return JSON.parse(sessionStorage.getItem(ORIGEM_KEY) || "{}");
  } catch {
    return {};
  }
}

/** Foto de celular costuma passar de 4 MB: reduz para JPEG antes de enviar. */
async function comprimirSeFoto(file: File): Promise<File> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size <= COMPRIMIR_FOTO_ACIMA_DE) {
    return file;
  }
  try {
    const bitmap = await createImageBitmap(file);
    const escala = Math.min(1, FOTO_MAX_LADO / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * escala);
    canvas.height = Math.round(bitmap.height * escala);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.82));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}

const inputBase =
  "mt-1.5 block w-full rounded-xl border bg-white px-4 py-3 text-base text-ink placeholder:text-ink-muted/70 transition-colors " +
  "focus:border-ink focus:outline-none focus:ring-2 focus:ring-brand-action/25";

function Campo({
  id,
  label,
  opcional,
  erro,
  children,
}: {
  id: string;
  label: string;
  opcional?: boolean;
  erro?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
        {opcional ? <span className="ml-1 font-normal text-ink-muted">(opcional)</span> : null}
      </label>
      {children}
      {erro ? (
        <p id={`${id}-erro`} className="mt-1.5 text-sm text-brand-action">
          {erro}
        </p>
      ) : null}
    </div>
  );
}

export function CandidaturaForm() {
  const [estado, setEstado] = useState<Estado>("idle");
  const [erros, setErros] = useState<Erros>({});
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [vaga, setVaga] = useState("");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const sucessoRef = useRef<HTMLDivElement>(null);
  const origemRef = useRef<Record<string, string>>({});

  useEffect(() => {
    origemRef.current = capturarOrigem();
    const onVaga = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (VAGAS.some((v) => v.id === id)) setVaga(id);
    };
    window.addEventListener(VAGA_EVENT, onVaga);
    return () => window.removeEventListener(VAGA_EVENT, onVaga);
  }, []);

  useEffect(() => {
    if (estado === "enviado") sucessoRef.current?.focus();
  }, [estado]);

  function focarPrimeiroErro(e: Erros) {
    const campo = ORDEM_CAMPOS.find((k) => e[k as keyof Erros]);
    if (campo) formRef.current?.querySelector<HTMLElement>(`[name="${campo}"]`)?.focus();
  }

  function escolherArquivo(file: File | undefined) {
    setErros((e) => ({ ...e, curriculo: undefined }));
    if (!file) return setArquivo(null);
    if (file.size > MAX_CURRICULO_BYTES && !file.type.startsWith("image/")) {
      setArquivo(null);
      if (fileRef.current) fileRef.current.value = "";
      setErros((e) => ({
        ...e,
        curriculo: "O arquivo passa de 4 MB. Envie um PDF menor ou mande pelo WhatsApp do RH.",
      }));
      return;
    }
    setArquivo(file);
  }

  function removerArquivo() {
    setArquivo(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (estado === "enviando") return;
    setErroGeral(null);

    const fd = new FormData(e.currentTarget);
    const validacao = validarCandidatura(Object.fromEntries(fd));
    if (!validacao.ok) {
      setErros(validacao.erros);
      focarPrimeiroErro(validacao.erros);
      return;
    }
    setErros({});
    setEstado("enviando");

    fd.delete("curriculo");
    if (arquivo) {
      const final = await comprimirSeFoto(arquivo);
      if (final.size > MAX_CURRICULO_BYTES) {
        setEstado("idle");
        setErros({ curriculo: "O arquivo passa de 4 MB. Envie um menor ou mande pelo WhatsApp do RH." });
        return;
      }
      fd.append("curriculo", final, final.name);
    }
    for (const [k, v] of Object.entries(origemRef.current)) fd.append(k, v);

    try {
      const res = await fetch("/api/candidatura", { method: "POST", body: fd });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; erro?: string; erros?: Erros };
      if (res.ok && body.ok) {
        trackCandidatura({ vaga: validacao.dados.vaga, hasCv: Boolean(arquivo) });
        setEstado("enviado");
        return;
      }
      setEstado("idle");
      if (body.erros) {
        setErros(body.erros);
        focarPrimeiroErro(body.erros);
      } else {
        setErroGeral(body.erro || "Não conseguimos enviar agora. Tente de novo ou chame o RH no WhatsApp.");
      }
    } catch {
      setEstado("idle");
      setErroGeral("Sem conexão no momento. Tente de novo ou chame o RH no WhatsApp.");
    }
  }

  if (estado === "enviado") {
    return (
      <div
        ref={sucessoRef}
        tabIndex={-1}
        role="status"
        className="flex flex-col items-center px-2 py-10 text-center outline-none"
      >
        <span className="flex size-16 items-center justify-center rounded-full bg-whatsapp/15 text-whatsapp-hover">
          <CheckCircle2 className="size-9" aria-hidden />
        </span>
        <h3 className="mt-5 text-2xl font-bold">Candidatura enviada!</h3>
        <p className="mt-3 max-w-sm text-ink-body">
          Seus dados já chegaram ao RH da Sólida. Se o seu perfil combinar com a vaga, entramos em contato pelo
          telefone que você informou.
        </p>
        <WhatsAppRHLink source="sucesso" className={cn(buttonClasses("whatsapp", "md"), "mt-7")}>
          <WhatsAppIcon className="size-5" />
          Falar com o RH agora
        </WhatsAppRHLink>
      </div>
    );
  }

  const enviando = estado === "enviando";
  const invalido = (k: keyof Erros) =>
    erros[k] ? { "aria-invalid": true as const, "aria-describedby": `${k}-erro` } : {};

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-5">
      <Campo id="vaga" label="Vaga" erro={erros.vaga}>
        <select
          id="vaga"
          name="vaga"
          value={vaga}
          onChange={(e) => setVaga(e.target.value)}
          className={cn(inputBase, "appearance-none bg-[length:1.1rem] bg-[right_1rem_center] bg-no-repeat pr-10", erros.vaga ? "border-brand-action" : "border-line")}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
          }}
          {...invalido("vaga")}
        >
          <option value="" disabled>
            Escolha a vaga
          </option>
          {VAGAS.map((v) => (
            <option key={v.id} value={v.id}>
              {v.titulo}
            </option>
          ))}
        </select>
      </Campo>

      <Campo id="nome" label="Nome completo" erro={erros.nome}>
        <input
          id="nome"
          name="nome"
          autoComplete="name"
          maxLength={120}
          className={cn(inputBase, erros.nome ? "border-brand-action" : "border-line")}
          {...invalido("nome")}
        />
      </Campo>

      <div className="grid gap-5 sm:grid-cols-2">
        <Campo id="telefone" label="WhatsApp com DDD" erro={erros.telefone}>
          <input
            id="telefone"
            name="telefone"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="(62) 90000-0000"
            maxLength={20}
            className={cn(inputBase, erros.telefone ? "border-brand-action" : "border-line")}
            {...invalido("telefone")}
          />
        </Campo>
        <Campo id="email" label="E-mail" opcional erro={erros.email}>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={120}
            className={cn(inputBase, erros.email ? "border-brand-action" : "border-line")}
            {...invalido("email")}
          />
        </Campo>
      </div>

      <Campo id="bairro" label="Bairro e cidade onde você mora" erro={erros.bairro}>
        <input
          id="bairro"
          name="bairro"
          autoComplete="address-level2"
          placeholder="Ex.: Jardim Novo Mundo, Goiânia"
          maxLength={120}
          className={cn(inputBase, erros.bairro ? "border-brand-action" : "border-line")}
          {...invalido("bairro")}
        />
      </Campo>

      {/* Currículo */}
      <div>
        <p id="curriculo-label" className="text-sm font-semibold text-ink">
          Currículo <span className="font-normal text-ink-muted">(opcional)</span>
        </p>
        {arquivo ? (
          <div className="mt-1.5 flex items-center gap-3 rounded-xl border border-line bg-surface-alt px-4 py-3">
            <Paperclip className="size-5 shrink-0 text-brand-action" aria-hidden />
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{arquivo.name}</span>
            <button
              type="button"
              onClick={removerArquivo}
              aria-label="Remover arquivo"
              className="flex size-9 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-white hover:text-ink cursor-pointer focus-visible:outline-2 focus-visible:outline-brand-action"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
        ) : (
          <label
            htmlFor="curriculo"
            className={cn(
              "mt-1.5 flex cursor-pointer flex-col items-center gap-1 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors",
              "hover:border-brand-action/60 hover:bg-brand-tint focus-within:border-brand-action focus-within:bg-brand-tint",
              erros.curriculo ? "border-brand-action" : "border-line"
            )}
          >
            <FileUp className="size-6 text-brand-action" aria-hidden />
            <span className="text-sm font-semibold text-ink">Anexar currículo</span>
            <span className="text-xs text-ink-muted">PDF, Word ou foto do currículo · até 4 MB</span>
          </label>
        )}
        <input
          ref={fileRef}
          id="curriculo"
          name="curriculo"
          type="file"
          accept={CURRICULO_ACCEPT}
          aria-labelledby="curriculo-label"
          onChange={(e) => escolherArquivo(e.target.files?.[0])}
          className="sr-only"
          {...invalido("curriculo")}
        />
        {erros.curriculo ? (
          <p id="curriculo-erro" className="mt-1.5 text-sm text-brand-action">
            {erros.curriculo}
          </p>
        ) : null}
      </div>

      <Campo id="mensagem" label="Conte um pouco da sua experiência" opcional>
        <textarea
          id="mensagem"
          name="mensagem"
          rows={3}
          maxLength={1500}
          placeholder="Onde já trabalhou, há quanto tempo, cursos..."
          className={cn(inputBase, "resize-y border-line")}
        />
      </Campo>

      {/* Isca anti-robô: fora da tela e fora do teclado */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="site">Site</label>
        <input id="site" name="site" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-ink-body">
          <input
            type="checkbox"
            name="consentimento"
            className="mt-0.5 size-5 shrink-0 cursor-pointer accent-brand-action"
            {...invalido("consentimento")}
          />
          <span>
            Autorizo a Sólida Transporte a usar meus dados e meu currículo neste processo seletivo, conforme a{" "}
            <Link href="/politica-de-privacidade" target="_blank" className="font-semibold underline">
              Política de Privacidade
            </Link>
            .
          </span>
        </label>
        {erros.consentimento ? (
          <p id="consentimento-erro" className="mt-1.5 text-sm text-brand-action">
            {erros.consentimento}
          </p>
        ) : null}
      </div>

      {erroGeral ? (
        <p role="alert" className="rounded-xl bg-brand-tint px-4 py-3 text-sm font-medium text-brand-hover">
          {erroGeral}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={enviando}
        data-track="Enviar candidatura"
        className="w-full transition-[background-color,transform,box-shadow] hover:scale-[1.01] hover:shadow-lg hover:shadow-brand-action/25 disabled:cursor-wait disabled:opacity-80 motion-reduce:hover:scale-100"
      >
        {enviando ? (
          <>
            <Loader2 className="size-5 animate-spin" aria-hidden />
            Enviando...
          </>
        ) : (
          "Enviar candidatura"
        )}
      </Button>
    </form>
  );
}
