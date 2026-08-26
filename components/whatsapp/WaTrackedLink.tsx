"use client";

import { trackWhatsAppClick } from "@/lib/analytics";
import { labelSource, labelSubject } from "@/lib/analytics-types";

/**
 * Link de WhatsApp (wa.me) com evento de analytics no clique.
 * Usar em QUALQUER link direto de WhatsApp fora do modal da Central,
 * para o funil registrar assunto + origem (plano §6.3/§10).
 */
export function WaTrackedLink({
  href,
  subject,
  option,
  source,
  className,
  children,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  subject: string;
  option?: string;
  source: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackWhatsAppClick({ subject, option, source })}
      data-track={`WhatsApp: ${labelSubject(subject)}${option ? ` › ${option}` : ""} (${labelSource(source)})`}
      {...rest}
    >
      {children}
    </a>
  );
}
