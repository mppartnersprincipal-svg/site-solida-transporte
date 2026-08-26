import Image from "next/image";
import Link from "next/link";
import { BarChart3, ExternalLink, FileText, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/(admin)/admin/actions";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "dashboard", href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "posts", href: "/admin", label: "Posts", icon: FileText },
] as const;

type TabId = (typeof TABS)[number]["id"];

/**
 * Casca compartilhada da área privada: header escuro com logo, abas
 * (Dashboard / Posts), link para o site, e-mail do usuário e Sair.
 * Usada pelos layouts de /admin e /dashboard.
 */
export async function AdminShell({
  active,
  wide = false,
  children,
}: {
  active: TabId;
  wide?: boolean;
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const width = wide ? "max-w-7xl" : "max-w-6xl";

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ink text-white">
        <div className={cn("mx-auto flex h-16 w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8", width)}>
          <div className="flex min-w-0 items-center gap-6">
            <Link href="/dashboard" className="flex shrink-0 items-center gap-3">
              <Image
                src="/assets/solida-white-retina.png"
                alt="Sólida Transporte"
                width={120}
                height={42}
                className="h-8 w-auto"
              />
            </Link>
            <nav aria-label="Área administrativa" className="flex items-center gap-1">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = tab.id === active;
                return (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors",
                      isActive
                        ? "bg-white text-ink"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <Icon aria-hidden className="size-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 transition-colors hover:text-white"
            >
              <span className="hidden sm:inline">Ver site</span>
              <ExternalLink aria-hidden className="size-3.5" />
            </Link>
            {user?.email ? (
              <span
                className="hidden max-w-48 truncate text-sm text-white/50 lg:inline"
                title={user.email}
              >
                {user.email}
              </span>
            ) : null}
            <form action={signOut}>
              <button
                type="submit"
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/20 px-3.5 py-1.5 text-sm font-semibold text-white/80 transition-colors hover:border-white hover:text-white"
              >
                <LogOut aria-hidden className="size-3.5" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className={cn("mx-auto w-full flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8", width)}>
        {children}
      </main>
    </>
  );
}
