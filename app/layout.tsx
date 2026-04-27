import type React from "react"
import type { Metadata } from "next"
import { Fragment_Mono, Inter, Syne } from "next/font/google"

import { SiteFooter } from "@/components/core/site-footer"
import { SiteHeader } from "@/components/core/site-header"
import { PassiveAnalyticsTracker } from "@/components/core/passive-analytics-tracker"
import { SiteParticleBackground } from "@/components/core/site-particle-background"
import { Seo } from "@/components/seo/Seo"
import { ThemeProvider } from "@/components/core/theme-provider"
import { getLocaleFromCookies } from "@/lib/locale"
import {
  buildLayoutMetadata,
  buildOrganizationEntity,
  buildWebSiteEntity,
  seoConfig,
} from "@/lib/seo"
import { getThemeFromRequest } from "@/lib/theme"
import "./globals.css"

// AGENCY_OWNED: root shell wiring for SEO, theme, locale, and global chrome.
// Client-specific copy/assets flow through the site-content and page components below.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-syne",
  display: "swap",
})

const fragmentMono = Fragment_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-fragment-mono",
  display: "swap",
})

const verificationOther: Record<string, string> = {}
if (process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION) {
  verificationOther.google = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
}
if (process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION) {
  verificationOther["msvalidate.01"] = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
}
if (process.env.NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION) {
  verificationOther["facebook-domain-verification"] = process.env.NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION
}

export const metadata: Metadata = {
  ...buildLayoutMetadata(seoConfig, {
    defaultTitle: seoConfig.site.defaultTitle,
    description: seoConfig.site.defaultDescription,
    canonicalPath: "/",
  }),
  applicationName: seoConfig.brand.brandName,
  keywords: [
    "web development",
    "sites web",
    "SEO técnico",
    "posicionamiento orgánico",
    "agencia web",
  ],
  authors: [{ name: seoConfig.brand.brandName, url: seoConfig.brand.brandUrl }],
  creator: seoConfig.brand.brandName,
  publisher: seoConfig.brand.brandName,
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: verificationOther,
  },
  icons: {
    icon: [
      {
        url: "/icon?v=tree",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon?v=tree",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: "/apple-icon?v=tree",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocaleFromCookies()
  const theme = await getThemeFromRequest()
  const organizationJsonLd = buildOrganizationEntity(seoConfig)
  const websiteJsonLd = buildWebSiteEntity(seoConfig, {
    searchTarget: `${seoConfig.site.siteUrl}/blog?q={search_term_string}`,
  })

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${syne.variable} ${fragmentMono.variable} ${theme === "dark" ? "dark" : ""}`}
      suppressHydrationWarning
    >
      <body className="relative isolate bg-background text-foreground antialiased">
        <Seo entities={[organizationJsonLd, websiteJsonLd]} />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <PassiveAnalyticsTracker />
          <SiteParticleBackground theme={theme} />
          <SiteHeader locale={locale} />
          {children}
          <SiteFooter locale={locale} />
        </ThemeProvider>
      </body>
    </html>
  )
}
