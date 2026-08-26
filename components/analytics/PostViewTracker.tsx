"use client";

import { useEffect } from "react";
import { trackBlogPostView } from "@/lib/analytics";

/** Dispara `blog_post_view` uma vez por post aberto (renderiza nada). */
export function PostViewTracker({
  slug,
  title,
  category,
}: {
  slug: string;
  title: string;
  category?: string | null;
}) {
  useEffect(() => {
    trackBlogPostView({ slug, title, category });
  }, [slug, title, category]);
  return null;
}
