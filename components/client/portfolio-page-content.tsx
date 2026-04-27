import Link from "next/link"
import {
  ArrowUpRight,
  CalendarClock,
  CalendarDays,
  ChevronDown,
  GitFork,
  Globe2,
  Heart,
  LockKeyhole,
  MapPinned,
  MessageSquareText,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Star,
  Workflow,
} from "lucide-react"

import { HeadingTypewriter } from "@/components/core/heading-typewriter"
import { ScrollReveal } from "@/components/core/scroll-reveal"
import { PortfolioTransitionDeck, type CapabilityIconName } from "@/components/client/portfolio-transition-deck"
import { getFeaturedGitHubProjects, summarizeGitHubProjects, type GitHubRepository } from "@/lib/github-projects"
import { type Locale } from "@/content/client/site-content"

type PortfolioPageContentProps = {
  locale: Locale
}

function renderRepoCodeNote(note: string) {
  return (
    <span className="underline decoration-[color:var(--accent)] decoration-2 underline-offset-4">
      {note}
    </span>
  )
}

// MIXED: portfolio narratives are brand/client-facing content, while the cards/layout are reusable agency components.
// NOTE: mentions of third-party services in portfolio copy are descriptive unless the repo contains active integration code.
// CLIENTE_OWNED: hero labels and portfolio narrative are site/brand copy.
const heroCopy: Record<Locale, { eyebrow: string; title: string; description: string; sectionTag: string; showcaseTag: string; recentTag: string; emptyState: string; openRepo: string; openSite: string; updated: string; projectInProgress: string; commerceDemoTag: string; conceptProject: string; featuredRepos: string; technicalShowcase: string; repoCodeNote: string; }> = {
  en: {
    eyebrow: "Portfolio",
    title: "My portfolio and real-time contributions",
    description:
      "Professional tracking of GitHub activity with a curated selection of recent repositories, project showcases, and bilingual product work.",
    sectionTag: "GitHub Contributions",
    showcaseTag: "Project in progress",
    recentTag: "Featured recent repositories",
    emptyState: "No projects available right now.",
    openRepo: "Open repository",
    openSite: "Open live site",
    updated: "Updated",
    projectInProgress: "Project in progress",
    commerceDemoTag: "Travel e-commerce demo",
    conceptProject: "Concept project",
    featuredRepos: "Featured recent repositories",
    technicalShowcase: "Technical showcase",
    repoCodeNote: "Code is available under licensed terms. Some repositories can be cited, while others stay restricted.",
  },
  fr: {
    eyebrow: "Portfolio",
    title: "Mes portefeuilles et mes contributions en temps réel",
    description:
      "Suivi professionnel de l’activité GitHub avec une sélection curatée de dépôts récents, de projets mis en avant et de travaux bilingues.",
    sectionTag: "Contributions GitHub",
    showcaseTag: "Projet en cours",
    recentTag: "Dépôts récents en vedette",
    emptyState: "Aucun projet disponible pour le moment.",
    openRepo: "Ouvrir le dépôt",
    openSite: "Ouvrir le site",
    updated: "Mis à jour",
    projectInProgress: "Projet en cours",
    commerceDemoTag: "Démo e-commerce voyage",
    conceptProject: "Projet conceptuel",
    featuredRepos: "Dépôts récents en vedette",
    technicalShowcase: "Vitrine technique",
    repoCodeNote: "Le code est disponible sous licence. Certains dépôts peuvent être cités, d’autres restent restreints.",
  },
  es: {
    eyebrow: "Portafolio",
    title: "Mis portafolios y contribuciones en tiempo real",
    description:
      "Seguimiento profesional de la actividad en GitHub con una selección curada de repositorios recientes, proyectos destacados y trabajo bilingüe.",
    sectionTag: "Contribuciones de GitHub",
    showcaseTag: "Proyecto en desarrollo",
    recentTag: "Repositorios recientes destacados",
    emptyState: "No hay proyectos disponibles en este momento.",
    openRepo: "Abrir repositorio",
    openSite: "Abrir sitio",
    updated: "Actualizado",
    projectInProgress: "Proyecto en desarrollo",
    commerceDemoTag: "Demo e-commerce de viajes",
    conceptProject: "Proyecto conceptual",
    featuredRepos: "Repositorios recientes destacados",
    technicalShowcase: "Showcase técnico",
    repoCodeNote: "El código está disponible bajo licencia. Algunos repositorios se pueden citar y otros permanecen restringidos.",
  },
}

// CLIENTE_OWNED: showcase copy and project descriptions are portfolio content.
const showcaseDetails = {
  en: {
    xoco: {
      title: "Xoco Suite - POS, advanced metrics, and client app",
      summary:
        "A long-running product that connects website, client app, and point of sale in one architecture. The POS syncs directly with the client app to keep orders moving in real time.",
      body:
        "The solution includes advanced metrics, hygiene and compliance workflows aligned with government entities, and a modern payment layer through local rails and crypto settlements.",
      links: [
        { href: "https://v0-xoco-suite-landing.vercel.app", label: "Xoco Suite landing" },
        { href: "https://xococafe.site", label: "Client app demo" },
        { href: "https://github.com/driano7/XocoCafe", label: "Repo Xoco App client" },
      ],
    },
    banffCommerce: {
      title: "Banff Commerce - travel agency e-commerce demo",
      summary:
        "A booking experience built to turn visits into reservations, with curated destinations, package discovery, and a clean purchase flow.",
      body:
        "It shows how we can push your business forward with an e-commerce that helps users search trips, compare packages, save favorites, and complete a reservation in just a few steps. The experience is designed to feel fast, clear, and ready to convert on mobile or desktop.",
      capabilities: [
        "Search destinations and travel packages",
        "Filter by dates, budget, and trip length",
        "Save favorites and compare options",
        "Review details, availability, and extras",
        "Complete checkout in a short booking flow",
      ],
      role: "Role: Conversion-focused demo for a travel agency e-commerce experience.",
      cta: "Built to attract more qualified leads and turn browsing into bookings with less friction.",
      links: [{ href: "https://banff-commerce.vercel.app", label: "Ver demo" }],
    },
    criptec: {
      title: "Criptec Platform - Web3 content & growth infrastructure",
      badge: "Private project",
      summary:
        "Private platform for the crypto ecosystem, designed to bring content, sign-in, and conversion together in one place.",
      body:
        "Built with Next.js and TypeScript. MDX keeps the content easy to update, social login makes access simpler, a payment layer handles transactions, and analytics help the team understand how people use the site. I also worked on the affiliate and admin tools.",
      capabilities: [
        "Social login and auth flows",
        "Payment integration",
        "Content and news publishing",
        "Passive analytics",
        "Internal panel and affiliates",
      ],
      role: "Role: Full-stack contributor on architecture, UI, and integrations.",
      cta: "Criptec.io. I am currently working on the website redesign.",
      links: [{ href: "https://criptec.io", label: "Criptec.io" }],
    },
    strawberry: {
      title: "Strawberry Wallet + ZK Proofs",
      summary:
        "A wallet concept focused on privacy and usability, using Zero-Knowledge Proofs to validate information without exposing sensitive data.",
      body:
        "Goal: stronger operational security with a better user experience for Web3 payments and transfers.",
      links: [
        { href: "https://strawberrywallet.netlify.app", label: "Open Strawberry app" },
        { href: "https://github.com/driano7/StrawberryWallet", label: "Strawberry Wallet repo" },
      ],
    },
  },
  fr: {
    xoco: {
      title: "Xoco Suite - POS, métriques avancées et app client",
      summary:
        "Un produit en cours qui relie site web, app client et point de vente dans une seule architecture. Le POS synchronise directement les commandes avec l’app client.",
      body:
        "La solution intègre des métriques avancées, des flux conformité/hygiène et une couche de paiement moderne via des rails locaux et des règlements crypto.",
      links: [
        { href: "https://v0-xoco-suite-landing.vercel.app", label: "Landing Xoco Suite" },
        { href: "https://xococafe.site", label: "Démo app client" },
        { href: "https://github.com/driano7/XocoCafe", label: "Repo Xoco App client" },
      ],
    },
    banffCommerce: {
      title: "Banff Commerce - démo e-commerce d’agence de voyage",
      summary:
        "Une expérience de réservation pensée pour transformer les visites en réservations, avec des destinations sélectionnées, la découverte de forfaits et un parcours d’achat clair.",
      body:
        "Elle montre comment nous pouvons faire progresser votre activité avec un e-commerce qui aide les utilisateurs à rechercher des voyages, comparer des forfaits, enregistrer des favoris et finaliser une réservation en quelques étapes. L’expérience est conçue pour être rapide, lisible et orientée conversion sur mobile comme sur desktop.",
      capabilities: [
        "Rechercher des destinations et des forfaits",
        "Filtrer par dates, budget et durée du voyage",
        "Enregistrer des favoris et comparer les options",
        "Consulter les détails, la disponibilité et les extras",
        "Finaliser la réservation dans un parcours court",
      ],
      role: "Rôle : démo orientée conversion pour un e-commerce d’agence de voyage.",
      cta: "Pensé pour générer plus de leads qualifiés et transformer la navigation en réservations avec moins de friction.",
      links: [{ href: "https://banff-commerce.vercel.app", label: "Voir la démo" }],
    },
    criptec: {
      title: "Criptec Platform - infrastructure de contenu & croissance Web3",
      badge: "Projet privé",
      summary:
        "Plateforme privée pour l’écosystème crypto, pensée pour réunir contenu, connexion et conversion au même endroit.",
      body:
        "Développée avec Next.js et TypeScript. MDX permet de mettre à jour le contenu facilement, la connexion sociale simplifie l’accès, une couche de paiement gère les transactions et les analyses aident l’équipe à comprendre comment le site est utilisé. J’ai aussi travaillé sur les outils d’affiliation et d’administration.",
      capabilities: [
        "Connexion sociale et flux d’authentification",
        "Intégration des paiements",
        "Publication de contenu et d’actualités",
        "Analytics passive",
        "Espace interne et affiliés",
      ],
      role: "Rôle : contributeur full-stack sur l’architecture, l’UI et les intégrations.",
      cta: "Criptec.io. Je travaille actuellement sur la refonte du site.",
      links: [{ href: "https://criptec.io", label: "Criptec.io" }],
    },
    strawberry: {
      title: "Strawberry Wallet + ZK Proofs",
      summary:
        "Un concept de wallet centré sur la confidentialité et l’ergonomie, avec des Zero-Knowledge Proofs pour valider l’information sans exposer les données sensibles.",
      body:
        "Objectif: renforcer la sécurité opérationnelle tout en améliorant l’expérience utilisateur pour les paiements et transferts Web3.",
      links: [
        { href: "https://strawberrywallet.netlify.app", label: "Ouvrir Strawberry" },
        { href: "https://github.com/driano7/StrawberryWallet", label: "Repo Strawberry Wallet" },
      ],
    },
  },
  es: {
    xoco: {
      title: "Xoco Suite - POS, métricas avanzadas y app cliente",
      summary:
        "Un proyecto en desarrollo que conecta sitio web, app de cliente y punto de venta en una sola arquitectura. El POS sincroniza pedidos en tiempo real con la app cliente.",
      body:
        "La solución incorpora métricas avanzadas, flujos de higiene y cumplimiento alineados a organismos gubernamentales, y una capa de pagos moderna con rieles locales y cripto.",
      links: [
        { href: "https://v0-xoco-suite-landing.vercel.app", label: "Landing Xoco Suite" },
        { href: "https://xococafe.site", label: "Demo app cliente" },
        { href: "https://github.com/driano7/XocoCafe", label: "Repo Xoco App client" },
      ],
    },
    banffCommerce: {
      title: "Banff Commerce - demo e-commerce para agencia de viajes",
      summary:
        "Una experiencia de compra pensada para convertir visitas en reservas, con destinos curados, descubrimiento de paquetes y un flujo de compra claro.",
      body:
        "Muestra cómo podemos impulsar tu negocio con un e-commerce que ayuda a los usuarios a buscar viajes, comparar paquetes, guardar favoritos y completar una reserva en pocos pasos. La experiencia está diseñada para sentirse rápida, clara y lista para convertir en móvil o desktop.",
      capabilities: [
        "Buscar destinos y paquetes de viaje",
        "Filtrar por fechas, presupuesto y duración",
        "Guardar favoritos y comparar opciones",
        "Revisar detalles, disponibilidad y extras",
        "Completar el checkout en un flujo corto",
      ],
      role: "Rol: demo orientada a conversión para un e-commerce de agencia de viajes.",
      cta: "Pensado para generar más leads calificados y convertir la navegación en reservas con menos fricción.",
      links: [{ href: "https://banff-commerce.vercel.app", label: "Ver demo" }],
    },
    criptec: {
      title: "Criptec Platform - infraestructura de contenido y crecimiento Web3",
      badge: "Proyecto privado",
      summary:
        "Plataforma privada orientada al ecosistema cripto, pensada para reunir contenido, acceso y conversión en un solo lugar.",
      body:
        "Desarrollada con Next.js y TypeScript. MDX permite actualizar el contenido fácilmente, el login social simplifica el acceso, una capa de pagos gestiona las transacciones y la analítica ayuda al equipo a entender cómo se usa el sitio. También trabajé en las herramientas de afiliados y administración.",
      capabilities: [
        "Social login y flujos de autorización",
        "Integración de pagos",
        "Publicación de contenido y noticias",
        "Analítica pasiva",
        "Panel interno y afiliados",
      ],
      role: "Rol: Full-stack contributor en arquitectura, UI e integraciones.",
      cta: "Criptec.io. Actualmente estoy trabajando en el rediseño de la página.",
      links: [{ href: "https://criptec.io", label: "Criptec.io" }],
    },
    strawberry: {
      title: "Strawberry Wallet + ZK Proofs",
      summary:
        "Un concepto de wallet enfocado en privacidad y usabilidad, usando Zero-Knowledge Proofs para validar información sin exponer datos sensibles.",
      body:
        "Objetivo: mayor seguridad operativa con una mejor experiencia de usuario para pagos y transferencias Web3.",
      links: [
        { href: "https://strawberrywallet.netlify.app", label: "Abrir Strawberry" },
        { href: "https://github.com/driano7/StrawberryWallet", label: "Repo Strawberry Wallet" },
      ],
    },
  },
} as const

// AGENCY_OWNED: presentation surfaces and motion rhythm are reusable UI patterns.
const surfaceGradients = [
  "from-accent/20 via-background to-primary/10",
  "from-sky-400/20 via-background to-accent/15",
  "from-emerald-400/20 via-background to-accent/15",
] as const

// AGENCY_OWNED: locale mapping and relative-time helper are reusable utility behavior.
const localeMap: Record<Locale, string> = {
  en: "en",
  fr: "fr",
  es: "es",
}

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

function formatRelativeTime(dateString: string, locale: Locale) {
  const date = new Date(dateString)
  const diffSeconds = Math.max(1, Math.floor((Date.now() - date.getTime()) / 1000))
  const lang = localeMap[locale]
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" })

  if (diffSeconds < 60) return rtf.format(-diffSeconds, "second")
  if (diffSeconds < 3600) return rtf.format(-Math.round(diffSeconds / 60), "minute")
  if (diffSeconds < 86_400) return rtf.format(-Math.round(diffSeconds / 3600), "hour")
  if (diffSeconds < 604_800) return rtf.format(-Math.round(diffSeconds / 86_400), "day")
  if (diffSeconds < 2_592_000) return rtf.format(-Math.round(diffSeconds / 604_800), "week")
  if (diffSeconds < 31_536_000) return rtf.format(-Math.round(diffSeconds / 2_592_000), "month")
  return rtf.format(-Math.round(diffSeconds / 31_536_000), "year")
}

function getDisplayProjectName(name: string) {
  return name.toLowerCase() === "portoflio" ? "Portfolio" : name
}

function isCitableLicense(spdxId: string | null | undefined) {
  if (!spdxId) return false

  const permissiveLicenses = new Set([
    "MIT",
    "Apache-2.0",
    "BSD-2-Clause",
    "BSD-3-Clause",
    "ISC",
    "CC0-1.0",
    "Unlicense",
    "MPL-2.0",
  ])

  return permissiveLicenses.has(spdxId)
}

const featuredRepoOrder = ["XocoCafe", "Landing-POS-Client-App", "Portfolio", "museum", "driano7"] as const

function sortFeaturedRepos(projects: GitHubRepository[]) {
  const projectMap = new Map(projects.map((repo) => [repo.name.toLowerCase(), repo]))
  return featuredRepoOrder
    .map((name) => projectMap.get(name.toLowerCase()))
    .filter((repo): repo is GitHubRepository => Boolean(repo))
}

function ProjectShowcaseCard({
  title,
  badge,
  summary,
  body,
  links,
  capabilities,
  role,
  cta,
  capabilityIconNames,
}: {
  title: string
  badge: string
  summary: string
  body: string
  links: ReadonlyArray<{ href: string; label: string }>
  capabilities?: ReadonlyArray<string>
  role?: string
  cta?: string
  capabilityIconNames?: ReadonlyArray<CapabilityIconName>
}) {
  return (
    <details open className="group rounded-[2rem] border border-border/60 bg-card/80 p-5 text-card-foreground shadow-[0_20px_60px_rgba(15,23,42,0.1)] dark:bg-card/70">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
        <span className="inline-flex rounded-full border border-border/60 bg-background/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--accent)]">
          {badge}
        </span>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-background/75 text-foreground transition-transform duration-300 group-open:rotate-180">
          <ChevronDown className="h-4 w-4" />
        </span>
      </summary>

      <div className="mt-4 space-y-3">
        <h3
          className="title-typewriter-ready title-typewriter-active text-2xl font-bold tracking-tight text-card-foreground md:text-3xl"
          aria-label={title}
        >
          {Array.from(title).map((char, index) =>
            char === " " ? (
              <span key={`${title}-space-${index}`}> </span>
            ) : (
              <span key={`${title}-char-${index}`} className="title-typing-word">
                <span className="title-typing-char" style={{ ["--typing-char-index" as string]: index }}>
                  {char}
                </span>
              </span>
            ),
          )}
          <span className="title-typing-caret" aria-hidden="true" />
        </h3>
        <p className="font-display-syne text-sm leading-relaxed text-muted-foreground">{summary}</p>
        <p className="font-display-syne text-sm leading-relaxed text-muted-foreground">{body}</p>
        {capabilities?.length ? (
          <ul className="space-y-2 pt-1 text-sm text-muted-foreground">
            {capabilities.map((item, itemIndex) => {
              const IconName = capabilityIconNames?.length
                ? capabilityIconNames[itemIndex % capabilityIconNames.length]
                : "lockKeyhole"
              const Icon = capabilityIconMap[IconName]

              return (
                <li key={item} className="flex gap-2">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--accent)]" />
                  <span>{item}</span>
                </li>
              )
            })}
          </ul>
        ) : null}
          {role ? <p className="font-display-syne text-sm font-medium leading-relaxed text-card-foreground">{role}</p> : null}
          {cta ? <p className="font-display-syne text-sm leading-relaxed text-muted-foreground">{cta}</p> : null}
        {links.length ? (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/75 px-3 py-2 text-xs font-semibold text-card-foreground transition-colors hover:border-[color:var(--accent)]/40 hover:text-[color:var(--accent)]"
              >
                {link.label}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </details>
  )
}

function RepositoryCard({
  repo,
  locale,
  index,
  label,
}: {
  repo: GitHubRepository
  locale: Locale
  index: number
  label: {
    openRepo: string
    updated: string
    codeAvailable: string
    licensed: string
    citeable: string
    restricted: string
  }
}) {
  const hasCover = Boolean(repo.coverImageUrl)
  const displayName = getDisplayProjectName(repo.name)
  const licenseName = repo.license?.spdx_id ?? repo.license?.name ?? null
  const citable = isCitableLicense(repo.license?.spdx_id)
  const bars = [24, 40, 58, 76].map((base, barIndex) => {
    const activityBoost = Math.min(22, Math.floor((repo.stargazers_count + repo.forks_count) / (barIndex + 3)))
    return Math.min(92, base + activityBoost)
  })

  return (
    <ScrollReveal direction={index % 2 === 0 ? "up" : "down"} delay={0.08 + index * 0.08}>
      <article className="rounded-[2rem] border border-border/70 bg-card/75 p-3 shadow-[0_10px_35px_-24px_rgba(2,6,23,0.55)] transition">
        <div className={`relative mb-4 h-44 overflow-hidden rounded-[1.4rem] border border-border/70 bg-gradient-to-br p-4 ${surfaceGradients[index % surfaceGradients.length]}`}>
          {hasCover ? (
            <>
              <img
                src={repo.coverImageUrl ?? ""}
                alt={`${displayName} cover`}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-black/45" />
            </>
          ) : (
            <>
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent/20 blur-xl" />
              <div className="absolute -bottom-8 -left-6 h-24 w-24 rounded-full bg-primary/20 blur-xl" />
            </>
          )}
          <div className="relative flex h-full flex-col justify-between">
            <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border/70 bg-background/80 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
              <Globe2 className="h-3.5 w-3.5 text-[color:var(--accent)]" />
              {repo.language ?? "Repository"}
            </div>
            {!hasCover ? (
              <div className="flex items-end gap-2">
                {bars.map((height, barIndex) => (
                  <div
                    key={`${repo.id}-bar-${barIndex}`}
                    className="w-10 rounded-t-xl border border-[color:var(--accent)]/30 bg-[color:var(--accent)]/70"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="px-2 pb-2">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/75 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
            #{index + 1} {repo.homepage ? "Portfolio" : "Repository"}
          </div>

          <h4 className="text-xl font-bold leading-tight text-card-foreground">{displayName}</h4>
          <p className="font-display-syne mt-2 text-sm leading-relaxed text-muted-foreground">
            {repo.description ?? "Repository without description yet."}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/75 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
              {label.codeAvailable}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/75 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
              {licenseName ?? label.licensed}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/75 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
              {citable ? label.citeable : label.restricted}
            </span>
          </div>

          <div className="mt-3 rounded-xl border border-border/60 bg-background/75 px-3 py-2 text-sm font-semibold text-card-foreground">
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-4 w-4 text-[color:var(--accent)]" />
                {repo.stargazers_count}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <GitFork className="h-4 w-4 text-[color:var(--accent)]" />
                {repo.forks_count}
              </span>
              <span className="font-display-syne text-muted-foreground">
                {label.updated} {formatRelativeTime(repo.pushed_at, locale)}
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Link
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--foreground)] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:text-black"
            >
              {label.openRepo}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            {repo.homepage ? (
              <Link
                href={repo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/75 px-4 py-2 text-sm font-semibold text-card-foreground transition-colors hover:border-[color:var(--accent)]/40 hover:text-[color:var(--accent)]"
              >
                {repo.homepage.includes("demo") ? "Demo" : "Live"}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            ) : null}
          </div>
        </div>
      </article>
    </ScrollReveal>
  )
}

export async function PortfolioPageContent({ locale }: PortfolioPageContentProps) {
  const copy = heroCopy[locale]
  const showcase = showcaseDetails[locale]
  const projects = sortFeaturedRepos(await getFeaturedGitHubProjects(30))
  const stats = summarizeGitHubProjects(projects)
  const showcaseCards = [
    {
      badge: copy.projectInProgress,
      title: showcase.xoco.title,
      summary: showcase.xoco.summary,
      body: showcase.xoco.body,
      links: showcase.xoco.links,
    },
    {
      badge: copy.commerceDemoTag,
      title: showcase.banffCommerce.title,
      summary: showcase.banffCommerce.summary,
      body: showcase.banffCommerce.body,
      links: showcase.banffCommerce.links,
      capabilities: showcase.banffCommerce.capabilities,
      role: showcase.banffCommerce.role,
      cta: showcase.banffCommerce.cta,
      capabilityIconNames: ["search", "mapPinned", "heart", "calendarDays", "shoppingBag"],
    },
    {
      badge: showcase.criptec.badge,
      title: showcase.criptec.title,
      summary: showcase.criptec.summary,
      body: showcase.criptec.body,
      links: showcase.criptec.links,
      capabilities: showcase.criptec.capabilities,
      role: showcase.criptec.role,
      cta: showcase.criptec.cta,
      capabilityIconNames: ["messageSquareText", "shieldCheck", "refreshCw", "workflow", "lockKeyhole"],
    },
    {
      badge: copy.conceptProject,
      title: showcase.strawberry.title,
      summary: showcase.strawberry.summary,
      body: showcase.strawberry.body,
      links: showcase.strawberry.links,
    },
  ] as const

  return (
    <main id="portfolio-scope" className="mx-auto w-full max-w-6xl px-4 pb-10 pt-28 sm:px-6 lg:pt-32">
      <HeadingTypewriter scopeSelector="#portfolio-scope" />

      <div className="mx-auto max-w-5xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[color:var(--accent)]">{copy.eyebrow}</p>
        <h1 className="mt-3 text-balance font-serif text-4xl leading-[1.02] tracking-tight text-foreground sm:text-5xl md:text-6xl">
          {copy.title}
        </h1>
        <p className="font-display-syne mx-auto mt-4 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">{copy.description}</p>
      </div>

      <ScrollReveal direction="up" className="mt-8">
        <section className="rounded-[2rem] border border-border/60 bg-card/80 p-4 dark:bg-card/70 md:p-6">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/75 px-3 py-1 text-xs font-semibold text-[color:var(--accent)]">
            <CalendarClock className="h-3.5 w-3.5" />
            {copy.sectionTag}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-[1.5rem] border border-border/60 bg-background/75 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Repos</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{stats.projectCount}</p>
            </div>
            <div className="rounded-[1.5rem] border border-border/60 bg-background/75 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Stars</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{stats.totalStars}</p>
            </div>
            <div className="rounded-[1.5rem] border border-border/60 bg-background/75 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Forks</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{stats.totalForks}</p>
            </div>
            <div className="rounded-[1.5rem] border border-border/60 bg-background/75 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Languages</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{stats.languageCount}</p>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <PortfolioTransitionDeck cards={showcaseCards} />

      <div className="mt-12 mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{copy.featuredRepos}</h2>
          <p className="font-display-syne text-sm leading-6 text-muted-foreground">{renderRepoCodeNote(copy.repoCodeNote)}</p>
        </div>
        <span className="rounded-full border border-border/60 bg-card/80 px-3 py-1 text-xs font-semibold text-muted-foreground">
          {copy.technicalShowcase}
        </span>
      </div>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map((repo, index) => (
          <RepositoryCard
            key={repo.id}
            repo={repo}
            locale={locale}
            index={index}
            label={{
              openRepo: copy.openRepo,
              updated: copy.updated,
              codeAvailable: locale === "es" ? "Código disponible" : locale === "fr" ? "Code disponible" : "Code available",
              licensed: locale === "es" ? "Licenciado" : locale === "fr" ? "Sous licence" : "Licensed",
              citeable: locale === "es" ? "Se puede citar" : locale === "fr" ? "Citable" : "Citable",
              restricted: locale === "es" ? "Cita restringida" : locale === "fr" ? "Citation restreinte" : "Citation restricted",
            }}
          />
      ))}
      </section>

      {projects.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-border/60 bg-card/75 px-4 py-5 text-center text-muted-foreground">
          {copy.emptyState}
        </div>
      ) : null}
    </main>
  )
}
