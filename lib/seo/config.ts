import type { SeoConfig, SeoPostalAddress } from "@/lib/seo/types"

// AGENCY_OWNED: reusable SEO configuration shape.
// The actual values below are project-specific and should be treated as site configuration, not framework logic.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000"

const brandLocation: SeoPostalAddress | undefined = undefined

function splitList(value: string | undefined) {
  return value?.split(",").map((item) => item.trim()).filter(Boolean) ?? []
}

export const seoConfig: SeoConfig = {
  brand: {
    brandName: process.env.NEXT_PUBLIC_BRAND_NAME?.trim() || "Binff",
    brandUrl: process.env.NEXT_PUBLIC_BRAND_URL?.trim() || siteUrl,
    brandLogo: process.env.NEXT_PUBLIC_BRAND_LOGO?.trim() || "/logos/binff_studio_parchment_vermillion.svg",
    brandDescription:
      process.env.NEXT_PUBLIC_BRAND_DESCRIPTION?.trim() ||
      "Agencia especializada en creación de sitios web y SEO técnico para empresas y negocios.",
    brandSameAs: splitList(process.env.NEXT_PUBLIC_BRAND_SAMEAS),
    brandTelephone: process.env.NEXT_PUBLIC_BRAND_TELEPHONE?.trim() || undefined,
    brandEmail: process.env.NEXT_PUBLIC_BRAND_EMAIL?.trim() || undefined,
    brandLocation,
    brandServiceArea: splitList(process.env.NEXT_PUBLIC_BRAND_SERVICE_AREA),
    brandContactPoints: [],
  },
  site: {
    siteUrl,
    defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE?.trim() || "es",
    locales: splitList(process.env.NEXT_PUBLIC_SITE_LOCALES).length
      ? splitList(process.env.NEXT_PUBLIC_SITE_LOCALES)
      : ["en", "fr", "es"],
    titleTemplate: process.env.NEXT_PUBLIC_TITLE_TEMPLATE?.trim() || "%s | Binff",
    defaultTitle: process.env.NEXT_PUBLIC_DEFAULT_TITLE?.trim() || "Binff",
    defaultDescription:
      process.env.NEXT_PUBLIC_DEFAULT_DESCRIPTION?.trim() ||
      "Creación de sitios web, SEO técnico y posicionamiento orgánico para empresas y negocios.",
  },
}
