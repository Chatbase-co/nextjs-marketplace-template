import { redirect } from "next/navigation"

import { getLocaleFromCookies } from "@/lib/locale"

export default async function PackagesRedirectPage() {
  const locale = await getLocaleFromCookies()
  redirect(`/${locale}/packages`)
}
