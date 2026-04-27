import type { Locale } from "@/lib/site-content"

export type BlogSeoLlmFaq = {
  question: string
  answer: string
}

export type BlogSeoLlmInternalLink = {
  label: string
  href: string
  purpose: string
}

export type BlogSeoLlmCmsSchema = {
  slug: string
  locale: Locale
  title: string
  excerpt: string
  date: string
  readTime: string
  category: string
  tags: string[]
  primaryKeyword: string
  secondaryKeywords: string[]
  searchIntent: string
  entities: string[]
  semanticRelations: string[]
  llmSummary: string
  snippetTakeaway: string
  faq: BlogSeoLlmFaq[]
  internalLinks: BlogSeoLlmInternalLink[]
  schemaType: "BlogPosting"
}

export type BlogSeoLlmChecklist = {
  step: string
  checks: readonly string[]
}

export const BLOG_SEO_LLM_CHECKLIST: readonly BlogSeoLlmChecklist[] = [
  {
    step: "CMS model",
    checks: [
      "Primary keyword is defined.",
      "Secondary keywords are listed.",
      "Search intent is explicit.",
      "Entities are captured as a list.",
      "FAQ answers are short and concrete.",
      "Snippet takeaway is one block that can stand alone.",
    ],
  },
  {
    step: "SEO structure",
    checks: [
      "Title matches search intent.",
      "H1 is clear and unique.",
      "H2/H3 structure is logical.",
      "Internal links reinforce the topic.",
      "No keyword stuffing or forced repetition.",
    ],
  },
  {
    step: "LLM structure",
    checks: [
      "Long paragraphs are broken into smaller blocks.",
      "Definitions are direct and close to the top.",
      "Lists are used for steps, signals, or features.",
      "FAQ blocks are visible in the content.",
      "Each section can be summarized in one sentence.",
    ],
  },
  {
    step: "Enrichment",
    checks: [
      "Entities are named consistently.",
      "Semantic relations are clear.",
      "Snippet-ready text is included.",
      "JSON-LD can be generated from the same source of truth.",
      "The content remains useful if read out of context.",
    ],
  },
  {
    step: "QA",
    checks: [
      "Keyword principal remains unchanged.",
      "Intent remains unchanged.",
      "The article still reads naturally.",
      "The piece is still useful for Google and for LLM retrieval.",
      "The structure is still easy to maintain in the CMS.",
    ],
  },
] as const
