import { ImageResponse } from "next/og"
import { seoConfig } from "@/lib/seo"

export const dynamic = "force-dynamic"

const logoUrl = new URL("/logos/binff_logo_vermillion.svg", seoConfig.site.siteUrl).toString()

function Logo() {
  return (
    <img
      src={logoUrl}
      alt="Binff"
      width="100%"
      height="100%"
      style={{ width: "100%", height: "100%", objectFit: "contain" }}
    />
  )
}

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f9f9f7",
          padding: 20,
          borderRadius: 38,
        }}
      >
        <Logo />
      </div>
    ),
    {
      width: 192,
      height: 192,
    },
  )
}
