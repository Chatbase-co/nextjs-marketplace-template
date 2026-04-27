"use client"

import { DotBackground } from "@/components/core/dot-background"
import { useEffect, useState } from "react"
import type { ThemeMode } from "@/lib/theme"

type SiteParticleBackgroundProps = {
  theme: ThemeMode
}

// AGENCY_OWNED: theme-aware decorative background wrapper.
export function SiteParticleBackground({ theme }: SiteParticleBackgroundProps) {
  const [isDark, setIsDark] = useState(theme === "dark")

  useEffect(() => {
    const root = document.documentElement

    const syncTheme = () => {
      setIsDark(root.classList.contains("dark"))
    }

    syncTheme()

    const observer = new MutationObserver(syncTheme)
    observer.observe(root, { attributes: true, attributeFilter: ["class"] })

    return () => observer.disconnect()
  }, [])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {isDark ? (
        <>
          <DotBackground
            className="opacity-100 mix-blend-normal"
            quantity={210}
            speed={0.168}
            radiusScale={1.15}
            alphaScale={1.87}
            accentRatio={0}
            baseColor="255, 255, 255"
            accentColor="255, 255, 255"
            opacity={0.85}
          />
          <DotBackground
            className="opacity-100 mix-blend-normal"
            quantity={77}
            speed={0.11}
            radiusScale={1}
            alphaScale={0.9}
            accentRatio={1}
            baseColor="224, 58, 30"
            accentColor="224, 58, 30"
            opacity={0.56}
          />
        </>
      ) : (
        <>
          <DotBackground
            className="opacity-100 mix-blend-multiply"
            quantity={434}
            speed={0.24}
            radiusScale={1.48}
            alphaScale={1.35}
            accentRatio={0}
            baseColor="8, 8, 8"
            accentColor="8, 8, 8"
            opacity={0.58}
          />
          <DotBackground
            className="opacity-100 mix-blend-normal"
            quantity={154}
            speed={0.12}
            radiusScale={0.98}
            alphaScale={0.8}
            accentRatio={1}
            baseColor="224, 58, 30"
            accentColor="224, 58, 30"
            opacity={0.29}
          />
        </>
      )}
    </div>
  )
}
