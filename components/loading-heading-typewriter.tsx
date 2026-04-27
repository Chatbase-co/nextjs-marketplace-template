"use client"

import { useEffect } from "react"

const HEADING_SELECTOR = "h1, h2, h3, h4, h5, h6"

// AGENCY_OWNED: loading-state variant of the reusable typewriter heading treatment.
function prepareLoadingHeading(heading: HTMLElement) {
  const text = heading.textContent ?? ""
  if (!text.trim()) return false

  heading.textContent = ""

  const textNode = document.createElement("span")
  textNode.className = "title-loading-text"
  textNode.textContent = text
  heading.append(textNode)

  const loader = document.createElement("span")
  loader.className = "title-loading-loader"
  loader.setAttribute("aria-hidden", "true")
  heading.append(loader)

  return true
}

type LoadingHeadingTypewriterProps = {
  scopeSelector?: string
}

export function LoadingHeadingTypewriter({ scopeSelector }: LoadingHeadingTypewriterProps) {
  useEffect(() => {
    if (typeof window === "undefined") return

    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (media.matches) return

    let observer: IntersectionObserver | null = null

    const resolveRoot = () => {
      if (!scopeSelector) return document.body
      const scoped = document.querySelector(scopeSelector)
      return scoped instanceof HTMLElement ? scoped : null
    }

    const registerHeadings = () => {
      const root = resolveRoot()
      if (!root) return

      const headings = Array.from(root.querySelectorAll<HTMLElement>(HEADING_SELECTOR))
      headings.forEach((heading) => {
        if (heading.dataset.loadingHeadingInit === "true") return
        if (heading.dataset.loadingHeadingSkip === "true") return
        heading.dataset.loadingHeadingInit = "true"
        observer?.observe(heading)
      })
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const heading = entry.target as HTMLElement
          if (heading.dataset.loadingHeadingPlayed === "true") return
          heading.classList.add("title-loading-ready")
          const prepared = prepareLoadingHeading(heading)
          if (!prepared) {
            heading.dataset.loadingHeadingPlayed = "true"
            observer?.unobserve(heading)
            return
          }
          heading.dataset.loadingHeadingPlayed = "true"
          heading.classList.add("title-loading-active")
          observer?.unobserve(heading)
        })
      },
      { threshold: 0.24, rootMargin: "0px 0px -10% 0px" },
    )

    registerHeadings()

    const mutationObserver = new MutationObserver(() => {
      registerHeadings()
    })

    const root = resolveRoot()
    mutationObserver.observe(root || document.body, { childList: true, subtree: true })

    return () => {
      observer?.disconnect()
      mutationObserver.disconnect()
    }
  }, [scopeSelector])

  return null
}
