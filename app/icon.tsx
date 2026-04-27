import { ImageResponse } from "next/og"
import { seoConfig } from "@/lib/seo"

export const size = {
  width: 32,
  height: 32,
}

export const contentType = "image/png"

const logoUrl = new URL("/logos/binff_logo_vermillion.svg", seoConfig.site.siteUrl).toString()

export default function Icon() {
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
          padding: 3,
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
