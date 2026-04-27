import { buildMonthlyAnalyticsReport } from "@/lib/analytics/report"
import type {
  AnalyticsDashboardData,
  AnalyticsDashboardSeriesPoint,
  AnalyticsEvent,
  AnalyticsScatterPoint,
} from "@/lib/analytics/types"

function monthKeyOrCurrent(monthKey?: string) {
  if (monthKey && /^\d{4}-\d{2}$/.test(monthKey)) {
    return monthKey
  }

  return new Date().toISOString().slice(0, 7)
}

function monthSet(events: readonly AnalyticsEvent[]) {
  return [...new Set(events.map((event) => event.createdAt.slice(0, 7)))].sort((left, right) =>
    right.localeCompare(left),
  )
}

function toDashboardSeries(
  reportSeries: ReturnType<typeof buildMonthlyAnalyticsReport>["dailySeries"],
  monthlyEvents: readonly AnalyticsEvent[],
): AnalyticsDashboardSeriesPoint[] {
  return reportSeries.map((point) => ({
    date: point.date,
    label: point.label,
    views: point.views,
    interactions: monthlyEvents.filter(
      (event) => event.createdAt.startsWith(point.date) && event.eventType !== "page_view",
    ).length,
    avgTimeOnPage: point.avgTimeOnPage,
    avgScrollDepth: point.avgScrollDepth,
  }))
}

function toScatterSeries(series: readonly AnalyticsDashboardSeriesPoint[]): AnalyticsScatterPoint[] {
  return series
    .filter((point) => point.views > 0 || point.interactions > 0)
    .map((point, index) => ({
      label: point.label,
      day: index + 1,
      views: point.views,
      avgTimeOnPage: point.avgTimeOnPage,
      avgScrollDepth: point.avgScrollDepth,
      interactions: point.interactions,
    }))
}

function shortenLabel(label: string) {
  return label.length > 28 ? `${label.slice(0, 28).trim()}...` : label
}

export function buildAnalyticsDashboardData(events: readonly AnalyticsEvent[], monthKey?: string): AnalyticsDashboardData {
  const resolvedMonthKey = monthKeyOrCurrent(monthKey)
  const report = buildMonthlyAnalyticsReport(events, resolvedMonthKey)
  const monthlyEvents = events.filter((event) => event.createdAt.startsWith(`${resolvedMonthKey}-`))
  const dailySeries = toDashboardSeries(report.dailySeries, monthlyEvents)
  const scatterSeries = toScatterSeries(dailySeries)

  return {
    monthKey: report.monthKey,
    monthLabel: report.monthLabel,
    generatedAt: report.generatedAt,
    availableMonths: monthSet(events),
    totals: report.totals,
    dailySeries,
    scatterSeries,
    topPages: report.topPages,
    topSurfaces: report.surfaceBreakdown,
    eventTypeBreakdown: report.eventTypeBreakdown,
    referrerBreakdown: report.topReferrers,
    localeBreakdown: report.localeBreakdown,
    deviceBreakdown: report.deviceBreakdown,
    pageTypeBreakdown: report.pageTypeBreakdown,
    charts: {
      topPagesBar: report.topPages.slice(0, 8).map((row) => ({
        label: shortenLabel(row.title || row.path),
        value: row.views,
        secondary: row.sessions,
      })),
      surfacesBar: report.surfaceBreakdown.slice(0, 8).map((row) => ({
        label: shortenLabel(row.label),
        value: row.value,
        secondary: Math.round(row.percentage),
      })),
      scatter: scatterSeries,
    },
  }
}
