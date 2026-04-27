import { NextRequest, NextResponse } from "next/server"

import { buildAnalyticsDashboardData, readAnalyticsEvents } from "@/lib/analytics"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  const month = request.nextUrl.searchParams.get("month") ?? undefined

  try {
    const events = await readAnalyticsEvents(month)
    const data = buildAnalyticsDashboardData(events, month)

    return NextResponse.json({ success: true, data }, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to build analytics dashboard"
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}
