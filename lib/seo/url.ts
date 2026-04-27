import type { SeoConfig } from "@/lib/seo/types"

// AGENCY_OWNED: canonical URL helpers used by SEO, sitemap, robots and JSON-LD generation.
function stripTrailingSlash(url: URL) {
  if (url.pathname !== "/" && url.pathname.endsWith("/")) {
    url.pathname = url.pathname.replace(/\/+$/, "")
  }

  url.search = ""
  url.hash = ""

  return url.pathname === "/" ? url.origin : url.toString()
}

function normalizePath(path: string) {
  const trimmed = path.trim()

  if (!trimmed) {
    return "/"
  }

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`
}

export function buildCanonicalUrl(config: SeoConfig, path?: string) {
  if (!path) {
    return stripTrailingSlash(new URL(config.site.siteUrl))
  }

  try {
    return stripTrailingSlash(new URL(path))
  } catch {
    return stripTrailingSlash(new URL(normalizePath(path), config.site.siteUrl))
  }
}

export function buildMetadataBaseUrl(config: SeoConfig) {
  return new URL(buildCanonicalUrl(config))
}

export function getSiteUrl(config: SeoConfig) {
  return buildCanonicalUrl(config)
}
