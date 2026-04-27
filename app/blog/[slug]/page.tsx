import { redirect } from "next/navigation"

import { getLocaleFromCookies } from "@/lib/locale"

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function BlogPostRedirectPage({ params }: PageProps) {
  const { slug } = await params
  const locale = await getLocaleFromCookies()
  redirect(`/${locale}/blog/${slug}`)
}
