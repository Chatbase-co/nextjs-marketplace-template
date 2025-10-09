import Link from "next/link"

export function MinimalNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-stone-900/20 to-transparent backdrop-blur-xs">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-6 w-6 bg-white border border-zinc rounded" />
            <span className="font-serif text-xl tracking-tight text-white text-shadow-lg">Nexus.ai</span>
          </Link>

          <div className="flex items-center gap-8">
            <Link
              href="#"
              className="rounded-full bg-background px-6 py-2.5 text-sm text-forground transition-all hover:bg-background/90"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
