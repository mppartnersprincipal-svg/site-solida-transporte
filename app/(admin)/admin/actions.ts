"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import type { PostStatus } from "@/lib/blog";

export type SavePostInput = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_url: string | null;
  category: string;
  tags: string[];
  status: PostStatus;
  /** Slug anterior (edição) — para revalidar a URL antiga se o slug mudar. */
  previousSlug?: string | null;
};

export type ActionResult = { ok: true; id?: string } | { ok: false; error: string };

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

/** Revalida as páginas públicas afetadas por um post (ISR on-demand). */
function revalidateBlog(slug?: string | null, previousSlug?: string | null) {
  revalidatePath("/blog");
  revalidatePath("/"); // seção "Blog" da Home
  if (slug) revalidatePath(`/blog/${slug}`);
  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/blog/${previousSlug}`);
  }
}

export async function savePost(input: SavePostInput): Promise<ActionResult> {
  const { supabase, user } = await requireUser();

  const title = input.title.trim();
  if (!title) return { ok: false, error: "Informe o título do post." };

  const slug = slugify(input.slug.trim() || title);
  if (!slug) return { ok: false, error: "Não foi possível gerar um slug válido." };

  const category = input.category.trim();

  const row = {
    title,
    slug,
    excerpt: input.excerpt.trim() || null,
    content: input.content,
    cover_url: input.cover_url,
    category: category || null,
    tags: input.tags.map((t) => t.trim()).filter(Boolean),
    status: input.status,
    // primeira publicação carimba published_at; salvar rascunho limpa
    ...(input.status === "draft" ? { published_at: null } : {}),
  };

  let savedId = input.id;

  if (input.id) {
    const { error } = await supabase
      .from("posts")
      .update(row)
      .eq("id", input.id);
    if (error) return { ok: false, error: translateDbError(error.code) };

    if (input.status === "published") {
      // garante published_at em posts que nunca foram publicados
      await supabase
        .from("posts")
        .update({ published_at: new Date().toISOString() })
        .eq("id", input.id)
        .is("published_at", null);
    }
  } else {
    const { data, error } = await supabase
      .from("posts")
      .insert({
        ...row,
        author_id: user.id,
        published_at:
          input.status === "published" ? new Date().toISOString() : null,
      })
      .select("id")
      .single();
    if (error) return { ok: false, error: translateDbError(error.code) };
    savedId = data.id;
  }

  // mantém a tabela categories em dia com o que o editor digitar
  if (category) {
    await supabase
      .from("categories")
      .upsert(
        { name: category, slug: slugify(category) },
        { onConflict: "name", ignoreDuplicates: true }
      );
  }

  revalidateBlog(slug, input.previousSlug);
  return { ok: true, id: savedId };
}

export async function setPostStatus(
  id: string,
  status: PostStatus
): Promise<ActionResult> {
  const { supabase } = await requireUser();

  const { data: post, error: fetchError } = await supabase
    .from("posts")
    .select("slug, published_at")
    .eq("id", id)
    .single();
  if (fetchError || !post) {
    return { ok: false, error: "Post não encontrado." };
  }

  const { error } = await supabase
    .from("posts")
    .update({
      status,
      published_at:
        status === "published"
          ? (post.published_at ?? new Date().toISOString())
          : post.published_at,
    })
    .eq("id", id);
  if (error) return { ok: false, error: translateDbError(error.code) };

  revalidateBlog(post.slug);
  return { ok: true, id };
}

export async function deletePost(id: string): Promise<ActionResult> {
  const { supabase } = await requireUser();

  const { data: post } = await supabase
    .from("posts")
    .select("slug")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) return { ok: false, error: translateDbError(error.code) };

  revalidateBlog(post?.slug);
  return { ok: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

function translateDbError(code?: string): string {
  if (code === "23505") {
    return "Já existe um post com esse slug. Ajuste o slug e tente de novo.";
  }
  return "Não foi possível salvar. Tente novamente.";
}
