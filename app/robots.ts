import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/** robots.txt — libera o site público e esconde a área administrativa. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/login"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
