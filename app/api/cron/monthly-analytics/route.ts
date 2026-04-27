import { NextRequest, NextResponse } from "next/server"

import {
  buildMonthlyAnalyticsEmailHtml,
  buildMonthlyAnalyticsEmailText,
  buildMonthlyAnalyticsReport,
  readAnalyticsEvents,
} from "@/lib/analytics"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

function getPreviousMonthKey(date = new Date()) {
  const current = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1))
  current.setUTCMonth(current.getUTCMonth() - 1)
  return current.toISOString().slice(0, 7)
}

async function sendWebhookEmail(payload: { to: string; subject: string; html: string; text: string }) {
  const url = process.env.ANALYTICS_EMAIL_WEBHOOK_URL?.trim()
  if (!url) {
    return { sent: false, reason: "ANALYTICS_EMAIL_WEBHOOK_URL not configured" }
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.ANALYTICS_EMAIL_WEBHOOK_SECRET
        ? { Authorization: `Bearer ${process.env.ANALYTICS_EMAIL_WEBHOOK_SECRET}` }
        : {}),
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Email webhook failed with status ${response.status}`)
  }

  return { sent: true }
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  }

  const month = request.nextUrl.searchParams.get("month") ?? getPreviousMonthKey()

  try {
    const events = await readAnalyticsEvents(month)
    const report = buildMonthlyAnalyticsReport(events, month)
    const subject = `Binff | Reporte mensual de analítica - ${report.monthLabel}`
    const html = buildMonthlyAnalyticsEmailHtml(report)
    const text = buildMonthlyAnalyticsEmailText(report)
    const to = process.env.ANALYTICS_EMAIL_TO?.trim() || ""

    const delivery = to
      ? await sendWebhookEmail({
          to,
          subject,
          html,
          text,
        })
      : { sent: false, reason: "ANALYTICS_EMAIL_TO not configured" }

    return NextResponse.json(
      {
        success: true,
        month,
        report,
        email: delivery,
      },
      { headers: { "Cache-Control": "no-store" } },
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to send analytics report"
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}

