import type { Locale } from "@/lib/site-content"

export type ContactCountry = "canada" | "mexico"

function resolveContactCountry(locale: Locale): ContactCountry | "other" {
  if (locale === "es") return "mexico"
  if (locale === "en" || locale === "fr") return "canada"
  return "other"
}

// AGENCY_OWNED: reusable contact routing for country-specific outbound links.
// Canada uses the main contact set; Mexico uses the alternate contact set.
export function getFooterContactCountry(locale: Locale): ContactCountry {
  const country = resolveContactCountry(locale)
  return country === "other" ? "mexico" : country
}

// AGENCY_OWNED: reusable contact routing for the header contact shortcuts.
// Unknown locales fall back to the Canada contact set.
export function getHeaderContactCountry(locale: Locale): ContactCountry {
  const country = resolveContactCountry(locale)
  return country === "other" ? "canada" : country
}
