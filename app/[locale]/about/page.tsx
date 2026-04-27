import { notFound } from "next/navigation"

import { AboutPageContent } from "@/components/client/about-page-content"
import { locales, type Locale } from "@/lib/site-content"

type LocalePageProps = {
  params: Promise<{
    locale: string
  }>
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function AboutPage({ params }: LocalePageProps) {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  return <AboutPageContent locale={locale as Locale} />
}
