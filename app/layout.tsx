import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Sólida Transporte — Cargas fracionadas SP, GO e DF",
    template: "%s | Sólida Transporte",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "pt_BR",
    title: "Sólida Transporte — Cargas fracionadas SP, GO e DF",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/assets/hero-sede.jpg",
        width: 1200,
        height: 630,
        alt: "Sede e frota da Sólida Transporte",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sólida Transporte — Cargas fracionadas SP, GO e DF",
    description: SITE_DESCRIPTION,
    images: ["/assets/hero-sede.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${sora.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
