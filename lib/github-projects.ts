// THIRD_PARTY_INTEGRATION: consumes the public GitHub API and README assets to populate portfolio cards.
export type GitHubRepository = {
  id: number
  name: string
  full_name: string
  html_url: string
  homepage: string | null
  description: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  pushed_at: string
  default_branch: string
  license?: {
    key: string | null
    name: string | null
    spdx_id: string | null
  } | null
  owner?: {
    login: string
  }
  coverImageUrl?: string | null
}

const GITHUB_USER = "driano7"

const requestHeaders: Record<string, string> = {
  Accept: "application/vnd.github+json",
  "User-Agent": "banff-studio",
}

async function fetchJson<T>(url: string, timeoutMs: number, init?: RequestInit): Promise<T | null> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  try {
    const controller = new AbortController()
    timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    const response = await fetch(url, {
      ...init,
      headers: requestHeaders,
      signal: controller.signal,
      next: { revalidate: 3600 },
    })

    if (!response.ok) return null
    return (await response.json()) as T
  } catch {
    return null
  } finally {
    if (timeoutId) clearTimeout(timeoutId)
  }
}

async function isUsableImageUrl(url: string, timeoutMs = 1600) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  try {
    const controller = new AbortController()
    timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    const response = await fetch(url, {
      method: "HEAD",
      headers: requestHeaders,
      signal: controller.signal,
      next: { revalidate: 3600 },
    })

    if (!response.ok) return false

    const contentType = response.headers.get("content-type") ?? ""
    return contentType.startsWith("image/")
  } catch {
    return false
  } finally {
    if (timeoutId) clearTimeout(timeoutId)
  }
}

function decodeBase64(value: string) {
  return Buffer.from(value.replace(/\n/g, ""), "base64").toString("utf8")
}

function collectMarkdownImageCandidates(markdown: string) {
  const output: string[] = []
  const markdownImageRegex = /!\[[^\]]*]\(([^)]+)\)/g
  const htmlImageRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi

  for (const match of markdown.matchAll(markdownImageRegex)) {
    const raw = (match[1] ?? "").trim()
    if (!raw) continue
    const cleaned = raw.replace(/^<|>$/g, "")
    const spaceIndex = cleaned.search(/\s/)
    output.push(spaceIndex === -1 ? cleaned : cleaned.slice(0, spaceIndex))
  }

  for (const match of markdown.matchAll(htmlImageRegex)) {
    const raw = (match[1] ?? "").trim()
    if (raw) output.push(raw)
  }

  return output
}

function toAbsoluteReadmeUrl(
  candidate: string,
  owner: string,
  repo: string,
  defaultBranch: string,
  readmePath: string,
) {
  if (!candidate || candidate.startsWith("data:")) return null
  if (candidate.startsWith("http://") || candidate.startsWith("https://")) return candidate
  if (candidate.startsWith("//")) return `https:${candidate}`

  if (candidate.startsWith("/")) {
    return `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/${candidate.slice(1)}`
  }

  const readmeDir = readmePath.includes("/") ? readmePath.slice(0, readmePath.lastIndexOf("/") + 1) : ""
  const base = `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/${readmeDir}`

  try {
    return new URL(candidate, base).toString()
  } catch {
    return null
  }
}

function pickCoverImage(
  candidates: string[],
  owner: string,
  repo: string,
  defaultBranch: string,
  readmePath: string,
) {
  const normalized = candidates
    .map((item) => toAbsoluteReadmeUrl(item, owner, repo, defaultBranch, readmePath))
    .filter((item): item is string => Boolean(item))

  const nonBadge = normalized.find((item) => {
    const lower = item.toLowerCase()
    return !lower.includes("shields.io") && !lower.includes("badge")
  })

  return nonBadge ?? normalized[0] ?? null
}

async function resolveReadmeCover(owner: string, repo: string, defaultBranch: string) {
  const readme = await fetchJson<{
    content?: string
    encoding?: string
    path?: string
  }>(`https://api.github.com/repos/${owner}/${repo}/readme`, 2000)

  if (!readme?.content || readme.encoding !== "base64") return null

  const markdown = decodeBase64(readme.content)
  const candidates = collectMarkdownImageCandidates(markdown)
  if (!candidates.length) return null

  const resolved = pickCoverImage(candidates, owner, repo, defaultBranch, readme.path ?? "README.md")
  if (!resolved) return null

  return (await isUsableImageUrl(resolved)) ? resolved : null
}

export async function getFeaturedGitHubProjects(limit = 7): Promise<GitHubRepository[]> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 1800)

  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=pushed&direction=desc&per_page=30`, {
      next: { revalidate: 3600 },
      headers: requestHeaders,
      signal: controller.signal,
    })

    if (!response.ok) return []

    const data = (await response.json()) as GitHubRepository[]
    const selected = data.slice(0, limit)

    return Promise.all(
      selected.map(async (repo) => {
        const owner = repo.owner?.login ?? GITHUB_USER
        const defaultBranch = repo.default_branch || "main"
        const readmeCover = await resolveReadmeCover(owner, repo.name, defaultBranch)
        const fallbackCover = `https://opengraph.githubassets.com/1/${owner}/${repo.name}`
        const validatedFallbackCover = (await isUsableImageUrl(fallbackCover)) ? fallbackCover : null
        const normalizedHomepage =
          repo.name.toLowerCase().includes("xoco") ? "https://xococafe.site" : repo.homepage

        return {
          ...repo,
          homepage: normalizedHomepage,
          coverImageUrl: readmeCover ?? validatedFallbackCover,
        }
      }),
    )
  } catch {
    return []
  } finally {
    clearTimeout(timeoutId)
  }
}

export function summarizeGitHubProjects(projects: GitHubRepository[]) {
  const totalStars = projects.reduce((sum, repo) => sum + repo.stargazers_count, 0)
  const totalForks = projects.reduce((sum, repo) => sum + repo.forks_count, 0)
  const languages = new Set(projects.map((repo) => repo.language).filter(Boolean))
  return {
    totalStars,
    totalForks,
    languageCount: languages.size,
    projectCount: projects.length,
  }
}
