import { WhatsAppProvider } from "@/components/whatsapp/WhatsAppProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { CookieBanner } from "@/components/layout/CookieBanner";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <WhatsAppProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFloat />
      <CookieBanner />
    </WhatsAppProvider>
  );
}
