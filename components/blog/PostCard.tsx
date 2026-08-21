import Image from "next/image";
import Link from "next/link";
import { Truck } from "lucide-react";
import { formatPostDate, type PostCard as PostCardData } from "@/lib/blog";

/** Card de post do blog — mesmo visual dos cards do BlogTeaser da Home. */
export function PostCard({ post }: { post: PostCardData }) {
  return (
    <article className="group h-full overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/blog/${post.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-[3/2] overflow-hidden bg-surface-alt">
          {post.cover_url ? (
            <Image
              src={post.cover_url}
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-ink">
              <Truck aria-hidden className="size-10 text-white/25" />
            </div>
          )}
          {post.category ? (
            <span className="absolute top-3 left-3 rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              {post.category}
            </span>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col p-5">
          {post.published_at ? (
            <time
              dateTime={post.published_at}
              className="text-xs font-medium text-ink-muted"
            >
              {formatPostDate(post.published_at)}
            </time>
          ) : null}
          <h3 className="mt-2 font-bold leading-snug text-ink transition-colors group-hover:text-brand-action">
            {post.title}
          </h3>
          {post.excerpt ? (
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-muted">
              {post.excerpt}
            </p>
          ) : null}
          <span className="mt-auto pt-4 text-xs font-semibold tracking-wide text-brand-action uppercase">
            Ler artigo →
          </span>
        </div>
      </Link>
    </article>
  );
}
