import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Seo } from "@/components/seo/Seo"
import { buildBreadcrumbList, buildPageMetadata, seoConfig } from "@/lib/seo"
import { getLocaleFromCookies } from "@/lib/locale"
import { getSiteCopy } from "@/lib/site-content"

// MIXED: home page uses reusable SEO/layout primitives and client-owned brand copy/hero assets.
export function generateMetadata(): Metadata {
  // AGENCY_OWNED: metadata builder, canonical URLs, and social previews are reusable SEO primitives.
  return buildPageMetadata(seoConfig, {
    title: `${seoConfig.brand.brandName} Studio`,
    description: seoConfig.brand.brandDescription,
    canonicalPath: "/",
    openGraph: {
      type: "website",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: seoConfig.brand.brandName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/opengraph-image"],
    },
  })
}

export default async function Home() {
  // CLIENTE_OWNED: hero copy and background image are brand-facing site content.
  const locale = await getLocaleFromCookies()
  const copy = getSiteCopy(locale)
  // AGENCY_OWNED: breadcrumb entity generation is reusable SEO infrastructure.
  const entities = buildBreadcrumbList([{ name: "Inicio", path: "/" }], seoConfig)

  return (
    <main className="relative min-h-screen overflow-hidden">
      <Seo entities={entities} />
      <section className="relative isolate flex min-h-screen items-center justify-center px-4 pt-28 sm:px-6 lg:pt-32">
        <div className="absolute inset-0">
          <Image
            src="/serene-nature-sharp.jpg"
            alt="Paisaje natural"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/5 to-background/36" />
        </div>

        <div
          className="relative z-10 flex w-full max-w-5xl -translate-y-[18%] flex-col items-center text-center lg:-translate-y-[33%]"
        >
          <h1
            className="home-reveal-title font-display-syne text-5xl leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl xl:text-[5rem]"
            style={{ textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}
          >
            <span className="home-reveal-title__line">
              <span className="font-black leading-[0.94] tracking-[-0.05em] bg-gradient-to-b from-white via-white to-zinc-300 bg-clip-text text-transparent dark:from-white dark:via-white dark:to-zinc-400">
                {copy.brand.name.toUpperCase()} STUDIO
              </span>
            </span>
            <span className="home-reveal-title__line mt-10 block sm:mt-12">
              <span className="text-[1.45rem] font-medium leading-tight text-white/82 sm:text-[1.75rem] md:text-[2rem]">
                {copy.hero.slogan}
              </span>
            </span>
          </h1>

          <p className="mt-10 max-w-2xl text-sm leading-7 text-white/78 sm:text-base sm:leading-8">
            {copy.hero.description}
          </p>

          <Button asChild className="group relative mt-10 overflow-hidden rounded-full border border-white/20 bg-white/10 px-8 py-4 font-medium text-white shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-white/30 hover:bg-white/20">
            <Link
              href="/services"
              data-analytics-event="cta_click"
              data-analytics-surface="home.hero.services"
              data-analytics-label={copy.nav.projectCta}
            >
              <span className="relative z-10">{copy.nav.projectCta}</span>
              <ArrowUpRight className="relative z-10 h-4 w-4" />
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
