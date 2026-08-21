import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Login | Área administrativa",
};

export default function LoginPage() {
  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden bg-ink px-4 py-16">
      <div
        aria-hidden
        className="absolute -top-24 right-0 size-96 rounded-full bg-brand-action/10 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -left-16 size-96 rounded-full bg-white/5 blur-3xl"
      />

      <div className="relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <Image
            src="/assets/solida-white-retina.png"
            alt="Sólida Transporte"
            width={180}
            height={63}
            className="mx-auto h-12 w-auto"
            priority
          />
          <p className="mt-4 text-sm text-white/60">
            Área administrativa do blog
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white p-6 shadow-2xl sm:p-8">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-sm">
          <Link
            href="/"
            className="text-white/50 transition-colors hover:text-white"
          >
            ← Voltar para o site
          </Link>
        </p>
      </div>
    </main>
  );
}
