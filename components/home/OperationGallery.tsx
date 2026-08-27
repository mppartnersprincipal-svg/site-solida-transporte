import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { WhatsAppCTAButton } from "@/components/whatsapp/WhatsAppCTAButton";

const PHOTOS = [
  {
    src: "/assets/op-galpao.jpg",
    alt: "Interior do galpão da Sólida com cargas organizadas em pallets",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    src: "/assets/op-equipe.jpg",
    alt: "Equipe da Sólida conferindo mercadorias no galpão",
    span: "",
  },
  {
    src: "/assets/op-frota.jpg",
    alt: "Caminhões da frota Sólida estacionados lado a lado",
    span: "",
  },
  {
    src: "/assets/op-carga.jpg",
    alt: "Caixas e volumes engradados prontos para despacho",
    span: "",
  },
  {
    src: "/assets/op-empilhadeira.jpg",
    alt: "Empilhadeira da Sólida ao lado de pallets de madeira",
    span: "col-span-2 md:col-span-1",
  },
  {
    src: "/assets/op-carreta.webp",
    alt: "Carreta Iveco Stralis da Sólida Transporte estacionada no pátio",
    span: "md:row-span-2",
  },
  {
    src: "/assets/op-patio-frota.webp",
    alt: "Carreta e caminhões baú da Sólida enfileirados em frente ao galpão",
    span: "col-span-2",
  },
  {
    src: "/assets/op-conferencia-patio.webp",
    alt: "Colaborador confere documentos com prancheta diante de uma carreta da Sólida",
    span: "",
  },
  {
    src: "/assets/op-carregamento.webp",
    alt: "Caixas paletizadas no galpão com carreta encostada na doca para carregamento",
    span: "col-span-2",
  },
  {
    src: "/assets/op-paleteira.webp",
    alt: "Colaborador da Sólida organizando volumes em pallet com paleteira manual",
    span: "",
  },
];

export function OperationGallery() {
  return (
    <section className="bg-surface-alt py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Por dentro da operação"
          title="Galpão, frota e equipe próprios"
          subtitle="Do início ao fim, a operação é feita com frota e equipe próprias. Em algumas regiões do interior, contamos com parceiros homologados e certificados, com quem mantemos parceria de longa data."
        />
        <ul className="grid grid-flow-dense auto-rows-[200px] grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:auto-rows-[220px]">
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
            </Reveal>
          ))}
        </ul>
        <Reveal delay={0.2} className="mt-10 text-center">
          <WhatsAppCTAButton variant="primary" size="lg" withIcon={false} className="w-full sm:w-auto">
            Quer conhecer a estrutura? Fale com a gente.
          </WhatsAppCTAButton>
        </Reveal>
      </Container>
    </section>
  );
}
