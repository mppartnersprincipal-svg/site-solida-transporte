import { WhatsAppProvider } from "@/components/whatsapp/WhatsAppProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { Analytics } from "@/components/analytics/Analytics";
import { Collector } from "@/components/analytics/Collector";
import { JsonLd } from "@/components/seo/JsonLd";
import { ORGANIZATION_JSONLD } from "@/lib/seo";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <WhatsAppProvider>
      {/* Acessibilidade: pular direto para o conteúdo via teclado */}
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white focus:outline-2 focus:outline-offset-2 focus:outline-brand-action"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" className="flex-1">
        {children}
      </main>
      <Footer />
      <WhatsAppFloat />
      <CookieBanner />
      <Analytics />
      <Collector />
      <JsonLd data={ORGANIZATION_JSONLD} />
    </WhatsAppProvider>
  );
}
