"use client"

import { useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"

import {
  randomId,
  resolveAnalyticsPageType,
  resolveCanonicalPath,
  resolveDeviceCategory,
  resolveLocaleFromPathname,
  resolveReferrerCategory,
  resolveReferrerHost,
  resolveUtmParams,
  isLikelyBot,
} from "@/lib/analytics/utils"
import type { AnalyticsEventType } from "@/lib/analytics/types"

type TrackerSnapshot = {
  pagePath: string
  canonicalPath: string
  pageTitle: string
  pageType: ReturnType<typeof resolveAnalyticsPageType>
  locale: string
  visitorId: string
  sessionId: string
  startedAt: number
  maxScrollDepth: number
  referrerUrl: string | null
  userAgent: string | null
  screenWidth: number | null
  screenHeight: number | null
  viewportWidth: number | null
  viewportHeight: number | null
  utmSource: string | null
  utmMedium: string | null
  utmCampaign: string | null
}

type AnalyticsPayload = Omit<TrackerSnapshot, "startedAt" | "maxScrollDepth"> & {
  timeOnPage: number
  scrollDepth: number
  eventType: AnalyticsEventType
  surfaceKey: string | null
  interactionLabel: string | null
  interactionValue: number | null
}

function getSessionId() {
  if (typeof window === "undefined") return randomId()
  const key = "binff_session_id"
  const existing = window.sessionStorage.getItem(key)
  if (existing) return existing
  const next = randomId()
  window.sessionStorage.setItem(key, next)
  return next
}

function getVisitorId() {
  if (typeof window === "undefined") return randomId()
  const key = "binff_visitor_id"
  const existing = window.localStorage.getItem(key)
  if (existing) return existing
  const next = randomId()
  window.localStorage.setItem(key, next)
  return next
}

function getScrollDepth() {
  if (typeof document === "undefined") return 0
  const scrollTop = window.scrollY || document.documentElement.scrollTop || 0
  const scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1

  if (scrollHeight <= viewportHeight) return 100
  const depth = ((scrollTop + viewportHeight) / scrollHeight) * 100
  return Math.max(0, Math.min(100, Math.round(depth)))
}

function sendPayload(payload: AnalyticsPayload) {
  const body = JSON.stringify(payload)
  const blob = new Blob([body], { type: "application/json" })

  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/analytics/track", blob)
    return
  }

  void fetch("/api/analytics/track", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
    keepalive: true,
  })
}

function readInteractionValue(value: string | null) {
  if (!value) return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

export function PassiveAnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const snapshotRef = useRef<TrackerSnapshot | null>(null)
  const currentPathname = pathname ?? "/"
  const searchString = searchParams?.toString() ?? ""

  useEffect(() => {
    if (currentPathname.startsWith("/api") || currentPathname.startsWith("/_next")) {
      return
    }

    const flush = () => {
      const current = snapshotRef.current
      if (!current) return

      const timeOnPage = Math.max(0, Math.round((performance.now() - current.startedAt) / 1000))
      if (!current.pagePath) return

      sendPayload({
        pagePath: current.pagePath,
        canonicalPath: current.canonicalPath,
        pageTitle: current.pageTitle,
        pageType: current.pageType,
        locale: current.locale,
        visitorId: current.visitorId,
        sessionId: current.sessionId,
        timeOnPage,
        scrollDepth: current.maxScrollDepth,
        referrerUrl: current.referrerUrl,
        userAgent: current.userAgent,
        screenWidth: current.screenWidth,
        screenHeight: current.screenHeight,
        viewportWidth: current.viewportWidth,
        viewportHeight: current.viewportHeight,
        utmSource: current.utmSource,
        utmMedium: current.utmMedium,
        utmCampaign: current.utmCampaign,
        eventType: "page_view",
        surfaceKey: current.canonicalPath,
        interactionLabel: null,
        interactionValue: null,
      })
      snapshotRef.current = null
    }

    const sendInteraction = (target: HTMLElement) => {
      const eventType = target.dataset.analyticsEvent as AnalyticsEventType | undefined
      if (!eventType) return

      const current = snapshotRef.current
      if (!current || !current.pagePath) return

      sendPayload({
        pagePath: current.pagePath,
        canonicalPath: current.canonicalPath,
        pageTitle: current.pageTitle,
        pageType: current.pageType,
        locale: current.locale,
        visitorId: current.visitorId,
        sessionId: current.sessionId,
        timeOnPage: Math.max(0, Math.round((performance.now() - current.startedAt) / 1000)),
        scrollDepth: current.maxScrollDepth,
        referrerUrl: current.referrerUrl,
        userAgent: current.userAgent,
        screenWidth: current.screenWidth,
        screenHeight: current.screenHeight,
        viewportWidth: current.viewportWidth,
        viewportHeight: current.viewportHeight,
        utmSource: current.utmSource,
        utmMedium: current.utmMedium,
        utmCampaign: current.utmCampaign,
        eventType,
        surfaceKey: target.dataset.analyticsSurface || null,
        interactionLabel: target.dataset.analyticsLabel || target.textContent?.trim() || null,
        interactionValue: readInteractionValue(target.dataset.analyticsValue ?? null),
      })
    }

    const canonicalPath = resolveCanonicalPath(currentPathname)
    const routeLocale = resolveLocaleFromPathname(currentPathname)
    const currentUrl = new URL(window.location.href)
    const utm = resolveUtmParams(currentUrl)
    const pageType = resolveAnalyticsPageType(currentPathname)
    const userAgent = navigator.userAgent || null

    snapshotRef.current = {
      pagePath: `${currentPathname}${searchString ? `?${searchString}` : ""}`,
      canonicalPath,
      pageTitle: document.title,
      pageType,
      locale: routeLocale || document.documentElement.lang || "es",
      visitorId: getVisitorId(),
      sessionId: getSessionId(),
      startedAt: performance.now(),
      maxScrollDepth: getScrollDepth(),
      referrerUrl: document.referrer || null,
      userAgent,
      screenWidth: window.screen?.width ?? null,
      screenHeight: window.screen?.height ?? null,
      viewportWidth: window.innerWidth ?? null,
      viewportHeight: window.innerHeight ?? null,
      utmSource: utm.utmSource,
      utmMedium: utm.utmMedium,
      utmCampaign: utm.utmCampaign,
    }

    const onScroll = () => {
      const current = snapshotRef.current
      if (!current) return
      current.maxScrollDepth = Math.max(current.maxScrollDepth, getScrollDepth())
    }

    const onPageHide = () => flush()
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        flush()
      }
    }

    const onClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return
      const analyticsTarget = target.closest<HTMLElement>("[data-analytics-event]")
      if (!analyticsTarget || analyticsTarget.dataset.analyticsDisabled === "true") return
      sendInteraction(analyticsTarget)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("click", onClick, true)
    window.addEventListener("pagehide", onPageHide)
    document.addEventListener("visibilitychange", onVisibilityChange)

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("click", onClick, true)
      window.removeEventListener("pagehide", onPageHide)
      document.removeEventListener("visibilitychange", onVisibilityChange)
      flush()
    }
  }, [currentPathname, searchString, searchParams])

  return null
}
