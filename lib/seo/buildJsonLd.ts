import type { SeoJsonLdInput } from "@/lib/seo/types"

// AGENCY_OWNED: small reusable serializer for JSON-LD payloads.
// This is generic infrastructure, not client-specific content.
export function escapeJsonLd(value: string) {
  return value.replace(/</g, "\\u003c")
}

export function serializeJsonLd(value: unknown) {
  return escapeJsonLd(JSON.stringify(value))
}

export function normalizeJsonLdInput(value: SeoJsonLdInput) {
  return Array.isArray(value) ? value : [value]
}
