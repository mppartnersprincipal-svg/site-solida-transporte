"use client";

import {
  trackEmailClick,
  trackMapsClick,
  trackPhoneClick,
  trackSocialClick,
} from "@/lib/analytics";

type Kind =
  | { kind: "phone"; phone: string; label?: string; source: string }
  | { kind: "email"; email: string; source: string }
  | { kind: "social"; network: string; source: string }
  | { kind: "maps"; unit: string };

/**
 * Link comum com evento de analytics no clique (tel:, mailto:, redes sociais,
 * "Ver no mapa"). Para links de WhatsApp use `WaTrackedLink`.
 */
export function TrackedLink({
  track,
  onClick,
  children,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { track: Kind }) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        switch (track.kind) {
          case "phone":
            trackPhoneClick({ phone: track.phone, label: track.label, source: track.source });
            break;
          case "email":
            trackEmailClick({ email: track.email, source: track.source });
            break;
          case "social":
            trackSocialClick({ network: track.network, source: track.source });
            break;
          case "maps":
            trackMapsClick(track.unit);
            break;
        }
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
