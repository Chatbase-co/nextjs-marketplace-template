import { ReactNode } from "react"

import { DotBackground } from "@/components/core/dot-background"
import { cn } from "@/lib/utils"

type SectionShellProps = {
  id?: string
  eyebrow: string
  title: string
  description: string
  children?: ReactNode
  className?: string
}

export function SectionShell({ id, eyebrow, title, description, children, className }: SectionShellProps) {
  return (
    <section id={id} className={cn("relative scroll-mt-28 py-6 sm:py-8", className)}>
      <div className="relative overflow-hidden p-6 text-card-foreground md:p-8">
        <DotBackground
          className="opacity-100 mix-blend-soft-light"
          quantity={140}
          accentRatio={0.28}
          baseColor="214, 122, 44"
          accentColor="255, 154, 72"
          opacity={0.95}
        />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[var(--accent)]">{eyebrow}</p>
          <div className="mt-3 max-w-3xl">
            <h2 className="font-serif text-3xl leading-[1.02] tracking-tight text-card-foreground md:text-5xl">{title}</h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">{description}</p>
          </div>
          {children ? <div className="relative mt-8">{children}</div> : null}
        </div>
      </div>
    </section>
  )
}
