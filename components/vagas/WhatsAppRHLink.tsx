"use client";

import { trackWhatsAppRH } from "@/lib/analytics";
import { WA_RH_MESSAGE, WHATSAPP_NUMBERS, waLink } from "@/lib/whatsapp";

export const WA_RH_HREF = waLink(WHATSAPP_NUMBERS.rh, WA_RH_MESSAGE);

interface WhatsAppRHLinkProps {
  /** Onde o clique aconteceu (header, hero, formulario, float...) */
  source: string;
  className?: string;
  children: React.ReactNode;
  "aria-label"?: string;
  title?: string;
}

/**
 * Link direto para o WhatsApp do RH. Dispara `whatsapp_rh_click`, que NÃO é
 * conversão de frete (o `WaTrackedLink` da Central dispara `whatsapp_click`).
 */
export function WhatsAppRHLink({ source, className, children, ...rest }: WhatsAppRHLinkProps) {
  return (
    <a
      href={WA_RH_HREF}
      target="_blank"
      rel="noopener noreferrer"
      data-track={`WhatsApp do RH (${source})`}
      onClick={() => trackWhatsAppRH(source)}
      className={className}
      {...rest}
    >
      {children}
    </a>
  );
}
