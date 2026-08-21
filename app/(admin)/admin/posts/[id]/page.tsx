import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PostEditor } from "@/components/admin/PostEditor";
import type { Post } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Editar post — Área administrativa",
};

export default async function EditPostPage({
  params,
}: PageProps<"/admin/posts/[id]">) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: post }, { data: categories }] = await Promise.all([
    supabase.from("posts").select("*").eq("id", id).maybeSingle(),
    supabase.from("categories").select("name").order("name"),
  ]);

  if (!post) notFound();

  return (
    <PostEditor
      post={post as Post}
      categories={(categories ?? []).map((c) => c.name as string)}
    />
  );
}
