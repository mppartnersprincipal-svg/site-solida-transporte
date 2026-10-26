import { CookieBanner } from "@/components/layout/CookieBanner";
import { Analytics } from "@/components/analytics/Analytics";
import { Collector } from "@/components/analytics/Collector";

/**
 * Layout das landing pages de anúncio (hoje: /trabalhe-conosco).
 * Sem menu, rodapé completo nem Central de WhatsApp — quem chega do anúncio
 * só tem o caminho da conversão. Mantém consentimento + GTM + coletor.
 */
export default function LpLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CookieBanner />
      <Analytics />
      <Collector />
    </>
  );
}
