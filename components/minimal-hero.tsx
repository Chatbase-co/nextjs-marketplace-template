export function MinimalHero() {
  return (
    <section className="relative min-h-screen pb-8">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src="/serene-nature-sharp.jpg" alt="Serene natural landscape" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-background" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center lg:px-8">
        <h1
          className="font-serif text-5xl leading-[1.05] tracking-tight text-white lg:text-6xl xl:text-7xl"
          style={{ textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}
        >
          <span className="text-balance">Support that works while you sleep</span>
        </h1>
        <p
          className="mt-6 max-w-2xl font-serif text-xl italic leading-relaxed text-white/95  lg:text-xl"
          style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
        >
          Meridian's AI-powered ticketing system resolves 60% of inquiries automatically and increases customer
          satisfaction by 35%
        </p>
        <button className="group relative mt-12 overflow-hidden rounded-full border border-white/20 bg-white/10 px-8 py-4 font-medium text-white shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-white/30 hover:bg-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]">
          <span className="relative z-10">Start Free Trial</span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </button>
      </div>
    </section>
  )
}
