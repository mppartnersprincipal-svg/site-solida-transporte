"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PostCard } from "@/components/blog/PostCard";
import { createClient } from "@/lib/supabase/client";
import {
  fetchPublishedPosts,
  POSTS_PAGE_SIZE,
  type PostCard as PostCardData,
} from "@/lib/blog";
import { cn } from "@/lib/utils";

/**
 * Grid do /blog com filtro por categoria e "Carregar mais".
 * A primeira página vem do servidor (ISR); filtro e paginação buscam
 * direto no Supabase pelo browser (RLS só expõe posts publicados).
 */
export function BlogGrid({
  initialPosts,
  initialTotal,
  categories,
}: {
  initialPosts: PostCardData[];
  initialTotal: number;
  categories: string[];
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [total, setTotal] = useState(initialTotal);
  const [category, setCategory] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const hasMore = posts.length < total;

  function selectCategory(next: string | null) {
    if (next === category) return;
    setCategory(next);
    startTransition(async () => {
      if (next === null) {
        // "Todas" volta ao estado do servidor sem nova query
        setPosts(initialPosts);
        setTotal(initialTotal);
        return;
      }
      const result = await fetchPublishedPosts(createClient(), {
        category: next,
      });
      setPosts(result.posts);
      setTotal(result.total);
    });
  }

  function loadMore() {
    startTransition(async () => {
      const result = await fetchPublishedPosts(createClient(), {
        category,
        offset: posts.length,
      });
      setPosts((prev) => [...prev, ...result.posts]);
      setTotal(result.total);
    });
  }

  const filterBase =
    "cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold transition-colors " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-action";

  return (
    <div>
      {categories.length > 0 ? (
        <div
          role="group"
          aria-label="Filtrar posts por categoria"
          className="mb-10 flex flex-wrap justify-center gap-2"
        >
          <button
            type="button"
            onClick={() => selectCategory(null)}
            aria-pressed={category === null}
            className={cn(
              filterBase,
              category === null
                ? "border-ink bg-ink text-white"
                : "border-line bg-white text-ink-body hover:border-ink"
            )}
          >
            Todas
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => selectCategory(c)}
              aria-pressed={category === c}
              className={cn(
                filterBase,
                category === c
                  ? "border-ink bg-ink text-white"
                  : "border-line bg-white text-ink-body hover:border-ink"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      ) : null}

      {posts.length === 0 ? (
        <div className="mx-auto max-w-md rounded-2xl border border-line bg-surface-alt px-6 py-16 text-center">
          <p className="font-bold text-ink">Nenhum artigo por aqui ainda.</p>
          <p className="mt-2 text-sm text-ink-muted">
            {category
              ? "Não há posts publicados nesta categoria. Escolha outra acima."
              : "Os primeiros conteúdos sobre frete e logística chegam em breve."}
          </p>
        </div>
      ) : (
        <ul
          className={cn(
            "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
            isPending && "opacity-60 transition-opacity"
          )}
        >
          {posts.map((post, i) => (
            <motion.li
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: (i % POSTS_PAGE_SIZE) * 0.05 }}
            >
              <PostCard post={post} />
            </motion.li>
          ))}
        </ul>
      )}

      {hasMore ? (
        <div className="mt-12 text-center">
          <Button
            variant="secondary"
            size="lg"
            onClick={loadMore}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 aria-hidden className="size-4 animate-spin" />
                Carregando…
              </>
            ) : (
              "Carregar mais artigos"
            )}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
