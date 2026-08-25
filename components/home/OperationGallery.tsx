import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { WhatsAppCTAButton } from "@/components/whatsapp/WhatsAppCTAButton";

const PHOTOS = [
  {
    src: "/assets/op-galpao.jpg",
    alt: "Interior do galpão da Sólida com cargas organizadas em pallets",
    caption: "Galpão de chegada e despacho em Goiânia",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    src: "/assets/op-equipe.jpg",
    alt: "Equipe da Sólida conferindo mercadorias no galpão",
    caption: "Conferência de carga",
    span: "",
  },
  {
    src: "/assets/op-frota.jpg",
    alt: "Caminhões da frota Sólida estacionados lado a lado",
    caption: "Frota própria",
    span: "",
  },
  {
    src: "/assets/op-carga.jpg",
    alt: "Caixas e volumes engradados prontos para despacho",
    caption: "Volumes prontos para despacho",
    span: "",
  },
  {
    src: "/assets/op-empilhadeira.jpg",
    alt: "Empilhadeira da Sólida ao lado de pallets de madeira",
    caption: "Movimentação interna",
    span: "col-span-2 md:col-span-1",
  },
];

export function OperationGallery() {
  return (
    <section className="bg-surface-alt py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Por dentro da operação"
          title="Galpão, frota e equipe próprios"
          subtitle="Quem coleta, despacha e entrega a sua carga é a própria Sólida. Nosso galpão é ponto de chegada e despacho: a mercadoria passa por ele, não fica parada."
        />
        <ul className="grid auto-rows-[200px] grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:auto-rows-[220px]">
          {PHOTOS.map((p, i) => (
            <Reveal
              key={p.src}
              as="li"
              delay={i * 0.07}
              className={`group relative overflow-hidden rounded-2xl ${p.span}`}
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent"
                aria-hidden
              />
              <span className="absolute inset-x-0 bottom-0 p-4 text-sm font-semibold text-white sm:text-base">
                {p.caption}
              </span>
            </Reveal>
          ))}
        </ul>
        <Reveal delay={0.2} className="mt-10 text-center">
          <WhatsAppCTAButton variant="primary" size="lg" withIcon={false}>
            Quer conhecer a estrutura? Fale com a gente.
          </WhatsAppCTAButton>
        </Reveal>
      </Container>
    </section>
  );
}
