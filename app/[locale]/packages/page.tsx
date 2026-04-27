import { notFound } from "next/navigation"

import { PackagesPageContent } from "@/components/client/packages-page-content"
import { locales, type Locale } from "@/lib/site-content"

type LocalePageProps = {
  params: Promise<{
    locale: string
  }>
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function PackagesPage({ params }: LocalePageProps) {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  return <PackagesPageContent locale={locale as Locale} />
}
