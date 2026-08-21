import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { buttonClasses } from "@/components/ui/Button";
import { PostRowActions } from "@/components/admin/PostRowActions";
import { formatPostDate, type PostStatus } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Posts — Área administrativa",
};

type AdminPostRow = {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  status: PostStatus;
  published_at: string | null;
  updated_at: string;
};

export default async function AdminPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, slug, title, category, status, published_at, updated_at")
    .order("updated_at", { ascending: false });

  const posts = (data ?? []) as AdminPostRow[];
  const published = posts.filter((p) => p.status === "published").length;
  const drafts = posts.length - published;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Posts do blog</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {posts.length} {posts.length === 1 ? "post" : "posts"} · {published}{" "}
            {published === 1 ? "publicado" : "publicados"} · {drafts}{" "}
            {drafts === 1 ? "rascunho" : "rascunhos"}
          </p>
        </div>
        <Link href="/admin/posts/novo" className={buttonClasses("primary", "md")}>
          <Plus aria-hidden className="size-4" />
          Novo post
        </Link>
      </div>

      {error ? (
        <p className="mt-8 rounded-xl border border-brand-action/30 bg-brand-tint px-4 py-3 text-sm font-medium text-brand-hover">
          Não foi possível carregar os posts. Verifique se as tabelas foram
          criadas no Supabase (supabase/migrations/0001_blog.sql).
        </p>
      ) : posts.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-line bg-white px-6 py-16 text-center">
          <FileText aria-hidden className="mx-auto size-10 text-ink-muted/40" />
          <p className="mt-4 font-bold text-ink">Nenhum post ainda</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-ink-muted">
            Crie o primeiro artigo do blog da Sólida — comece por uma pauta do
            calendário editorial, como &ldquo;Por que o frete mais barato pode
            sair caro?&rdquo;.
          </p>
          <Link
            href="/admin/posts/novo"
            className={`${buttonClasses("primary", "md")} mt-6`}
          >
            <Plus aria-hidden className="size-4" />
            Criar primeiro post
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs font-semibold tracking-wide text-ink-muted uppercase">
                <th className="px-5 py-3.5">Título</th>
                <th className="px-5 py-3.5">Categoria</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Atualizado</th>
                <th className="px-5 py-3.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-line last:border-b-0 hover:bg-surface-alt/60"
                >
                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="font-semibold text-ink hover:text-brand-action"
                    >
                      {post.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-ink-muted">/{post.slug}</p>
                  </td>
                  <td className="px-5 py-4 text-ink-muted">
                    {post.category ?? "—"}
                  </td>
                  <td className="px-5 py-4">
                    {post.status === "published" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        Publicado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-alt px-2.5 py-1 text-xs font-semibold text-ink-muted">
                        <span className="size-1.5 rounded-full bg-ink-muted/60" />
                        Rascunho
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-ink-muted">
                    {formatPostDate(post.updated_at)}
                  </td>
                  <td className="px-5 py-4">
                    <PostRowActions
                      id={post.id}
                      slug={post.slug}
                      title={post.title}
                      status={post.status}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
