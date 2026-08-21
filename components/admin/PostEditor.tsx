"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { savePost } from "@/app/(admin)/admin/actions";
import { createClient } from "@/lib/supabase/client";
import { cn, slugify } from "@/lib/utils";
import type { Post, PostStatus } from "@/lib/blog";

const inputClasses =
  "w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink-body " +
  "placeholder:text-ink-muted focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10";

/** Sobe um arquivo para o bucket post-images e devolve a URL pública. */
async function uploadToStorage(
  file: File,
  folder: "covers" | "content"
): Promise<string | null> {
  const supabase = createClient();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("post-images")
    .upload(path, file, { cacheControl: "31536000", upsert: false });
  if (error) {
    console.error("[admin] upload:", error.message);
    return null;
  }
  return supabase.storage.from("post-images").getPublicUrl(path).data.publicUrl;
}

/** Formulário de criação/edição de post (/admin/posts/novo e /admin/posts/[id]). */
export function PostEditor({
  post,
  categories,
}: {
  post?: Post;
  categories: string[];
}) {
  const router = useRouter();
  const isEditing = Boolean(post);

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [category, setCategory] = useState(post?.category ?? "");
  const [tags, setTags] = useState((post?.tags ?? []).join(", "));
  const [coverUrl, setCoverUrl] = useState(post?.cover_url ?? null);
  const [content, setContent] = useState(post?.content ?? "");

  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingContentImage, setUploadingContentImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [pendingStatus, setPendingStatus] = useState<PostStatus | null>(null);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function handleCoverChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);
    setUploadingCover(true);
    const url = await uploadToStorage(file, "covers");
    setUploadingCover(false);
    if (!url) {
      setError("Não foi possível enviar a imagem de capa. Tente de novo.");
      return;
    }
    setCoverUrl(url);
  }

  async function handleContentImage(file: File) {
    setError(null);
    setUploadingContentImage(true);
    const url = await uploadToStorage(file, "content");
    setUploadingContentImage(false);
    if (!url) {
      setError("Não foi possível enviar a imagem. Tente de novo.");
    }
    return url;
  }

  function handleSave(status: PostStatus) {
    setError(null);
    setPendingStatus(status);
    startTransition(async () => {
      const result = await savePost({
        id: post?.id,
        title,
        slug,
        excerpt,
        content,
        cover_url: coverUrl,
        category,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        status,
        previousSlug: post?.slug ?? null,
      });

      if (!result.ok) {
        setPendingStatus(null);
        setError(result.error);
        return;
      }
      router.push("/admin");
      router.refresh();
    });
  }

  const publishLabel =
    post?.status === "published" ? "Atualizar post publicado" : "Publicar";

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted transition-colors hover:text-ink"
      >
        <ArrowLeft aria-hidden className="size-4" />
        Voltar para a lista
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold sm:text-3xl">
          {isEditing ? "Editar post" : "Novo post"}
        </h1>
        {post?.status === "published" ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Publicado
          </span>
        ) : isEditing ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-alt px-2.5 py-1 text-xs font-semibold text-ink-muted">
            <span className="size-1.5 rounded-full bg-ink-muted/60" />
            Rascunho
          </span>
        ) : null}
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <label htmlFor="post-title" className="mb-1.5 block text-sm font-semibold text-ink">
            Título *
          </label>
          <input
            id="post-title"
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Ex.: Por que o frete mais barato pode sair caro?"
            className={cn(inputClasses, "text-base font-semibold")}
          />
        </div>

        <div>
          <label htmlFor="post-slug" className="mb-1.5 block text-sm font-semibold text-ink">
            Slug (URL)
          </label>
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-sm text-ink-muted">/blog/</span>
            <input
              id="post-slug"
              type="text"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              onBlur={() => setSlug((s) => slugify(s))}
              placeholder="gerado-automaticamente-do-titulo"
              className={inputClasses}
            />
          </div>
        </div>

        <div>
          <label htmlFor="post-excerpt" className="mb-1.5 block text-sm font-semibold text-ink">
            Resumo (aparece no card e na busca do Google)
          </label>
          <textarea
            id="post-excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            placeholder="Uma ou duas frases que resumem o artigo."
            className={cn(inputClasses, "resize-y")}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="post-category" className="mb-1.5 block text-sm font-semibold text-ink">
              Categoria
            </label>
            <input
              id="post-category"
              type="text"
              list="category-options"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ex.: Frete"
              className={inputClasses}
            />
            <datalist id="category-options">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          <div>
            <label htmlFor="post-tags" className="mb-1.5 block text-sm font-semibold text-ink">
              Tags (separadas por vírgula)
            </label>
            <input
              id="post-tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="frete, carga fracionada, prazos"
              className={inputClasses}
            />
          </div>
        </div>

        <div>
          <span className="mb-1.5 block text-sm font-semibold text-ink">
            Imagem de capa
          </span>
          {coverUrl ? (
            <div className="relative aspect-[2/1] overflow-hidden rounded-xl border border-line bg-surface-alt">
              <Image
                src={coverUrl}
                alt="Capa do post"
                fill
                sizes="768px"
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => setCoverUrl(null)}
                className="absolute top-3 right-3 inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-ink/80 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur transition-colors hover:bg-brand-action"
              >
                <Trash2 aria-hidden className="size-3.5" />
                Remover
              </button>
            </div>
          ) : (
            <label
              className={cn(
                "flex aspect-[3/1] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-white text-ink-muted transition-colors hover:border-ink hover:text-ink",
                uploadingCover && "pointer-events-none opacity-60"
              )}
            >
              {uploadingCover ? (
                <Loader2 aria-hidden className="size-6 animate-spin" />
              ) : (
                <ImagePlus aria-hidden className="size-6" />
              )}
              <span className="text-sm font-semibold">
                {uploadingCover ? "Enviando…" : "Clique para enviar a capa"}
              </span>
              <span className="text-xs">JPG, PNG ou WebP (ideal 1600×800)</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverChosen}
                disabled={uploadingCover}
              />
            </label>
          )}
        </div>

        <div>
          <span className="mb-1.5 block text-sm font-semibold text-ink">
            Conteúdo *
          </span>
          <RichTextEditor
            initialContent={post?.content ?? ""}
            onChange={setContent}
            onUploadImage={handleContentImage}
            uploading={uploadingContentImage}
          />
        </div>

        {error ? (
          <p
            role="alert"
            className="rounded-xl border border-brand-action/30 bg-brand-tint px-4 py-3 text-sm font-medium text-brand-hover"
          >
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3 border-t border-line pt-5">
          <Button
            type="button"
            variant="primary"
            size="lg"
            disabled={isPending || uploadingCover}
            onClick={() => handleSave("published")}
          >
            {isPending && pendingStatus === "published" ? (
              <>
                <Loader2 aria-hidden className="size-4 animate-spin" />
                Publicando…
              </>
            ) : (
              publishLabel
            )}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            disabled={isPending || uploadingCover}
            onClick={() => handleSave("draft")}
          >
            {isPending && pendingStatus === "draft" ? (
              <>
                <Loader2 aria-hidden className="size-4 animate-spin" />
                Salvando…
              </>
            ) : (
              "Salvar rascunho"
            )}
          </Button>
          {post?.status === "published" ? (
            <p className="w-full text-xs text-ink-muted sm:w-auto">
              &ldquo;Salvar rascunho&rdquo; tira o post do ar até publicar de
              novo.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
