"use client"

import Link from "next/link"
import { Bar, BarChart, CartesianGrid, ComposedChart, Line, Scatter, XAxis, YAxis } from "recharts"
import { CalendarDays, MousePointerClick, RefreshCw, ShieldCheck, ShoppingBag, Target } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ScrollReveal } from "@/components/core/scroll-reveal"
import type { AnalyticsDashboardData } from "@/lib/analytics/types"
import { cn } from "@/lib/utils"

type AnalyticsDashboardProps = {
  data: AnalyticsDashboardData
}

const chartPalette = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--secondary))", "hsl(var(--destructive))"] as const

function formatNumber(value: number) {
  return new Intl.NumberFormat("es-MX").format(Math.round(value))
}

function formatFixed(value: number) {
  return new Intl.NumberFormat("es-MX", { maximumFractionDigits: 1 }).format(Math.round(value * 10) / 10)
}

function metricIcon(index: number) {
  const icons = [Target, MousePointerClick, CalendarDays, ShoppingBag, RefreshCw, ShieldCheck]
  return icons[index % icons.length]
}

export function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:pt-32">
      <ScrollReveal direction="up">
        <section className="rounded-[2.25rem] border border-border/60 bg-card/85 p-5 shadow-[0_24px_80px_rgba(2,6,23,0.16)] backdrop-blur md:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <Badge variant="outline" className="rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em]">
                Analítica pasiva
              </Badge>
              <div className="space-y-2">
                <h1 className="text-4xl font-semibold tracking-tight text-card-foreground sm:text-5xl">
                  Dashboard mensual de reservas, ventas y lectura
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
                  Sin login. Este panel junta pageviews, clicks, reservas y señales de comercio para que puedas leer qué
                  partes del sitio empujan mejor el negocio.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {data.availableMonths.length ? (
                data.availableMonths.map((month) => {
                  const active = month === data.monthKey
                  return (
                    <Link
                      key={month}
                      href={`/analytics?month=${month}`}
                      className={cn(
                        "rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] transition",
                        active
                          ? "border-[color:var(--accent)]/40 bg-[color:var(--accent)]/12 text-[color:var(--accent)]"
                          : "border-border/60 bg-background/80 text-muted-foreground hover:border-[color:var(--accent)]/30 hover:text-card-foreground",
                      )}
                    >
                      {month}
                    </Link>
                  )
                })
              ) : (
                <span className="rounded-full border border-border/60 bg-background/80 px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  {data.monthKey}
                </span>
              )}
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0.08} className="mt-8">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          {[
            { label: "Pageviews", value: data.totals.views },
            { label: "Interacciones", value: data.totals.interactions },
            { label: "Reservas", value: data.totals.bookingStarts + data.totals.bookingConfirmed },
            { label: "Ventas", value: data.totals.purchaseStarts + data.totals.purchaseConfirmed },
            { label: "Tiempo medio", value: `${formatFixed(data.totals.avgTimeOnPage)}s` },
            { label: "Scroll medio", value: `${formatFixed(data.totals.avgScrollDepth)}%` },
          ].map((metric, index) => {
            const Icon = metricIcon(index)
            return (
              <article
                key={metric.label}
                className="rounded-[1.5rem] border border-border/60 bg-card/80 p-4 shadow-[0_12px_36px_-28px_rgba(2,6,23,0.35)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                      {metric.label}
                    </p>
                    <p className="text-2xl font-semibold tracking-tight text-card-foreground">{metric.value}</p>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[color:var(--accent)]/12 text-[color:var(--accent)]">
                    <Icon className="h-4 w-4" />
                  </span>
                </div>
              </article>
            )
          })}
        </section>
      </ScrollReveal>

      <div className="mt-8 grid gap-4 xl:grid-cols-[1.35fr_0.95fr]">
        <ScrollReveal direction="up">
          <Card className="border-border/60 bg-card/80 shadow-[0_18px_60px_-36px_rgba(2,6,23,0.45)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-card-foreground">Páginas con más tráfico</CardTitle>
            </CardHeader>
            <CardContent className="h-[22rem]">
              <ChartContainer
                config={{
                  views: { label: "Vistas", color: chartPalette[0] },
                  sessions: { label: "Sesiones", color: chartPalette[1] },
                }}
                className="h-full w-full"
              >
                <BarChart data={data.charts.topPagesBar} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.12} />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} interval={0} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                  <Bar dataKey="value" fill={chartPalette[0]} radius={[10, 10, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.08}>
          <Card className="border-border/60 bg-card/80 shadow-[0_18px_60px_-36px_rgba(2,6,23,0.45)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-card-foreground">Dispersión de lectura</CardTitle>
            </CardHeader>
            <CardContent className="h-[22rem]">
              <ChartContainer
                config={{
                  views: { label: "Pageviews", color: chartPalette[0] },
                  interactions: { label: "Interacciones", color: chartPalette[2] },
                }}
                className="h-full w-full"
              >
                <ComposedChart data={data.charts.scatter} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.12} />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} interval={0} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke={chartPalette[0]}
                    strokeWidth={3}
                    dot={false}
                    isAnimationActive={false}
                  />
                  <Scatter dataKey="views" fill={chartPalette[0]} />
                </ComposedChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>

      <div className="mt-8 grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <ScrollReveal direction="up">
          <Card className="border-border/60 bg-card/80 shadow-[0_18px_60px_-36px_rgba(2,6,23,0.45)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-card-foreground">Superficies con más actividad</CardTitle>
            </CardHeader>
            <CardContent className="h-[22rem]">
              <ChartContainer
                config={{
                  value: { label: "Eventos", color: chartPalette[3] },
                }}
                className="h-full w-full"
              >
                <BarChart data={data.charts.surfacesBar} layout="vertical" margin={{ left: 12, right: 8, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.12} />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="label" type="category" tick={{ fontSize: 12 }} width={120} />
                  <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                  <Bar dataKey="value" fill={chartPalette[3]} radius={[0, 10, 10, 0]} isAnimationActive={false} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.08}>
          <Card className="border-border/60 bg-card/80 shadow-[0_18px_60px_-36px_rgba(2,6,23,0.45)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-card-foreground">Breakdown mensual</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-muted-foreground">Tipos de evento</p>
                <div className="space-y-2">
                  {data.eventTypeBreakdown.map((row, index) => (
                    <div key={row.label} className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/80 px-4 py-3">
                      <span className="text-sm font-medium text-card-foreground">{row.label}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatNumber(row.value)} ({formatFixed(row.percentage)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-muted-foreground">Fuentes y locales</p>
                <div className="space-y-2">
                  {data.referrerBreakdown.slice(0, 4).map((row) => (
                    <div key={row.label} className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/80 px-4 py-3">
                      <span className="text-sm font-medium text-card-foreground">{row.label}</span>
                      <span className="text-sm text-muted-foreground">{formatNumber(row.value)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {data.localeBreakdown.slice(0, 2).map((row) => (
                    <div key={row.label} className="rounded-2xl border border-border/60 bg-background/80 px-4 py-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">{row.label}</p>
                      <p className="mt-1 text-sm font-medium text-card-foreground">{formatNumber(row.value)} vistas</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>
    </main>
  )
}
