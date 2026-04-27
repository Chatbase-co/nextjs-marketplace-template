"use client"

import type { ReactNode } from "react"

import { DotBackground } from "@/components/core/dot-background"
import { ScrollReveal } from "@/components/core/scroll-reveal"
import { cn } from "@/lib/utils"
import type { Locale } from "@/content/client/site-content"

type ServicesLeadPanelCopy = {
  eyebrow: string
  title: string
  description: string
}

type ServicesLeadCard = {
  title: string
  summary: string
  deliverables: readonly string[]
}

type ServiceEditorialSection = {
  eyebrow: string
  title: string
  descriptions: ReactNode[]
  subheading?: string
  subdescriptions?: ReactNode[]
  bullets?: string[]
}

type ServicesEditorialCopy = Record<Locale, ServiceEditorialSection[]>

const servicesEditorialCopy: ServicesEditorialCopy = {
  en: [
    {
      eyebrow: "01 / Design",
      title: "Web design",
      descriptions: [
        "We create custom websites focused on conversion, with strong hierarchy, familiar interactions, and bilingual structure.",
      ],
    },
    {
      eyebrow: "02 / Mobile",
      title: "Mobile app",
      descriptions: [
        "We design mobile experiences for onboarding, booking, payments, and customer self-service.",
      ],
    },
    {
      eyebrow: "03 / Search",
      title: "SEO",
      descriptions: [
        "We improve your site's visibility in Google with clear content, well-organized pages, and a structure built for local businesses and bilingual sites.",
      ],
      subheading: "Web positioning (SEO) + AIs",
      subdescriptions: [
        "We optimize content so it is easier to understand, stays focused on the business goal, and has a better chance of showing up in Google and being used by AI tools.",
      ],
      bullets: [
        "We use clear, simple headings.",
        "We turn long text into shorter, easier blocks.",
        "We adjust related words that help explain the topic better for people and computers.",
        "We include short explanations, lists, and useful answers.",
      ],
    },
    {
      eyebrow: "04 / Content",
      title: "Social media marketing",
      descriptions: ["We create content systems for reels, posts, and campaigns that support the sales process."],
    },
    {
      eyebrow: "05 / Systems",
      title: "Web3 + AI",
      descriptions: [
        "We offer solutions for your business when you need to integrate current technology, automation, or more advanced workflows.",
        <>
          We also provide training in Stablecoins, Blockchain, Crypto, and AI through{" "}
          <a
            href="https://criptec.io"
            className="underline decoration-[color:var(--accent)]/50 underline-offset-4 transition hover:text-[color:var(--accent)]"
            target="_blank"
            rel="noreferrer"
          >
            Criptec
          </a>{" "}
          for teams and projects that want to understand this ecosystem better.
        </>,
        "We also offer personalized consulting on these topics.",
      ],
    },
  ],
  fr: [
    {
      eyebrow: "01 / Design",
      title: "Web design",
      descriptions: [
        "Nous créons des sites sur mesure, orientés conversion, avec une hiérarchie forte, des interactions familières et une structure bilingue.",
      ],
    },
    {
      eyebrow: "02 / Mobile",
      title: "Mobile app",
      descriptions: [
        "Nous concevons des expériences mobiles pour l’onboarding, la réservation, le paiement et l’auto-service.",
      ],
    },
    {
      eyebrow: "03 / Search",
      title: "SEO",
      descriptions: [
        "Nous améliorons la visibilité de votre site sur Google grâce à un contenu clair, des pages bien organisées et une structure pensée pour les entreprises locales et les sites bilingues.",
      ],
      subheading: "Positionnement web (SEO) + IA",
      subdescriptions: [
        "Nous optimisons le contenu pour qu’il soit plus facile à comprendre, qu’il garde son objectif commercial et qu’il soit mieux préparé à apparaître sur Google et à être consulté par les outils d’IA.",
      ],
      bullets: [
        "Nous utilisons des titres clairs et simples.",
        "Nous transformons les longs textes en blocs plus courts.",
        "Nous ajustons les mots liés au sujet pour mieux l’expliquer aux personnes et aux machines.",
        "Nous incluons des explications courtes, des listes et des réponses utiles.",
      ],
    },
    {
      eyebrow: "04 / Contenu",
      title: "Social media marketing",
      descriptions: [
        "Nous créons des systèmes de contenu pour les reels, les posts et les campagnes qui soutiennent les ventes.",
      ],
    },
    {
      eyebrow: "05 / Systèmes",
      title: "Web3 + IA",
      descriptions: [
        "Nous proposons des solutions pour votre entreprise lorsque vous avez besoin d’intégrer des technologies actuelles, de l’automatisation ou des flux de travail plus avancés.",
        <>
          Nous proposons aussi des formations sur les stablecoins, la blockchain, la crypto et l’IA via{" "}
          <a
            href="https://criptec.io"
            className="underline decoration-[color:var(--accent)]/50 underline-offset-4 transition hover:text-[color:var(--accent)]"
            target="_blank"
            rel="noreferrer"
          >
            Criptec
          </a>{" "}
          pour les équipes et les projets qui souhaitent mieux comprendre cet écosystème.
        </>,
        "Nous proposons également des consultations personnalisées sur ces sujets.",
      ],
    },
  ],
  es: [
    {
      eyebrow: "01 / Diseño",
      title: "Web design",
      descriptions: [
        "Creamos sitios a medida, orientados a conversión, con jerarquía fuerte, interacciones familiares y estructura bilingüe.",
      ],
    },
    {
      eyebrow: "02 / Móvil",
      title: "Mobile app",
      descriptions: [
        "Diseñamos experiencias móviles para onboarding, booking, pagos y autoservicio.",
      ],
    },
    {
      eyebrow: "03 / Búsqueda",
      title: "SEO",
      descriptions: [
        "Mejoramos la visibilidad de tu sitio en Google con contenido claro, páginas bien organizadas y una estructura pensada para negocios locales y sitios bilingües.",
      ],
      subheading: "Posicionamiento web (SEO) + IAs",
      subdescriptions: [
        "Optimizamos el contenido para que se entienda mejor, mantenga su enfoque comercial y esté mejor preparado para aparecer en Google y ser consultado por herramientas de IA.",
      ],
      bullets: [
        "Usamos títulos claros y ordenados.",
        "Hacemos los textos más cortos y fáciles de leer.",
        "Ajustamos las palabras relacionadas que ayudan a explicar mejor el tema a nivel humano y por computadoras.",
        "Agregamos explicaciones simples, listas y respuestas útiles.",
      ],
    },
    {
      eyebrow: "04 / Contenido",
      title: "Social media marketing",
      descriptions: ["Creamos sistemas de contenido para reels, posts y campañas que apoyen las ventas."],
    },
    {
      eyebrow: "05 / Sistemas",
      title: "Web3 + IA",
      descriptions: [
        "Ofrecemos soluciones para tu negocio cuando necesitas integrar tecnología actual, automatización o flujos más avanzados.",
        <>
          También impartimos capacitaciones en Stablecoins, Blockchain, Cripto e IA a través de{" "}
          <a
            href="https://criptec.io"
            className="underline decoration-[color:var(--accent)]/50 underline-offset-4 transition hover:text-[color:var(--accent)]"
            target="_blank"
            rel="noreferrer"
          >
            Criptec
          </a>{" "}
          para equipos y proyectos que quieran entender mejor este ecosistema.
        </>,
        "También ofrecemos consultorías personalizadas en estos temas.",
      ],
    },
  ],
}

export function ServicesLeadPanel({
  copy,
  cards,
}: {
  copy: ServicesLeadPanelCopy
  cards: ReadonlyArray<ServicesLeadCard>
}) {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-border/60 bg-card/80 p-5 text-card-foreground shadow-[0_24px_80px_rgba(2,6,23,0.14)] dark:bg-card/70 md:p-6">
      <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[color:var(--accent)]/14 blur-3xl" />
      <div className="pointer-events-none absolute -left-28 bottom-0 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.35)_1px,transparent_0)] [background-size:22px_22px]" />

      <div className="relative grid gap-6 lg:grid-cols-[1.06fr_0.94fr] lg:items-center">
        <div className="space-y-5 md:flex md:h-full md:flex-col md:justify-center">
          <div className="space-y-4">
            <p className="inline-flex rounded-full border border-border/60 bg-background/75 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.32em] text-[color:var(--accent)]">
              {copy.eyebrow}
            </p>
            <div className="space-y-3">
              <h2 className="font-display-syne max-w-2xl text-balance text-3xl leading-[1.02] tracking-tight text-card-foreground sm:text-4xl md:text-[2.8rem]">
                {copy.title}
              </h2>
              <p className="font-display-syne max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">{copy.description}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {cards.map((card, index) => (
              <span
                key={card.title}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium shadow-[0_10px_25px_-18px_rgba(2,6,23,0.25)]",
                  index % 3 === 0
                    ? "bg-gradient-to-br from-accent/20 via-background to-primary/12 text-[color:var(--accent)] border-accent/20"
                    : index % 3 === 1
                      ? "bg-gradient-to-br from-sky-400/20 via-background to-accent/10 text-sky-700 border-sky-400/20 dark:text-sky-200"
                      : "bg-gradient-to-br from-emerald-400/20 via-background to-accent/10 text-emerald-700 border-emerald-400/20 dark:text-emerald-200",
                )}
              >
                {card.title}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-3">
          {cards.slice(0, 3).map((card, index) => (
            <ScrollReveal key={card.title} direction={index % 2 === 0 ? "up" : "down"} delay={0.14 + index * 0.12}>
              <article
                className={`rounded-[1.7rem] border border-border/70 bg-background/92 p-4 shadow-[0_18px_40px_-28px_rgba(2,6,23,0.38)] ${
                  index === 1 ? "md:translate-x-3" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-display-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                      0{index + 1}
                    </p>
                    <h3 className="font-display-syne text-lg font-semibold tracking-tight text-card-foreground md:text-xl">{card.title}</h3>
                  </div>
                  <span className="rounded-full border border-border/60 bg-card/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[color:var(--accent)]">
                    {index === 0 ? "Build" : index === 1 ? "Visibility" : "Systems"}
                  </span>
                </div>
                <p className="font-display-syne mt-3 text-sm leading-7 text-muted-foreground">{card.summary}</p>
                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  {card.deliverables.slice(0, 3).map((deliverable) => (
                    <div
                      key={deliverable}
                      className="rounded-2xl border border-border/60 bg-card/75 px-3 py-2 text-xs leading-5 text-card-foreground"
                    >
                      {deliverable}
                    </div>
                  ))}
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function EditorialParagraph({ children }: { children: ReactNode }) {
  return <p className="font-display-syne mx-auto max-w-3xl text-center text-sm leading-7 text-muted-foreground md:text-base">{children}</p>
}

function EditorialBulletList({ bullets }: { bullets: string[] }) {
  return (
    <ul className="mx-auto grid max-w-3xl gap-2 pt-1 text-center">
      {bullets.map((bullet) => (
        <li key={bullet} className="font-display-syne flex justify-center gap-3 text-sm leading-7 text-muted-foreground md:text-base">
          <span className="mt-2 h-2 w-2 rounded-full bg-[color:var(--accent)]/90" />
          <span>{bullet}</span>
        </li>
      ))}
    </ul>
  )
}

function EditorialSectionBlock({
  section,
}: {
  section: ServiceEditorialSection
}) {
  return (
    <section className="space-y-5">
      <div className="space-y-3 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[color:var(--accent)]/90">{section.eyebrow}</p>
        <h3 className="font-display-syne text-balance text-3xl leading-[1.04] tracking-tight text-card-foreground sm:text-4xl">
          {section.title}
        </h3>
      </div>

      <div className="space-y-5">
        {section.descriptions.map((paragraph, paragraphIndex) => (
          <EditorialParagraph key={`${section.title}-desc-${paragraphIndex}`}>{paragraph}</EditorialParagraph>
        ))}

        {section.subheading ? (
          <ScrollReveal
            direction="up"
            once
            delay={0.08}
            className="space-y-4 rounded-[1.6rem] border border-border/60 bg-background/72 p-4 shadow-[0_16px_40px_-30px_rgba(2,6,23,0.32)] md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none"
          >
            <h4 className="text-center text-sm font-semibold uppercase tracking-[0.3em] text-[color:var(--accent)]/90">
              {section.subheading}
            </h4>
            {section.subdescriptions?.map((paragraph, paragraphIndex) => (
              <ScrollReveal
                key={`${section.title}-subdesc-${paragraphIndex}`}
                direction="up"
                once
                delay={0.12 + paragraphIndex * 0.08}
              >
                <EditorialParagraph>{paragraph}</EditorialParagraph>
              </ScrollReveal>
            ))}
            {section.bullets ? (
              <ScrollReveal direction="up" once delay={0.24}>
                <EditorialBulletList bullets={section.bullets} />
              </ScrollReveal>
            ) : null}
          </ScrollReveal>
        ) : null}

        {!section.subheading && section.bullets ? <EditorialBulletList bullets={section.bullets} /> : null}
      </div>
    </section>
  )
}

export function ServicesEditorialIntro({
  title,
  excerpt,
}: {
  title: string
  excerpt: string
}) {
  return (
    <section className="relative isolate overflow-hidden px-2 py-10 text-card-foreground sm:px-4 md:px-6 md:py-14">
      <DotBackground
        className="opacity-100 mix-blend-soft-light"
        quantity={140}
        accentRatio={0.28}
        baseColor="214, 122, 44"
        accentColor="255, 154, 72"
        opacity={0.95}
      />
      <div className="relative space-y-5">
        <h2 className="font-display-syne text-center text-4xl leading-[0.96] tracking-tight text-card-foreground sm:text-5xl md:text-6xl">
          {title}
        </h2>
        <p className="font-display-syne mx-auto max-w-3xl text-center text-base leading-8 text-muted-foreground md:text-lg">{excerpt}</p>
      </div>
    </section>
  )
}

export function ServicesEditorialBody({ locale }: { locale: Locale }) {
  const sections = servicesEditorialCopy[locale].slice(2)

  return (
    <section className="relative isolate overflow-hidden px-2 py-10 text-card-foreground sm:px-4 md:px-6 md:py-14">
      <DotBackground
        className="opacity-100 mix-blend-soft-light"
        quantity={140}
        accentRatio={0.28}
        baseColor="214, 122, 44"
        accentColor="255, 154, 72"
        opacity={0.95}
      />

      <div className="relative space-y-8">
        {sections.map((section, index) => (
          <ScrollReveal key={section.title} direction={index % 2 === 0 ? "up" : "down"} delay={0.08 + index * 0.08}>
            <EditorialSectionBlock section={section} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}

export function ServicesEditorialPrelude({ locale }: { locale: Locale }) {
  const sections = servicesEditorialCopy[locale].slice(0, 2)

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-2 py-6 sm:px-4 md:px-6">
      {sections.map((section, index) => (
        <ScrollReveal key={section.title} direction={index % 2 === 0 ? "up" : "down"} delay={0.08 + index * 0.08}>
          <EditorialSectionBlock section={section} />
        </ScrollReveal>
      ))}
    </div>
  )
}
