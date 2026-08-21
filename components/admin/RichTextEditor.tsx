"use client";

import { useRef } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  Loader2,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Undo2,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Editor de texto rico (Tiptap) do admin. O conteúdo é editado com as mesmas
 * classes .post-body do site — o gerente escreve vendo o resultado final.
 */
export function RichTextEditor({
  initialContent,
  onChange,
  onUploadImage,
  uploading = false,
}: {
  initialContent: string;
  onChange: (html: string) => void;
  /** Sobe a imagem para o Storage e devolve a URL pública (ou null em erro). */
  onUploadImage: (file: File) => Promise<string | null>;
  uploading?: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false },
      }),
      TiptapImage,
      Placeholder.configure({
        placeholder: "Escreva o conteúdo do post…",
      }),
    ],
    content: initialContent,
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "post-body min-h-[360px] px-5 py-4 focus:outline-none [&_a]:cursor-text",
      },
    },
  });

  function setLink(editor: Editor) {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL do link:", previous ?? "https://");
    if (url === null) return;
    if (url === "" || url === "https://") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  async function handleImageChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !editor) return;
    const url = await onUploadImage(file);
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }

  if (!editor) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-xl border border-line bg-white">
        <Loader2 aria-hidden className="size-5 animate-spin text-ink-muted" />
      </div>
    );
  }

  const btn = (active = false, disabled = false) =>
    cn(
      "inline-flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors",
      active ? "bg-ink text-white" : "text-ink-body hover:bg-surface-alt",
      disabled && "cursor-not-allowed opacity-40 hover:bg-transparent"
    );

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white focus-within:border-ink">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-line bg-surface-alt/60 px-2 py-1.5">
        <button
          type="button"
          title="Desfazer"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className={btn(false, !editor.can().undo())}
        >
          <Undo2 aria-hidden className="size-4" />
        </button>
        <button
          type="button"
          title="Refazer"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className={btn(false, !editor.can().redo())}
        >
          <Redo2 aria-hidden className="size-4" />
        </button>

        <span className="mx-1 h-5 w-px bg-line" />

        <button
          type="button"
          title="Negrito"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btn(editor.isActive("bold"))}
        >
          <Bold aria-hidden className="size-4" />
        </button>
        <button
          type="button"
          title="Itálico"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btn(editor.isActive("italic"))}
        >
          <Italic aria-hidden className="size-4" />
        </button>
        <button
          type="button"
          title="Tachado"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={btn(editor.isActive("strike"))}
        >
          <Strikethrough aria-hidden className="size-4" />
        </button>

        <span className="mx-1 h-5 w-px bg-line" />

        <button
          type="button"
          title="Subtítulo (H2)"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={btn(editor.isActive("heading", { level: 2 }))}
        >
          <Heading2 aria-hidden className="size-4" />
        </button>
        <button
          type="button"
          title="Subtítulo (H3)"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={btn(editor.isActive("heading", { level: 3 }))}
        >
          <Heading3 aria-hidden className="size-4" />
        </button>

        <span className="mx-1 h-5 w-px bg-line" />

        <button
          type="button"
          title="Lista"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btn(editor.isActive("bulletList"))}
        >
          <List aria-hidden className="size-4" />
        </button>
        <button
          type="button"
          title="Lista numerada"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={btn(editor.isActive("orderedList"))}
        >
          <ListOrdered aria-hidden className="size-4" />
        </button>
        <button
          type="button"
          title="Citação"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={btn(editor.isActive("blockquote"))}
        >
          <Quote aria-hidden className="size-4" />
        </button>
        <button
          type="button"
          title="Linha divisória"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={btn()}
        >
          <Minus aria-hidden className="size-4" />
        </button>

        <span className="mx-1 h-5 w-px bg-line" />

        <button
          type="button"
          title="Inserir/editar link"
          onClick={() => setLink(editor)}
          className={btn(editor.isActive("link"))}
        >
          <Link2 aria-hidden className="size-4" />
        </button>
        <button
          type="button"
          title="Remover link"
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive("link")}
          className={btn(false, !editor.isActive("link"))}
        >
          <Link2Off aria-hidden className="size-4" />
        </button>
        <button
          type="button"
          title="Inserir imagem"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className={btn(false, uploading)}
        >
          {uploading ? (
            <Loader2 aria-hidden className="size-4 animate-spin" />
          ) : (
            <ImagePlus aria-hidden className="size-4" />
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChosen}
        />
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
