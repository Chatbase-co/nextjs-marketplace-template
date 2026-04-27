import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { Seo } from "@/components/seo/Seo"
import { buildBreadcrumbList, buildPageMetadata, buildServiceEntity, seoConfig } from "@/lib/seo"

type ServicePageProps = {
  params: {
    slug: string
  }
}

const services = {
  "diseno-web": {
    name: "Creación de sitios web",
    description: "Sitios rápidos, claros y pensados para convertir visitas en consultas.",
    serviceType: "Web Development",
  },
  "seo-tecnico": {
    name: "SEO técnico",
    description: "Arquitectura, indexación y structured data para mejorar comprensión semántica.",
    serviceType: "Search Engine Optimization",
  },
  "contenido-estrategico": {
    name: "Contenido estratégico",
    description: "Páginas orientadas a intención de búsqueda y entidades relevantes del negocio.",
    serviceType: "Content Strategy",
  },
} as const

export function generateStaticParams() {
  return Object.keys(services).map((slug) => ({ slug }))
}

export function generateMetadata({ params }: ServicePageProps): Metadata {
  const service = services[params.slug as keyof typeof services]

  if (!service) {
    return buildPageMetadata(seoConfig, {
      title: seoConfig.brand.brandName,
      description: seoConfig.brand.brandDescription,
      canonicalPath: `/servicios/${params.slug}`,
    })
  }

  return buildPageMetadata(seoConfig, {
    title: service.name,
    description: service.description,
    canonicalPath: `/servicios/${params.slug}`,
    openGraph: {
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
    },
  })
}

export default function ServicePage({ params }: ServicePageProps) {
  const service = services[params.slug as keyof typeof services]

  if (!service) notFound()

  const entities = [
    buildServiceEntity(seoConfig, {
      slug: params.slug,
      name: service.name,
      description: service.description,
      serviceType: service.serviceType,
    }),
    buildBreadcrumbList(
      [
        { name: "Inicio", path: "/" },
        { name: "Servicios", path: "/servicios" },
        { name: service.name, path: `/servicios/${params.slug}` },
      ],
      seoConfig,
    ),
  ]

  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-16 pt-28 sm:px-6 lg:pt-32">
      <Seo entities={entities} />
      <section className="space-y-4">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Servicio</p>
        <h1 className="text-4xl font-semibold tracking-tight">{service.name}</h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">{service.description}</p>
      </section>
    </main>
  )
}

