"use client"

import type { CSSProperties } from "react"
import { Languages } from "lucide-react"
import { usePathname } from "next/navigation"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { resolveLocalePath } from "@/lib/navigation"
import { locales, type Locale } from "@/lib/site-content"

const LABELS: Record<Locale, string> = {
  en: "EN",
  fr: "FR",
  es: "ES",
}

const FLAGS: Record<Locale, string> = {
  en: "🇺🇸",
  fr: "🇫🇷",
  es: "🇲🇽",
}

type LanguageSwitcherProps = {
  locale: Locale
}

// AGENCY_OWNED: client-side locale switcher.
// It persists the preference in a cookie and only updates navigation state; no third-party service is involved.
export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const pathname = usePathname()
  const currentPathname = pathname ?? "/"

  const setLocale = (nextLocale: Locale) => {
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; samesite=lax`
    window.location.assign(resolveLocalePath(currentPathname, nextLocale))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="relative z-[80] h-9 rounded-full border-black/10 bg-white/86 px-3 text-xs font-semibold text-foreground shadow-[0_10px_26px_rgba(15,23,42,0.1)] backdrop-blur-2xl touch-manipulation transition-all hover:border-[color:var(--accent)]/35 hover:text-[color:var(--accent)] hover:shadow-[0_0_0_1px_rgba(251,125,79,0.12),0_12px_24px_rgba(251,125,79,0.08)] hover:bg-white dark:border-white/10 dark:bg-[rgba(8,10,18,0.9)] dark:text-white dark:shadow-[0_12px_34px_rgba(0,0,0,0.38)] dark:hover:bg-[rgba(12,16,24,0.95)] dark:hover:border-[color:var(--accent)]/35 dark:hover:text-[color:var(--accent)]"
        >
          <Languages className="h-4 w-4" />
          <span>{LABELS[locale]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="dropdown-menu-open z-[90] min-w-40 rounded-2xl border-black/10 bg-white/92 p-2 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-2xl dark:border-white/10 dark:bg-[rgba(8,10,18,0.94)] dark:text-white dark:shadow-[0_24px_90px_rgba(0,0,0,0.54)]"
      >
        {locales.map((item) => (
          <DropdownMenuItem
            key={item}
            className="language-menu-item cursor-pointer rounded-xl px-3 py-2 text-sm font-medium text-foreground outline-none transition-colors focus:bg-[color:var(--accent)]/10 focus:text-foreground dark:text-white/88 dark:focus:bg-white/10 dark:focus:text-white"
            style={{ "--language-menu-delay": `${locales.indexOf(item) * 70}ms` } as CSSProperties}
            onClick={() => setLocale(item)}
          >
            {LABELS[item]}
            <span className="ml-auto text-sm leading-none" aria-hidden="true">
              {FLAGS[item]}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
