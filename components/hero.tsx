import Link from "next/link";

export function Hero() {
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
          <span className="text-balance">NextJS Chatbase Template</span>
        </h1>
        <Link 
        href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FChatbase-co%2Fnextjs-marketplace-template&env=NEXT_PUBLIC_CHATBOT_ID&envDescription=chatbot%20id%20from%20chatbase&integration-ids=icfg_jS0nsILSbn7FTwQFbTJy5CSY&products=%5B%7B%22type%22%3A%22integration%22%2C%22integrationSlug%22%3A%22chatbase%22%2C%22productSlug%22%3A%22chatbot%22%2C%22protocol%22%3A%22ai%22%7D%5D"
        target="_blank"
        className="group relative mt-12 overflow-hidden rounded-full border border-white/20 bg-white/10 px-8 py-4 font-medium text-white shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-white/30 hover:bg-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]">
          <span className="relative z-10">Deploy To Vercel</span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </Link>
      </div>
    </section>
  )
}
