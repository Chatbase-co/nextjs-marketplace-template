import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import {
  appendAnalyticsEvent,
  isLikelyBot,
  randomId,
  resolveDeviceCategory,
  resolveReferrerCategory,
  resolveReferrerHost,
} from "@/lib/analytics"
import type { AnalyticsEvent, AnalyticsPageType } from "@/lib/analytics/types"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const AnalyticsEventSchema = z.object({
  pagePath: z.string().min(1),
  canonicalPath: z.string().min(1),
  pageTitle: z.string().min(1),
  pageType: z.string().min(1),
  locale: z.string().min(1),
  visitorId: z.string().min(1),
  sessionId: z.string().min(1),
  timeOnPage: z.coerce.number().int().min(0).default(0),
  scrollDepth: z.coerce.number().int().min(0).max(100).default(0),
  referrerUrl: z.string().nullable().optional(),
  userAgent: z.string().nullable().optional(),
  screenWidth: z.coerce.number().int().nullable().optional(),
  screenHeight: z.coerce.number().int().nullable().optional(),
  viewportWidth: z.coerce.number().int().nullable().optional(),
  viewportHeight: z.coerce.number().int().nullable().optional(),
  utmSource: z.string().nullable().optional(),
  utmMedium: z.string().nullable().optional(),
  utmCampaign: z.string().nullable().optional(),
  eventType: z.enum([
    "page_view",
    "cta_click",
    "booking_start",
    "booking_confirmed",
    "purchase_start",
    "purchase_confirmed",
  ]).default("page_view"),
  surfaceKey: z.string().nullable().optional(),
  interactionLabel: z.string().nullable().optional(),
  interactionValue: z.coerce.number().nullable().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const parsed = AnalyticsEventSchema.parse(await request.json())
    if (isLikelyBot(parsed.userAgent)) {
      return NextResponse.json({ success: true, ignored: true }, { headers: { "Cache-Control": "no-store" } })
    }

    const origin = request.nextUrl.origin
    const analyticsEvent: AnalyticsEvent = {
      ...parsed,
      pageType: parsed.pageType as AnalyticsPageType,
      id: randomId(),
      createdAt: new Date().toISOString(),
      referrerUrl: parsed.referrerUrl ?? null,
      userAgent: parsed.userAgent ?? null,
      screenWidth: parsed.screenWidth ?? null,
      screenHeight: parsed.screenHeight ?? null,
      viewportWidth: parsed.viewportWidth ?? null,
      viewportHeight: parsed.viewportHeight ?? null,
      utmSource: parsed.utmSource ?? null,
      utmMedium: parsed.utmMedium ?? null,
      utmCampaign: parsed.utmCampaign ?? null,
      surfaceKey: parsed.surfaceKey ?? null,
      interactionLabel: parsed.interactionLabel ?? null,
      interactionValue: parsed.interactionValue ?? null,
      referrerHost: resolveReferrerHost(parsed.referrerUrl ?? null),
      referrerCategory: resolveReferrerCategory(parsed.referrerUrl ?? null, origin),
      deviceCategory: resolveDeviceCategory(parsed.viewportWidth ?? parsed.screenWidth ?? null),
    }

    await appendAnalyticsEvent(analyticsEvent)

    return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to track analytics"
    return NextResponse.json({ success: false, message }, { status: 400 })
  }
}
