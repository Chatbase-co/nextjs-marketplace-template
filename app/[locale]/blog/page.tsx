import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { HeadingTypewriter } from "@/components/core/heading-typewriter"
import { BlogArticle } from "@/components/core/blog-article"
import { ScrollReveal } from "@/components/core/scroll-reveal"
import { Button } from "@/components/ui/button"
import { getSiteCopy, locales, type Locale } from "@/lib/site-content"
import { readLocalizedMdx } from "@/lib/mdx"
import { localizedBlogHref } from "@/lib/navigation"
import { buildPageMetadata, seoConfig } from "@/lib/seo"

const blogSurfaces = [
  "from-[#f2edd6] via-[#f9f9f7] to-[#e8e7e3] dark:from-[#111926] dark:via-[#0d1219] dark:to-[#151c27]",
  "from-[#f9f9f7] via-[#f2edd6] to-[#e8e7e3] dark:from-[#0f151f] dark:via-[#0b1016] dark:to-[#151b24]",
  "from-[#f9f9f7] via-[#e8e7e3] to-[#f2edd6] dark:from-[#0c1118] dark:via-[#101623] dark:to-[#11151d]",
] as const

type LocalePageProps = {
  params: Promise<{
    locale: string
  }>
}

const blogHeroCopy: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "Practical notes on SEO, social selling, AI, and websites that still perform after launch.",
    description:
      "Articles written in the same editorial system as the rest of the site: clean contrast, warm paper surfaces, and signal accents used sparingly.",
  },
  fr: {
    title: "Notes pratiques sur le SEO, la vente sociale, l’IA, et les sites web qui performent après le lancement.",
    description:
      "Articles écrits dans le même système éditorial que le reste du site: contraste net, surfaces papier chaudes, et accents signal utilisés avec mesure.",
  },
  es: {
    title: "Notas prácticas sobre SEO, ventas por redes, IA y sitios web que siguen funcionando después del lanzamiento.",
    description:
      "Artículos escritos con el mismo sistema editorial que el resto del sitio: contraste limpio, superficies tipo papel cálidas y acentos de señal usados con medida.",
  },
}

function buildBlogAlternates() {
  return {
    languages: Object.fromEntries(locales.map((item) => [item, `/${item}/blog`])) as Record<string, string>,
  }
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) {
    return buildPageMetadata(seoConfig, {
      title: `${seoConfig.brand.brandName} Studio`,
      description: seoConfig.brand.brandDescription,
      canonicalPath: "/blog",
    })
  }

  const doc = readLocalizedMdx("blog", locale as Locale) ?? readLocalizedMdx("blog", "en")

  if (!doc) {
    return buildPageMetadata(seoConfig, {
      title: `${seoConfig.brand.brandName} Studio`,
      description: seoConfig.brand.brandDescription,
      canonicalPath: `/${locale}/blog`,
    })
  }

  return buildPageMetadata(seoConfig, {
    title: doc.title,
    description: doc.excerpt,
    canonicalPath: `/${locale}/blog`,
    locale,
    alternates: buildBlogAlternates(),
  })
}

export default async function BlogPage({ params }: LocalePageProps) {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  const typedLocale = locale as Locale
  const copy = getSiteCopy(typedLocale)
  const doc = readLocalizedMdx("blog", typedLocale) ?? readLocalizedMdx("blog", "en")
  const posts = copy.blog.cards
  const heroCopy = blogHeroCopy[typedLocale]

  if (!doc) return null

  return (
    <main
      id="blog-scope"
      className="blog-shell mx-auto w-full max-w-6xl px-4 pb-10 pt-28 sm:px-6 lg:pt-32"
    >
      <HeadingTypewriter scopeSelector="#blog-scope" />

      <section className="blog-hero-card mb-8 rounded-[2rem] border px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-3">
            <p className="font-blog-mono text-[9px] uppercase tracking-[0.16em] text-[color:var(--blog-stone)]">Binff Studio / Blog</p>
            <h2 className="blog-ink max-w-2xl font-blog-syne text-2xl font-black leading-[0.96] tracking-[-0.05em] sm:text-3xl">
              {heroCopy.title}
            </h2>
            <p className="blog-muted max-w-3xl font-blog-syne text-sm leading-7 sm:text-base">
              {heroCopy.description}
            </p>
          </div>
          <span className="font-blog-mono text-[9px] uppercase tracking-[0.16em] text-[color:var(--blog-signal)]">
            Canada / Mexico
          </span>
        </div>
      </section>

      <ScrollReveal direction="up">
        <BlogArticle title={doc.title} excerpt="" html="" />
      </ScrollReveal>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        {posts.map((post, index) => (
          <ScrollReveal key={post.slug} direction={index % 2 === 0 ? "up" : "down"} delay={0.08 + index * 0.08}>
            <article className="blog-post-card rounded-[2rem] border p-3 transition">
              <div className={`blog-border relative h-full overflow-hidden rounded-[1.4rem] border bg-gradient-to-br p-5 ${blogSurfaces[index % blogSurfaces.length]}`}>
                <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-[#e03a1e]/10 blur-xl dark:bg-[#ff6b42]/12" />
                <div className="absolute -bottom-8 -left-8 h-20 w-20 rounded-full bg-[#232320]/10 blur-xl dark:bg-white/10" />
                <div className="relative space-y-3">
                  <span className="blog-pill inline-flex rounded-full border px-2.5 py-1 font-blog-mono text-[11px] uppercase tracking-[0.14em]">
                    {post.tag}
                  </span>
                  <h2 className="blog-ink font-blog-syne text-[0.8rem] font-bold leading-tight tracking-[-0.03em] sm:text-[0.9rem]">
                    {post.title}
                  </h2>
                  <p className="blog-muted font-blog-syne text-sm leading-7">{post.excerpt}</p>
                  <Link
                    href={localizedBlogHref(typedLocale, post.slug)}
                    className="inline-flex items-center gap-2 pt-2 font-blog-mono text-[9px] uppercase tracking-[0.16em] text-[color:var(--blog-signal)] transition"
                  >
                    {typedLocale === "es" ? "Leer artículo" : typedLocale === "fr" ? "Lire l’article" : "Read article"}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          </ScrollReveal>
        ))}
      </section>

      <div className="mt-6 flex justify-start">
        <Button
          asChild
          variant="outline"
          className="blog-cta rounded-full border border-[color:var(--blog-border)] px-5 font-blog-mono text-[9px] uppercase tracking-[0.16em]"
        >
          <Link href="/#contact">{copy.nav.contact}</Link>
        </Button>
      </div>
    </main>
  )
}
