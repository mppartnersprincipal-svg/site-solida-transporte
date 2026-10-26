"use client";

import { ArrowDown } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";

/** Evento que o formulário escuta para já deixar a vaga escolhida. */
export const VAGA_EVENT = "solida:vaga";

/** "Quero esta vaga": rola até o formulário com a vaga marcada. */
export function CandidatarButton({ vagaId, titulo }: { vagaId: string; titulo: string }) {
  return (
    <a
      href="#candidatura"
      data-track={`Quero esta vaga: ${titulo}`}
      onClick={() => window.dispatchEvent(new CustomEvent(VAGA_EVENT, { detail: vagaId }))}
      className={buttonClasses("secondary", "md") + " w-full"}
    >
      Quero esta vaga
      <ArrowDown className="size-4" aria-hidden />
    </a>
  );
}
