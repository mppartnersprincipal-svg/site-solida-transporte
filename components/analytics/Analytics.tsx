"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import {
  CONSENT_EVENT,
  GA4_ID,
  GTM_ID,
  META_PIXEL_ID,
  pushConsent,
  readConsent,
} from "@/lib/analytics";

/**
 * Scripts de medição — só carregam APÓS o aceite no banner de cookies (LGPD)
 * e apenas se as chaves existirem no .env. Sem chave e sem consentimento,
 * não renderiza nada.
 *
 * Caminho principal: GTM (NEXT_PUBLIC_GTM_ID) — GA4, Google Ads e Meta Pixel
 * são configurados dentro do container (ver gtm/TRACKING.md). Os eventos do
 * site chegam via dataLayer (catálogo em lib/analytics.ts).
 *
 * Consent Mode v2: o `default` (negado) entra no dataLayer no primeiro render;
 * ao aceitar, um `update` (concedido) é enviado ANTES do gtm.js carregar —
 * assim as tags Google com verificação de consentimento disparam normalmente.
 *
 * GA4_ID/META_PIXEL_ID diretos continuam suportados como fallback, mas não
 * devem ser preenchidos junto com o GTM (mediria em dobro).
 */
export function Analytics() {
  const [consented, setConsented] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Consent Mode: padrão negado até o usuário decidir
    pushConsent("default", false);
    const sync = () => {
      const accepted = readConsent()?.accepted === true;
      if (accepted) pushConsent("update", true);
      setConsented(accepted);
    };
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, []);

  // Pageview em navegações SPA e no load inicial (a Google tag no GTM fica
  // com send_page_view=false e uma tag GA4 dispara no evento "page_view")
  useEffect(() => {
    if (!consented) return;
    const params = {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    };
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "page_view", ...params });
    window.gtag?.("event", "page_view", params);
    window.fbq?.("track", "PageView");
    // pathname na dependência: dispara a cada troca de rota
  }, [pathname, consented]);

  if (!consented) return null;

  return (
    <>
      {GTM_ID ? (
        <Script id="gtm-init" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `}
        </Script>
      ) : null}

      {GA4_ID ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${GA4_ID}', { anonymize_ip: true });
            `}
          </Script>
        </>
      ) : null}

      {META_PIXEL_ID ? (
        <Script id="meta-pixel-init" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      ) : null}
    </>
  );
}
