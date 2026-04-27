"use client"

import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

type ScrollRevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right" | "none"
  once?: boolean
}

// AGENCY_OWNED: reusable reveal-on-scroll motion primitive.
// Keep this isolated so pages can opt into the same motion language without duplicating observer logic.
const DIRECTION_MAP = {
  up: { x: 0, y: 48 },
  down: { x: 0, y: -48 },
  left: { x: 56, y: 0 },
  right: { x: -56, y: 0 },
  none: { x: 0, y: 0 },
} as const

export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
  once = false,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
        if (once && entry.isIntersecting) {
          observer.unobserve(node)
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -10% 0px" },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [once])

  const offset = DIRECTION_MAP[direction]
  const style = {
    "--reveal-x": `${offset.x}px`,
    "--reveal-y": `${offset.y}px`,
    "--reveal-delay": `${delay}s`,
  } as CSSProperties

  return (
    <div
      ref={ref}
      style={style}
      className={cn("scroll-reveal", isVisible && "scroll-reveal-visible", className)}
    >
      {children}
    </div>
  )
}
