import { ScrollReveal } from "@/components/core/scroll-reveal"
import type { Locale } from "@/content/client/site-content"

// MIXED: copy and brand assets are client-owned; layout, motion, and section composition are reusable agency UI.
const aboutCopy = {
  en: {
    title: "About Us",
    description:
      "We create bespoke bilingual websites and digital products with clear UX/UI, multilingual structure, and practical support for SEO, content, and light marketing. We avoid simple AI-made templates and build around familiar interactions and current technology.",
    panelDescription:
      "We create bilingual websites and mobile products shaped by UX/UI, product thinking, AI, and execution that is compatible with Web3. The result should feel familiar to everyday users, but still be custom-built and technically current.",
    points: [
      "Custom-built sites, not generic AI templates.",
      "Interfaces aligned with everyday app gestures.",
      "Cutting-edge technology chosen for the scope.",
      "SEO, content, and practical marketing support.",
    ],
  },
  fr: {
    title: "À propos de nous",
    description:
      "Nous créons des sites web et des produits numériques bilingues sur mesure avec une UX/UI claire, une structure multilingue et un soutien concret en SEO, contenu et marketing léger. Nous évitons les modèles IA simplistes et construisons autour d’interactions familières et de technologies actuelles.",
    panelDescription:
      "Nous créons des sites web et des produits mobiles bilingues pensés autour de l’UX/UI, du produit, de l’IA et d’une exécution compatible avec Web3. Le résultat doit rester familier pour les utilisateurs du quotidien, tout en étant sur mesure et techniquement actuel.",
    points: [
      "Des sites sur mesure, pas des modèles IA génériques.",
      "Des interfaces alignées sur les gestes des applications du quotidien.",
      "Des technologies actuelles choisies selon le besoin.",
      "SEO, contenu et soutien marketing concret.",
    ],
  },
  es: {
    title: "Sobre nosotros",
    description:
      "Diseñamos y desarrollamos sitios web y productos digitales a medida para empresas y proyectos de Canadá y México que buscan comunicar mejor su valor, fortalecer su presencia digital y luego a posicionar sitios en la web (SEO) e IA, contenido y apoyo de marketing cuando hace falta, con interfaces familiares y tecnología actual. Evitamos plantillas simples hechas con AI.",
    panelDescription:
      "Creamos sitios web y productos móviles bilingües pensados desde UX/UI, producto, AI y una ejecución compatible con Web3. El resultado debe sentirse familiar para las personas que ya usan apps todos los días, pero seguir siendo a medida y técnicamente actual.",
    points: [
      "Sitios a medida, no plantillas genéricas hechas con AI.",
      "Interfaces alineadas con los gestos de las apps cotidianas.",
      "Tecnología actual elegida según el alcance.",
      "SEO, contenido y apoyo de marketing práctico.",
    ],
  },
} as const

// CLIENTE_OWNED: these narrative blocks are site/brand messaging.
const whyMattersCopy = {
  en: {
    title: "Why Binff is the better choice",
    items: [
      "Custom websites, not flat AI templates.",
      "Professional delivery with real post-launch support.",
      "SEO, positioning, and maintenance planned from day one.",
    ],
    lead: "Binff is built for businesses that need more than a page online.",
    emphasis:
      "We build custom, professional websites that stand apart from AI-generated or flat template sites.",
    support:
      "Structure, content, support, and visibility are planned together so the site keeps working after launch.",
  },
  fr: {
    title: "Pourquoi Binff est le meilleur choix",
    items: [
      "Des sites sur mesure, pas des modèles IA plats.",
      "Une exécution professionnelle avec un vrai support après le lancement.",
      "SEO, positionnement et maintenance pensés dès le départ.",
    ],
    lead: "Binff est pensé pour les entreprises qui ont besoin de plus qu’une simple page en ligne.",
    emphasis:
      "Nous construisons des sites sur mesure et professionnels, plus solides que les modèles générés par IA ou les sites plats.",
    support:
      "La structure, le contenu, le support et la visibilité sont pensés ensemble pour que le site continue de fonctionner après le lancement.",
  },
  es: {
    title: "Por qué Binff es la mejor opción",
    items: [
      "Sitios a medida, no plantillas planas hechas con AI.",
      "Entrega profesional con soporte real después del lanzamiento.",
      "SEO, posicionamiento y mantenimiento previstos desde el inicio.",
    ],
    lead: "Binff está pensado para negocios que necesitan más que una página en internet.",
    emphasis:
      "Construimos sitios a medida y profesionales que se diferencian de la IA y de los sitios planos.",
    support:
      "La estructura, el contenido, el soporte y la visibilidad se planean juntos para que el sitio siga funcionando después del lanzamiento.",
  },
} as const

// AGENCY_OWNED: reusable story structure and section sequencing for the about page.
const howWeWorkCopy = {
  en: {
    title: "How we work",
    description:
      "We start by understanding the project goal, define a clear direction, and develop a website solution that feels careful, functional, familiar, and ready to grow.",
    steps: [
      {
        title: "We listen to the context.",
        text: "We understand your business, your market, and what you need to communicate.",
      },
      {
        title: "We define the direction.",
        text: "We organize content, structure, and interaction patterns so the site feels familiar to people who already use modern apps.",
      },
      {
        title: "We build and refine.",
        text: "We create a clean, professional experience on current technology, prepared to evolve with your project.",
      },
    ],
  },
  fr: {
    title: "Comment nous travaillons",
    description:
      "Nous commençons par comprendre l’objectif du projet, nous définissons une direction claire et nous développons une solution web soignée, fonctionnelle, familière et prête à évoluer.",
    steps: [
      {
        title: "Nous écoutons le contexte.",
        text: "Nous comprenons votre entreprise, votre marché et ce que vous devez communiquer.",
      },
      {
        title: "Nous définissons la direction.",
        text: "Nous structurons le contenu, l’architecture et les interactions pour que le site paraisse familier aux personnes qui utilisent déjà des apps modernes.",
      },
      {
        title: "Nous développons et affinons.",
        text: "Nous créons une expérience propre, professionnelle, basée sur des technologies actuelles et prête à évoluer avec votre projet.",
      },
    ],
  },
  es: {
    title: "Cómo trabajamos",
    description:
      "Empezamos por entender el objetivo del proyecto, definimos una dirección clara y desarrollamos una solución web cuidada, funcional, familiar y lista para crecer.",
    steps: [
      {
        title: "Escuchamos el contexto.",
        text: "Entendemos tu negocio, tu mercado y lo que necesitas comunicar.",
      },
      {
        title: "Definimos la dirección.",
        text: "Ordenamos contenido, estructura e interacciones para que el sitio se sienta familiar para personas que ya usan apps modernas.",
      },
      {
        title: "Desarrollamos y afinamos.",
        text: "Construimos una experiencia limpia, profesional, basada en tecnología actual y preparada para evolucionar con tu proyecto.",
      },
    ],
  },
} as const

type AboutPageContentProps = {
  locale: Locale
}

type AboutIntroCopy = {
  title: string
  description: string
}

type AboutFeatureCopy = {
  description: string
  points: readonly string[]
}

function AboutIntroSection({ title, description }: AboutIntroCopy) {
  return (
    <ScrollReveal direction="up">
      {/* CLIENTE_OWNED: localized about copy is site content. */}
      <div className="mx-auto max-w-3xl text-center text-black dark:text-white">
        <p className="text-balance font-display-syne text-3xl leading-[1.02] tracking-tight text-black sm:text-4xl md:text-5xl dark:text-white">
          {title}
        </p>
        <p className="font-display-syne mt-4 text-sm leading-7 text-black/80 md:text-base dark:text-white/80">{description}</p>
      </div>
    </ScrollReveal>
  )
}

function AboutFeaturePanel({
  description,
  points,
}: AboutFeatureCopy) {
  return (
    <ScrollReveal direction="up" className="mt-8">
      {/* AGENCY_OWNED: reusable feature-panel layout and motion. */}
      <section className="grid gap-8 rounded-[2rem] border border-border/60 bg-card/80 p-5 text-card-foreground shadow-[0_18px_55px_-28px_rgba(2,6,23,0.45)] dark:bg-card/70 lg:grid-cols-[1.1fr_minmax(280px,0.9fr)] lg:p-8">
        <ScrollReveal direction="down" delay={0.24} className="flex flex-col justify-center text-left">
          <p className="font-display-syne text-sm leading-7 text-card-foreground/90 md:text-base dark:text-card-foreground/85">{description}</p>
          <div className="mt-8">
            <ul className="grid gap-3 sm:grid-cols-2">
              {points.map((point, index) => (
                <ScrollReveal key={point} direction={index % 2 === 0 ? "up" : "down"} delay={0.12 + index * 0.1}>
                  <li className="flex gap-3 rounded-2xl border border-border/60 bg-background/75 px-4 py-3 text-sm leading-6 text-foreground">
                    <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 border-[color:var(--accent)]" />
                    <span className="font-display-syne">{point}</span>
                  </li>
                </ScrollReveal>
              ))}
            </ul>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.36} className="relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-[2rem] bg-white/10 blur-3xl dark:bg-black/25" />
          <div className="relative w-full p-2 sm:p-4">
            {/* CLIENTE_OWNED: studio brand images / identity assets. Confirm authorship and transfer terms in the contract. */}
            <img
              src="/logos/binff_studio_parchment.svg"
              alt="Binff logo"
              className="block h-auto w-full dark:hidden"
              loading="eager"
            />
            <img
              src="/logos/binff_studio_vermillion.svg"
              alt="Binff logo"
              className="hidden h-auto w-full dark:block"
              loading="eager"
            />
          </div>
        </ScrollReveal>
      </section>
    </ScrollReveal>
  )
}

function AboutMapsSection({ locale }: { locale: Locale }) {
  return (
    <ScrollReveal direction="up" className="mt-8">
      {/* THIRD_PARTY_INTEGRATION: Google Maps embed is an external provider surface. */}
      <section className="space-y-5">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-display-syne mt-3 text-sm leading-7 text-muted-foreground md:text-base">
            {locale === "es"
              ? "Abrimos Google Maps para que puedas ver la ubicación desde cualquier dispositivo."
              : locale === "fr"
                ? "Nous ouvrons Google Maps pour que vous puissiez voir l’emplacement depuis n’importe quel appareil."
                : "We open Google Maps so you can view the location from any device."}
          </p>
        </div>

        <div className="grid gap-4">
          <details className="group rounded-[2rem] border border-border/60 bg-card/80 p-5 shadow-[0_18px_55px_-28px_rgba(2,6,23,0.35)] dark:bg-card/70 md:p-6">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--accent)]">G maps</p>
              <h3 className="font-display-syne text-2xl leading-none tracking-tight text-card-foreground">Torre CN</h3>
              </div>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/40 bg-background/90 text-lg text-muted-foreground shadow-sm transition-transform duration-300 dark:border-white/50 dark:bg-black/40">
                ▾
              </span>
            </summary>
            <div className="mt-5 overflow-hidden rounded-[1.6rem] border border-border/70 bg-background">
              {/* THIRD_PARTY_INTEGRATION: Google Maps embed. No custom maps backend or API layer exists in this repo. */}
              <div className="aspect-[4/3] w-full md:aspect-[16/9]">
                <iframe
                  title="Google Maps - Torre CN"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2887.2690643595633!2d-79.38963172384474!3d43.64257005311824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b34d68bf33a9b%3A0x15edd8c4de1c7581!2sTorre%20CN!5e0!3m2!1ses-419!2smx!4v1775340491513!5m2!1ses-419!2smx"
                  className="h-full w-full border-0"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </details>

        </div>
      </section>
    </ScrollReveal>
  )
}

function AboutHowWeWorkSection({ locale }: { locale: Locale }) {
  const copy = howWeWorkCopy[locale]

  return (
    <ScrollReveal direction="up" className="mt-8">
      <section className="rounded-[2rem] border border-border/60 bg-card/80 p-5 text-card-foreground shadow-[0_18px_55px_-28px_rgba(2,6,23,0.35)] dark:bg-card/70 md:p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <ScrollReveal direction="up">
            <div className="max-w-3xl">
              <h2 className="font-display-syne text-3xl leading-none tracking-tight text-card-foreground sm:text-4xl">
                {copy.title}
              </h2>
              <p className="font-display-syne mt-3 text-sm leading-7 text-muted-foreground md:text-base">{copy.description}</p>
            </div>
          </ScrollReveal>

          <div className="grid gap-3 md:grid-cols-3">
            {copy.steps.map((step, index) => (
              <ScrollReveal key={step.title} direction={index % 2 === 0 ? "up" : "down"} delay={0.1 + index * 0.08}>
                <article className="h-full rounded-[1.5rem] border border-border/60 bg-background/75 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--accent)]">
                    0{index + 1}
                  </p>
                  <h3 className="font-display-syne mt-2 text-xl leading-tight tracking-tight text-card-foreground">
                    {step.title}
                  </h3>
                  <p className="font-display-syne mt-3 text-sm leading-7 text-muted-foreground">{step.text}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </ScrollReveal>
  )
}

export function AboutPageContent({ locale }: AboutPageContentProps) {
  const copy = aboutCopy[locale]

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-12 pt-28 sm:px-6 lg:pt-32">
      {/* CLIENTE_OWNED: visible about copy is site content. */}
      <AboutIntroSection title={copy.title} description={copy.description} />
      <AboutFeaturePanel description={copy.panelDescription} points={copy.points} />
      <AboutHowWeWorkSection locale={locale} />

      {/* AGENCY_OWNED: reusable narrative section, reveal timing, and visual hierarchy. */}
      <ScrollReveal direction="up" className="mt-8">
        <section className="relative isolate overflow-hidden px-2 py-10 text-card-foreground sm:px-4 md:px-6 md:py-14">
          <div className="relative space-y-6">
            <ScrollReveal direction="up">
              <h2 className="text-center font-display-syne text-4xl leading-[0.96] tracking-tight text-card-foreground sm:text-5xl md:text-6xl">
                {whyMattersCopy[locale].title}
              </h2>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.12}>
              <ol className="mx-auto max-w-3xl space-y-4 text-base text-card-foreground">
                {whyMattersCopy[locale].items.map((item, index) => (
                  <li key={item} className="font-display-syne text-lg text-muted-foreground">
                    {index + 1}. {item}
                  </li>
                ))}
              </ol>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.24}>
              <div className="mx-auto max-w-3xl rounded-[2rem] border border-border/60 bg-card/80 p-5 text-sm leading-8 text-muted-foreground shadow-[0_18px_55px_-28px_rgba(2,6,23,0.35)] dark:bg-card/70 md:p-6 md:text-base">
                <p className="font-display-syne">{whyMattersCopy[locale].lead}</p>
                <p className="mt-3 text-card-foreground">
                  <strong>{whyMattersCopy[locale].emphasis}</strong>
                </p>
                <p className="font-display-syne mt-3">{whyMattersCopy[locale].support}</p>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </ScrollReveal>

      <AboutMapsSection locale={locale} />
    </main>
  )
}
