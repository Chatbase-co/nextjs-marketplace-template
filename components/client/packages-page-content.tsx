import { ArrowUpRight, CheckCircle2, LayoutGrid, Mail, RefreshCw, Search, Target, XCircle } from "lucide-react"

import { HeadingTypewriter } from "@/components/core/heading-typewriter"
import { MinimalWhatsappIcon } from "@/components/icons/minimal-whatsapp-icon"
import { ScrollReveal } from "@/components/core/scroll-reveal"
import { Button } from "@/components/ui/button"
import { getSiteCopy, type Locale } from "@/content/client/site-content"

const packageSurfaces = [
  "from-accent/20 via-background to-primary/10",
  "from-sky-400/20 via-background to-accent/15",
  "from-emerald-400/20 via-background to-accent/15",
] as const

const packageChipSurfaces = [
  "bg-gradient-to-br from-accent/20 via-background to-primary/12 text-[color:var(--accent)] border-accent/20",
  "bg-gradient-to-br from-sky-400/20 via-background to-accent/10 text-sky-700 border-sky-400/20 dark:text-sky-200",
  "bg-gradient-to-br from-emerald-400/20 via-background to-accent/10 text-emerald-700 border-emerald-400/20 dark:text-emerald-200",
] as const

const packageFactIcons = [Target, LayoutGrid, RefreshCw, Search] as const
const contactChipClassName =
  "group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-black/10 bg-white px-3 py-2 text-foreground transition-all duration-300 hover:border-[color:var(--accent)]/35 hover:text-[color:var(--accent)] hover:shadow-[0_0_0_1px_rgba(251,125,79,0.12),0_12px_24px_rgba(251,125,79,0.08)] dark:border-white/10 dark:bg-white/5 dark:text-white/90"

function buildAnalyticsAttrs(
  eventType: string,
  surfaceKey: string,
  label: string,
  value?: string | number,
) {
  return {
    "data-analytics-event": eventType,
    "data-analytics-surface": surfaceKey,
    "data-analytics-label": label,
    ...(value === undefined ? {} : { "data-analytics-value": String(value) }),
  } as const
}

function renderAgendaSummary(summary: string) {
  const phrase = "Ideal para servicios y profesionistas."
  const parts = summary.split(phrase)

  if (parts.length === 1) {
    return summary
  }

  return (
    <>
      {parts[0]}
      <span className="underline decoration-[color:var(--accent)] decoration-2 underline-offset-4">
        {phrase}
      </span>
      {parts[1]}
    </>
  )
}

function renderVendeSummary(summary: string) {
  const phrase = "Ideal para vender productos."
  const parts = summary.split(phrase)

  if (parts.length === 1) {
    return summary
  }

  return (
    <>
      {parts[0]}
      <span className="underline decoration-[color:var(--accent)] decoration-2 underline-offset-4">
        {phrase}
      </span>
      {parts[1]}
    </>
  )
}

type PackagesPageContentProps = {
  locale: Locale
}

// MIXED: package pricing / scope copy is client-facing content; the card system and interaction pattern are reusable agency UI.
export function PackagesPageContent({ locale }: PackagesPageContentProps) {
  // CLIENTE_OWNED: pricing, scope language, and contact wording come from the site copy model.
  const copy = getSiteCopy(locale)
  const mainEmail = copy.contact.emails[0]
  const whatsappHref = `https://wa.me/${copy.contact.whatsapp.replace(/[^+\d]/g, "").replace(/^\+/, "")}`

  const starterPackage = copy.packages.cards.find((card) => card.badge === "Starter") ?? copy.packages.cards[0]
  const growthPackage = copy.packages.cards.find((card) => card.badge === "Growth") ?? copy.packages.cards[1]
  const scalePackage = copy.packages.cards.find((card) => card.badge === "Scale") ?? copy.packages.cards[2]
  const demoLinks: Partial<Record<string, string>> = {
    Starter: "https://binffstarter.netlify.app",
    Scale: "https://banff-commerce.vercel.app/",
  }
  const demoLabel = locale === "fr" ? "Voir la démo" : locale === "es" ? "Ver demo" : "View demo"

  // AGENCY_OWNED: reusable contact CTA block shared across package cards and quote prompts.
  const renderEmailChip = (href: string, surfaceKey?: string) => (
    <a
      href={href}
      className={contactChipClassName}
      {...(surfaceKey ? buildAnalyticsAttrs("cta_click", surfaceKey, "Email") : {})}
    >
      <span className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(251,125,79,0.18),transparent_72%)] opacity-0 transition-opacity duration-300 content-[''] group-hover:opacity-100" />
      <Mail className="h-4 w-4" />
      Email
    </a>
  )

  const renderContactActions = (surfaceKey: string) => (
    <div className="flex flex-wrap gap-2 pt-1">
      {renderEmailChip(`mailto:${mainEmail}`, `${surfaceKey}.email`)}
      <Button asChild size="sm" className="rounded-full">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          {...buildAnalyticsAttrs("cta_click", `${surfaceKey}.whatsapp`, "WhatsApp")}
        >
          <MinimalWhatsappIcon className="h-4 w-4" />
          WhatsApp
        </a>
      </Button>
    </div>
  )

  const renderDemoAction = (cardBadge: string) => {
    const href = demoLinks[cardBadge]

    if (!href) return null

    return (
      <div className="pt-2">
        <Button asChild size="sm" variant="outline" className="rounded-full border-border/60 bg-background/80">
          <a href={href} target="_blank" rel="noreferrer">
            <span className="underline decoration-current decoration-2 underline-offset-4">{demoLabel}</span>
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </Button>
      </div>
    )
  }

  const renderGrowthDemoAction = () => (
    <div className="pt-2">
      <Button type="button" size="sm" variant="outline" className="rounded-full border-border/60 bg-background/80">
        <span className="underline decoration-current decoration-2 underline-offset-4">Este es el sitio demo</span>
        <ArrowUpRight className="h-4 w-4" />
      </Button>
    </div>
  )

  const renderPackageCard = (
    card: (typeof copy.packages.cards)[number],
    index: number,
    isScale = false,
  ) => (
    <article
      className={`rounded-[2rem] border border-border/70 bg-card/75 p-3 shadow-[0_10px_35px_-24px_rgba(2,6,23,0.55)] transition ${
        !isScale && index === 1 ? "md:translate-y-4" : ""
      } ${isScale ? "md:col-span-2" : ""}`}
    >
      <div
        className={`relative h-full overflow-hidden rounded-[1.4rem] border border-border/70 bg-gradient-to-br p-5 ${
          packageSurfaces[index % packageSurfaces.length]
        }`}
      >
        <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-accent/20 blur-xl" />
        <div className="absolute -bottom-8 -left-8 h-20 w-20 rounded-full bg-primary/20 blur-xl" />
        <div className="relative space-y-4">
          <span className="inline-flex rounded-full border border-border/70 bg-background/75 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
            {card.badge}
          </span>

          {card.modules?.length ? (
            <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{card.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{card.summary}</p>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  {card.facts.map((fact, factIndex) => {
                    const Icon = packageFactIcons[factIndex % packageFactIcons.length]

                    return (
                      <div key={`${card.title}-${fact.label}`} className="rounded-2xl border border-border/60 bg-background/72 p-3">
                        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground underline decoration-[color:var(--accent)] decoration-2 underline-offset-4">
                          <Icon className="h-3.5 w-3.5 shrink-0 text-[color:var(--accent)] no-underline" />
                          <span>{fact.label}</span>
                        </div>
                        <p className="mt-1 text-sm font-medium leading-6 text-foreground">{fact.value}</p>
                      </div>
                    )
                  })}
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground underline decoration-[color:var(--accent)] decoration-2 underline-offset-4">
                      {locale === "fr" ? "Inclus" : locale === "es" ? "Incluye" : "Includes"}
                    </p>
                    <ul className="mt-2 space-y-2 text-sm text-foreground">
                      {card.includes.map((item) => (
                        <li key={item} className="flex gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                          <span className="underline decoration-white/30 decoration-2 underline-offset-4">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground underline decoration-[color:var(--accent)] decoration-2 underline-offset-4">
                      {locale === "fr" ? "Non inclus" : locale === "es" ? "No incluye" : "Excludes"}
                    </p>
                    <ul className="mt-2 space-y-2 text-sm text-foreground">
                      {card.excludes.map((item) => (
                        <li key={item} className="flex gap-2">
                          <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                          <span className="line-through decoration-white/30 decoration-2">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p className="pt-1 text-xs leading-relaxed text-muted-foreground">{card.note}</p>
                {card.badge === "Growth" ? renderGrowthDemoAction() : null}
                {renderDemoAction(card.badge)}
                {renderContactActions(`packages.${card.badge.toLowerCase()}`)}
              </div>

              <div className="grid gap-3">
                {card.modules.map((module, moduleIndex) => (
                  <ScrollReveal
                    key={module.title}
                    direction={moduleIndex % 2 === 0 ? "up" : "down"}
                    delay={0.14 + moduleIndex * 0.12}
                    once
                  >
                    <article
                      className={`flex h-full flex-col justify-between rounded-2xl border border-border/60 bg-background/76 p-4 shadow-[0_12px_28px_-22px_rgba(2,6,23,0.4)] ${
                        moduleIndex === 1 ? "lg:translate-y-2" : moduleIndex === 2 ? "lg:-translate-y-2" : ""
                      }`}
                    >
                      <div className="space-y-3">
                        <span className="inline-flex rounded-full border border-border/70 bg-background/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                          {module.badge}
                        </span>
                        <div className="space-y-1.5">
                          <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-card-foreground">
                            {module.title}
                          </h4>
                          <p className="text-sm leading-6 text-muted-foreground">
                            {module.badge === "Agenda"
                              ? renderAgendaSummary(module.summary)
                              : module.badge === "Vende"
                                ? renderVendeSummary(module.summary)
                                : module.summary}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {module.bullets.map((bullet) => (
                            <span
                              key={bullet}
                              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/75 px-3 py-1 text-xs text-card-foreground"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                              <span>{bullet}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="pt-4">
                        <Button asChild size="sm" className="rounded-full">
                          <a
                            href={`mailto:${mainEmail}?subject=${encodeURIComponent(`${card.title} - ${module.title}`)}`}
                            {...buildAnalyticsAttrs(module.eventType, module.surfaceKey, module.cta)}
                          >
                            {module.cta}
                          </a>
                        </Button>
                      </div>
                    </article>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{card.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{card.summary}</p>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {card.facts.map((fact, factIndex) => {
                  const Icon = packageFactIcons[factIndex % packageFactIcons.length]

                  return (
                    <div key={`${card.title}-${fact.label}`} className="rounded-2xl border border-border/60 bg-background/70 p-3">
                      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground underline decoration-[color:var(--accent)] decoration-2 underline-offset-4">
                        <Icon className="h-3.5 w-3.5 shrink-0 text-[color:var(--accent)] no-underline" />
                        <span>{fact.label}</span>
                      </div>
                      <p className="mt-1 text-sm font-medium leading-6 text-foreground">{fact.value}</p>
                    </div>
                  )
                })}
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground underline decoration-[color:var(--accent)] decoration-2 underline-offset-4">
                    {locale === "fr" ? "Inclus" : locale === "es" ? "Incluye" : "Includes"}
                  </p>
                  <ul className="mt-2 space-y-2 text-sm text-foreground">
                    {card.includes.map((item) => (
                      <li key={item} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        <span className="underline decoration-white/30 decoration-2 underline-offset-4">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground underline decoration-[color:var(--accent)] decoration-2 underline-offset-4">
                    {locale === "fr" ? "Non inclus" : locale === "es" ? "No incluye" : "Excludes"}
                  </p>
                  <ul className="mt-2 space-y-2 text-sm text-foreground">
                    {card.excludes.map((item) => (
                      <li key={item} className="flex gap-2">
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                        <span className="line-through decoration-white/30 decoration-2">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="pt-1 text-xs leading-relaxed text-muted-foreground">{card.note}</p>
              {card.badge === "Growth" ? renderGrowthDemoAction() : null}
              {renderDemoAction(card.badge)}
              {renderContactActions(`packages.${card.badge.toLowerCase()}`)}
            </>
          )}
        </div>
      </div>
    </article>
  )

  return (
    <>
      <main id="packages-scope" className="mx-auto w-full max-w-6xl px-4 pb-12 pt-32 sm:px-6 lg:pt-36">
        <HeadingTypewriter scopeSelector="#packages-scope" />

      <ScrollReveal direction="up" className="mt-2">
        <section className="grid gap-4 rounded-[2rem] border border-border/60 bg-card/80 p-5 text-card-foreground dark:bg-card/70 md:grid-cols-[1.05fr_0.95fr] md:p-6">
          <div className="space-y-4">
            {/* CLIENTE_OWNED: section labels and commercial scope copy are site content. */}
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--accent)]">
              {copy.packages.eyebrow}
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-card-foreground md:text-3xl">
              {copy.packages.title}
            </h2>
            <p className="text-sm leading-7 text-muted-foreground md:text-base">{copy.packages.description}</p>
            <div className="flex flex-wrap gap-2">
              {copy.packages.cards.map((card, index) => (
                <span
                  key={card.badge}
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${packageChipSurfaces[index % packageChipSurfaces.length]}`}
                >
                  {card.badge}
                </span>
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            {(locale === "es"
              ? ["Definimos el alcance", "Ordenamos los entregables", "Cotizamos lo que quede fuera"]
              : locale === "fr"
                ? ["Nous définissons le périmètre", "Nous ordonnons les livrables", "Nous chiffrons le reste"]
                : ["We define the scope", "We organize the deliverables", "We quote what falls outside"]
            ).map((item, index) => (
              <div key={item} className="rounded-2xl border border-border/60 bg-background/75 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">0{index + 1}</p>
                <p className="mt-1 text-sm font-semibold text-card-foreground">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* AGENCY_OWNED: reusable card grid, motion timing, and visual hierarchy. */}
      <section className="mt-10 grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <ScrollReveal direction="up" delay={0.12}>
            {renderPackageCard(starterPackage, 0)}
          </ScrollReveal>
          <ScrollReveal direction="down" delay={0.3}>
            {renderPackageCard(growthPackage, 1)}
          </ScrollReveal>
        </div>

        <ScrollReveal direction="up" delay={0.48}>
          {renderPackageCard(scalePackage, 2, true)}
        </ScrollReveal>
      </section>

      <ScrollReveal direction="up" delay={0.46} className="mt-8">
        <section className="rounded-[2rem] border border-border/60 bg-card/80 p-5 shadow-[0_10px_35px_-24px_rgba(2,6,23,0.55)] dark:bg-card/70 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--accent)]">
                {locale === "es" ? "Cotización" : locale === "fr" ? "Devis" : "Quote"}
              </p>
              <h3 className="text-2xl font-semibold tracking-tight text-card-foreground">
                {locale === "es"
                  ? "Habla con nosotros"
                  : locale === "fr"
                    ? "Parlons ensemble"
                    : "Talk to us"}
              </h3>
              <p className="text-sm leading-7 text-muted-foreground md:text-base">
                {locale === "es"
                  ? "Podemos modernizar tu sitio web a una nueva tecnología o volverlo más intuitivo. Escríbenos por email o WhatsApp y te pasamos más información con el scope adecuado."
                  : locale === "fr"
                    ? "Nous pouvons moderniser votre site web avec une technologie plus récente ou le rendre plus intuitif. Écrivez-nous par email ou WhatsApp et nous vous enverrons plus d’informations avec le bon scope."
                    : "We can modernize your website with newer technology or make it more intuitive. Write to us by email or WhatsApp and we will send more details with the right scope."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {renderEmailChip(`mailto:${mainEmail}`)}
              <Button asChild className="rounded-full">
                <a href={whatsappHref} target="_blank" rel="noreferrer">
                  <MinimalWhatsappIcon className="h-4 w-4" />
                  WhatsApp
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </section>
      </ScrollReveal>
      </main>
    </>
  )
}
