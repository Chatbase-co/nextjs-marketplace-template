"use client"

import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

type DotBackgroundProps = {
  className?: string
  quantity?: number
  speed?: number
  darkSpeed?: number
  radiusScale?: number
  darkRadiusScale?: number
  alphaScale?: number
  darkAlphaScale?: number
  accentRatio?: number
  baseColor?: string
  darkBaseColor?: string
  accentColor?: string
  darkAccentColor?: string
  opacity?: number
  darkOpacity?: number
}

type Dot = {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  alpha: number
  color: string
}

// AGENCY_OWNED: canvas-based ambient background primitive.
// This is part of the site’s reusable motion system, not a business feature.
export function DotBackground({
  className,
  quantity = 96,
  speed = 0.35,
  darkSpeed,
  radiusScale = 1,
  darkRadiusScale,
  alphaScale = 1,
  darkAlphaScale,
  accentRatio = 0.18,
  baseColor = "94, 82, 71",
  darkBaseColor,
  accentColor = "127, 105, 255",
  darkAccentColor,
  opacity = 1,
  darkOpacity,
}: DotBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const dotsRef = useRef<Dot[]>([])
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const root = document.documentElement

    const syncTheme = () => {
      setIsDarkMode(root.classList.contains("dark"))
    }

    syncTheme()

    const observer = new MutationObserver(syncTheme)
    observer.observe(root, { attributes: true, attributeFilter: ["class"] })

    return () => observer.disconnect()
  }, [])

  const resolvedSpeed = isDarkMode && darkSpeed !== undefined ? darkSpeed : speed
  const resolvedRadiusScale = isDarkMode && darkRadiusScale !== undefined ? darkRadiusScale : radiusScale
  const resolvedAlphaScale = isDarkMode && darkAlphaScale !== undefined ? darkAlphaScale : alphaScale
  const resolvedBaseColor = isDarkMode && darkBaseColor ? darkBaseColor : baseColor
  const resolvedAccentColor = isDarkMode && darkAccentColor ? darkAccentColor : accentColor
  const resolvedOpacity = isDarkMode && darkOpacity !== undefined ? darkOpacity : opacity

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const particleCount = Math.max(0, Math.floor(quantity))
    const normalizedAccentRatio = Math.min(1, Math.max(0, accentRatio))

    const resize = () => {
      const rect = container.getBoundingClientRect()
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches
      const effectiveCount = isDesktop ? Math.round(particleCount * 1.15) : particleCount
      const accentCount = Math.round(effectiveCount * normalizedAccentRatio)
      const accentMap = Array.from({ length: effectiveCount }, (_, index) => index < accentCount)

      for (let index = accentMap.length - 1; index > 0; index -= 1) {
        const swap = Math.floor(Math.random() * (index + 1))
        ;[accentMap[index], accentMap[swap]] = [accentMap[swap], accentMap[index]]
      }

      canvas.width = Math.max(1, Math.floor(rect.width * dpr))
      canvas.height = Math.max(1, Math.floor(rect.height * dpr))
      canvas.style.width = `${Math.floor(rect.width)}px`
      canvas.style.height = `${Math.floor(rect.height)}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      dotsRef.current = Array.from({ length: effectiveCount }, (_, index) => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * resolvedSpeed,
        vy: (Math.random() - 0.5) * resolvedSpeed,
        radius: (accentMap[index] ? 1.2 + Math.random() * 1.6 : 0.75 + Math.random() * 1.4) * resolvedRadiusScale,
        alpha: Math.min(
          1,
          (accentMap[index] ? 0.55 + Math.random() * 0.3 : 0.14 + Math.random() * 0.38) * resolvedAlphaScale,
        ),
        color: accentMap[index] ? resolvedAccentColor : resolvedBaseColor,
      }))
    }

    const draw = () => {
      const rect = container.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)

      for (const dot of dotsRef.current) {
        dot.x += dot.vx
        dot.y += dot.vy

        if (dot.x <= 0 || dot.x >= rect.width) dot.vx *= -1
        if (dot.y <= 0 || dot.y >= rect.height) dot.vy *= -1

        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${dot.color}, ${dot.alpha})`
        ctx.fill()
      }

      rafRef.current = window.requestAnimationFrame(draw)
    }

    resize()
    rafRef.current = window.requestAnimationFrame(draw)
    window.addEventListener("resize", resize)

    return () => {
      window.removeEventListener("resize", resize)
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current)
    }
  }, [accentRatio, quantity, resolvedAccentColor, resolvedBaseColor, resolvedRadiusScale, resolvedAlphaScale, resolvedSpeed])

  return (
    <div ref={containerRef} className={cn("pointer-events-none absolute inset-0", className)} style={{ opacity: resolvedOpacity }}>
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden />
    </div>
  )
}
