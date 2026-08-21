"use client";

import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/layout/WhatsAppIcon";
import { useWhatsApp } from "@/components/whatsapp/WhatsAppProvider";

/** CTA reutilizável: abre a Central de WhatsApp (modal de assuntos). */
export function WhatsAppCTAButton({
  children,
  variant = "primary",
  size = "lg",
  withIcon = true,
  className,
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline-light" | "whatsapp";
  size?: "md" | "lg";
  withIcon?: boolean;
  className?: string;
}) {
  const { open } = useWhatsApp();

  return (
    <Button variant={variant} size={size} className={className} onClick={open}>
      {withIcon && <WhatsAppIcon className="size-4.5" />}
      {children}
    </Button>
  );
}
