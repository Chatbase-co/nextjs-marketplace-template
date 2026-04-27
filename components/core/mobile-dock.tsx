"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { BookOpenText, BriefcaseBusiness, PanelsTopLeft, PocketKnife, UserRound, type LucideIcon } from "lucide-react"

import { localizedSectionHref } from "@/lib/navigation"
import { cn } from "@/lib/utils"
import type { Locale } from "@/lib/site-content"

type MobileDockProps = {
  locale: Locale
  aboutLabel: string
  packagesLabel: string
  portfolioLabel: string
  blogLabel: string
  servicesLabel: string
}

type DockItem = {
  href: string
  label: string
  icon: LucideIcon
}

// AGENCY_OWNED: mobile navigation dock and compact/expanded behavior.
// This stays visible on mobile and only changes density based on recent interaction.
export function MobileDock({
  locale,
  aboutLabel,
  packagesLabel,
  portfolioLabel,
  blogLabel,
  servicesLabel,
}: MobileDockProps) {
  const pathname = usePathname()
  const [isCompact, setIsCompact] = useState(false)
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const links = useMemo<DockItem[]>(
    () => [
      { href: localizedSectionHref(locale, "about"), label: aboutLabel, icon: UserRound },
      { href: localizedSectionHref(locale, "packages"), label: packagesLabel, icon: PocketKnife },
      { href: localizedSectionHref(locale, "services"), label: servicesLabel, icon: BriefcaseBusiness },
      { href: localizedSectionHref(locale, "blog"), label: blogLabel, icon: BookOpenText },
      { href: "/portfolio", label: portfolioLabel, icon: PanelsTopLeft },
    ],
    [aboutLabel, blogLabel, locale, packagesLabel, portfolioLabel, servicesLabel],
  )

  const scheduleCompact = useCallback(() => {
    if (collapseTimer.current) clearTimeout(collapseTimer.current)
    collapseTimer.current = setTimeout(() => {
      setIsCompact(true)
    }, 20_000)
  }, [])

  useEffect(() => {
    setIsCompact(false)
    scheduleCompact()
    return () => {
      if (collapseTimer.current) clearTimeout(collapseTimer.current)
    }
  }, [pathname, scheduleCompact])

  const handleDockInteraction = () => {
    setIsCompact(false)
    scheduleCompact()
  }

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[70] px-4 sm:hidden">
        <nav
          className={cn(
            "pointer-events-auto relative mx-auto flex w-full items-center justify-between gap-1 border border-black/10 bg-white/78 shadow-[0_20px_60px_rgba(15,23,42,0.14)] backdrop-blur-2xl transition-all duration-300 ease-in-out dark:border-white/10 dark:bg-[rgba(8,10,18,0.86)] dark:shadow-[0_24px_80px_rgba(0,0,0,0.5)]",
            isCompact
              ? "max-w-[20rem] rounded-[1.35rem] px-1.5 py-1"
              : "max-w-md rounded-[1.55rem] px-2 py-1.5",
          )}
          onPointerDownCapture={handleDockInteraction}
          onFocusCapture={handleDockInteraction}
        >
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-0 transition-all duration-300",
              isCompact ? "rounded-[1.35rem]" : "rounded-[1.55rem]",
              "bg-[linear-gradient(135deg,rgba(255,255,255,0.82),rgba(250,238,222,0.72))] dark:bg-[linear-gradient(135deg,rgba(10,14,22,0.94),rgba(18,22,34,0.82))]",
            )}
          />

          {links.map((item) => {
            const Icon = item.icon
            const active = item.href === "/" ? pathname === "/" : pathname === item.href || pathname?.startsWith(item.href + "/")

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                onClick={handleDockInteraction}
                className={cn(
                  "relative flex flex-1 flex-col items-center justify-center gap-1 rounded-[1.1rem] transition-all duration-300",
                  isCompact ? "py-0.5" : "py-1",
                )}
                aria-label={item.label}
              >
                <span
                  className={cn(
                    "inline-flex items-center justify-center rounded-2xl border shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-300",
                    isCompact ? "h-8 w-8" : "h-9 w-9",
                    active
                      ? "border-[#E03A1E]/45 bg-[#E03A1E]/14 text-[#E03A1E] shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_0_0_1px_rgba(224,58,30,0.14),0_10px_24px_rgba(224,58,30,0.34)] dark:bg-[#E03A1E]/16"
                      : "border-black/10 bg-white/78 text-foreground dark:border-white/10 dark:bg-white/6 dark:text-white",
                  )}
                >
                  <Icon
                    className={cn(
                      "transition-all duration-300",
                      isCompact ? "h-3.5 w-3.5" : "h-4 w-4",
                      active ? "drop-shadow-[0_0_10px_rgba(224,58,30,0.55)]" : "",
                    )}
                  />
                </span>

                <span
                  className={cn(
                    "max-w-[4.5rem] truncate overflow-hidden text-[9px] font-medium leading-none transition-all duration-300",
                    isCompact ? "max-h-0 -translate-y-1 opacity-0" : "max-h-4 translate-y-0 opacity-100",
                    active ? "text-[#E03A1E]" : "text-muted-foreground dark:text-white/65",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div aria-hidden className="h-[calc(5.5rem+env(safe-area-inset-bottom))] sm:hidden" />
    </>
  )
}
