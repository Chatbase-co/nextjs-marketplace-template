import { PortfolioPageContent } from "@/components/client/portfolio-page-content"
import { getLocaleFromCookies } from "@/lib/locale"

export const dynamic = "force-dynamic"

export default async function PortfolioPage() {
  const locale = await getLocaleFromCookies()
  return <PortfolioPageContent locale={locale} />
}
