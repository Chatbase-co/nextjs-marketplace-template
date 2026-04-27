import { ImageResponse } from "next/og"
import { seoConfig } from "@/lib/seo"

export const size = {
  width: 180,
  height: 180,
}

export const contentType = "image/png"

const logoUrl = new URL("/logos/binff_logo_vermillion.svg", seoConfig.site.siteUrl).toString()

export default function AppleIcon() {
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
          padding: 18,
          borderRadius: 36,
        }}
      >
        <img
          src={logoUrl}
          alt="Binff"
          width="100%"
          height="100%"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </div>
    ),
    {
      ...size,
    },
  )
}
