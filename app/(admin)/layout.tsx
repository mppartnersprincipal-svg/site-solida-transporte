import type { Metadata } from "next";

// Área privada: nunca indexar login/painel
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex min-h-dvh flex-1 flex-col bg-surface-alt">{children}</div>;
}
