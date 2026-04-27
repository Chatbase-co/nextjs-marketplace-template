import { locales, type Locale } from "@/lib/site-content"
import type {
  AnalyticsDeviceCategory,
  AnalyticsPageType,
  AnalyticsReferrerCategory,
} from "@/lib/analytics/types"

const BOT_PATTERNS = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /slurp/i,
  /bingpreview/i,
  /facebookexternalhit/i,
  /preview/i,
]

const SEARCH_HOST_PATTERNS = [
  /google\./i,
  /bing\./i,
  /duckduckgo\./i,
  /search.yahoo\./i,
  /baidu\./i,
  /yandex\./i,
]

const SOCIAL_HOST_PATTERNS = [
  /facebook\./i,
  /instagram\./i,
  /linkedin\./i,
  /x\.com/i,
  /twitter\.com/i,
  /t\.co/i,
  /pinterest\./i,
  /tiktok\./i,
  /youtube\./i,
  /reddit\./i,
]

export function randomId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }

  return `id-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`
}

export function isLikelyBot(userAgent: string | null | undefined) {
  if (!userAgent) return false
  return BOT_PATTERNS.some((pattern) => pattern.test(userAgent))
}

export function stripLocalePrefix(pathname: string) {
  const normalized = pathname.replace(/\/+$/, "") || "/"
  const segments = normalized.split("/").filter(Boolean)
  if (segments.length === 0) {
    return { locale: null as Locale | null, path: "/" }
  }

  const [firstSegment, ...rest] = segments
  if (locales.includes(firstSegment as Locale)) {
    return {
      locale: firstSegment as Locale,
      path: `/${rest.join("/")}` || "/",
    }
  }

  return { locale: null as Locale | null, path: normalized }
}

export function resolveAnalyticsPageType(pathname: string): AnalyticsPageType {
  const { path } = stripLocalePrefix(pathname)
  const segments = path.split("/").filter(Boolean)
  const [firstSegment] = segments

  if (!firstSegment) return "home"
  if (firstSegment === "about") return "about"
  if (firstSegment === "services" || firstSegment === "servicios") return "services"
  if (firstSegment === "packages") return "packages"
  if (firstSegment === "portfolio") return "portfolio"
  if (firstSegment === "blog") return segments.length > 1 ? "blog_post" : "blog_index"
  if (firstSegment === "casos") return "case_study"
  return "other"
}

export function resolveCanonicalPath(pathname: string) {
  const { path } = stripLocalePrefix(pathname)
  return path || "/"
}

export function resolveLocaleFromPathname(pathname: string): Locale | null {
  return stripLocalePrefix(pathname).locale
}

export function resolveDeviceCategory(viewportWidth: number | null | undefined): AnalyticsDeviceCategory {
  if (typeof viewportWidth !== "number" || Number.isNaN(viewportWidth) || viewportWidth <= 0) {
    return "unknown"
  }

  if (viewportWidth < 768) return "mobile"
  if (viewportWidth < 1024) return "tablet"
  return "desktop"
}

export function resolveReferrerHost(referrerUrl: string | null) {
  if (!referrerUrl) return null

  try {
    return new URL(referrerUrl).hostname.toLowerCase()
  } catch {
    return null
  }
}

export function resolveReferrerCategory(referrerUrl: string | null, currentOrigin?: string): AnalyticsReferrerCategory {
  if (!referrerUrl) return "direct"

  try {
    const referrer = new URL(referrerUrl)
    if (currentOrigin && referrer.origin === currentOrigin) {
      return "internal"
    }

    if (SEARCH_HOST_PATTERNS.some((pattern) => pattern.test(referrer.hostname))) {
      return "search"
    }

    if (SOCIAL_HOST_PATTERNS.some((pattern) => pattern.test(referrer.hostname))) {
      return "social"
    }

    return "external"
  } catch {
    return "external"
  }
}

export function resolveUtmParams(url: URL) {
  return {
    utmSource: url.searchParams.get("utm_source"),
    utmMedium: url.searchParams.get("utm_medium"),
    utmCampaign: url.searchParams.get("utm_campaign"),
  }
}

