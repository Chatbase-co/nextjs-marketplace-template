import type { Metadata } from "next"

import { AnalyticsDashboard } from "@/components/client/analytics-dashboard"
import { buildAnalyticsDashboardData, readAnalyticsEvents } from "@/lib/analytics"

export const metadata: Metadata = {
  title: "Analytics dashboard",
  robots: {
    index: false,
    follow: false,
  },
}

type AnalyticsPageProps = {
  searchParams?: {
    month?: string
  }
}

export default async function AnalyticsPage({ searchParams }: AnalyticsPageProps) {
  const month = searchParams?.month && /^\d{4}-\d{2}$/.test(searchParams.month) ? searchParams.month : undefined
  const events = await readAnalyticsEvents(month)
  const data = buildAnalyticsDashboardData(events, month)

  return <AnalyticsDashboard data={data} />
}
