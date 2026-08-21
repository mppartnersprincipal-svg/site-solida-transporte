"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Loader2, Pencil, Trash2 } from "lucide-react";
import { deletePost, setPostStatus } from "@/app/(admin)/admin/actions";
import type { PostStatus } from "@/lib/blog";
import { cn } from "@/lib/utils";

/** Ações de cada linha da tabela do /admin: publicar, editar, ver, excluir. */
export function PostRowActions({
  id,
  slug,
  title,
  status,
}: {
  id: string;
  slug: string;
  title: string;
  status: PostStatus;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run(action: () => Promise<{ ok: boolean }>) {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        setError("Ação falhou. Tente de novo.");
        return;
      }
      router.refresh();
    });
  }

  function handleToggleStatus() {
    run(() =>
      setPostStatus(id, status === "published" ? "draft" : "published")
    );
  }

  function handleDelete() {
    const confirmed = window.confirm(
      `Excluir o post "${title}"? Essa ação não tem volta.`
    );
    if (!confirmed) return;
    run(() => deletePost(id));
  }

  const actionButton =
    "inline-flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50";

  return (
    <div className="flex items-center justify-end gap-1">
      {isPending ? (
        <Loader2 aria-hidden className="size-4 animate-spin text-ink-muted" />
      ) : null}
      {error ? (
        <span className="text-xs font-medium text-brand-action">{error}</span>
      ) : null}

      <button
        type="button"
        onClick={handleToggleStatus}
        disabled={isPending}
        className={cn(
          actionButton,
          status === "published"
            ? "text-ink-muted hover:bg-surface-alt hover:text-ink"
            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
        )}
      >
        {status === "published" ? "Despublicar" : "Publicar"}
      </button>

      {status === "published" ? (
        <Link
          href={`/blog/${slug}`}
          target="_blank"
          className={cn(actionButton, "text-ink-muted hover:bg-surface-alt hover:text-ink")}
          title="Ver no site"
        >
          <Eye aria-hidden className="size-3.5" />
        </Link>
      ) : null}

      <Link
        href={`/admin/posts/${id}`}
        className={cn(actionButton, "text-ink-muted hover:bg-surface-alt hover:text-ink")}
        title="Editar"
      >
        <Pencil aria-hidden className="size-3.5" />
      </Link>

      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className={cn(actionButton, "text-ink-muted hover:bg-brand-tint hover:text-brand-action")}
        title="Excluir"
      >
        <Trash2 aria-hidden className="size-3.5" />
      </button>
    </div>
  );
}
