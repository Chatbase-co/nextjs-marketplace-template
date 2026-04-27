"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  Heart,
  LockKeyhole,
  MapPinned,
  MessageSquareText,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Workflow,
} from "lucide-react"

type ShowcaseLink = {
  href: string
  label: string
}

type ShowcaseCard = {
  badge: string
  title: string
  summary: string
  body: string
  links: ReadonlyArray<ShowcaseLink>
  capabilities?: ReadonlyArray<string>
  role?: string
  cta?: string
  capabilityIconNames?: ReadonlyArray<CapabilityIconName>
}

export type CapabilityIconName =
  | "search"
  | "mapPinned"
  | "heart"
  | "calendarDays"
  | "refreshCw"
  | "shoppingBag"
  | "messageSquareText"
  | "shieldCheck"
  | "workflow"
  | "lockKeyhole"

const capabilityIconMap: Record<CapabilityIconName, typeof Search> = {
  search: Search,
  mapPinned: MapPinned,
  heart: Heart,
  calendarDays: CalendarDays,
  refreshCw: RefreshCw,
  shoppingBag: ShoppingBag,
  messageSquareText: MessageSquareText,
  shieldCheck: ShieldCheck,
  workflow: Workflow,
  lockKeyhole: LockKeyhole,
}

type PortfolioTransitionDeckProps = {
  cards: ReadonlyArray<ShowcaseCard>
}

const surfaceGradients = [
  "from-accent/20 via-background to-primary/10",
  "from-sky-400/20 via-background to-accent/15",
  "from-emerald-400/20 via-background to-accent/15",
] as const

function ShowcaseCardView({
  card,
  index,
  open,
  onToggle,
}: {
  card: ShowcaseCard
  index: number
  open: boolean
  onToggle: (open: boolean) => void
}) {
  const capabilityIcons =
    card.capabilityIconNames?.map((name) => capabilityIconMap[name]) ?? [Search, MapPinned, Heart, RefreshCw, ShoppingBag]
  const IconChevron = ChevronDown

  return (
    <article className="relative rounded-[2rem] border border-border/80 bg-card/99 p-3 shadow-[0_16px_52px_-28px_rgba(2,6,23,0.58)] backdrop-blur-sm transition-transform duration-300 ease-out">
      <button
        type="button"
        className="group flex w-full cursor-pointer items-start justify-between gap-4 rounded-[1.4rem] border border-border/70 bg-gradient-to-br p-5 text-left text-card-foreground transition-colors duration-300 ease-out"
        onClick={() => onToggle(!open)}
        aria-expanded={open}
        aria-controls={`portfolio-card-${index}`}
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-accent/15 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-primary/15 blur-2xl" />

        <div className="grid flex-1 gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex rounded-full border border-border/70 bg-background/75 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                {card.badge}
              </span>
              <span className="inline-flex rounded-full border border-border/70 bg-background/75 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="text-balance font-serif text-[1.7rem] leading-[1.02] tracking-tight text-card-foreground sm:text-[2rem]">
                {card.title}
              </h3>
              <p className="max-w-3xl text-sm leading-7 text-card-foreground/84 md:text-base">{card.summary}</p>
            </div>
          </div>

          <div className="flex items-start justify-end pt-1">
            <span className={`inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-background/75 text-foreground transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
              <IconChevron className="h-4 w-4 text-[color:var(--accent)]" />
            </span>
          </div>
        </div>
      </button>

      <div
        id={`portfolio-card-${index}`}
        className={`grid gap-3 overflow-hidden transition-all duration-300 ease-out ${open ? "mt-4 max-h-[1200px] opacity-100" : "max-h-0 opacity-0"}`}
        aria-hidden={!open}
      >
        <div className="space-y-3 rounded-[1.4rem] border border-border/60 bg-background/96 p-4 shadow-[0_10px_30px_-20px_rgba(2,6,23,0.34)]">
          <p className="text-sm leading-7 text-card-foreground md:text-base">{card.body}</p>
          {card.role ? <p className="text-sm leading-7 text-muted-foreground">{card.role}</p> : null}
          {card.cta ? <p className="text-sm leading-7 text-muted-foreground">{card.cta}</p> : null}
        </div>

        <div className="space-y-3 rounded-[1.4rem] border border-border/60 bg-background/96 p-4 shadow-[0_10px_30px_-20px_rgba(2,6,23,0.34)]">
          {card.capabilities?.length ? (
            <ul className="grid gap-2">
              {card.capabilities.map((capability, capabilityIndex) => {
                const CapabilityIcon = capabilityIcons[capabilityIndex % capabilityIcons.length]
                return (
                  <li key={capability} className="flex items-start gap-2 text-sm leading-6 text-foreground">
                    <CapabilityIcon className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--accent)]" />
                    <span>{capability}</span>
                  </li>
                )
              })}
            </ul>
          ) : null}

          <div className="space-y-2">
            {card.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-between gap-3 rounded-full border border-border/60 bg-card/96 px-4 py-2 text-sm font-semibold text-card-foreground transition-colors hover:border-[color:var(--accent)]/40 hover:text-[color:var(--accent)]"
              >
                <span>{link.label}</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}

export function PortfolioTransitionDeck({ cards }: PortfolioTransitionDeckProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  useEffect(() => {
    if (!cards.length) return
    setOpenIndex(Math.floor(Math.random() * cards.length))
  }, [cards.length])

  return (
    <section className="mt-8">
      <div className="rounded-[2rem] border border-border/60 bg-card/70 p-4 shadow-[0_24px_60px_rgba(2,6,23,0.12)] dark:bg-card/65 md:p-6">
        <div className="grid gap-4">
          {cards.map((card, index) => (
            <ShowcaseCardView
              key={`${card.title}-${index}`}
              card={card}
              index={index}
              open={openIndex === index}
              onToggle={(open) => setOpenIndex(open ? index : null)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
