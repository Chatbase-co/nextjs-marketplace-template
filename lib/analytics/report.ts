import type {
  AnalyticsDailyPoint,
  AnalyticsEvent,
  AnalyticsPageRow,
  AnalyticsPageType,
  AnalyticsSimpleRow,
  AnalyticsTotals,
  MonthlyAnalyticsReport,
} from "@/lib/analytics/types"

type SessionSummary = {
  sessionId: string
  visitorId: string
  events: AnalyticsEvent[]
  engaged: boolean
  bounced: boolean
}

const MONTH_LABEL_LOCALE = "es-MX"

function formatNumber(value: number) {
  return new Intl.NumberFormat(MONTH_LABEL_LOCALE).format(Math.round(value))
}

function formatFixed(value: number) {
  return new Intl.NumberFormat(MONTH_LABEL_LOCALE, {
    maximumFractionDigits: 1,
  }).format(Math.round(value * 10) / 10)
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function monthBounds(monthKey: string) {
  const [year, month] = monthKey.split("-").map((item) => Number(item))
  const start = new Date(Date.UTC(year, month - 1, 1))
  const end = new Date(Date.UTC(year, month, 1))
  return { start, end }
}

function resolveMonthKey(date = new Date()) {
  return date.toISOString().slice(0, 7)
}

function monthLabel(monthKey: string) {
  const { start } = monthBounds(monthKey)
  return new Intl.DateTimeFormat(MONTH_LABEL_LOCALE, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(start)
}

function roundTo(value: number, precision = 1) {
  const factor = 10 ** precision
  return Math.round(value * factor) / factor
}

function groupBy<T>(items: readonly T[], keyFn: (item: T) => string) {
  const map = new Map<string, T[]>()
  for (const item of items) {
    const key = keyFn(item)
    const existing = map.get(key)
    if (existing) {
      existing.push(item)
    } else {
      map.set(key, [item])
    }
  }
  return map
}

function safeAverage(values: number[]) {
  if (values.length === 0) return 0
  return roundTo(values.reduce((sum, item) => sum + item, 0) / values.length)
}

function safeMax(values: number[]) {
  return values.length ? Math.max(...values) : 0
}

function summarizeSessions(events: readonly AnalyticsEvent[]) {
  const sessions = Array.from(
    groupBy(events, (event) => event.sessionId).entries(),
    ([sessionId, sessionEvents]) => {
      const engaged = sessionEvents.some((event) => event.timeOnPage >= 15 || event.scrollDepth >= 50 || event.eventType === "cta_click")
      const bounced = sessionEvents.length === 1 && !engaged && (sessionEvents[0]?.timeOnPage ?? 0) < 10 && (sessionEvents[0]?.scrollDepth ?? 0) < 25
      return {
        sessionId,
        visitorId: sessionEvents[0]?.visitorId ?? sessionId,
        events: sessionEvents,
        engaged,
        bounced,
      } satisfies SessionSummary
    },
  )

  return sessions
}

function buildBreakdown(items: readonly AnalyticsEvent[], keyFn: (event: AnalyticsEvent) => string, total: number) {
  const grouped = Array.from(groupBy(items, keyFn).entries()).map(([label, group]) => ({
    label,
    value: group.length,
    percentage: total ? roundTo((group.length / total) * 100) : 0,
  }))

  return grouped.sort((a, b) => b.value - a.value)
}

function dailySeriesForMonth(events: readonly AnalyticsEvent[], monthKey: string): AnalyticsDailyPoint[] {
  const { start, end } = monthBounds(monthKey)
  const points: AnalyticsDailyPoint[] = []

  for (let cursor = new Date(start); cursor < end; cursor.setUTCDate(cursor.getUTCDate() + 1)) {
    const dateKey = cursor.toISOString().slice(0, 10)
    const label = String(cursor.getUTCDate())
    const dayEvents = events.filter((event) => event.createdAt.startsWith(dateKey))
    const sessions = new Set(dayEvents.map((event) => event.sessionId))
    const visitors = new Set(dayEvents.map((event) => event.visitorId))

    points.push({
      date: dateKey,
      label,
      views: dayEvents.length,
      sessions: sessions.size,
      visitors: visitors.size,
      avgTimeOnPage: safeAverage(dayEvents.map((event) => event.timeOnPage)),
      avgScrollDepth: safeAverage(dayEvents.map((event) => event.scrollDepth)),
    })
  }

  return points
}

function renderLineChartSvg(points: readonly AnalyticsDailyPoint[], title: string) {
  const width = 820
  const height = 260
  const padding = { top: 28, right: 24, bottom: 42, left: 52 }
  const plotWidth = width - padding.left - padding.right
  const plotHeight = height - padding.top - padding.bottom
  const maxValue = Math.max(1, safeMax(points.map((point) => point.views)))
  const segments = Math.max(points.length - 1, 1)
  const tickCount = 4
  const pointsLine = points
    .map((point, index) => {
      const x = padding.left + (index / segments) * plotWidth
      const y = padding.top + plotHeight - (point.views / maxValue) * plotHeight
      return `${x},${y}`
    })
    .join(" ")

  const ticks = Array.from({ length: tickCount + 1 }, (_, index) => {
    const value = Math.round((maxValue / tickCount) * index)
    const y = padding.top + plotHeight - (value / maxValue) * plotHeight
    return { value, y }
  })

  const circles = points.map((point, index) => {
    const x = padding.left + (index / segments) * plotWidth
    const y = padding.top + plotHeight - (point.views / maxValue) * plotHeight
    const showLabel = index === 0 || index === points.length - 1 || index % 4 === 0
    return `
      <circle cx="${x}" cy="${y}" r="4.5" fill="#f97316" stroke="#ffffff" stroke-width="2" />
      ${showLabel ? `<text x="${x}" y="${height - 14}" text-anchor="middle" font-size="11" fill="#64748b">${escapeHtml(point.label)}</text>` : ""}
    `
  })

  return `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(title)}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${width}" height="${height}" rx="24" fill="#ffffff" />
      <text x="${padding.left}" y="18" font-size="16" font-weight="700" fill="#0f172a">${escapeHtml(title)}</text>
      ${ticks
        .map(
          (tick) => `
            <line x1="${padding.left}" y1="${tick.y}" x2="${width - padding.right}" y2="${tick.y}" stroke="#e2e8f0" stroke-width="1" />
            <text x="${padding.left - 10}" y="${tick.y + 4}" text-anchor="end" font-size="11" fill="#94a3b8">${tick.value}</text>
          `,
        )
        .join("")}
      <polyline fill="none" stroke="#f97316" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="${pointsLine}" />
      ${circles.join("")}
      <text x="${padding.left}" y="${height - 10}" font-size="11" fill="#94a3b8">Días del mes</text>
    </svg>
  `
}

function renderBarChartSvg(rows: readonly AnalyticsPageRow[], title: string) {
  const width = 820
  const rowHeight = 34
  const height = Math.max(220, 80 + rows.length * rowHeight)
  const padding = { top: 34, right: 24, bottom: 24, left: 220 }
  const plotWidth = width - padding.left - padding.right
  const maxValue = Math.max(1, safeMax(rows.map((row) => row.views)))

  const bars = rows
    .map((row, index) => {
      const y = 58 + index * rowHeight
      const barWidth = (row.views / maxValue) * plotWidth
      const valueLabelX = padding.left + Math.min(plotWidth, barWidth) + 8
      const label = row.title || row.path
      return `
        <text x="20" y="${y + 5}" font-size="12" font-weight="600" fill="#0f172a">${escapeHtml(label.length > 28 ? `${label.slice(0, 28).trim()}...` : label)}</text>
        <rect x="${padding.left}" y="${y - 12}" width="${Math.max(6, barWidth)}" height="20" rx="10" fill="#fb923c" />
        <text x="${valueLabelX}" y="${y + 3}" font-size="11" fill="#475569">${row.views}</text>
      `
    })
    .join("")

  return `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(title)}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${width}" height="${height}" rx="24" fill="#ffffff" />
      <text x="20" y="22" font-size="16" font-weight="700" fill="#0f172a">${escapeHtml(title)}</text>
      ${bars}
      <text x="20" y="${height - 10}" font-size="11" fill="#94a3b8">Páginas principales</text>
    </svg>
  `
}

function monthKeyOrCurrent(monthKey?: string) {
  if (monthKey && /^\d{4}-\d{2}$/.test(monthKey)) {
    return monthKey
  }

  return resolveMonthKey()
}

export function buildMonthlyAnalyticsReport(events: readonly AnalyticsEvent[], monthKey?: string): MonthlyAnalyticsReport {
  const resolvedMonthKey = monthKeyOrCurrent(monthKey)
  const monthlyEvents = events.filter((event) => event.createdAt.startsWith(`${resolvedMonthKey}-`))
  const viewEvents = monthlyEvents.filter((event) => event.eventType === "page_view")
  const interactionEvents = monthlyEvents.filter((event) => event.eventType !== "page_view")
  const sessions = summarizeSessions(monthlyEvents)
  const uniqueVisitors = new Set(viewEvents.map((event) => event.visitorId))
  const dailySeries = dailySeriesForMonth(viewEvents, resolvedMonthKey)
  const monthTitle = monthLabel(resolvedMonthKey)
  const totalViews = viewEvents.length
  const totalSessions = new Set(viewEvents.map((event) => event.sessionId)).size
  const ctaClicks = monthlyEvents.filter((event) => event.eventType === "cta_click").length
  const bookingStarts = monthlyEvents.filter((event) => event.eventType === "booking_start").length
  const bookingConfirmed = monthlyEvents.filter((event) => event.eventType === "booking_confirmed").length
  const purchaseStarts = monthlyEvents.filter((event) => event.eventType === "purchase_start").length
  const purchaseConfirmed = monthlyEvents.filter((event) => event.eventType === "purchase_confirmed").length
  const eventTypeBreakdown = buildBreakdown(monthlyEvents, (event) => event.eventType, monthlyEvents.length)
  const surfaceBreakdown = buildBreakdown(
    monthlyEvents,
    (event) => event.surfaceKey || event.canonicalPath,
    monthlyEvents.length,
  ).slice(0, 8)
  const engagedSessions = sessions.filter((session) => session.engaged).length
  const bouncedSessions = sessions.filter((session) => session.bounced).length
  const totalTime = viewEvents.reduce((sum, event) => sum + event.timeOnPage, 0)
  const totalScroll = viewEvents.reduce((sum, event) => sum + event.scrollDepth, 0)
  const totals: AnalyticsTotals = {
    views: totalViews,
    sessions: totalSessions,
    visitors: uniqueVisitors.size,
    ctaClicks,
    bookingStarts,
    bookingConfirmed,
    purchaseStarts,
    purchaseConfirmed,
    interactions: interactionEvents.length,
    avgTimeOnPage: totalViews ? roundTo(totalTime / totalViews) : 0,
    avgScrollDepth: totalViews ? roundTo(totalScroll / totalViews) : 0,
    engagementRate: totalSessions ? roundTo((engagedSessions / totalSessions) * 100) : 0,
    bounceRate: totalSessions ? roundTo((bouncedSessions / totalSessions) * 100) : 0,
  }

  const pageGroups = Array.from(groupBy(viewEvents, (event) => `${event.canonicalPath}::${event.pageType}::${event.locale}`).entries())
  const topPages = pageGroups
    .map(([key, pageEvents]) => {
      const [path, pageType, locale] = key.split("::")
      const title = pageEvents[0]?.pageTitle || path
      const pageSessions = new Set(pageEvents.map((event) => event.sessionId)).size
      const pageVisitors = new Set(pageEvents.map((event) => event.visitorId)).size
      const bounceEvents = pageEvents.filter((event) => event.timeOnPage < 10 && event.scrollDepth < 25)
      return {
        path,
        title,
        pageType: pageType as AnalyticsPageType,
        locale,
        views: pageEvents.length,
        sessions: pageSessions,
        visitors: pageVisitors,
        avgTimeOnPage: safeAverage(pageEvents.map((event) => event.timeOnPage)),
        avgScrollDepth: safeAverage(pageEvents.map((event) => event.scrollDepth)),
        bounceRate: pageEvents.length ? roundTo((bounceEvents.length / pageEvents.length) * 100) : 0,
      } satisfies AnalyticsPageRow
    })
    .sort((a, b) => b.views - a.views)
    .slice(0, 8)

  const topReferrers = buildBreakdown(
    viewEvents.filter((event) => event.referrerCategory !== "direct"),
    (event) => event.referrerHost || event.referrerCategory,
    totalViews,
  ).slice(0, 8)

  const localeBreakdown = buildBreakdown(viewEvents, (event) => event.locale || "unknown", totalViews)
  const deviceBreakdown = buildBreakdown(viewEvents, (event) => event.deviceCategory || "unknown", totalViews)
  const pageTypeBreakdown = buildBreakdown(viewEvents, (event) => event.pageType, totalViews)

  return {
    monthKey: resolvedMonthKey,
    monthLabel: monthTitle,
    generatedAt: new Date().toISOString(),
    totals,
    dailySeries,
    topPages,
    topReferrers,
    eventTypeBreakdown,
    surfaceBreakdown,
    localeBreakdown,
    deviceBreakdown,
    pageTypeBreakdown,
    charts: {
      lineChartSvg: renderLineChartSvg(dailySeries, "Vistas por día"),
      barChartSvg: renderBarChartSvg(topPages, "Páginas con más tráfico"),
    },
  }
}

function renderKpiCard(label: string, value: string, extra?: string) {
  return `
    <td style="padding:12px;border:1px solid #e2e8f0;border-radius:18px;background:#fff;">
      <div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#94a3b8;margin-bottom:6px;">${escapeHtml(label)}</div>
      <div style="font-size:22px;font-weight:700;color:#0f172a;line-height:1.15;">${escapeHtml(value)}</div>
      ${extra ? `<div style="margin-top:4px;font-size:12px;color:#64748b;">${escapeHtml(extra)}</div>` : ""}
    </td>
  `
}

function renderTable(headers: string[], rows: string[][]) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:separate;border-spacing:0 10px;">
      <thead>
        <tr>
          ${headers.map((header) => `<th style="text-align:left;padding:8px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#94a3b8;">${escapeHtml(header)}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (row) => `
              <tr>
                ${row.map((cell) => `<td style="padding:12px;border-top:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0;background:#fff;color:#0f172a;font-size:14px;">${cell}</td>`).join("")}
              </tr>
            `,
          )
          .join("")}
      </tbody>
    </table>
  `
}

export function buildMonthlyAnalyticsEmailHtml(report: MonthlyAnalyticsReport) {
  const kpis = [
    renderKpiCard("Vistas", formatNumber(report.totals.views), "Eventos de página y acciones"),
    renderKpiCard("Sesiones", formatNumber(report.totals.sessions)),
    renderKpiCard("Visitantes", formatNumber(report.totals.visitors)),
    renderKpiCard("Interacciones", formatNumber(report.totals.interactions), "Clicks, reservas y compras"),
    renderKpiCard("Engagement", `${formatFixed(report.totals.engagementRate)}%`, "Sesiones con interacción real"),
    renderKpiCard("Tiempo medio", `${formatFixed(report.totals.avgTimeOnPage)}s`),
    renderKpiCard("Scroll medio", `${formatFixed(report.totals.avgScrollDepth)}%`),
  ].join("")

  const pageRows = report.topPages
    .map(
      (row) => `
        <tr>
          <td style="padding:10px 12px;border-top:1px solid #e2e8f0;background:#fff;">${escapeHtml(row.title)}</td>
          <td style="padding:10px 12px;border-top:1px solid #e2e8f0;background:#fff;">${escapeHtml(row.pageType)}</td>
          <td style="padding:10px 12px;border-top:1px solid #e2e8f0;background:#fff;">${formatNumber(row.views)}</td>
          <td style="padding:10px 12px;border-top:1px solid #e2e8f0;background:#fff;">${formatFixed(row.avgTimeOnPage)}s</td>
          <td style="padding:10px 12px;border-top:1px solid #e2e8f0;background:#fff;">${formatFixed(row.avgScrollDepth)}%</td>
          <td style="padding:10px 12px;border-top:1px solid #e2e8f0;background:#fff;">${formatFixed(row.bounceRate)}%</td>
        </tr>
      `,
    )
    .join("")

  const referrerRows = report.topReferrers
    .map(
      (row) => `
        <tr>
          <td style="padding:10px 12px;border-top:1px solid #e2e8f0;background:#fff;">${escapeHtml(row.label)}</td>
          <td style="padding:10px 12px;border-top:1px solid #e2e8f0;background:#fff;">${formatNumber(row.value)}</td>
          <td style="padding:10px 12px;border-top:1px solid #e2e8f0;background:#fff;">${formatFixed(row.percentage)}%</td>
        </tr>
      `,
    )
    .join("")

  const localeRows = report.localeBreakdown
    .map(
      (row) => `
        <tr>
          <td style="padding:10px 12px;border-top:1px solid #e2e8f0;background:#fff;">${escapeHtml(row.label)}</td>
          <td style="padding:10px 12px;border-top:1px solid #e2e8f0;background:#fff;">${formatNumber(row.value)}</td>
          <td style="padding:10px 12px;border-top:1px solid #e2e8f0;background:#fff;">${formatFixed(row.percentage)}%</td>
        </tr>
      `,
    )
    .join("")

  const deviceRows = report.deviceBreakdown
    .map(
      (row) => `
        <tr>
          <td style="padding:10px 12px;border-top:1px solid #e2e8f0;background:#fff;">${escapeHtml(row.label)}</td>
          <td style="padding:10px 12px;border-top:1px solid #e2e8f0;background:#fff;">${formatNumber(row.value)}</td>
          <td style="padding:10px 12px;border-top:1px solid #e2e8f0;background:#fff;">${formatFixed(row.percentage)}%</td>
        </tr>
      `,
    )
    .join("")

  const dailyRows = report.dailySeries
    .filter((point) => point.views > 0 || point.sessions > 0)
    .slice(0, 12)
    .map(
      (point) => `
        <tr>
          <td style="padding:10px 12px;border-top:1px solid #e2e8f0;background:#fff;">${escapeHtml(point.date)}</td>
          <td style="padding:10px 12px;border-top:1px solid #e2e8f0;background:#fff;">${formatNumber(point.views)}</td>
          <td style="padding:10px 12px;border-top:1px solid #e2e8f0;background:#fff;">${formatNumber(point.sessions)}</td>
          <td style="padding:10px 12px;border-top:1px solid #e2e8f0;background:#fff;">${formatFixed(point.avgTimeOnPage)}s</td>
          <td style="padding:10px 12px;border-top:1px solid #e2e8f0;background:#fff;">${formatFixed(point.avgScrollDepth)}%</td>
        </tr>
      `,
    )
    .join("")

  return `
    <html>
      <body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
        <div style="max-width:980px;margin:0 auto;padding:32px 20px;">
          <div style="background:linear-gradient(135deg,#0f172a 0%,#1f2937 55%,#f97316 160%);border-radius:28px;padding:28px 28px 24px;color:#fff;">
            <div style="font-size:11px;letter-spacing:.28em;text-transform:uppercase;opacity:.78;">Binff</div>
            <h1 style="margin:10px 0 8px;font-size:28px;line-height:1.12;">Reporte mensual de analítica</h1>
            <p style="margin:0;max-width:720px;font-size:15px;line-height:1.6;color:rgba(255,255,255,.84);">
              Resumen de tráfico público, páginas más leídas, fuentes de entrada y comportamiento de lectura para <strong>${escapeHtml(report.monthLabel)}</strong>.
            </p>
          </div>

          <div style="margin-top:20px;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:separate;border-spacing:10px 10px;">
              <tr>${kpis}</tr>
            </table>
          </div>

          <div style="display:grid;grid-template-columns:1fr;gap:18px;margin-top:18px;">
            <div style="background:#fff;border:1px solid #e2e8f0;border-radius:28px;padding:18px;">
              ${report.charts.lineChartSvg}
            </div>
            <div style="background:#fff;border:1px solid #e2e8f0;border-radius:28px;padding:18px;">
              ${report.charts.barChartSvg}
            </div>
          </div>

          <div style="margin-top:22px;background:#fff;border:1px solid #e2e8f0;border-radius:28px;padding:18px;">
            <h2 style="margin:0 0 14px;font-size:20px;">Páginas principales</h2>
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
              <thead>
                <tr>
                  <th style="text-align:left;padding:10px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#94a3b8;">Página</th>
                  <th style="text-align:left;padding:10px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#94a3b8;">Tipo</th>
                  <th style="text-align:left;padding:10px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#94a3b8;">Vistas</th>
                  <th style="text-align:left;padding:10px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#94a3b8;">Tiempo</th>
                  <th style="text-align:left;padding:10px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#94a3b8;">Scroll</th>
                  <th style="text-align:left;padding:10px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#94a3b8;">Bounce</th>
                </tr>
              </thead>
              <tbody>${pageRows}</tbody>
            </table>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:18px;">
            <div style="background:#fff;border:1px solid #e2e8f0;border-radius:28px;padding:18px;">
              <h2 style="margin:0 0 14px;font-size:20px;">Tipos de evento</h2>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
                <thead>
                  <tr>
                    <th style="text-align:left;padding:10px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#94a3b8;">Tipo</th>
                    <th style="text-align:left;padding:10px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#94a3b8;">Eventos</th>
                    <th style="text-align:left;padding:10px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#94a3b8;">Peso</th>
                  </tr>
                </thead>
                <tbody>
                  ${report.eventTypeBreakdown
                    .map(
                      (row) => `
                        <tr>
                          <td style="padding:10px 12px;border-top:1px solid #e2e8f0;background:#fff;">${escapeHtml(row.label)}</td>
                          <td style="padding:10px 12px;border-top:1px solid #e2e8f0;background:#fff;">${formatNumber(row.value)}</td>
                          <td style="padding:10px 12px;border-top:1px solid #e2e8f0;background:#fff;">${formatFixed(row.percentage)}%</td>
                        </tr>
                      `,
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
            <div style="background:#fff;border:1px solid #e2e8f0;border-radius:28px;padding:18px;">
              <h2 style="margin:0 0 14px;font-size:20px;">Superficies principales</h2>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
                <thead>
                  <tr>
                    <th style="text-align:left;padding:10px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#94a3b8;">Superficie</th>
                    <th style="text-align:left;padding:10px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#94a3b8;">Eventos</th>
                    <th style="text-align:left;padding:10px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#94a3b8;">Peso</th>
                  </tr>
                </thead>
                <tbody>
                  ${report.surfaceBreakdown
                    .map(
                      (row) => `
                        <tr>
                          <td style="padding:10px 12px;border-top:1px solid #e2e8f0;background:#fff;">${escapeHtml(row.label)}</td>
                          <td style="padding:10px 12px;border-top:1px solid #e2e8f0;background:#fff;">${formatNumber(row.value)}</td>
                          <td style="padding:10px 12px;border-top:1px solid #e2e8f0;background:#fff;">${formatFixed(row.percentage)}%</td>
                        </tr>
                      `,
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1fr;gap:18px;margin-top:18px;">
            <div style="background:#fff;border:1px solid #e2e8f0;border-radius:28px;padding:18px;">
              <h2 style="margin:0 0 14px;font-size:20px;">Vistas por día</h2>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
                <thead>
                  <tr>
                    <th style="text-align:left;padding:10px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#94a3b8;">Día</th>
                    <th style="text-align:left;padding:10px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#94a3b8;">Vistas</th>
                    <th style="text-align:left;padding:10px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#94a3b8;">Sesiones</th>
                    <th style="text-align:left;padding:10px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#94a3b8;">Tiempo</th>
                    <th style="text-align:left;padding:10px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#94a3b8;">Scroll</th>
                  </tr>
                </thead>
                <tbody>${dailyRows || ""}</tbody>
              </table>
            </div>
            <div style="background:#fff;border:1px solid #e2e8f0;border-radius:28px;padding:18px;">
              <h2 style="margin:0 0 14px;font-size:20px;">Fuentes de tráfico</h2>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
                <thead>
                  <tr>
                    <th style="text-align:left;padding:10px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#94a3b8;">Fuente</th>
                    <th style="text-align:left;padding:10px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#94a3b8;">Vistas</th>
                    <th style="text-align:left;padding:10px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#94a3b8;">Peso</th>
                  </tr>
                </thead>
                <tbody>${referrerRows}</tbody>
              </table>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:18px;">
            <div style="background:#fff;border:1px solid #e2e8f0;border-radius:28px;padding:18px;">
              <h2 style="margin:0 0 14px;font-size:20px;">Locales</h2>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
                <thead>
                  <tr>
                    <th style="text-align:left;padding:10px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#94a3b8;">Idioma</th>
                    <th style="text-align:left;padding:10px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#94a3b8;">Vistas</th>
                    <th style="text-align:left;padding:10px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#94a3b8;">Peso</th>
                  </tr>
                </thead>
                <tbody>${localeRows}</tbody>
              </table>
            </div>
            <div style="background:#fff;border:1px solid #e2e8f0;border-radius:28px;padding:18px;">
              <h2 style="margin:0 0 14px;font-size:20px;">Dispositivos</h2>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
                <thead>
                  <tr>
                    <th style="text-align:left;padding:10px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#94a3b8;">Dispositivo</th>
                    <th style="text-align:left;padding:10px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#94a3b8;">Vistas</th>
                    <th style="text-align:left;padding:10px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#94a3b8;">Peso</th>
                  </tr>
                </thead>
                <tbody>${deviceRows}</tbody>
              </table>
            </div>
          </div>

          <div style="margin-top:18px;background:#fff;border:1px solid #e2e8f0;border-radius:28px;padding:18px;">
            <h2 style="margin:0 0 14px;font-size:20px;">Tipos de página</h2>
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
              <thead>
                <tr>
                  <th style="text-align:left;padding:10px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#94a3b8;">Tipo</th>
                  <th style="text-align:left;padding:10px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#94a3b8;">Vistas</th>
                  <th style="text-align:left;padding:10px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#94a3b8;">Peso</th>
                </tr>
              </thead>
              <tbody>
                ${report.pageTypeBreakdown
                  .map(
                    (row) => `
                      <tr>
                        <td style="padding:10px 12px;border-top:1px solid #e2e8f0;background:#fff;">${escapeHtml(row.label)}</td>
                        <td style="padding:10px 12px;border-top:1px solid #e2e8f0;background:#fff;">${formatNumber(row.value)}</td>
                        <td style="padding:10px 12px;border-top:1px solid #e2e8f0;background:#fff;">${formatFixed(row.percentage)}%</td>
                      </tr>
                    `,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      </body>
    </html>
  `
}

export function buildMonthlyAnalyticsEmailText(report: MonthlyAnalyticsReport) {
  const lines = [
    `Binff | Reporte mensual de analítica - ${report.monthLabel}`,
    "",
    `Vistas: ${report.totals.views}`,
    `Sesiones: ${report.totals.sessions}`,
    `Visitantes: ${report.totals.visitors}`,
    `Interacciones: ${report.totals.interactions}`,
    `Reservas iniciadas: ${report.totals.bookingStarts}`,
    `Ventas iniciadas: ${report.totals.purchaseStarts}`,
    `Engagement: ${formatFixed(report.totals.engagementRate)}%`,
    `Tiempo medio: ${formatFixed(report.totals.avgTimeOnPage)}s`,
    `Scroll medio: ${formatFixed(report.totals.avgScrollDepth)}%`,
    "",
    "Tipos de evento:",
    ...report.eventTypeBreakdown.map((row) => `- ${row.label}: ${formatNumber(row.value)} (${formatFixed(row.percentage)}%)`),
    "",
    "Superficies principales:",
    ...report.surfaceBreakdown.map((row) => `- ${row.label}: ${formatNumber(row.value)} (${formatFixed(row.percentage)}%)`),
    "",
    "Páginas principales:",
    ...report.topPages.map(
      (row) =>
        `- ${row.title} (${row.pageType}) | ${row.views} vistas | ${formatFixed(row.avgTimeOnPage)}s | ${formatFixed(row.avgScrollDepth)}%`,
    ),
  ]

  return lines.join("\n")
}
