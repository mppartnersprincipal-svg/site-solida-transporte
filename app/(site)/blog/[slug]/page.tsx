import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { PostCard } from "@/components/blog/PostCard";
import { WhatsAppCTAButton } from "@/components/whatsapp/WhatsAppCTAButton";
import { PostViewTracker } from "@/components/analytics/PostViewTracker";
import {
  formatPostDate,
  getPostBySlug,
  getPublishedSlugs,
  getRelatedPosts,
} from "@/lib/blog";

// ISR: página estática por slug, revalidada on-demand ao publicar/editar
// (server actions do admin) e a cada hora por segurança.
export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post não encontrado" };

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      type: "article",
      publishedTime: post.published_at ?? undefined,
      images: post.cover_url ? [{ url: post.cover_url }] : undefined,
    },
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.cover_url ?? undefined,
    datePublished: post.published_at ?? undefined,
    dateModified: post.updated_at,
    author: { "@type": "Organization", name: "Sólida Transporte" },
    publisher: { "@type": "Organization", name: "Sólida Transporte" },
  };

  return (
    <article>
      <PostViewTracker slug={post.slug} title={post.title} category={post.category} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Cabeçalho escuro no padrão das páginas internas */}
      <header className="relative overflow-hidden bg-ink pt-12 pb-16 text-white sm:pt-16 sm:pb-24">
        <div
          aria-hidden
          className="absolute -top-24 right-0 size-80 rounded-full bg-brand-action/10 blur-3xl"
        />
        <Container className="relative">
          <div className="mx-auto max-w-4xl">
          <Reveal>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/60 transition-colors hover:text-white"
            >
              <ArrowLeft aria-hidden className="size-4" />
              Voltar para o blog
            </Link>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold tracking-wide uppercase">
              {post.category ? (
                <span className="rounded-full bg-brand-action px-3 py-1 text-white">
                  {post.category}
                </span>
              ) : null}
              {post.published_at ? (
                <time dateTime={post.published_at} className="text-white/60">
                  {formatPostDate(post.published_at)}
                </time>
              ) : null}
            </div>
          </Reveal>
          <Reveal delay={0.16}>
            <h1 className="mt-4 text-3xl font-bold leading-tight text-white text-balance sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>
          </Reveal>
          {post.excerpt ? (
            <Reveal delay={0.24}>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
                {post.excerpt}
              </p>
            </Reveal>
          ) : null}
          </div>
        </Container>
      </header>

      <div className="bg-surface pb-16 sm:pb-24">
        <Container>
          <div className="mx-auto max-w-4xl">
          {/* Capa sobreposta ao cabeçalho escuro */}
          {post.cover_url ? (
            <div className="relative -mt-8 mb-10 aspect-[2/1] overflow-hidden rounded-2xl border border-line shadow-lg sm:-mt-12 sm:mb-14">
              <Image
                src={post.cover_url}
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 896px, 100vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="pt-10 sm:pt-14" />
          )}

          <div
            className="post-body mx-auto max-w-3xl"
            dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
          />

          {post.tags.length > 0 ? (
            <div className="mx-auto mt-10 flex max-w-3xl flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-surface-alt px-3 py-1 text-xs font-semibold text-ink-muted"
                >
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}

          {/* CTA de WhatsApp no fim do post (plano §7.1) */}
          <Reveal className="mx-auto mt-14 max-w-3xl">
            <aside className="relative overflow-hidden rounded-2xl bg-ink px-6 py-10 text-center text-white sm:px-10">
              <div
                aria-hidden
                className="absolute -top-16 right-0 size-56 rounded-full bg-brand-action/15 blur-3xl"
              />
              <h2 className="relative text-2xl font-bold text-white text-balance sm:text-3xl">
                Precisa transportar entre SP, Goiás, DF e Rio de Janeiro?
              </h2>
              <p className="relative mx-auto mt-3 max-w-xl text-white/75">
                Fale agora com nosso time comercial pelo WhatsApp e receba sua
                cotação.
              </p>
              <div className="relative mt-7">
                <WhatsAppCTAButton variant="whatsapp" source="post">
                  Pedir cotação no WhatsApp
                </WhatsAppCTAButton>
              </div>
            </aside>
          </Reveal>
          </div>
        </Container>

        {/* Posts relacionados */}
        {related.length > 0 ? (
          <Container className="mt-16 sm:mt-24">
            <Reveal>
              <h2 className="mb-8 text-center text-2xl font-bold sm:text-3xl">
                Continue lendo
              </h2>
            </Reveal>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.1} as="li" className="h-full">
                    <PostCard post={p} />
                  </Reveal>
              ))}
            </ul>
          </Container>
        ) : null}
      </div>
    </article>
  );
}
