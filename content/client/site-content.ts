export type Locale = "en" | "fr" | "es"

export const locales: readonly Locale[] = ["en", "fr", "es"] as const

export type NavLink = {
  label: string
  href: string
}

export type PackageCard = {
  badge: string
  title: string
  summary: string
  facts: {
    label: string
    value: string
  }[]
  modules?: PackageModule[]
  includes: string[]
  excludes: string[]
  note: string
}

export type PackageModule = {
  badge: string
  title: string
  summary: string
  bullets: string[]
  cta: string
  eventType: "booking_start" | "purchase_start" | "booking_purchase"
  surfaceKey: string
}

export type ServiceCard = {
  title: string
  summary: string
  deliverables: string[]
}

export type PortfolioCard = {
  title: string
  category: string
  summary: string
  stack: string[]
  outcome: string
}

export type BlogTeaser = {
  slug: string
  title: string
  excerpt: string
  tag: string
}

export type SiteCopy = {
  brand: {
    name: string
    tagline: string
  }
  nav: {
    home: string
    about: string
    packages: string
    portfolio: string
    blog: string
    services: string
    contact: string
    projectCta: string
  }
  hero: {
    eyebrow: string
    title: string
    slogan: string
    description: string
    primaryCta: string
    secondaryCta: string
    highlightOne: string
    highlightTwo: string
  }
  about: {
    eyebrow: string
    title: string
    description: string
    points: string[]
  }
  packages: {
    eyebrow: string
    title: string
    description: string
    cards: PackageCard[]
  }
  services: {
    eyebrow: string
    title: string
    description: string
    cards: ServiceCard[]
  }
  portfolio: {
    eyebrow: string
    title: string
    description: string
    cards: PortfolioCard[]
  }
  blog: {
    eyebrow: string
    title: string
    description: string
    cards: BlogTeaser[]
    cta: string
  }
  contact: {
    eyebrow: string
    title: string
    description: string
    telegrams: string[]
    whatsapp: string
    phone: string
    emails: string[]
    instagram: string
    github: string
  }
  footer: {
    note: string
    credit: string
    rights: string
  }
}

// MIXED: this file mixes client-owned marketing copy/contact data with reusable data shapes.
// Keep the text, imagery references, and contact details as client-owned; the TypeScript types and section model are reusable.
// AGENCY_OWNED: the exported data model is reusable, but the locale content below is client-owned.
const portfolioCardsByLocale: Record<Locale, PortfolioCard[]> = {
  en: [
    {
      title: "Bilingual service website",
      category: "Website",
      summary:
        "A launch-ready website concept for a service business that needs clear positioning across English, French, and Spanish.",
      stack: ["Next.js", "SEO", "Content"],
      outcome: "Best for a site that needs to stay simple, multilingual, and easy to expand.",
    },
    {
      title: "Content-driven service hub",
      category: "Website",
      summary:
        "A modular structure for pages, blog posts, and updates without rebuilding the whole site.",
      stack: ["MDX", "CMS", "SEO"],
      outcome: "Useful when the team needs to publish regularly in more than one language.",
    },
    {
      title: "Selective mobile flow",
      category: "App",
      summary:
        "A mobile concept reserved for projects that truly need app behavior, not the default offer.",
      stack: ["React Native", "UI", "Integrations"],
      outcome: "Kept as a secondary capability when the project scope calls for it.",
    },
  ],
  fr: [
    {
      title: "Site de services bilingue",
      category: "Site web",
      summary:
        "Un concept de site prêt à lancer pour une entreprise de services qui doit être clair en anglais, en français et en espagnol.",
      stack: ["Next.js", "SEO", "Contenu"],
      outcome: "Idéal pour un site simple, multilingue et facile à faire évoluer.",
    },
    {
      title: "Pôle de contenu",
      category: "Site web",
      summary:
        "Une structure modulaire pour les pages, les articles et les mises à jour sans reconstruire tout le site.",
      stack: ["MDX", "CMS", "SEO"],
      outcome: "Utile quand l’équipe doit publier régulièrement dans plusieurs langues.",
    },
    {
      title: "Parcours mobile sélectif",
      category: "App",
      summary:
        "Un concept mobile réservé aux projets qui ont réellement besoin d’un comportement d’application.",
      stack: ["React Native", "UI", "Intégrations"],
      outcome: "Conservé comme capacité secondaire lorsque le projet l’exige.",
    },
  ],
  es: [
    {
      title: "Sitio de servicios bilingüe",
      category: "Sitio web",
      summary:
        "Un concepto de sitio listo para lanzar para un negocio de servicios que necesita posicionarse con claridad en inglés, francés y español.",
      stack: ["Next.js", "SEO", "Contenido"],
      outcome: "Ideal para un sitio simple, multilingüe y fácil de ampliar.",
    },
    {
      title: "Hub de contenido",
      category: "Sitio web",
      summary:
        "Una estructura modular para páginas, artículos y actualizaciones sin reconstruir todo el sitio.",
      stack: ["MDX", "CMS", "SEO"],
      outcome: "Útil cuando el equipo necesita publicar con frecuencia en más de un idioma.",
    },
    {
      title: "Flujo móvil selectivo",
      category: "App",
      summary:
        "Un concepto móvil reservado para proyectos que realmente necesitan comportamiento de app.",
      stack: ["React Native", "UI", "Integraciones"],
      outcome: "Se mantiene como capacidad secundaria cuando el proyecto lo pide.",
    },
  ],
}

// CLIENTE_OWNED: localized blog teaser copy is site editorial content.
const blogCardsByLocale: Record<Locale, BlogTeaser[]> = {
  en: [
    {
      slug: "seo-in-canada",
      title: "SEO in Canada: what it is and why it still matters",
      excerpt:
        "A country-specific guide to bilingual search, local trust signals, and why a specialized studio can outpace generic templates.",
      tag: "Canada · SEO",
    },
    {
      slug: "selling-in-canada-with-ai",
      title: "Selling in Canada in the AI era",
      excerpt:
        "How changing search results and AI tools reshape the funnel for service businesses that still need clear positioning.",
      tag: "Canada · AI",
    },
    {
      slug: "social-media-sales-strategies-canada",
      title: "Social media sales strategies that work in Canada",
      excerpt:
        "Practical ways to turn LinkedIn, Instagram, and short-form content into real inquiries and booked calls.",
      tag: "Canada · Social",
    },
    {
      slug: "why-canadian-businesses-need-a-website",
      title: "Why Canadian businesses still need a website",
      excerpt:
        "A website gives professionals and companies a place to explain services, support, and long-term trust beyond social platforms.",
      tag: "Canada · Web",
    },
    {
      slug: "seo-in-mexico",
      title: "SEO in Mexico: what it is and why it still matters",
      excerpt:
        "A local-first look at service pages, WhatsApp-friendly journeys, and the trust signals that move people to contact.",
      tag: "Mexico · SEO",
    },
    {
      slug: "selling-in-mexico-with-ai",
      title: "Selling in Mexico in the AI era",
      excerpt:
        "How businesses can adapt content, offers, and search visibility as AI changes discovery and the SEO mix.",
      tag: "Mexico · AI",
    },
    {
      slug: "social-media-sales-strategies-mexico",
      title: "Social media sales strategies that work in Mexico",
      excerpt:
        "A practical mix of social proof, fast replies, and channel choices that convert attention into leads.",
      tag: "Mexico · Social",
    },
    {
      slug: "why-mexican-businesses-need-a-website",
      title: "Why Mexican businesses still need a website",
      excerpt:
        "The website is the owned channel where you control message, support, updates, and the things AI cannot do for you.",
      tag: "Mexico · Web",
    },
  ],
  fr: [
    {
      slug: "seo-in-canada",
      title: "SEO au Canada : ce que c’est et pourquoi cela compte toujours",
      excerpt:
        "Un guide centré sur la recherche bilingue, les signaux de confiance locaux et l’intérêt d’un studio spécialisé face aux modèles génériques.",
      tag: "Canada · SEO",
    },
    {
      slug: "selling-in-canada-with-ai",
      title: "Vendre au Canada à l’ère de l’IA",
      excerpt:
        "Comment les résultats de recherche et les outils IA modifient l’entonnoir pour les entreprises de services qui ont encore besoin d’un positionnement clair.",
      tag: "Canada · IA",
    },
    {
      slug: "social-media-sales-strategies-canada",
      title: "Stratégies de vente sur les réseaux sociaux qui fonctionnent au Canada",
      excerpt:
        "Des façons concrètes de transformer LinkedIn, Instagram et les contenus courts en demandes réelles et en appels réservés.",
      tag: "Canada · Social",
    },
    {
      slug: "why-canadian-businesses-need-a-website",
      title: "Pourquoi les entreprises canadiennes ont encore besoin d’un site web",
      excerpt:
        "Un site web donne aux professionnels et aux entreprises un endroit pour expliquer services, support et confiance durable au-delà des réseaux.",
      tag: "Canada · Web",
    },
    {
      slug: "seo-in-mexico",
      title: "SEO au Mexique : ce que c’est et pourquoi cela compte toujours",
      excerpt:
        "Un regard local sur les pages de services, les parcours compatibles avec WhatsApp et les signaux de confiance qui poussent au contact.",
      tag: "Mexique · SEO",
    },
    {
      slug: "selling-in-mexico-with-ai",
      title: "Vendre au Mexique à l’ère de l’IA",
      excerpt:
        "Comment adapter le contenu, les offres et la visibilité dans les moteurs pendant que l’IA change la découverte et la part du SEO.",
      tag: "Mexique · IA",
    },
    {
      slug: "social-media-sales-strategies-mexico",
      title: "Stratégies de vente sur les réseaux sociaux qui fonctionnent au Mexique",
      excerpt:
        "Un mélange pratique de preuve sociale, de réponses rapides et de canaux qui transforment l’attention en prospects.",
      tag: "Mexique · Social",
    },
    {
      slug: "why-mexican-businesses-need-a-website",
      title: "Pourquoi les entreprises mexicaines ont encore besoin d’un site web",
      excerpt:
        "Le site web est le canal propriétaire où vous contrôlez le message, le support, les mises à jour et ce que l’IA ne peut pas faire pour vous.",
      tag: "Mexique · Web",
    },
  ],
  es: [
    {
      slug: "seo-in-canada",
      title: "SEO en Canadá: qué es y por qué sigue importando",
      excerpt:
        "Una guía enfocada en búsqueda bilingüe, señales de confianza locales y por qué un estudio especializado supera a las plantillas genéricas.",
      tag: "Canadá · SEO",
    },
    {
      slug: "selling-in-canada-with-ai",
      title: "Vender en Canadá en la era de la IA",
      excerpt:
        "Cómo los resultados de búsqueda y las herramientas de IA cambian el embudo para negocios de servicios que aún necesitan una propuesta clara.",
      tag: "Canadá · IA",
    },
    {
      slug: "social-media-sales-strategies-canada",
      title: "Estrategias de ventas por redes sociales que funcionan en Canadá",
      excerpt:
        "Formas prácticas de convertir LinkedIn, Instagram y contenido corto en consultas reales y llamadas agendadas.",
      tag: "Canadá · Social",
    },
    {
      slug: "why-canadian-businesses-need-a-website",
      title: "Por qué las empresas canadienses aún necesitan un sitio web",
      excerpt:
        "Un sitio web le da a profesionistas y compañías un lugar para explicar servicios, soporte y confianza de largo plazo más allá de las redes.",
      tag: "Canadá · Web",
    },
    {
      slug: "seo-in-mexico",
      title: "SEO en México: qué es y por qué sigue importando",
      excerpt:
        "Una mirada local a páginas de servicio, recorridos amigables con WhatsApp y señales de confianza que ayudan a convertir.",
      tag: "México · SEO",
    },
    {
      slug: "selling-in-mexico-with-ai",
      title: "Vender en México en la era de la IA",
      excerpt:
        "Cómo adaptar contenido, ofertas y visibilidad en buscadores mientras la IA cambia el descubrimiento y la mezcla del SEO.",
      tag: "México · IA",
    },
    {
      slug: "social-media-sales-strategies-mexico",
      title: "Estrategias de ventas por redes sociales que funcionan en México",
      excerpt:
        "Una mezcla práctica de prueba social, respuestas rápidas y canales que convierten atención en leads.",
      tag: "México · Social",
    },
    {
      slug: "why-mexican-businesses-need-a-website",
      title: "Por qué las empresas mexicanas aún necesitan un sitio web",
      excerpt:
        "El sitio web es el canal propio donde controlas mensaje, soporte, actualizaciones y lo que la IA no puede hacer por ti.",
      tag: "México · Web",
    },
  ],
}

export const siteCopy: Record<Locale, SiteCopy> = {
  en: {
    brand: {
      name: "Binff",
      tagline: "Websites first for Mexico and Canada.",
    },
    nav: {
      home: "Home",
      about: "About Us",
      packages: "Packages",
      portfolio: "Portfolio",
      blog: "Blog",
      services: "Services",
      contact: "Contact",
      projectCta: "See services",
    },
    hero: {
      eyebrow: "English · French · Spanish",
      title: "Websites that work in Mexico and Canada.",
      slogan: "We're technology and professional development",
      description:
        "We design and build websites for companies and projects in Canada and Mexico that want to communicate their value better, strengthen their digital presence, and turn prospects into new and better customers in three languages.",
      primaryCta: "Book a call",
      secondaryCta: "See the work",
      highlightOne: "Bespoke by default",
      highlightTwo: "Built on current tech",
    },
    about: {
      eyebrow: "About us",
      title: "A website studio for multilingual teams.",
      description:
        "Binff focuses on websites first: clear UX/UI, bespoke delivery, and support for SEO, content, and light marketing. We avoid simple AI-made templates and build interfaces that feel familiar, use current technology, and can grow with the project.",
      points: [
        "Custom-built sites, not generic AI templates.",
        "Interfaces aligned with everyday app gestures.",
        "Cutting-edge technology chosen for the scope.",
        "SEO, content, and practical marketing support.",
      ],
    },
    packages: {
      eyebrow: "Website packages",
      title: "Website packages",
      description:
        "Starter, Growth, and Scale cover the most common website scopes. We build custom sites, not simple AI-generated pages, with positioning designed for the web and for AI models. Scale also splits into booking, ecommerce, and hybrid flows when a project needs more than a simple brochure site.",
      cards: [
        {
          badge: "Starter",
          title: "Starter site",
          summary: "A lean website for validating a new idea or creating a simple online presence.",
          facts: [
            { label: "Best for", value: "Validating a website idea." },
            { label: "Pages", value: "1 landing page." },
            { label: "Revisions", value: "2 rounds." },
            { label: "SEO", value: "Not included." },
          ],
          includes: ["Up to 5 images", "2 POCs/CTAs"],
          excludes: ["E-commerce"],
          note: "Best when the goal is to move fast without overbuilding.",
        },
        {
          badge: "Growth",
          title: "Growth site",
          summary:
            "A fuller website for a real business that needs more pages, stronger structure, room to grow, and better visibility on the web and in AI models. Our current site is the example.",
          facts: [
            { label: "Best for", value: "Growing a real business." },
            { label: "Pages", value: "5 to 10 subpages." },
            { label: "Revisions", value: "3 rounds." },
            { label: "SEO", value: "Basic indexing + AI visibility." },
          ],
          includes: ["Up to 15 images", "2 languages (English, French, or Spanish)", "5 POCs/CTAs", "Professional animations", "Google Maps", "Light and dark theme"],
          excludes: ["E-commerce"],
          note: "Best when the site needs to support ongoing marketing, SEO, and visibility in AI models.",
        },
        {
          badge: "Scale",
          title: "Scale site",
          summary: "A larger website scope for products and teams that need custom structure, more moving parts, and room to expand.",
          facts: [
            { label: "Best for", value: "Larger website scopes." },
            { label: "Pages", value: "Custom." },
            { label: "Revisions", value: "By request." },
            { label: "SEO", value: "Custom." },
          ],
          modules: [
            {
              badge: "Booking",
              title: "Book your clients",
              summary:
                "Clients book time at your office, clinic, or branch with a QR flow, email confirmation, and metrics for the busiest hours and days.",
              bullets: ["QR booking", "Email confirmation", "Client and schedule metrics"],
              cta: "I want to book clients",
              eventType: "booking_start",
              surfaceKey: "packages.scale.booking",
            },
            {
              badge: "Commerce",
              title: "Sell to your clients",
              summary:
                "Run your own online store with secure payments, organized customers, and passive analytics to see what products and pages convert best.",
              bullets: ["Online store", "Secure payments", "Smart dashboards"],
              cta: "I want to sell products",
              eventType: "purchase_start",
              surfaceKey: "packages.scale.purchase",
            },
            {
              badge: "Hybrid",
              title: "Book and sell",
              summary:
                "Combine appointments and product sales in one site so you can sell services, products, or both without duplicating operations.",
              bullets: ["Bookings + store", "Unified flow", "Clearer business view"],
              cta: "I want both",
              eventType: "booking_purchase",
              surfaceKey: "packages.scale.hybrid",
            },
          ],
          includes: ["Discovery call", "Defined scope", "Quote by email or WhatsApp"],
          excludes: ["Fixed pricing", "One-size-fits-all scope"],
          note: "If the project does not fit Starter, Growth, or Scale, contact us for more info.",
        },
      ],
    },
    services: {
      eyebrow: "Services",
      title: "Website-first services for launch and growth.",
      description:
        "Binff helps teams build custom websites first, then layer in SEO, content, light marketing, and the occasional app or integration when it genuinely helps the project. The goal is a product that feels familiar to people who use modern apps every day, ranks on the web, and is also readable by AI models, not a simple AI-generated template.",
      cards: [
        {
          title: "Website design",
          summary: "Clear, custom websites with strong hierarchy, familiar interaction patterns, and a simple path from idea to launch.",
          deliverables: ["Landing pages", "Business websites", "Campaign pages"],
        },
        {
          title: "SEO and content",
          summary: "On-page SEO, content structure, and bilingual messaging for sites that need to be found, understood, and surfaced by AI models.",
          deliverables: ["Keyword mapping", "Metadata", "Content outlines"],
        },
        {
          title: "Site modernization",
          summary: "Refresh older websites with cleaner UX, stronger structure, and a more app-like feel.",
          deliverables: ["UX audit", "Information architecture review", "Visual updates"],
        },
        {
          title: "Mobile apps on request",
          summary: "App concepts and builds only when the scope truly calls for mobile. If needed, they are quoted separately.",
          deliverables: ["UI systems", "Prototypes", "React Native"],
        },
        {
          title: "Advanced integrations",
          summary: "AI, automation, and Web3 integrations when the project benefits from current, high-performance technology and broader AI-model visibility.",
          deliverables: ["Automation flows", "AI assistants", "Web3 integrations"],
        },
      ],
    },
    portfolio: {
      eyebrow: "Portfolio",
      title: "Representative project directions, not client case studies.",
      description:
        "A preview of the kinds of websites and digital products Binff can scope, including custom builds that feel familiar and use current technology when needed.",
      cards: portfolioCardsByLocale.en,
    },
    blog: {
      eyebrow: "Blog",
      title: "Short notes on websites, SEO, and practical marketing.",
      description:
        "Eight practical articles about SEO, AI-era sales, social media, and websites for Canada and Mexico.",
      cards: blogCardsByLocale.en,
      cta: "Read the blog",
    },
    contact: {
      eyebrow: "Contact",
      title: "Let us know what you want to build.",
      description:
        "If you need a website, SEO support, content help, or a selective mobile or integration project, these are the fastest ways to reach us.",
      telegrams: ["https://t.me/riaygarcia4", "https://t.me/driano7"],
      whatsapp: "+1 647 223 0271",
      phone: "+1 647 223 0271",
      emails: ["y@criptec.io", "donovan@criptec.io"],
      instagram: "https://www.instagram.com/binffstudio/",
      github: "github.com/driano7",
    },
    footer: {
      note: "Websites first for Mexico and Canada.",
      credit: "Made with 🧡 by Donovan Riaño.",
      rights: "All rights reserved.",
    },
  },
  fr: {
    brand: {
      name: "Binff",
      tagline: "Le web d’abord pour le Mexique et le Canada.",
    },
    nav: {
      home: "Accueil",
      about: "À propos",
      packages: "Forfaits",
      portfolio: "Réalisations",
      blog: "Blog",
      services: "Prestations",
      contact: "Contact",
      projectCta: "Voir les services",
    },
    hero: {
      eyebrow: "Anglais · Français · Espagnol",
      title: "Des sites web qui fonctionnent au Mexique et au Canada.",
      slogan: "Nous sommes technologie et développement professionnel",
      description:
        "Nous concevons et développons des sites web pour des entreprises et des projets au Canada et au Mexique qui veulent mieux communiquer leur valeur, renforcer leur présence numérique et convertir des prospects en nouveaux meilleurs clients en trois langues.",
      primaryCta: "Planifier un appel",
      secondaryCta: "Voir les projets",
      highlightOne: "Sur mesure par défaut",
      highlightTwo: "Construit avec des technologies actuelles",
    },
    about: {
      eyebrow: "À propos",
      title: "Un studio web pour les équipes multilingues.",
      description:
        "Binff se concentre d’abord sur les sites web: UX/UI claire, livraison sur mesure, et appui en SEO, contenu et marketing léger. Nous évitons les modèles IA simplistes et construisons des interfaces familières, appuyées sur des technologies actuelles, capables d’évoluer avec le projet.",
      points: [
        "Des sites sur mesure, pas des modèles IA génériques.",
        "Des interfaces alignées sur les gestes des applications du quotidien.",
        "Des technologies actuelles choisies selon le besoin.",
        "SEO, contenu et soutien marketing concret.",
      ],
    },
    packages: {
      eyebrow: "Forfaits web",
      title: "Forfaits web",
      description:
        "Starter, Growth et Scale couvrent les besoins web les plus courants. Nous construisons des sites sur mesure, pas de simples pages générées par IA, avec un positionnement pensé pour le web et pour les modèles d’IA. Scale se découpe aussi en réservation, e-commerce et flux hybrides quand un projet dépasse un simple site vitrine.",
      cards: [
        {
          badge: "Starter",
          title: "Site Starter",
          summary: "Un site léger pour tester une idée ou poser une présence en ligne simple.",
          facts: [
            { label: "Idéal pour", value: "Valider une idée de site web." },
            { label: "Pages", value: "1 page d’atterrissage." },
            { label: "Révisions", value: "2 rondes." },
            { label: "SEO", value: "Non inclus." },
          ],
          includes: ["Jusqu’à 5 images", "2 POCs/CTAs"],
          excludes: ["E-commerce"],
          note: "Idéal pour aller vite sans alourdir le projet.",
        },
        {
          badge: "Growth",
          title: "Site Growth",
          summary:
            "Un site plus complet pour accompagner une entreprise qui veut grandir, avec une meilleure visibilité sur le web et dans les modèles d’IA. Notre site actuel sert d’exemple.",
          facts: [
            { label: "Idéal pour", value: "Développer une vraie entreprise." },
            { label: "Pages", value: "5 à 10 sous-pages." },
            { label: "Révisions", value: "3 rondes." },
            { label: "SEO", value: "Indexation de base + visibilité IA." },
          ],
          includes: ["Jusqu’à 15 images", "2 langues (anglais, français ou espagnol)", "5 POCs/CTAs", "Animations professionnelles", "Google Maps", "Thème clair et sombre"],
          excludes: ["E-commerce"],
          note: "Idéal pour soutenir un marketing continu, le SEO et la visibilité dans les modèles d’IA.",
        },
        {
          badge: "Scale",
          title: "Site Scale",
          summary: "Un périmètre plus large pour des produits et équipes qui ont besoin d’une structure sur mesure, de plus de mouvement et d’espace pour évoluer.",
          facts: [
            { label: "Idéal pour", value: "Des périmètres web plus larges." },
            { label: "Pages", value: "Sur mesure." },
            { label: "Révisions", value: "Sur demande." },
            { label: "SEO", value: "Sur mesure." },
          ],
          modules: [
            {
              badge: "Réservation",
              title: "Réserver vos clients",
              summary:
                "Vos clients réservent en cabinet, au bureau ou en boutique avec un parcours QR, une confirmation par email et des métriques sur les heures et jours les plus demandés.",
              bullets: ["Réservation par QR", "Confirmation par email", "Métriques clients et horaires"],
              cta: "Je veux réserver des clients",
              eventType: "booking_start",
              surfaceKey: "packages.scale.booking",
            },
            {
              badge: "Commerce",
              title: "Vendre à vos clients",
              summary:
                "Une boutique en ligne avec paiements sécurisés, clients organisés et analytics passifs pour voir ce qui convertit le mieux.",
              bullets: ["Boutique en ligne", "Paiements sécurisés", "Dashboards intelligents"],
              cta: "Je veux vendre en ligne",
              eventType: "purchase_start",
              surfaceKey: "packages.scale.purchase",
            },
            {
              badge: "Hybride",
              title: "Réserver et vendre",
              summary:
                "Combinez réservations et ventes dans un même site pour vendre des services, des produits ou les deux sans dupliquer les parcours.",
              bullets: ["Réservations + boutique", "Flux unifié", "Vision plus claire du business"],
              cta: "Je veux les deux",
              eventType: "booking_purchase",
              surfaceKey: "packages.scale.hybrid",
            },
          ],
          includes: ["Appel de découverte", "Périmètre défini", "Devis par email ou WhatsApp"],
          excludes: ["Tarif forfaitaire", "Périmètre identique pour tous"],
          note: "Si le projet ne rentre pas dans Starter, Growth ou Scale, contactez-nous pour plus d’infos.",
        },
      ],
    },
    services: {
      eyebrow: "Prestations",
      title: "Des prestations pensées d’abord pour le web.",
      description:
        "Binff aide les équipes à construire des sites web sur mesure, puis à ajouter du SEO, du contenu, un peu de marketing et, si nécessaire, des apps ou des intégrations. Le résultat doit sembler familier aux personnes qui utilisent déjà des applications modernes, se positionner sur le web, et aussi être lisible par les modèles d’IA, pas à un simple gabarit généré par IA.",
      cards: [
        {
          title: "Conception web",
          summary: "Des sites sur mesure avec une hiérarchie claire, des interactions familières et une trajectoire simple de l’idée au lancement.",
          deliverables: ["Pages d’atterrissage", "Sites d’entreprise", "Pages de campagne"],
        },
        {
          title: "SEO et contenu",
          summary: "SEO on-page, structure de contenu et messages bilingues pour des sites faciles à trouver, à comprendre et à faire remonter par les modèles d’IA.",
          deliverables: ["Cartographie de mots-clés", "Métadonnées", "Plans de contenu"],
        },
        {
          title: "Modernisation de site",
          summary: "Refaire d’anciens sites avec une UX plus claire, une structure plus solide et une sensation plus proche des apps actuelles.",
          deliverables: ["Audit UX", "Revue de l’architecture de l’information", "Mises à jour visuelles"],
        },
        {
          title: "Apps mobiles sur demande",
          summary: "Des concepts et des builds d’apps uniquement quand le projet en a vraiment besoin. Si nécessaire, ils sont chiffrés à part.",
          deliverables: ["Systèmes UI", "Prototypes", "React Native"],
        },
        {
          title: "Intégrations avancées",
          summary: "IA, automatisation et Web3 quand le projet en tire une vraie valeur, avec des technologies actuelles et une meilleure lisibilité pour les modèles d’IA.",
          deliverables: ["Flux d’automatisation", "Assistants IA", "Intégrations Web3"],
        },
      ],
    },
    portfolio: {
      eyebrow: "Portfolio",
      title: "Des directions de projet représentatives, pas des cas clients.",
      description:
        "Un aperçu des sites web et produits numériques que Binff peut cadrer, y compris des builds sur mesure qui restent familiers et s’appuient sur des technologies actuelles.",
      cards: portfolioCardsByLocale.fr,
    },
    blog: {
      eyebrow: "Blog",
      title: "Des notes courtes sur les sites web, le SEO et le marketing utile.",
      description:
        "Huit articles pratiques sur le SEO, les ventes à l’ère de l’IA, les réseaux sociaux et les sites web pour le Canada et le Mexique.",
      cards: blogCardsByLocale.fr,
      cta: "Lire le blog",
    },
    contact: {
      eyebrow: "Contact",
      title: "Dites-nous ce que vous voulez construire.",
      description:
        "Si vous avez un site, une app ou un projet de croissance en tête, voici les moyens les plus rapides pour nous joindre.",
      telegrams: ["https://t.me/riaygarcia4", "https://t.me/driano7"],
      whatsapp: "+1 647 223 0271",
      phone: "+1 647 223 0271",
      emails: ["y@criptec.io", "donovan@criptec.io"],
      instagram: "https://www.instagram.com/binffstudio/",
      github: "github.com/driano7",
    },
    footer: {
      note: "Le web d’abord pour le Mexique et le Canada.",
      credit: "Fait avec 🧡 par Donovan Riaño.",
      rights: "Tous droits réservés.",
    },
  },
  es: {
    brand: {
      name: "Binff",
      tagline: "Sitios web primero para México y Canadá.",
    },
    nav: {
      home: "Inicio",
      about: "Quiénes somos",
      packages: "Paquetes",
      portfolio: "Portafolio",
      blog: "Blog",
      services: "Servicios",
      contact: "Contacto",
      projectCta: "Ver servicios",
    },
    hero: {
      eyebrow: "Inglés · Francés · Español",
      title: "Sitios web que funcionan en México y Canadá.",
      slogan: "Somos tecnología y desarrollo profesional",
      description:
        "Diseñamos y desarrollamos sitios web para empresas y proyectos de Canadá y México que buscan comunicar mejor su valor, fortalecer su presencia digital y concretar ventas potenciales en nuevos y mejores clientes de manera trilingüe.",
      primaryCta: "Agendar llamada",
      secondaryCta: "Ver proyectos",
      highlightOne: "Hecho a medida",
      highlightTwo: "Construido con tecnología actual",
    },
    about: {
      eyebrow: "Sobre nosotros",
      title: "Un estudio web para equipos multilingües.",
      description:
        "Diseñamos y desarrollamos sitios web a tu medida para empresas y proyectos de Canadá y México que buscan comunicar mejor su valor, fortalecer su presencia digital y concretar ventas potenciales con interfaces familiares y tecnología actual.",
      points: [
        "Sitios a medida, no plantillas genéricas hechas con AI.",
        "Interfaces alineadas con los gestos de las apps cotidianas.",
        "Tecnología actual elegida según el alcance.",
        "SEO, contenido y apoyo de marketing práctico.",
      ],
    },
    packages: {
      eyebrow: "Paquetes web",
      title: "Paquetes web",
      description:
        "Starter, Growth y Scale cubren los alcances web más comunes. Construimos sitios a medida, no páginas simples hechas con AI, con posicionamiento pensado para la web y para modelos de AI. Scale también se divide en reserva, ecommerce y flujos híbridos cuando el proyecto necesita más que un sitio vitrina.",
      cards: [
        {
          badge: "Starter",
          title: "Sitio Starter",
          summary: "Un sitio ligero para probar una idea o establecer una presencia en línea simple.",
          facts: [
            { label: "Ideal para", value: "Validar una idea de sitio web." },
            { label: "Páginas", value: "1 landing page." },
            { label: "Revisiones", value: "2 rondas." },
            { label: "SEO", value: "No incluido." },
          ],
          includes: ["Hasta 5 imágenes", "2 POCs/CTAs"],
          excludes: ["E-commerce"],
          note: "Ideal para salir rápido sin complicar el alcance.",
        },
        {
          badge: "Growth",
          title: "Sitio Growth",
          summary:
            "Un sitio más completo para acompañar a un negocio real que necesita más recorrido, mejor visibilidad en la web y en modelos de AI. Nuestra página actual es el ejemplo.",
          facts: [
            { label: "Ideal para", value: "Hacer crecer un negocio real." },
            { label: "Páginas", value: "5 a 10 subpáginas." },
            { label: "Revisiones", value: "3 rondas." },
            { label: "SEO", value: "Indexación básica + visibilidad AI." },
          ],
          includes: ["Hasta 15 imágenes", "2 idiomas (inglés, francés o español)", "5 POCs/CTAs", "Animaciones profesionales", "Google Maps", "Tema claro y oscuro"],
          excludes: ["E-commerce"],
          note: "Ideal cuando el sitio debe apoyar marketing continuo, SEO y visibilidad en modelos de AI.",
        },
        {
          badge: "Scale",
          title: "Sitio Scale",
          summary: "Un alcance más amplio para productos y equipos que necesitan estructura a medida, más piezas en movimiento y espacio para crecer.",
          facts: [
            { label: "Ideal para", value: "Alcances web más grandes." },
            { label: "Páginas", value: "Personalizado." },
            { label: "Revisiones", value: "Bajo solicitud." },
            { label: "SEO", value: "Personalizado." },
          ],
          modules: [
            {
              badge: "Agenda",
              title: "Agenda tus clientes",
              summary:
                "Tus clientes reservan tiempo en tu despacho, consultorio o sucursal con QR, confirmación por email y métricas de horarios y días de mayor demanda. Ideal para servicios y profesionistas.",
              bullets: ["Reserva con QR", "Confirmación por email", "Métricas de clientes y horarios"],
              cta: "Quiero agendar clientes",
              eventType: "booking_start",
              surfaceKey: "packages.scale.booking",
            },
            {
              badge: "Vende",
              title: "Vende a tus clientes",
              summary:
                "Tu propia tienda en línea con pagos seguros, clientes ordenados y analítica pasiva para saber qué les gusta más dentro del sitio. Ideal para vender productos.",
              bullets: ["Tienda online", "Pagos seguros", "Dashboards inteligentes"],
              cta: "Quiero vender productos",
              eventType: "purchase_start",
              surfaceKey: "packages.scale.purchase",
            },
            {
              badge: "Integrado",
              title: "Agenda y vende",
              summary:
                "Une la reservación de citas y la venta de productos en un solo sitio, con beneficios completos de ambos flujos.",
              bullets: ["Reservas + tienda", "Flujo unificado", "Más valor por visita"],
              cta: "Quiero una solución integrada",
              eventType: "booking_purchase",
              surfaceKey: "packages.scale.hybrid",
            },
          ],
          includes: ["Llamada inicial", "Alcance definido", "Cotización por email o WhatsApp"],
          excludes: ["Precio fijo por paquete", "Alcance genérico"],
          note: "Si el proyecto no entra en Starter, Growth o Scale, escríbenos para más info.",
        },
      ],
    },
    services: {
      eyebrow: "Servicios",
      title: "Servicios pensados primero para web.",
      description:
        "Binff ayuda a los equipos a crear sitios a medida y luego a sumar SEO, contenido y apoyo de marketing cuando hace falta. Si el proyecto lo pide, también añadimos apps o integraciones. La meta es que el sitio se sienta claro, moderno y fácil de usar, no como una plantilla hecha por AI.",
      cards: [
        {
          title: "Diseño web",
          summary: "Sitios claros, rápidos y hechos a la medida para presentar tu negocio sin enredos.",
          deliverables: ["Una landing", "Sitio corporativo", "Página de campaña"],
        },
        {
          title: "SEO y contenido",
          summary: "Te ayudamos a aparecer mejor en Google con textos claros, páginas ordenadas y mensajes fáciles de entender.",
          deliverables: ["Palabras clave", "Metadatos", "Estructura de contenidos"],
        },
        {
          title: "Modernización de sitios",
          summary: "Renovamos sitios viejos para que se vean actuales y se sientan más fáciles de navegar.",
          deliverables: ["Revisión UX", "Orden de contenidos", "Mejoras visuales"],
        },
        {
          title: "Apps móviles bajo solicitud",
          summary: "Si tu proyecto realmente necesita una app, la planteamos aparte para no mezclarla con la web.",
          deliverables: ["Pantallas clave", "Prototipos", "App móvil"],
        },
        {
          title: "Integraciones avanzadas",
          summary: "Automatizaciones, pagos o funciones con IA cuando sí aportan valor al proyecto.",
          deliverables: ["Automatizaciones", "Asistentes IA", "Conexiones externas"],
        },
      ],
    },
    portfolio: {
      eyebrow: "Portafolio",
      title: "Direcciones de proyecto representativas, no casos de clientes.",
      description:
        "Una vista previa de los sitios web y productos digitales que Binff puede plantear, incluidos builds a medida que se sienten familiares y usan tecnología actual.",
      cards: portfolioCardsByLocale.es,
    },
    blog: {
      eyebrow: "Blog",
      title: "Notas cortas sobre sitios web, SEO y marketing útil.",
      description:
        "Ocho artículos prácticos sobre SEO, ventas en la era de la IA, redes sociales y sitios web para Canadá y México.",
      cards: blogCardsByLocale.es,
      cta: "Leer blog",
    },
    contact: {
      eyebrow: "Contacto",
      title: "Cuéntanos qué quieres construir.",
      description:
        "Si necesitas un sitio web, apoyo en SEO, ayuda con contenido o un proyecto móvil o de integración más selectivo, estas son las formas más rápidas de contactarnos.",
      telegrams: ["https://t.me/riaygarcia4", "https://t.me/driano7"],
      whatsapp: "+1 647 223 0271",
      phone: "+1 647 223 0271",
      emails: ["y@criptec.io", "donovan@criptec.io"],
      instagram: "https://www.instagram.com/binffstudio/",
      github: "github.com/driano7",
    },
    footer: {
      note: "Sitios web primero para México y Canadá.",
      credit: "Hecho con 🧡 por Donovan Riaño.",
      rights: "Todos los derechos reservados.",
    },
  },
}

export function getSiteCopy(locale: Locale): SiteCopy {
  return siteCopy[locale] ?? siteCopy.en
}
