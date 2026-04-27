import type { Metadata } from "next"

import { seoConfig } from "@/lib/seo/config"
import type {
  SeoConfig,
  SeoLayoutMetadataInput,
  SeoOpenGraphImage,
  SeoPageMetadataInput,
  SeoTwitterImage,
} from "@/lib/seo/types"
import { buildCanonicalUrl, buildMetadataBaseUrl } from "@/lib/seo/url"

// AGENCY_OWNED: metadata builder used across pages and projects.
// Keep this reusable so client content can plug into the same SEO surface.
function normalizeOpenGraphImages(images?: SeoOpenGraphImage[]) {
  return images?.map((image) => ({
    url: image.url,
    width: image.width,
    height: image.height,
    alt: image.alt,
  }))
}

function normalizeTwitterImages(images?: SeoTwitterImage[]) {
  return images?.map((image) => {
    if (typeof image === "string") {
      return image
    }

    return {
      url: image.url,
      width: image.width,
      height: image.height,
      alt: image.alt,
    }
  })
}

export function buildLayoutMetadata(
  config: SeoConfig = seoConfig,
  input: SeoLayoutMetadataInput = {},
): Metadata {
  const canonical = buildCanonicalUrl(config, input.canonicalPath)

  return {
    metadataBase: buildMetadataBaseUrl(config),
    title: {
      default: input.defaultTitle ?? config.site.defaultTitle,
      template: config.site.titleTemplate,
    },
    description: input.description ?? config.site.defaultDescription,
    alternates: {
      ...input.alternates,
      canonical,
    },
    robots: input.robots ?? {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      siteName: config.brand.brandName,
      title: input.defaultTitle ?? config.site.defaultTitle,
      description: input.description ?? config.site.defaultDescription,
      url: canonical,
      type: "website",
      locale: input.locale ?? config.site.defaultLocale,
      images: [
        {
          url: config.brand.brandLogo,
          alt: config.brand.brandName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: input.defaultTitle ?? config.site.defaultTitle,
      description: input.description ?? config.site.defaultDescription,
      images: [config.brand.brandLogo],
    },
  }
}

export function buildPageMetadata(
  config: SeoConfig = seoConfig,
  input: SeoPageMetadataInput,
): Metadata {
  const canonical = buildCanonicalUrl(config, input.canonicalPath)
  const openGraphInput = input.openGraph ?? {}
  const { images: openGraphImages, ...openGraphRest } = openGraphInput
  const twitterInput = input.twitter ?? {}
  const { images: twitterImages, ...twitterRest } = twitterInput
  const openGraphType = openGraphRest.type ?? "website"
  const twitterCard = twitterRest.card ?? "summary_large_image"

  return {
    title: input.title,
    description: input.description,
    alternates: {
      ...input.alternates,
      canonical,
    },
    robots: input.robots ?? {
      index: true,
      follow: true,
    },
    openGraph: {
      siteName: config.brand.brandName,
      title: input.title,
      description: input.description,
      url: canonical,
      type: openGraphType,
      locale: input.locale ?? config.site.defaultLocale,
      ...openGraphRest,
      images: normalizeOpenGraphImages(openGraphImages),
    },
    twitter: {
      card: twitterCard,
      title: input.title,
      description: input.description,
      ...twitterRest,
      images: normalizeTwitterImages(twitterImages),
    },
  }
}
