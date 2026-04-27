import type { MetadataRoute } from "next"

import { buildCanonicalUrl, seoConfig } from "@/lib/seo"

export default function robots(): MetadataRoute.Robots {
  const siteUrl = buildCanonicalUrl(seoConfig)

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: buildCanonicalUrl(seoConfig, "/sitemap.xml"),
    host: siteUrl,
  }
}
