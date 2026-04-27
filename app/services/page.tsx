import { redirect } from "next/navigation"

import { getLocaleFromCookies } from "@/lib/locale"

export default async function ServicesRedirectPage() {
  const locale = await getLocaleFromCookies()
  redirect(`/${locale}/services`)
}
