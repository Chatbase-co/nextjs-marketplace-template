import Link from "next/link"
import Image from "next/image"
import { Book } from "lucide-react"

export function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-stone-900/20 to-transparent backdrop-blur-xs">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/chatbase-logo.svg" width={100} height={100} alt="Chatbase Logo" className="w-[50px]" />
            <span className="text-4xl font-bold">+</span>
            <Image src="/vercel-logo.svg" width={100} height={100} alt="Vercel Logo" className="w-[100px]" />
          </Link>

        <div className="flex items-center gap-4">
          <Link href="https://chatbase.co/docs" target="_blank"
          className="flex items-center gap-2 text-xl font-bold text-white/80 transition-colors hover:text-white">
          <Book className="w-6 h-6" />Documentation</Link>
        </div>
      </div>
        </div>
    </nav>
  )
}
