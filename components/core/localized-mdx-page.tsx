import { MdxArticle } from "@/components/core/mdx-article"
import { HeadingTypewriter } from "@/components/core/heading-typewriter"
import { ScrollReveal } from "@/components/core/scroll-reveal"
import { readLocalizedMdx, renderMdxToHtml } from "@/lib/mdx"
import type { Locale } from "@/lib/site-content"

type LocalizedMdxPageProps = {
  route: "about" | "packages" | "services"
  locale: Locale
}

// MIXED: localized MDX pages contain client copy, while the page scaffold is reusable.
export function LocalizedMdxPage({ route, locale }: LocalizedMdxPageProps) {
  // CLIENTE_OWNED: page copy lives in localized MDX files.
  const doc = readLocalizedMdx(route, locale) ?? readLocalizedMdx(route, "en")

  if (!doc) return null

  const scopeId = `${route}-scope`

  return (
    <main id={scopeId} className="mx-auto w-full max-w-6xl px-4 pb-8 pt-28 sm:px-6 lg:pt-32">
      {/* AGENCY_OWNED: reusable heading animation and article scaffold. */}
      <HeadingTypewriter scopeSelector={`#${scopeId}`} />
      <ScrollReveal direction="up">
        <MdxArticle title={doc.title} excerpt={doc.excerpt} html={renderMdxToHtml(doc.content)} />
      </ScrollReveal>
    </main>
  )
}
