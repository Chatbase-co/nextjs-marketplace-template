"use client"

import { Children, useEffect, useMemo, useRef, useState } from "react"

import { cn } from "@/lib/utils"

type ScrollRevealStaggerProps = {
  children: React.ReactNode
  className?: string
  itemClassName?: string
}

// AGENCY_OWNED: staggered reveal utility for long card lists and grouped content blocks.
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export function ScrollRevealStagger({ children, className, itemClassName }: ScrollRevealStaggerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const items = useMemo(() => Children.toArray(children), [children])
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const update = () => {
      const rect = container.getBoundingClientRect()
      const viewportHeight = window.innerHeight || 1
      const start = viewportHeight * 0.88
      const end = -rect.height * 0.12
      const progress = clamp((start - rect.top) / Math.max(start - end, 1), 0, 1)
      const nextCount = clamp(Math.round(progress * items.length), 0, items.length)
      setVisibleCount(nextCount)
      rafRef.current = null
    }

    const onScrollOrResize = () => {
      if (rafRef.current) return
      rafRef.current = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onScrollOrResize, { passive: true })
    window.addEventListener("resize", onScrollOrResize)

    return () => {
      window.removeEventListener("scroll", onScrollOrResize)
      window.removeEventListener("resize", onScrollOrResize)
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current)
    }
  }, [items.length])

  return (
    <div ref={containerRef} className={className}>
      {items.map((child, index) => {
        const visible = index < visibleCount
        return (
          <div
            key={`reveal-${index}`}
            className={cn(itemClassName)}
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translate3d(0, 0, 0)" : "translate3d(0, 28px, 0)",
              filter: visible ? "blur(0px)" : "blur(4px)",
              transition:
                "opacity 420ms cubic-bezier(0.22,1,0.36,1), transform 420ms cubic-bezier(0.22,1,0.36,1), filter 420ms cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            {child}
          </div>
        )
      })}
    </div>
  )
}
