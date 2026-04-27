import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { Seo } from "@/components/seo/Seo"
import {
  buildArticleEntity,
  buildBreadcrumbList,
  buildLocalBusinessEntity,
  buildPageMetadata,
  seoConfig,
} from "@/lib/seo"

type CasePageProps = {
  params: {
    slug: string
  }
}

const cases = {
  "sitio-web-corporativo": {
    title: "Sitio web corporativo para empresa de servicios",
    description: "Estructura diseñada para captar consultas orgánicas y presentar oferta clara.",
    datePublished: "2025-01-10",
  },
  "seo-local-empresa": {
    title: "SEO local para negocio con presencia física",
    description: "Caso enfocado en señalización semántica, cobertura local y páginas de servicio.",
    datePublished: "2025-02-18",
  },
} as const

export function generateStaticParams() {
  return Object.keys(cases).map((slug) => ({ slug }))
}

export function generateMetadata({ params }: CasePageProps): Metadata {
  const caseStudy = cases[params.slug as keyof typeof cases]

  if (!caseStudy) {
    return buildPageMetadata(seoConfig, {
      title: seoConfig.brand.brandName,
      description: seoConfig.brand.brandDescription,
      canonicalPath: `/casos/${params.slug}`,
    })
  }

  return buildPageMetadata(seoConfig, {
    title: caseStudy.title,
    description: caseStudy.description,
    canonicalPath: `/casos/${params.slug}`,
    openGraph: {
      type: "article",
    },
  })
}

export default function CaseStudyPage({ params }: CasePageProps) {
  const caseStudy = cases[params.slug as keyof typeof cases]

  if (!caseStudy) notFound()

  const localBusiness = buildLocalBusinessEntity(seoConfig)
  const entities = [
    buildArticleEntity(seoConfig, {
      kind: "Article",
      slug: params.slug,
      headline: caseStudy.title,
      description: caseStudy.description,
      datePublished: caseStudy.datePublished,
      articleSection: "Case Study",
    }),
    buildBreadcrumbList(
      [
        { name: "Inicio", path: "/" },
        { name: "Casos", path: "/casos" },
        { name: caseStudy.title, path: `/casos/${params.slug}` },
      ],
      seoConfig,
    ),
    ...(localBusiness ? [localBusiness] : []),
  ]

  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-16 pt-28 sm:px-6 lg:pt-32">
      <Seo entities={entities} />
      <section className="space-y-4">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Caso</p>
        <h1 className="text-4xl font-semibold tracking-tight">{caseStudy.title}</h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">{caseStudy.description}</p>
      </section>
    </main>
  )
}

