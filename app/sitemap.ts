import type { MetadataRoute } from "next"

import { getAllBlogPosts } from "@/lib/blog"
import { locales } from "@/lib/site-content"
import { buildCanonicalUrl, seoConfig } from "@/lib/seo"

const serviceSlugs = [
  "diseno-web",
  "seo-tecnico",
  "contenido-estrategico",
] as const

const caseSlugs = [
  "sitio-web-corporativo",
  "seo-local-empresa",
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const localePages = locales.flatMap((locale) => [
    {
      url: buildCanonicalUrl(seoConfig, `/${locale}/about`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: buildCanonicalUrl(seoConfig, `/${locale}/packages`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: buildCanonicalUrl(seoConfig, `/${locale}/services`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: buildCanonicalUrl(seoConfig, `/${locale}/blog`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ])

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: buildCanonicalUrl(seoConfig, "/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: buildCanonicalUrl(seoConfig, "/portfolio"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...serviceSlugs.map((slug) => ({
      url: buildCanonicalUrl(seoConfig, `/servicios/${slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...caseSlugs.map((slug) => ({
      url: buildCanonicalUrl(seoConfig, `/casos/${slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ]

  const blogPages = locales.flatMap((locale) =>
    getAllBlogPosts().map((post) => ({
      url: buildCanonicalUrl(seoConfig, `/${locale}/blog/${post.slug}`),
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  )

  return [...staticPages, ...localePages, ...blogPages]
}
