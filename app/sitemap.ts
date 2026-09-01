import type { MetadataRoute } from "next";
import { createPublicClient } from "@/lib/supabase/public";
import { SITE_URL } from "@/lib/seo";
import { FREIGHT_ROUTES } from "@/lib/freight-routes";

/** sitemap.xml — páginas estáticas + rotas de frete + posts publicados (plano §10). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { path: "", priority: 1, changeFrequency: "weekly" as const },
    { path: "/a-empresa", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/como-funciona", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/segmentos", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/diferenciais", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/frete", priority: 0.8, changeFrequency: "monthly" as const },
    ...FREIGHT_ROUTES.map((route) => ({
      path: `/frete/${route.slug}`,
      priority: 0.8,
      changeFrequency: "monthly" as const,
    })),
    { path: "/contato", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/blog", priority: 0.9, changeFrequency: "daily" as const },
    { path: "/politica-de-privacidade", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/politica-de-cookies", priority: 0.3, changeFrequency: "yearly" as const },
  ].map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  // Posts publicados
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("posts")
    .select("slug, updated_at")
    .eq("status", "published");

  const postRoutes: MetadataRoute.Sitemap = (data ?? []).map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at as string),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes];
}
