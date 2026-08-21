import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { PostCard } from "@/components/blog/PostCard";
import { buttonClasses } from "@/components/ui/Button";
import { getPublishedPosts } from "@/lib/blog";

/**
 * Seção "Blog" da Home: lista os 3 últimos posts publicados no Supabase.
 * Enquanto não houver posts, mantém os cards-placeholder das pautas do
 * calendário editorial. Revalidada on-demand quando o admin publica.
 */
const PLACEHOLDER_POSTS = [
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

export async function BlogTeaser() {
  const { posts } = await getPublishedPosts({ limit: 3 });

  return (
    <section className="bg-surface py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Blog"
          title="Conteúdo para quem vive de logística"
          subtitle={
            posts.length > 0
              ? "Artigos práticos sobre frete, operação e gestão logística, direto do blog da Sólida."
              : "Artigos práticos sobre frete, operação e gestão logística — em breve no novo blog da Sólida."
          }
        />

        {posts.length > 0 ? (
          <>
            <ul className="grid gap-6 md:grid-cols-3">
              {posts.map((post, i) => (
                <Reveal key={post.id} delay={i * 0.1} as="li" className="h-full">
                    <PostCard post={post} />
                  </Reveal>
              ))}
            </ul>
            <Reveal className="mt-10 text-center" delay={0.2}>
              <Link href="/blog" className={buttonClasses("secondary", "md")}>
                Ver todos os artigos
              </Link>
            </Reveal>
          </>
        ) : (
          <ul className="grid gap-6 md:grid-cols-3">
            {PLACEHOLDER_POSTS.map((post, i) => (
              <Reveal key={post.title} delay={i * 0.1} as="li" className="group h-full overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
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
                    <h3 className="font-bold leading-snug text-ink">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-xs font-semibold tracking-wide text-brand-action uppercase">
                      Em breve
                    </p>
                  </div>
                </Reveal>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}
