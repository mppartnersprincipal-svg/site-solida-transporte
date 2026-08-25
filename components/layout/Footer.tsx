import Link from "next/link";
import Image from "next/image";
import { MapPin, ShieldCheck } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
} from "@/components/layout/SocialIcons";
import { Container } from "@/components/ui/Container";
import { WhatsAppIcon } from "@/components/layout/WhatsAppIcon";
import { FOOTER_LINKS } from "@/components/layout/nav-links";
import { WA_SUBJECTS, WHATSAPP_NUMBERS, waLink } from "@/lib/whatsapp";
import { WaTrackedLink } from "@/components/whatsapp/WaTrackedLink";

const UNITS = [
  {
    city: "Goiânia - GO",
    role: "Matriz",
    phoneLabel: "(62) 3206-3513",
    href: waLink(WHATSAPP_NUMBERS.goianiaComercial, "Olá! Vim pelo site da Sólida."),
  },
  {
    city: "São Paulo - SP",
    role: "Filial",
    phoneLabel: "(11) 3936-8284",
    href: waLink(WHATSAPP_NUMBERS.coletaSP, "Olá! Vim pelo site da Sólida."),
  },
  {
    city: "Brasília - DF",
    role: "Filial",
    phoneLabel: "(61) 99653-2064",
    href: waLink(WHATSAPP_NUMBERS.brasiliaComercial, "Olá! Vim pelo site da Sólida."),
  },
];

// TODO: validar URL de LinkedIn com a Sólida (Facebook veio da auditoria)
const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/solidatransporte/", Icon: InstagramIcon },
  { label: "LinkedIn", href: "#", Icon: LinkedInIcon },
  { label: "Facebook", href: "https://facebook.com/solidatransporte", Icon: FacebookIcon },
];

export function Footer() {
  return (
    <footer className="bg-ink text-white/70">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Coluna 1 — marca + selos */}
        <div>
          <Image
            src="/assets/solida-white-retina.png"
            alt="Sólida Transporte"
            width={150}
            height={53}
            className="h-auto w-36"
          />
          <p className="mt-4 text-sm leading-relaxed">
            Transportadora de cargas fracionadas entre São Paulo, Goiás, Distrito Federal e a cidade do Rio de Janeiro. Há 32 anos na estrada, com o mesmo CNPJ desde a fundação.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1 text-xs font-medium text-white/80">
              32 anos de mercado
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1 text-xs font-medium text-white/80">
              <ShieldCheck className="size-3.5 text-brand" aria-hidden />
              Seguro de carga
            </span>
          </div>
        </div>

        {/* Coluna 2 — navegação */}
        <nav aria-label="Navegação do rodapé">
          <h3 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">
            Navegação
          </h3>
          <ul className="flex flex-col gap-2.5">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Coluna 3 — unidades */}
        <div>
          <h3 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">
            Unidades
          </h3>
          <ul className="flex flex-col gap-4">
            {UNITS.map((unit) => (
              <li key={unit.city} className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
                <div className="text-sm">
                  <p className="font-medium text-white">
                    {unit.city}{" "}
                    <span className="font-normal text-white/50">· {unit.role}</span>
                  </p>
                  <WaTrackedLink
                    href={unit.href}
                    subject="unidade"
                    option={unit.city}
                    source="footer"
                    className="transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    {unit.phoneLabel}
                  </WaTrackedLink>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Coluna 4 — Central de WhatsApp + redes */}
        <div>
          <h3 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">
            Central de WhatsApp
          </h3>
          <ul className="flex flex-col gap-2">
            {WA_SUBJECTS.map((subject) => (
              <li key={subject.id}>
                <WaTrackedLink
                  href={subject.href ?? subject.options?.[0]?.href ?? "#"}
                  subject={subject.id}
                  source="footer"
                  className="inline-flex items-center gap-2 text-sm transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <WhatsAppIcon className="size-3.5 text-whatsapp" />
                  {subject.label}
                </WaTrackedLink>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex gap-3">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex size-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/40 hover:text-white focus-visible:outline-2 focus-visible:outline-white"
              >
                <Icon className="size-4.5" />
              </a>
            ))}
          </div>
        </div>
      </Container>

      {/* Barra inferior */}
      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-3 py-5 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Sólida Transporte. Todos os direitos reservados.</p>
          <div className="flex gap-5">
            <Link
              href="/politica-de-privacidade"
              className="transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Política de Privacidade
            </Link>
            <Link
              href="/politica-de-cookies"
              className="transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Política de Cookies
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
