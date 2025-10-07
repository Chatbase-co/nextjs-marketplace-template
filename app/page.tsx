import { MinimalNav } from "@/components/minimal-nav"
import { MinimalHero } from "@/components/minimal-hero"
import { ProductSection } from "@/components/product-section"
import { PricingSection } from "@/components/pricing-section"
import Script from "next/script"

export default function Home() {
  return (
    <main className="min-h-screen">
	<Script>
	{
		`(function(){if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})}const onLoad=function(){const script=document.createElement("script");script.src="www.chatbase.co/embed.min.js";script.id="${
		process.env.NEXT_PUBLIC_CHATBOT_ID
		}";script.domain="www.chatbase.co";document.body.appendChild(script)};if(document.readyState==="complete"){onLoad()}else{window.addEventListener("load",onLoad)}})();`
	}
	  </Script>
      <MinimalNav />
      <MinimalHero />
      <ProductSection />
      <PricingSection />
    </main>
  )
}
