import { HeadingTypewriter } from "@/components/core/heading-typewriter"
import { ScrollReveal } from "@/components/core/scroll-reveal"
import { ServicesFruityShowcase } from "@/components/client/services-fruity-showcase"
import { ServicesEditorialBody, ServicesEditorialIntro, ServicesEditorialPrelude, ServicesLeadPanel } from "@/components/client/services-editorial-content"
import { readLocalizedMdx } from "@/lib/mdx"
import { getSiteCopy, type Locale } from "@/content/client/site-content"

const fruityShowcaseCopy = {
  en: [
    {
      eyebrow: "A / Product",
      title: "Product build for web and mobile",
      summary: "We prototype visual flows that feel like real product screens and are ready to ship.",
      bullets: ["Web product UI", "Mobile UX", "Launch-ready flows"],
    },
    {
      eyebrow: "B / Visibility",
      title: "Web positioning (SEO) + AIs",
      summary:
        "We structure pages, content, and metadata so Google and AI tools can read the product clearly.",
      bullets: ["SEO local", "Metadata", "AI-readable"],
    },
    {
      eyebrow: "C / Systems",
      title: "Web3 + IA",
      summary:
        "AI, automation, payments, and Web3 are added only when they strengthen the product.",
      bullets: ["Automation flows", "AI assistants", "Web3 integrations"],
    },
  ],
  fr: [
    {
      eyebrow: "A / Produit",
      title: "Production produit web et mobile",
      summary: "Des sites sur mesure et des parcours mobiles pensés pour paraître familiers, rapides et prêts au lancement.",
      bullets: ["Sites sur mesure", "Parcours mobile-first", "UX prête au lancement"],
    },
    {
      eyebrow: "B / Visibilité",
      title: "Positionnement web (SEO) + IA",
      summary:
        "Nous structurons les pages, le contenu et les métadonnées pour que Google et les outils d’IA lisent le produit clairement.",
      bullets: ["SEO local", "Métadonnées", "Lisible IA"],
    },
    {
      eyebrow: "C / Systèmes",
      title: "Web3 + IA",
      summary:
        "Nous ajoutons l’IA, l’automatisation, les paiements et le Web3 seulement lorsqu’ils renforcent le produit.",
      bullets: ["Flux d’automatisation", "Assistants IA", "Intégrations Web3"],
    },
  ],
  es: [
    {
      eyebrow: "A / Producto",
      title: "Construcción de producto web y mobile",
      summary: "Mostramos flujos visuales que se sienten como producto real y listos para lanzar.",
      bullets: ["UI web", "UX móvil", "Flujos listos"],
    },
    {
      eyebrow: "B / Visibilidad",
      title: "Posicionamiento web (SEO) + AIs",
      summary:
        "Ordenamos páginas, contenido y metadatos para que Google y las herramientas de IA lean el producto con claridad.",
      bullets: ["SEO local", "Metadatos", "Legible por IA"],
    },
    {
      eyebrow: "C / Sistemas",
      title: "Web3 + IA",
      summary:
        "Sumamos AI, automatización, pagos y Web3 solo cuando refuerzan el producto.",
      bullets: ["Flujos de automatización", "Asistentes AI", "Integraciones Web3"],
    },
  ],
} as const

type ServicesPageContentProps = {
  locale: Locale
}

// MIXED: localized service copy comes from the client/site, while the surface system and motion are reusable agency UI.
export function ServicesPageContent({ locale }: ServicesPageContentProps) {
  // CLIENTE_OWNED: service descriptions and cards come from the site's editorial model.
  const copy = getSiteCopy(locale)
  const desktopContextCards = copy.services.cards.slice(0, 4)
  const fruityShowcase = fruityShowcaseCopy[locale]
  const doc = readLocalizedMdx("services", locale) ?? readLocalizedMdx("services", "en")

  if (!doc) return null

  return (
    <main id="services-scope" className="mx-auto w-full max-w-6xl px-4 pb-8 pt-20 sm:px-6 lg:pt-24">
      <HeadingTypewriter scopeSelector="#services-scope" staggerMs={180} />

      <ScrollReveal direction="up" className="mt-0">
        <ServicesEditorialIntro title={doc.title} excerpt={doc.excerpt} />
      </ScrollReveal>

      <ScrollReveal direction="up" className="mt-0">
        <ServicesLeadPanel
          copy={copy.services}
          cards={desktopContextCards}
        />
      </ScrollReveal>

      <ScrollReveal direction="up" className="mt-8">
        <ServicesEditorialPrelude locale={locale} />
      </ScrollReveal>

      <ScrollReveal direction="up" className="mt-8">
        <ServicesFruityShowcase scenes={fruityShowcase} />
      </ScrollReveal>

      <ScrollReveal direction="up" className="mt-8">
        <ServicesEditorialBody locale={locale} />
      </ScrollReveal>
    </main>
  )
}
