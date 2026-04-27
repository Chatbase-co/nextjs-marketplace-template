import type {
  SeoArticleEntity,
  SeoConfig,
  SeoContactPoint,
  SeoFaqPageEntity,
  SeoLocalBusinessEntity,
  SeoOrganizationEntity,
  SeoPostalAddress,
  SeoServiceEntity,
  SeoWebSiteEntity,
} from "@/lib/seo/types"
import { buildBreadcrumbList } from "@/lib/seo/buildBreadcrumbs"
import { buildCanonicalUrl } from "@/lib/seo/url"

// AGENCY_OWNED: structured-data entity builders.
// These helpers are framework-level SEO primitives and should remain reusable in a private agency package.
function organizationId(config: SeoConfig) {
  return `${new URL(config.site.siteUrl).origin}#organization`
}

function websiteId(config: SeoConfig) {
  return `${new URL(config.site.siteUrl).origin}#website`
}

function normalizeAreaServed(value: string | readonly string[] | undefined): string | string[] | undefined {
  if (!value || (Array.isArray(value) && value.length === 0)) {
    return undefined
  }

  return Array.isArray(value) ? [...value] : (value as string)
}

function normalizeContactPoints(contactPoints: readonly SeoContactPoint[] | undefined) {
  if (!contactPoints || contactPoints.length === 0) {
    return undefined
  }

  return contactPoints.map((contactPoint) => ({
    "@type": "ContactPoint" as const,
    contactType: contactPoint.contactType,
    telephone: contactPoint.telephone,
    email: contactPoint.email,
    areaServed: normalizeAreaServed(contactPoint.areaServed),
    availableLanguage: normalizeAreaServed(contactPoint.availableLanguage),
  }))
}

function normalizeStringList(value: readonly string[] | undefined) {
  if (!value || value.length === 0) {
    return undefined
  }

  return [...value]
}

export interface BuildOrganizationEntityInput {
  name?: string
  url?: string
  logo?: string
  sameAs?: readonly string[]
  telephone?: string
  email?: string
  contactPoint?: readonly SeoContactPoint[]
  address?: SeoPostalAddress
}

export function buildOrganizationEntity(
  config: SeoConfig,
  input: BuildOrganizationEntityInput = {},
): SeoOrganizationEntity {
  const entity: SeoOrganizationEntity = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId(config),
    name: input.name ?? config.brand.brandName,
    url: input.url ?? config.brand.brandUrl,
    logo: input.logo ?? config.brand.brandLogo,
  }

  const sameAs = normalizeStringList(input.sameAs ?? config.brand.brandSameAs)
  if (sameAs) {
    entity.sameAs = sameAs
  }

  const telephone = input.telephone ?? config.brand.brandTelephone
  if (telephone) {
    entity.telephone = telephone
  }

  const email = input.email ?? config.brand.brandEmail
  if (email) {
    entity.email = email
  }

  const contactPoint = normalizeContactPoints(input.contactPoint ?? config.brand.brandContactPoints)
  if (contactPoint) {
    entity.contactPoint = contactPoint
  }

  const address = input.address ?? config.brand.brandLocation
  if (address) {
    entity.address = address
  }

  return entity
}

export interface BuildWebSiteEntityInput {
  name?: string
  url?: string
  inLanguage?: string
  searchTarget?: string
}

export function buildWebSiteEntity(
  config: SeoConfig,
  input: BuildWebSiteEntityInput = {},
): SeoWebSiteEntity {
  const entity: SeoWebSiteEntity = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId(config),
    name: input.name ?? config.brand.brandName,
    url: input.url ?? config.site.siteUrl,
    publisher: {
      "@id": organizationId(config),
    },
    inLanguage: input.inLanguage ?? config.site.defaultLocale,
  }

  if (input.searchTarget) {
    entity.potentialAction = {
      "@type": "SearchAction",
      target: input.searchTarget,
      "query-input": "required name=search_term_string",
    }
  }

  return entity
}

export interface BuildServiceEntityInput {
  name: string
  slug: string
  description?: string
  serviceType?: string
  areaServed?: string | string[]
  url?: string
}

export function buildServiceEntity(
  config: SeoConfig,
  input: BuildServiceEntityInput,
): SeoServiceEntity {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    url: input.url ?? buildCanonicalUrl(config, `/servicios/${input.slug}`),
    description: input.description,
    serviceType: input.serviceType,
    provider: {
      "@id": organizationId(config),
    },
    areaServed: normalizeAreaServed(input.areaServed) ?? normalizeAreaServed(config.brand.brandServiceArea),
  }
}

export interface BuildArticleEntityInput {
  kind: "Article" | "BlogPosting"
  headline: string
  slug?: string
  url?: string
  description?: string
  image?: string | string[]
  datePublished?: string
  dateModified?: string
  articleSection?: string
  author?: {
    "@type": "Person" | "Organization"
    name: string
  }
  inLanguage?: string
}

export function buildArticleEntity(
  config: SeoConfig,
  input: BuildArticleEntityInput,
): SeoArticleEntity {
  const fallbackPath =
    input.kind === "BlogPosting"
      ? `/${config.site.defaultLocale}/blog/${input.slug ?? ""}`
      : `/casos/${input.slug ?? ""}`
  const url = input.url ?? buildCanonicalUrl(config, fallbackPath)

  return {
    "@context": "https://schema.org",
    "@type": input.kind,
    headline: input.headline,
    description: input.description,
    url,
    mainEntityOfPage: url,
    image: input.image,
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    articleSection: input.articleSection,
    author: input.author,
    publisher: {
      "@id": organizationId(config),
    },
    inLanguage: input.inLanguage ?? config.site.defaultLocale,
  }
}

export interface BuildFaqPageEntityInput {
  questions: ReadonlyArray<{
    question: string
    answer: string
  }>
}

export function buildFaqPageEntity(
  input: BuildFaqPageEntityInput,
): SeoFaqPageEntity {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: input.questions.map((question) => ({
      "@type": "Question",
      name: question.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: question.answer,
      },
    })),
  }
}

export interface BuildLocalBusinessEntityInput {
  name?: string
  url?: string
  telephone?: string
  email?: string
  address?: SeoPostalAddress
  areaServed?: string | string[]
  sameAs?: readonly string[]
}

export function buildLocalBusinessEntity(
  config: SeoConfig,
  input: BuildLocalBusinessEntityInput = {},
): SeoLocalBusinessEntity | null {
  const address = input.address ?? config.brand.brandLocation
  if (!address) {
    return null
  }

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: input.name ?? config.brand.brandName,
    url: input.url ?? config.brand.brandUrl,
    telephone: input.telephone ?? config.brand.brandTelephone,
    email: input.email ?? config.brand.brandEmail,
    address,
    areaServed: normalizeAreaServed(input.areaServed) ?? normalizeAreaServed(config.brand.brandServiceArea),
    sameAs: normalizeStringList(input.sameAs ?? config.brand.brandSameAs),
  }
}

export { buildBreadcrumbList }
