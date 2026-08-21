import Image from "next/image";
import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/(admin)/admin/actions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ink text-white">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="flex items-center gap-3">
            <Image
              src="/assets/solida-white-retina.png"
              alt="Sólida Transporte"
              width={120}
              height={42}
              className="h-8 w-auto"
            />
            <span className="hidden rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-white/80 sm:inline">
              Admin
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/blog"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 transition-colors hover:text-white"
            >
              Ver site
              <ExternalLink aria-hidden className="size-3.5" />
            </Link>
            {user?.email ? (
              <span
                className="hidden max-w-48 truncate text-sm text-white/50 md:inline"
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
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {children}
      </main>
    </>
  );
}
