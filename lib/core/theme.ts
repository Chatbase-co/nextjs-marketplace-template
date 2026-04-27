import { cookies, headers } from "next/headers"

// AGENCY_OWNED: theme resolution logic is reusable across the app shell.
export type ThemeMode = "dark" | "light"

export async function getThemeFromRequest(): Promise<ThemeMode> {
  const cookieTheme = (await cookies()).get("NEXT_THEME")?.value
  if (cookieTheme === "light" || cookieTheme === "dark") {
    return cookieTheme
  }

  const cookieHeader = (await headers()).get("cookie") ?? ""
  const match = cookieHeader.match(/NEXT_THEME=(light|dark)/)
  if (match) {
    return match[1] as ThemeMode
  }

  return "dark"
}
