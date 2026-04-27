import { DotBackground } from "@/components/core/dot-background"

type BlogArticleProps = {
  title: string
  excerpt: string
  html: string
  meta?: {
    readTime?: string
    date?: string
    category?: string
  }
}

// AGENCY_OWNED: reusable blog/article presentation shell.
export function BlogArticle({ title, excerpt, html, meta }: BlogArticleProps) {
  return (
    <article className="blog-surface relative isolate overflow-hidden rounded-[2rem] border px-4 py-10 shadow-[0_24px_90px_-60px_var(--blog-shadow)] sm:px-6 md:px-8 md:py-14">
      <DotBackground
        className="opacity-100 mix-blend-multiply dark:mix-blend-screen"
        quantity={104}
        accentRatio={0.24}
        baseColor="35, 35, 32"
        darkBaseColor="244, 241, 234"
        accentColor="224, 58, 30"
        darkAccentColor="255, 125, 79"
        opacity={0.16}
        darkOpacity={0.11}
      />
      <div className="relative space-y-5">
        <div className="flex items-center gap-3">
          <span className="font-blog-mono text-[9px] uppercase tracking-[0.16em] text-[color:var(--blog-stone)]">Blog / Note</span>
          <span className="blog-rule h-px flex-1" />
        </div>
        <h1 className="blog-ink font-blog-syne text-center text-[clamp(1.9rem,5.6vw,3.5rem)] font-black leading-[0.94] tracking-[-0.05em]">
          {title}
        </h1>
        {meta?.readTime || meta?.date || meta?.category ? (
          <div className="flex flex-wrap justify-center gap-3 font-blog-mono text-[9px] uppercase tracking-[0.16em] text-[color:var(--blog-signal)]">
            {meta?.readTime ? <span>{meta.readTime}</span> : null}
            {meta?.date ? <span>{meta.date}</span> : null}
            {meta?.category ? <span>{meta.category}</span> : null}
          </div>
        ) : null}
        {excerpt ? <p className="blog-muted mx-auto max-w-3xl font-blog-syne text-base leading-8 md:text-lg">{excerpt}</p> : null}

        {html ? (
          <>
            <div className="blog-rule mt-8 h-px w-full" />
            <div className="blog-content blog-ink mt-8 space-y-6 text-base leading-8" dangerouslySetInnerHTML={{ __html: html }} />
          </>
        ) : null}
      </div>
    </article>
  )
}
