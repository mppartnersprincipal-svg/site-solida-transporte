import type { SupabaseClient } from "@supabase/supabase-js";
import { createPublicClient } from "@/lib/supabase/public";

export type PostStatus = "draft" | "published";

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  cover_url: string | null;
  category: string | null;
  tags: string[];
  status: PostStatus;
  author_id: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

/** Subconjunto usado nos cards da listagem (evita baixar o content inteiro). */
export type PostCard = Pick<
  Post,
  "id" | "slug" | "title" | "excerpt" | "cover_url" | "category" | "published_at"
>;

export const POST_CARD_COLUMNS =
  "id, slug, title, excerpt, cover_url, category, published_at";

export const POSTS_PAGE_SIZE = 9;

/**
 * Busca paginada de posts publicados. Recebe o client por parâmetro para
 * servir tanto o server (ISR) quanto o "Carregar mais" no browser.
 */
export async function fetchPublishedPosts(
  supabase: SupabaseClient,
  {
    category,
    offset = 0,
    limit = POSTS_PAGE_SIZE,
  }: { category?: string | null; offset?: number; limit?: number } = {}
): Promise<{ posts: PostCard[]; total: number }> {
  let query = supabase
    .from("posts")
    .select(POST_CARD_COLUMNS, { count: "exact" })
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (category) {
    query = query.eq("category", category);
  }

  const { data, count, error } = await query;
  if (error) {
    console.error("[blog] fetchPublishedPosts:", error.message);
    return { posts: [], total: 0 };
  }
  return { posts: (data ?? []) as PostCard[], total: count ?? 0 };
}

export async function getPublishedPosts(options?: {
  category?: string | null;
  offset?: number;
  limit?: number;
}) {
  return fetchPublishedPosts(createPublicClient(), options);
}

/** Categorias com pelo menos um post publicado (para os filtros do /blog). */
export async function getPublishedCategories(): Promise<string[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("posts")
    .select("category")
    .eq("status", "published")
    .not("category", "is", null);

  if (error) {
    console.error("[blog] getPublishedCategories:", error.message);
    return [];
  }
  const unique = new Set<string>();
  for (const row of data ?? []) {
    if (row.category) unique.add(row.category);
  }
  return [...unique].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("[blog] getPostBySlug:", error.message);
    return null;
  }
  return data as Post | null;
}

export async function getPublishedSlugs(): Promise<string[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("posts")
    .select("slug")
    .eq("status", "published");

  if (error) {
    console.error("[blog] getPublishedSlugs:", error.message);
    return [];
  }
  return (data ?? []).map((row) => row.slug as string);
}

/** Posts relacionados: mesma categoria primeiro, completa com os mais recentes. */
export async function getRelatedPosts(post: Post, limit = 3): Promise<PostCard[]> {
  const supabase = createPublicClient();
  const related: PostCard[] = [];

  if (post.category) {
    const { posts } = await fetchPublishedPosts(supabase, {
      category: post.category,
      limit: limit + 1,
    });
    related.push(...posts.filter((p) => p.id !== post.id).slice(0, limit));
  }

  if (related.length < limit) {
    const { posts } = await fetchPublishedPosts(supabase, {
      limit: limit + 1 + related.length,
    });
    for (const p of posts) {
      if (related.length >= limit) break;
      if (p.id !== post.id && !related.some((r) => r.id === p.id)) {
        related.push(p);
      }
    }
  }

  return related;
}

/** "21 de agosto de 2026" */
export function formatPostDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  });
}
