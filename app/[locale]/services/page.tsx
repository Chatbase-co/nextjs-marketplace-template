import { notFound } from "next/navigation"

import { ServicesPageContent } from "@/components/client/services-page-content"
import { locales, type Locale } from "@/lib/site-content"

type LocalePageProps = {
  params: Promise<{
    locale: string
  }>
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function ServicesPage({ params }: LocalePageProps) {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  return <ServicesPageContent locale={locale as Locale} />
}
