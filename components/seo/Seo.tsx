import type { SeoJsonLdInput } from "@/lib/seo/types"
import { JsonLd } from "@/components/seo/JsonLd"

interface SeoProps {
  entities?: SeoJsonLdInput | null
}

// AGENCY_OWNED: thin adapter that lets pages emit structured data through the reusable SEO system.
export function Seo({ entities }: SeoProps) {
  if (!entities) {
    return null
  }

  return <JsonLd data={entities} />
}
