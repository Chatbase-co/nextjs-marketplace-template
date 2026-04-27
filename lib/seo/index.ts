import { seoConfig } from "@/lib/seo/config"

export * from "@/lib/seo/buildBreadcrumbs"
export * from "@/lib/seo/buildJsonLd"
export * from "@/lib/seo/buildMetadata"
export * from "@/lib/seo/config"
export * from "@/lib/seo/entities"
export * from "@/lib/seo/types"
export * from "@/lib/seo/url"

export const SITE_NAME = seoConfig.brand.brandName
export const SITE_DESCRIPTION = seoConfig.brand.brandDescription
export const SOCIAL_LINKS = seoConfig.brand.brandSameAs
export { seoConfig }
