import {
  Bike,
  Cog,
  Dumbbell,
  Home,
  Monitor,
  Smartphone,
  Sparkles,
  UtensilsCrossed,
  Wine,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card3D } from "@/components/ui/animated-3d-card";
import { Reveal } from "@/components/motion/Reveal";
import { WhatsAppCTAButton } from "@/components/whatsapp/WhatsAppCTAButton";

const SEGMENTS = [
  { Icon: Smartphone, label: "Acessórios para celular" },
  { Icon: Cog, label: "Autopeças" },
  { Icon: Bike, label: "Acessórios para motos" },
  { Icon: Sparkles, label: "Cosméticos" },
  { Icon: Home, label: "Automação residencial" },
  { Icon: Dumbbell, label: "Suplementação animal e alimentar" },
  { Icon: Monitor, label: "Equipamentos de informática" },
  { Icon: UtensilsCrossed, label: "Alimentos" },
  { Icon: Wine, label: "Vinhos" },
];

export function Segments() {
  return (
    <section className="bg-surface py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Segmentos"
          title="Feito para quem envia caixas e volumes menores"
        />
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {SEGMENTS.map(({ Icon, label }, i) => (
            <Reveal key={label} delay={i * 0.05} as="li" className="h-full">
              <Card3D
                glare="dark"
                className="group flex h-full items-center gap-3.5 rounded-2xl border border-line bg-white p-4 transition-[border-color,box-shadow] duration-300 hover:border-brand-action/30 hover:shadow-md sm:p-5"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-tint text-brand-action transition-transform duration-300 group-hover:scale-110">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="text-sm font-semibold text-ink">{label}</span>
              </Card3D>
            </Reveal>
          ))}
        </ul>
        <Reveal delay={0.2} className="mt-10 text-center">
          <WhatsAppCTAButton variant="primary" size="lg" withIcon={false}>
            Seu segmento está aqui? Fale no WhatsApp.
          </WhatsAppCTAButton>
        </Reveal>
      </Container>
    </section>
  );
}
