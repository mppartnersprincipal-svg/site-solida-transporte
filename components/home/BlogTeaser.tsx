import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

/**
 * PLACEHOLDER — na Fase 3 esta seção passa a listar os últimos posts
 * publicados no Supabase. Pautas do calendário editorial do briefing.
 */
const POSTS = [
  {
    title: "Por que o frete mais barato pode sair caro?",
    category: "Frete",
    image: "/assets/blog/frete-barato.png",
  },
  {
    title: "Carga fracionada x carga fechada: qual a diferença?",
    category: "Logística",
    image: "/assets/blog/carga-fracionada.png",
  },
  {
    title: "FOB x CIF: qual a diferença e quem paga o frete?",
    category: "Fiscal",
    image: "/assets/blog/fob-cif.webp",
  },
];

export function BlogTeaser() {
  return (
    <section className="bg-surface py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Blog"
          title="Conteúdo para quem vive de logística"
          subtitle="Artigos práticos sobre frete, operação e gestão logística — em breve no novo blog da Sólida."
        />
        <ul className="grid gap-6 md:grid-cols-3">
          {POSTS.map((post, i) => (
            <Reveal key={post.title} delay={i * 0.1}>
              <li className="group h-full overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="relative aspect-[3/2] overflow-hidden bg-surface-alt">
                  <Image
                    src={post.image}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                    {post.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold leading-snug text-ink">{post.title}</h3>
                  <p className="mt-3 text-xs font-semibold tracking-wide text-brand-action uppercase">
                    Em breve
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
