import { DotBackground } from "@/components/core/dot-background"

type MdxArticleProps = {
  title: string
  excerpt: string
  html: string
}

// AGENCY_OWNED: reusable article shell for rendered MDX pages.
export function MdxArticle({ title, excerpt, html }: MdxArticleProps) {
  return (
    <section className="relative isolate overflow-hidden px-2 py-10 text-card-foreground sm:px-4 md:px-6 md:py-14">
      <DotBackground
        className="opacity-100 mix-blend-soft-light"
        quantity={140}
        accentRatio={0.28}
        baseColor="214, 122, 44"
        accentColor="255, 154, 72"
        opacity={0.95}
      />
      <div className="relative space-y-5">
        <h1 className="text-center font-serif text-4xl leading-[0.96] tracking-tight text-card-foreground sm:text-5xl md:text-6xl">{title}</h1>
        <p className="mx-auto max-w-3xl text-center text-base leading-8 text-muted-foreground md:text-lg">{excerpt}</p>

        <div className="mt-8 space-y-6 text-base" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </section>
  )
}
