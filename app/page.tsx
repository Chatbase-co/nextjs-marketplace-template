import { MinimalNav } from "@/components/minimal-nav"
import { MinimalHero } from "@/components/minimal-hero"
import { ProductSection } from "@/components/product-section"
import { PricingSection } from "@/components/pricing-section"

export default function Home() {
  return (
    <main className="min-h-screen">
      <MinimalNav />
      <MinimalHero />
      <ProductSection />
      <PricingSection />
    </main>
  )
}
