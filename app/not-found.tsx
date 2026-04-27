import Link from "next/link"

import { Button } from "@/components/ui/button"
import { NotFoundLeafReveal } from "@/components/client/not-found-leaf-reveal"
import { localizedSectionHref } from "@/lib/core/navigation"
import { getLocaleForNotFound } from "@/lib/core/locale"
import type { Locale } from "@/content/client/site-content"

const notFoundCopy: Record<
  Locale,
  {
    title: string
    description: string
    cta: string
  }
> = {
  en: {
    title: "We couldn't find this page.",
    description: "Oops, did you get lost? You can go back to our services and keep exploring the studio.",
    cta: "Go to services",
  },
  fr: {
    title: "Nous n'avons pas trouvé cette page.",
    description: "Oups, vous vous êtes perdu ? Vous pouvez revenir à nos services et continuer à explorer le studio.",
    cta: "Aller aux services",
  },
  es: {
    title: "No encontramos esta página.",
    description: "Ups, ¿te perdiste? Puedes volver a explorar nuestros servicios.",
    cta: "Ir a servicios",
  },
}

export default async function NotFound() {
  const locale = await getLocaleForNotFound()
  const copy = notFoundCopy[locale]

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05080c] text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(251,125,79,0.16),transparent_38%),radial-gradient(circle_at_80%_18%,rgba(92,181,255,0.1),transparent_26%),linear-gradient(to_bottom,rgba(5,8,12,0.02),rgba(5,8,12,0.38))]" />
        <div className="absolute inset-0 z-10">
          <NotFoundLeafReveal />
        </div>
      </div>

      <section className="relative z-20 flex min-h-screen items-center justify-center px-4 py-20 sm:px-6">
        <div className="flex w-full max-w-3xl flex-col items-center text-center">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.48em] text-[color:var(--accent)]">
              Error 404
            </p>
            <h1 className="mt-5 text-balance font-serif text-5xl leading-[0.95] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              {copy.title}
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-balance text-base leading-7 text-foreground/72 sm:text-lg sm:leading-8">
              {copy.description}
            </p>
            <div className="mt-10 flex justify-center">
              <Button asChild className="rounded-full bg-[color:var(--accent)] px-6 py-6 text-base text-white shadow-lg shadow-[color:var(--accent)]/15 transition-transform hover:scale-[1.03]">
                <Link href={localizedSectionHref(locale, "services")}>{copy.cta}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
