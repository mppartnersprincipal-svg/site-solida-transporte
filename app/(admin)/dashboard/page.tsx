import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Dashboard | Área administrativa",
};

// Placeholder da Fase D1 — o painel completo entra na Fase D2.
export default function DashboardPlaceholder() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <BarChart3 aria-hidden className="size-12 text-ink-muted/40" />
      <h1 className="mt-4 text-2xl font-bold text-ink">Dashboard em construção</h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
        A coleta de dados já está ativa no site. Os gráficos e relatórios entram na
        próxima fase.
      </p>
      <Link href="/admin" className={`${buttonClasses("primary", "md")} mt-6`}>
        Ir para os posts do blog
      </Link>
    </div>
  );
}
