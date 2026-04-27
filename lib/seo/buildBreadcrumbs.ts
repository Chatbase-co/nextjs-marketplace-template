import type { SeoBreadcrumbEntity, SeoConfig } from "@/lib/seo/types"
import { buildCanonicalUrl } from "@/lib/seo/url"

// AGENCY_OWNED: generic breadcrumb schema builder.
// Safe to reuse across client projects as part of the agency SEO toolkit.
export interface BuildBreadcrumbInput {
  name: string
  path?: string
}

export function buildBreadcrumbList(
  items: readonly BuildBreadcrumbInput[],
  config: SeoConfig,
): SeoBreadcrumbEntity {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path ? buildCanonicalUrl(config, item.path) : undefined,
    })),
  }
}
