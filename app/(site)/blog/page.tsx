import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { getPublishedCategories, getPublishedPosts } from "@/lib/blog";

// ISR: além da revalidação on-demand ao publicar (server action do admin),
// a listagem se renova sozinha a cada hora.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog",
  alternates: { canonical: "/blog" },
  description:
    "Conteúdo para quem vive de logística: frete, cargas fracionadas, prazos, seguro de carga e gestão de estoque, pela Sólida Transporte.",
};

export default async function BlogPage() {
  const [{ posts, total }, categories] = await Promise.all([
    getPublishedPosts(),
    getPublishedCategories(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Conteúdo para quem vive de logística"
        subtitle="Artigos práticos sobre frete, operação e gestão logística, escritos por quem transporta cargas fracionadas há 32 anos."
      />
      <section className="bg-surface py-16 sm:py-24">
        <Container>
          <BlogGrid
            initialPosts={posts}
            initialTotal={total}
            categories={categories}
          />
        </Container>
      </section>
    </>
  );
}
