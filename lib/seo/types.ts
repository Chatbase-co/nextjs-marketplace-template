import type { Metadata } from "next"

export interface SeoPostalAddress {
  streetAddress?: string
  addressLocality?: string
  addressRegion?: string
  postalCode?: string
  addressCountry?: string
}

export interface SeoContactPoint {
  contactType: string
  telephone?: string
  email?: string
  areaServed?: string | string[]
  availableLanguage?: string | string[]
}

export interface SeoBrandConfig {
  brandName: string
  brandUrl: string
  brandLogo: string
  brandDescription: string
  brandSameAs: readonly string[]
  brandTelephone?: string
  brandEmail?: string
  brandLocation?: SeoPostalAddress
  brandServiceArea: readonly string[]
  brandContactPoints: readonly SeoContactPoint[]
}

export interface SeoSiteConfig {
  siteUrl: string
  defaultLocale: string
  locales: readonly string[]
  titleTemplate: string
  defaultTitle: string
  defaultDescription: string
}

export interface SeoConfig {
  brand: SeoBrandConfig
  site: SeoSiteConfig
}

export type SeoRobots = Metadata["robots"]
export type SeoAlternates = Metadata["alternates"]

export type SeoOpenGraphImage = {
  url: string
  width?: number
  height?: number
  alt?: string
}

export type SeoTwitterImage = string | SeoOpenGraphImage

export interface SeoPageMetadataInput {
  title: string
  description: string
  canonicalPath?: string
  locale?: string
  robots?: SeoRobots
  openGraph?: Omit<
    NonNullable<Metadata["openGraph"]>,
    "title" | "description" | "url" | "siteName" | "images"
  > & {
    type?: string
    images?: SeoOpenGraphImage[]
  }
  twitter?: Omit<NonNullable<Metadata["twitter"]>, "title" | "description" | "images"> & {
    card?: string
    images?: SeoTwitterImage[]
  }
  alternates?: SeoAlternates
}

export interface SeoLayoutMetadataInput {
  defaultTitle?: string
  description?: string
  canonicalPath?: string
  locale?: string
  robots?: SeoRobots
  alternates?: SeoAlternates
}

export interface SeoEntityBase {
  "@context": "https://schema.org"
  "@type": string
  "@id"?: string
}

export interface SeoOrganizationEntity extends SeoEntityBase {
  "@type": "Organization"
  name: string
  url: string
  logo?: string
  sameAs?: string[]
  telephone?: string
  email?: string
  contactPoint?: Array<{
    "@type": "ContactPoint"
    contactType: string
    telephone?: string
    email?: string
    areaServed?: string | string[]
    availableLanguage?: string | string[]
  }>
  address?: SeoPostalAddress
}

export interface SeoWebSiteEntity extends SeoEntityBase {
  "@type": "WebSite"
  name: string
  url: string
  publisher?: {
    "@id": string
  }
  inLanguage?: string
  potentialAction?: {
    "@type": "SearchAction"
    target: string
    "query-input": string
  }
}

export interface SeoServiceEntity extends SeoEntityBase {
  "@type": "Service"
  name: string
  url: string
  serviceType?: string
  description?: string
  provider?: {
    "@id": string
  }
  areaServed?: string | string[]
}

export interface SeoArticleEntity extends SeoEntityBase {
  "@type": "Article" | "BlogPosting"
  headline: string
  description?: string
  url?: string
  mainEntityOfPage?: string
  image?: string | string[]
  datePublished?: string
  dateModified?: string
  author?: {
    "@type": "Person" | "Organization"
    name: string
  }
  publisher?: {
    "@id": string
  }
  articleSection?: string
  inLanguage?: string
}

export interface SeoFaqPageEntity extends SeoEntityBase {
  "@type": "FAQPage"
  mainEntity: Array<{
    "@type": "Question"
    name: string
    acceptedAnswer: {
      "@type": "Answer"
      text: string
    }
  }>
}

export interface SeoBreadcrumbEntity extends SeoEntityBase {
  "@type": "BreadcrumbList"
  itemListElement: Array<{
    "@type": "ListItem"
    position: number
    name: string
    item?: string
  }>
}

export interface SeoLocalBusinessEntity extends SeoEntityBase {
  "@type": "LocalBusiness"
  name: string
  url: string
  telephone?: string
  email?: string
  address?: SeoPostalAddress
  areaServed?: string | string[]
  sameAs?: string[]
}

export type SeoJsonLdEntity =
  | SeoOrganizationEntity
  | SeoWebSiteEntity
  | SeoServiceEntity
  | SeoArticleEntity
  | SeoFaqPageEntity
  | SeoBreadcrumbEntity
  | SeoLocalBusinessEntity

export type SeoJsonLdInput = SeoJsonLdEntity | readonly SeoJsonLdEntity[]
