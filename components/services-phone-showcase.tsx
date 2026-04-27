"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ArrowUpRight, Bot, Globe, Search, Smartphone, Megaphone, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import type { Locale } from "@/lib/site-content"
import { getSiteCopy } from "@/lib/site-content"

type ServiceCard = {
  title: string
  summary: string
  deliverables: string[]
}

type ServicesPhoneShowcaseProps = {
  locale: Locale
  cards: ServiceCard[]
}

// AGENCY_OWNED: high-value showcase component that turns service copy into an interactive product-style scene.
// The labels are site content, but the motion/layout system is reusable agency UI.
type PeripheralKey = "top-left" | "top-right" | "mid-left" | "mid-right" | "bottom-center"

type PeripheralCard = {
  id: PeripheralKey
  icon: LucideIcon
  title: string
  description: string
  glow?: boolean
  surfaceClass: string
}

type PeripheralLayout = {
  id: PeripheralKey
  initialX: number
  initialY: number
  initialRotate: number
  width: number
  height: number
}

const serviceIconMap: Record<string, LucideIcon> = {
  "Web design": Globe,
  "Mobile app": Smartphone,
  SEO: Search,
  "Social media marketing": Megaphone,
  "AI + Crypto integrations": Bot,
  "Intégrations IA + crypto": Bot,
  "Integraciones AI + cripto": Bot,
}

const peripheralOrder: PeripheralKey[] = ["top-left", "top-right", "mid-left", "mid-right", "bottom-center"]

const serviceChipSurfaces = [
  "bg-gradient-to-br from-accent/20 via-background to-primary/10 text-[color:var(--accent)] border-accent/20",
  "bg-gradient-to-br from-sky-400/20 via-background to-accent/15 text-sky-700 border-sky-400/20 dark:text-sky-200",
  "bg-gradient-to-br from-emerald-400/20 via-background to-accent/15 text-emerald-700 border-emerald-400/20 dark:text-emerald-200",
] as const

const serviceCardSurfaces = [
  "from-accent/20 via-background to-primary/10",
  "from-sky-400/20 via-background to-accent/15",
  "from-emerald-400/20 via-background to-accent/15",
] as const

const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)"

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function lerp(start: number, end: number, ratio: number) {
  return start + (end - start) * ratio
}

function getPhoneCopy(locale: Locale) {
  const copy = getSiteCopy(locale)
  return {
    brandName: copy.brand.name,
    title: copy.services.title,
    description: copy.services.description,
  }
}

function PeripheralCardView({
  card,
  progressRatio,
}: {
  card: PeripheralCard
  progressRatio: number
}) {
  const Icon = card.icon
  const barWidth = `${Math.round(44 + progressRatio * 42)}%`

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[22px] border p-3 shadow-[0_26px_75px_rgba(2,6,23,0.24)] antialiased [transform:translateZ(0)] [backface-visibility:hidden]",
        "bg-gradient-to-br border-black/10 text-slate-900",
        card.surfaceClass,
        "dark:border-white/15 dark:text-white",
        card.glow && "ring-1 ring-[color:var(--accent)]/35",
      )}
      role="img"
      aria-label={card.title}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-accent/18 blur-xl dark:bg-accent/12" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-20 w-20 rounded-full bg-primary/14 blur-xl dark:bg-primary/10" />
      <div className="flex items-start gap-2.5">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
            "border-black/10 bg-[color:var(--accent)]/12 text-[color:var(--accent)]",
            "dark:border-white/15 dark:bg-[color:var(--accent)]/18",
          )}
          aria-hidden
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold leading-tight">{card.title}</p>
          <p className="mt-1 text-[10px] leading-snug text-slate-600 dark:text-white/68">{card.description}</p>
        </div>
      </div>

      <div className="mt-3">
        <div className="h-1.5 w-full rounded-full bg-black/10 dark:bg-white/10">
          <div
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              card.glow ? "bg-[color:var(--accent)]/80" : "bg-slate-500/70 dark:bg-white/45",
            )}
            style={{ width: barWidth }}
          />
        </div>
      </div>

      <div className="pointer-events-none absolute -right-14 -top-10 h-24 w-24 rounded-full bg-[color:var(--accent)]/12 blur-2xl dark:bg-[color:var(--accent)]/18" />
    </div>
  )
}

export function ServicesPhoneShowcase({ locale, cards }: ServicesPhoneShowcaseProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [viewportWidth, setViewportWidth] = useState(0)
  const [progress, setProgress] = useState(0)
  const copy = getPhoneCopy(locale)

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth || 0)
    const onScroll = () => {
      const node = sectionRef.current
      if (!node) return

      const rect = node.getBoundingClientRect()
      const viewportHeight = window.innerHeight || 1
      const total = rect.height - viewportHeight
      if (total <= 0) {
        setProgress(0)
        return
      }

      const traveled = clamp(-rect.top, 0, total)
      setProgress(traveled / total)
    }

    onResize()
    onScroll()
    window.addEventListener("resize", onResize, { passive: true })
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      window.removeEventListener("resize", onResize)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  const isMobile = viewportWidth > 0 ? viewportWidth < 768 : false
  const progressBoost = clamp(progress * (isMobile ? 1.12 : 1.18), 0, 1)

  const phoneFrame = useMemo(() => {
    const width = viewportWidth
    const t = clamp((width - 360) / (1600 - 360), 0, 1)
    const frameWidth = Math.round(218 + 112 * t)
    const frameHeight = Math.round(frameWidth * 2.08)
    const frameRadius = Math.round(38 + 14 * t)
    const bezel = Math.round(10 + 3 * t)
    return {
      width: frameWidth,
      height: frameHeight,
      radius: frameRadius,
      bezel,
    }
  }, [viewportWidth])

  const peripheralCards = useMemo<PeripheralCard[]>(() => {
    return cards.map((card, index) => {
      const icon = serviceIconMap[card.title] ?? Globe
      return {
        id: peripheralOrder[index % peripheralOrder.length],
        icon,
        title: card.title,
        description: card.summary,
        glow: card.title === "AI + Crypto integrations" || card.title === "Mobile app" || card.title === "Web design",
        surfaceClass: serviceCardSurfaces[index % serviceCardSurfaces.length],
      }
    })
  }, [cards])

  const layouts = useMemo<PeripheralLayout[]>(() => {
    const gapX = isMobile ? 88 : 230
    const midGapX = isMobile ? 102 : 308
    const topY = isMobile ? -214 : -228
    const midY = isMobile ? -20 : -16
    const bottomY = isMobile ? 178 : 197

    return [
      { id: "top-left", initialX: -gapX, initialY: topY, initialRotate: -7, width: isMobile ? 172 : 220, height: isMobile ? 142 : 158 },
      { id: "top-right", initialX: gapX, initialY: topY, initialRotate: 7, width: isMobile ? 172 : 220, height: isMobile ? 142 : 158 },
      { id: "mid-left", initialX: -midGapX, initialY: midY, initialRotate: -9, width: isMobile ? 194 : 258, height: isMobile ? 164 : 188 },
      { id: "mid-right", initialX: midGapX, initialY: midY, initialRotate: 9, width: isMobile ? 194 : 258, height: isMobile ? 164 : 188 },
      { id: "bottom-center", initialX: 0, initialY: bottomY, initialRotate: 0, width: isMobile ? 206 : 296, height: isMobile ? 146 : 160 },
    ]
  }, [isMobile])

  const sceneHeight = useMemo(() => {
    const base = isMobile ? 620 : 748
    return Math.max(base, phoneFrame.height + (isMobile ? 128 : 168))
  }, [isMobile, phoneFrame.height])

  const scrollTrackHeight = useMemo(() => {
    const minHeight = isMobile ? 752 : 860
    return Math.max(minHeight, sceneHeight + (isMobile ? 100 : 132))
  }, [isMobile, sceneHeight])

  const spreadMedium = isMobile ? 1.12 : 1.28
  const spreadLong = isMobile ? 1.4 : 1.78
  const phoneXOffset = isMobile ? 100 : 168
  const phoneYOffset = isMobile ? lerp(175, -6, progressBoost) : lerp(165, -10, progressBoost)
  const peripheralRightBias = isMobile ? 13 : 34
  const heroChips =
    locale === "es"
      ? ["Podemos modernizar tu web o app", "Integraciones de IA y cripto", "Ejecución de producto y marketing"]
      : locale === "fr"
        ? ["Nous pouvons moderniser votre site ou votre app", "Intégrations IA et crypto", "Exécution produit et marketing"]
        : ["We can modernize your app or website", "AI + crypto integrations", "Product and marketing execution"]

  const cardByLayout = (id: PeripheralKey) => peripheralCards.find((card) => card.id === id) ?? peripheralCards[0]

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-16 md:py-24"
      aria-label="Servicios con iPhone y cards periféricas"
    >
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <div className="mx-auto mb-8 max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[color:var(--accent)]">Services</p>
          <h2 className="mt-3 text-balance font-serif text-3xl font-semibold leading-[1.02] tracking-tight text-foreground md:text-5xl">
            {copy.title}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
            {copy.description}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold">
            {heroChips.map((item, index) => (
              <span
                key={item}
                className={`rounded-full border px-3 py-2 shadow-[0_10px_25px_-18px_rgba(2,6,23,0.25)] ${serviceChipSurfaces[index % serviceChipSurfaces.length]}`}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="relative" style={{ height: `${scrollTrackHeight}px` }}>
        <div className="sticky top-14 md:top-16">
          <div className="mx-auto max-w-[900px] px-4 lg:px-8">
            <div className="relative mx-auto w-full translate-y-12 md:translate-y-16" style={{ height: `${sceneHeight}px` }}>
              <div className="absolute inset-0">
                {layouts.map((layout, index) => {
                  const card = cardByLayout(layout.id)
                  const xNear = layout.initialX
                  const xMedium = layout.initialX * spreadMedium
                  const xLong = layout.initialX * spreadLong
                  const yNear = layout.initialY
                  const yMedium = layout.initialY + (layout.id === "bottom-center" ? 14 : 10)
                  const yFar = layout.initialY + (layout.id === "bottom-center" ? 76 : 88)

                  const x = lerp(lerp(xNear, xMedium, clamp(progressBoost / 0.28, 0, 1)), xLong, clamp((progressBoost - 0.28) / 0.72, 0, 1)) + peripheralRightBias
                  const y = lerp(lerp(yNear, yMedium, clamp(progressBoost / 0.28, 0, 1)), yFar, clamp((progressBoost - 0.28) / 0.72, 0, 1))
                  const rotate = lerp(layout.initialRotate, layout.initialRotate * 1.24, clamp(progressBoost / 1, 0, 1))
                  const opacity = lerp(1, 0.34, clamp((progressBoost - 0.24) / 0.76, 0, 1))

                  return (
                    <div
                      key={layout.id}
                      className="absolute left-1/2 top-1/2 select-none"
                      style={{
                        transform: `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${rotate}deg)`,
                        opacity,
                        transition: `transform 120ms ${EASE_OUT}, opacity 120ms ${EASE_OUT}`,
                        width: layout.width,
                        height: layout.height,
                      }}
                    >
                      <PeripheralCardView card={card} progressRatio={0.5 + (index % 4) * 0.12} />
                    </div>
                  )
                })}
              </div>

              <div
                className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
                style={{
                  transform: `translate3d(calc(-50% + ${phoneXOffset}px), calc(-50% + ${phoneYOffset}px), 0) scale(${lerp(0.74, 1.02, progressBoost)})`,
                  width: phoneFrame.width,
                  height: phoneFrame.height,
                  transition: `transform 120ms ${EASE_OUT}`,
                }}
              >
                <div
                  className={cn(
                    "relative border shadow-[0_40px_120px_rgba(2,6,23,0.34)]",
                    "bg-gradient-to-b from-sky-950 to-slate-950 border-sky-950/45",
                    "dark:border-white/15",
                  )}
                  style={{
                    width: phoneFrame.width,
                    height: phoneFrame.height,
                    borderRadius: phoneFrame.radius,
                  }}
                  aria-label="iPhone de servicios"
                >
                  <div
                    className="absolute left-1/2 top-3 z-20 -translate-x-1/2 rounded-full border border-sky-900/20 bg-sky-950/90 shadow-[0_8px_24px_rgba(15,23,42,0.28)] dark:border-white/20 dark:bg-slate-800/95 dark:shadow-[0_8px_24px_rgba(0,0,0,0.55)]"
                    style={{
                      width: 120 + Math.round(12 * progress),
                      height: 28,
                      transition: `width 120ms ${EASE_OUT}`,
                    }}
                    aria-hidden
                    >
                    <div className="flex h-full items-center justify-center gap-2 px-3">
                      <span className="h-1.5 w-8 rounded-full bg-white/35 dark:bg-white/45" />
                      <span className="h-2 w-2 rounded-full bg-black shadow-[0_0_12px_rgba(0,0,0,0.45)] dark:bg-black" />
                    </div>
                  </div>

                  <div
                    className="absolute z-10 overflow-hidden border border-sky-900/10 bg-white/95 dark:border-white/10 dark:bg-black/95"
                    style={{
                      top: phoneFrame.bezel,
                      right: phoneFrame.bezel,
                      bottom: phoneFrame.bezel,
                      left: phoneFrame.bezel,
                      borderRadius: Math.max(20, phoneFrame.radius - 8),
                    }}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(96,165,250,0.22),transparent_45%)] opacity-60 dark:opacity-25" />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-sky-900/10 dark:from-black/25 dark:to-black/45" />
                    <div className="relative flex h-full flex-col justify-between px-4 pb-3 pt-11 text-slate-900 dark:text-white">
                      <div className="mt-2 space-y-2">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-600 dark:text-white/70">{copy.brandName}</p>
                        <h3 className="text-lg font-semibold leading-tight">{copy.title}</h3>
                        <p className="text-xs leading-5 text-slate-600 dark:text-white/68">
                          {locale === "es"
                            ? "Diseño, desarrollo y modernización de productos digitales bilingües."
                            : locale === "fr"
                              ? "Conception, développement et modernisation de produits digitaux bilingues."
                              : "Design, development, and modernization for bilingual digital products."}
                        </p>
                      </div>

                      <div className="grid gap-2 -mt-1">
                        {cards.slice(0, 3).map((card) => (
                          <div key={card.title} className="rounded-2xl border border-sky-900/10 bg-white/80 px-3 py-2 backdrop-blur-sm dark:border-white/10 dark:bg-white/8">
                            <p className="text-[11px] font-semibold text-slate-900 dark:text-white">{card.title}</p>
                            <p className="mt-1 text-[10px] leading-snug text-slate-600 dark:text-white/68">{card.summary}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between rounded-2xl border border-sky-900/10 bg-white/80 px-3 py-2 backdrop-blur-sm dark:border-white/10 dark:bg-white/8">
                        <div className="space-y-0.5">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-600 dark:text-white/68">
                            {locale === "es" ? "Servicios" : locale === "fr" ? "Services" : "Services"}
                          </p>
                          <p className="text-xs text-slate-900 dark:text-white">AI, crypto, SEO, design</p>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-slate-700 dark:text-white/75" />
                      </div>
                    </div>
                  </div>

                  <div className="absolute -left-1 top-[20%] h-16 w-1 rounded-full bg-black/20 dark:bg-white/12" aria-hidden />
                  <div className="absolute -left-1 top-[34%] h-11 w-1 rounded-full bg-black/20 dark:bg-white/12" aria-hidden />
                  <div className="absolute -right-1 top-[24%] h-24 w-1 rounded-full bg-black/20 dark:bg-white/12" aria-hidden />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
