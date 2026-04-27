import { NextResponse, type NextRequest } from "next/server"

import { locales } from "@/lib/site-content"

// AGENCY_OWNED: request middleware that persists locale/theme hints in cookies.
// No client data processing happens here; it only keeps the UI state consistent.
function detectLocale(acceptLanguage: string | null | undefined) {
  const header = acceptLanguage ?? ""
  const preferredLocales = header
    .split(",")
    .map((part) => part.trim().split(";")[0]?.toLowerCase())
    .filter(Boolean)

  for (const preferred of preferredLocales) {
    const base = preferred.split("-")[0]
    if (locales.includes(base as (typeof locales)[number])) {
      return base
    }
  }

  return "en"
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const firstSegment = pathname.split("/").filter(Boolean)[0]
  const response = NextResponse.next()

  if (firstSegment && locales.includes(firstSegment as (typeof locales)[number])) {
    response.cookies.set("NEXT_LOCALE", firstSegment, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    })
  } else if (!request.cookies.get("NEXT_LOCALE")) {
    response.cookies.set("NEXT_LOCALE", detectLocale(request.headers.get("accept-language")), {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    })
  }

  if (!request.cookies.get("NEXT_THEME")) {
    const hintedTheme = request.headers.get("sec-ch-prefers-color-scheme")
    response.cookies.set("NEXT_THEME", hintedTheme === "light" || hintedTheme === "dark" ? hintedTheme : "dark", {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    })
  }

  return response
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
}
