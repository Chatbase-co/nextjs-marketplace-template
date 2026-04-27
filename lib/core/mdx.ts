import fs from "node:fs"
import path from "node:path"

import type { Locale } from "@/lib/site-content"

// MIXED: local MDX content is client-owned editorial material, while the parser/renderer is reusable framework code.
// AGENCY_OWNED: parser, escaping, and render helpers are reusable across client content sources.
export type MdxDocument = {
  title: string
  excerpt: string
  content: string
}

export type MdxFrontmatter = {
  locale?: Locale
  title?: string
  excerpt?: string
  slug?: string
  date?: string
  readTime?: string
  category?: string
  tags?: string[]
  primaryKeyword?: string
  secondaryKeywords?: string[]
  searchIntent?: string
  entities?: string[]
  semanticRelations?: string[]
  llmSummary?: string
  snippetTakeaway?: string
  faq?: Array<{
    question: string
    answer: string
  }>
  internalLinks?: Array<{
    label: string
    href: string
    purpose: string
  }>
  schemaType?: string
}

function parseJsonValue(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return ""

  if (/^[\[{"]/.test(trimmed) || /^(true|false|null|-?\d+(\.\d+)?)$/.test(trimmed)) {
    try {
      return JSON.parse(trimmed)
    } catch {
      // Fall through to string handling below.
    }
  }

  return trimmed
}

export function parseFrontmatter(raw: string): { meta: MdxFrontmatter; body: string } {
  const trimmed = raw.trim()
  if (!trimmed.startsWith("---")) {
    return { meta: {}, body: trimmed }
  }

  const end = trimmed.indexOf("\n---", 3)
  if (end === -1) {
    return { meta: {}, body: trimmed }
  }

  const frontmatter = trimmed.slice(3, end).trim()
  const body = trimmed.slice(end + 4).trim()
  const meta: MdxFrontmatter = { tags: [] }
  const jsonArrayKeys = new Set(["tags", "secondaryKeywords", "entities", "semanticRelations"])
  const jsonObjectArrayKeys = new Set(["faq", "internalLinks"])

  for (const line of frontmatter.split("\n")) {
    const colonIndex = line.indexOf(":")
    if (colonIndex === -1) continue
    const key = line.slice(0, colonIndex).trim()
    const value = line.slice(colonIndex + 1).trim()

    if (key === "tags") {
      const parsed = parseJsonValue(value)
      meta.tags = Array.isArray(parsed)
        ? parsed.map((item) => String(item).trim()).filter(Boolean)
        : String(parsed)
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
      continue
    }

    if (jsonArrayKeys.has(key)) {
      const parsed = parseJsonValue(value)
      if (Array.isArray(parsed)) {
        ;(meta as Record<string, string[]>)[key] = parsed.map((item) => String(item).trim()).filter(Boolean)
      }
      continue
    }

    if (jsonObjectArrayKeys.has(key)) {
      const parsed = parseJsonValue(value)
      if (Array.isArray(parsed)) {
        if (key === "faq") {
          meta.faq = parsed
            .map((item) => {
              if (!item || typeof item !== "object") return null
              const record = item as Record<string, unknown>
              const question = String(record.question ?? "").trim()
              const answer = String(record.answer ?? "").trim()
              if (!question || !answer) return null
              return { question, answer }
            })
            .filter((item): item is NonNullable<typeof item> => Boolean(item))
        } else {
          meta.internalLinks = parsed
            .map((item) => {
              if (!item || typeof item !== "object") return null
              const record = item as Record<string, unknown>
              const label = String(record.label ?? "").trim()
              const href = String(record.href ?? "").trim()
              const purpose = String(record.purpose ?? "").trim()
              if (!label || !href || !purpose) return null
              return { label, href, purpose }
            })
            .filter((item): item is NonNullable<typeof item> => Boolean(item))
        }
      }
      continue
    }

    if (["locale", "title", "excerpt", "slug", "date", "readTime", "category", "primaryKeyword", "searchIntent", "llmSummary", "snippetTakeaway", "schemaType"].includes(key)) {
      ;(meta as Record<string, string>)[key] = String(parseJsonValue(value))
      continue
    }
  }

  return { meta, body }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function renderInline(source: string) {
  const escaped = escapeHtml(source)
  return escaped
    .replace(
      /&lt;u&gt;([\s\S]+?)&lt;\/u&gt;/g,
      '<span class="underline decoration-[color:var(--accent)] decoration-2 underline-offset-4">$1</span>',
    )
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="underline decoration-[color:var(--accent)]/60 underline-offset-4 hover:text-[color:var(--accent)]" target="_blank" rel="noreferrer">$1</a>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.+?)`/g, '<code class="rounded bg-black/5 px-1.5 py-0.5 text-[0.92em] font-medium text-foreground">$1</code>')
}

export function renderMdxToHtml(
  source: string,
  options?: {
    centerParagraphs?: boolean
  },
) {
  const lines = source.replace(/\r\n/g, "\n").split("\n")
  const html: string[] = []
  let index = 0
  const paragraphClass = options?.centerParagraphs
    ? "mx-auto max-w-3xl text-center leading-7 text-muted-foreground"
    : "leading-7 text-muted-foreground"
  const centeredHeadingClass = options?.centerParagraphs
    ? "mx-auto max-w-3xl text-center tracking-tight text-foreground"
    : "tracking-tight text-foreground"
  const centeredListClass = options?.centerParagraphs
    ? "mx-auto my-6 max-w-3xl space-y-3 pl-0 text-center text-muted-foreground"
    : "my-6 space-y-3 pl-5 text-muted-foreground"
  const centeredUnorderedListItemClass = options?.centerParagraphs
    ? "list-disc list-inside leading-7 text-center"
    : "list-disc leading-7"
  const centeredOrderedListItemClass = options?.centerParagraphs
    ? "list-decimal list-inside leading-7 text-center"
    : "list-decimal leading-7"

  const flushParagraph = (buffer: string[]) => {
    if (buffer.length === 0) return
    html.push(`<p class="${paragraphClass}">${renderInline(buffer.join(" ").trim())}</p>`)
    buffer.length = 0
  }

  while (index < lines.length) {
    const line = lines[index].trimEnd()
    const trimmed = line.trim()

    if (!trimmed) {
      index += 1
      continue
    }

    if (trimmed.startsWith("### ")) {
      html.push(`<h3 class="mt-8 text-2xl font-semibold ${centeredHeadingClass}">${renderInline(trimmed.slice(4))}</h3>`)
      index += 1
      continue
    }

    if (trimmed.startsWith("## ")) {
      html.push(`<h2 class="mt-10 text-center text-3xl font-semibold ${centeredHeadingClass}">${renderInline(trimmed.slice(3))}</h2>`)
      index += 1
      continue
    }

    if (trimmed.startsWith("# ")) {
      html.push(`<h1 class="mt-10 text-4xl font-semibold ${centeredHeadingClass}">${renderInline(trimmed.slice(2))}</h1>`)
      index += 1
      continue
    }

    if (trimmed.startsWith("> ")) {
      const quote: string[] = []
      while (index < lines.length && lines[index].trim().startsWith("> ")) {
        quote.push(lines[index].trim().replace(/^>\s?/, ""))
        index += 1
      }
      html.push(
        `<blockquote class="rounded-3xl border border-black/10 bg-white/70 px-5 py-4 text-sm leading-7 text-foreground shadow-sm dark:border-white/10 dark:bg-black/55 dark:text-white/78"><p>${renderInline(
          quote.join(" "),
        )}</p></blockquote>`,
      )
      continue
    }

    if (/^(\- |\* )/.test(trimmed)) {
      const items: string[] = []
      while (index < lines.length && /^(\- |\* )/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^(\- |\* )/, ""))
        index += 1
      }
      html.push(
        `<ul class="${centeredListClass}">${items
          .map((item) => `<li class="${centeredUnorderedListItemClass}">${renderInline(item)}</li>`)
          .join("")}</ul>`,
      )
      continue
    }

    if (/^\d+\. /.test(trimmed)) {
      const items: string[] = []
      while (index < lines.length && /^\d+\. /.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s+/, ""))
        index += 1
      }
      html.push(
        `<ol class="${centeredListClass}">${items
          .map((item) => `<li class="${centeredOrderedListItemClass}">${renderInline(item)}</li>`)
          .join("")}</ol>`,
      )
      continue
    }

    const paragraph: string[] = [trimmed]
    index += 1
    while (index < lines.length && lines[index].trim() && !/^(#|##|###|> |\- |\* |\d+\. )/.test(lines[index].trim())) {
      paragraph.push(lines[index].trim())
      index += 1
    }
    flushParagraph(paragraph)
  }

  return html.join("\n")
}

const CONTENT_ROOT = path.join(process.cwd(), "content")

// CLIENTE_OWNED: the actual MDX files under content/ belong to the site content layer.
export function readMdxFile(filePath: string): MdxDocument | null {
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, "utf8")
  const { meta, body } = parseFrontmatter(raw)
  if (!meta.title || !meta.excerpt) return null
  return { title: meta.title, excerpt: meta.excerpt, content: body }
}

export function readLocalizedMdx(route: string, locale: "en" | "fr" | "es"): MdxDocument | null {
  const filePath = path.join(CONTENT_ROOT, "pages", route, `${locale}.mdx`)
  return readMdxFile(filePath)
}
