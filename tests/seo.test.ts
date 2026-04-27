import { describe, expect, it } from "vitest"

import { buildPageMetadata } from "@/lib/seo/buildMetadata"
import { buildBreadcrumbList } from "@/lib/seo/buildBreadcrumbs"
import { escapeJsonLd, serializeJsonLd } from "@/lib/seo/buildJsonLd"
import { seoConfig } from "@/lib/seo/config"
import {
  buildArticleEntity,
  buildLocalBusinessEntity,
  buildOrganizationEntity,
  buildServiceEntity,
  buildWebSiteEntity,
} from "@/lib/seo/entities"
import { buildCanonicalUrl } from "@/lib/seo/url"

describe("seo helpers", () => {
  it("builds canonical urls without trailing slash for nested paths", () => {
    expect(buildCanonicalUrl(seoConfig, "/servicios/seo-tecnico/")).toBe(
      `${seoConfig.site.siteUrl.replace(/\/+$/, "")}/servicios/seo-tecnico`,
    )
  })

  it("builds metadata with canonical alternates", () => {
    const metadata = buildPageMetadata(seoConfig, {
      title: "SEO técnico",
      description: "Servicio de SEO",
      canonicalPath: "/servicios/seo-tecnico",
    })

    expect(metadata.title).toBe("SEO técnico")
    expect(metadata.alternates?.canonical).toBe(`${seoConfig.site.siteUrl.replace(/\/+$/, "")}/servicios/seo-tecnico`)
    expect(metadata.openGraph?.title).toBe("SEO técnico")
  })

  it("escapes json ld payloads", () => {
    expect(escapeJsonLd('<script>alert("x")</script>')).toBe("\\u003cscript>alert(\"x\")\\u003c/script>")
    expect(serializeJsonLd({ "@context": "https://schema.org", "@type": "Thing", name: "<danger>" })).toContain(
      "\\u003cdanger>",
    )
  })

  it("builds breadcrumb lists with absolute items", () => {
    const breadcrumbs = buildBreadcrumbList(
      [
        { name: "Inicio", path: "/" },
        { name: "Servicios", path: "/servicios" },
      ],
      seoConfig,
    )

    expect(breadcrumbs.itemListElement).toHaveLength(2)
    expect(breadcrumbs.itemListElement[1].item).toBe(`${seoConfig.site.siteUrl.replace(/\/+$/, "")}/servicios`)
  })

  it("builds entity graphs for organization, website, service and article", () => {
    const organization = buildOrganizationEntity(seoConfig)
    const website = buildWebSiteEntity(seoConfig)
    const service = buildServiceEntity(seoConfig, {
      slug: "seo-tecnico",
      name: "SEO técnico",
    })
    const article = buildArticleEntity(seoConfig, {
      kind: "BlogPosting",
      slug: "seo-tecnico-nextjs",
      headline: "SEO técnico en Next.js App Router",
    })

    expect(organization["@type"]).toBe("Organization")
    expect(website["@type"]).toBe("WebSite")
    expect(service["@type"]).toBe("Service")
    expect(article["@type"]).toBe("BlogPosting")
  })

  it("returns local business only when location data exists", () => {
    expect(buildLocalBusinessEntity(seoConfig)).toBeNull()

    const localBusiness = buildLocalBusinessEntity(seoConfig, {
      address: {
        addressLocality: "Ciudad de México",
        addressCountry: "MX",
      },
    })

    expect(localBusiness?.["@type"]).toBe("LocalBusiness")
  })
})

