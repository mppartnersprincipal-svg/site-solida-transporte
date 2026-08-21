import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PostEditor } from "@/components/admin/PostEditor";

export const metadata: Metadata = {
  title: "Novo post | Área administrativa",
};

export default async function NewPostPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("name")
    .order("name");

  return <PostEditor categories={(data ?? []).map((c) => c.name as string)} />;
}
