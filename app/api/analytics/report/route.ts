import { NextRequest, NextResponse } from "next/server"

import { buildMonthlyAnalyticsEmailHtml, buildMonthlyAnalyticsReport, readAnalyticsEvents } from "@/lib/analytics"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  const month = request.nextUrl.searchParams.get("month") ?? undefined
  const format = request.nextUrl.searchParams.get("format") ?? "json"

  try {
    const events = await readAnalyticsEvents(month)
    const report = buildMonthlyAnalyticsReport(events, month)

    if (format === "html") {
      return new NextResponse(buildMonthlyAnalyticsEmailHtml(report), {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store",
        },
      })
    }

    return NextResponse.json({ success: true, data: report }, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to build analytics report"
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}

