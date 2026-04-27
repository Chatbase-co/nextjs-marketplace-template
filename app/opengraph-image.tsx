import { ImageResponse } from "next/og"

import { SITE_DESCRIPTION, SITE_NAME, seoConfig } from "@/lib/seo"

export const runtime = "edge"

const logoUrl = new URL(seoConfig.brand.brandLogo, seoConfig.site.siteUrl).toString()

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#f9f9f7",
          color: "#232320",
          padding: 56,
          fontFamily: "Syne, Inter, Arial, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 18% 20%, rgba(224,58,30,0.12) 0%, rgba(224,58,30,0.03) 24%, rgba(249,249,247,0) 55%), linear-gradient(135deg, rgba(242,237,214,0.78) 0%, rgba(249,249,247,0.96) 52%, rgba(232,231,227,0.78) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: 24,
            maxWidth: 760,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
            }}
          >
            <div
              style={{
                width: 92,
                height: 92,
                borderRadius: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f2edd6",
                border: "1px solid rgba(35,35,32,0.08)",
                boxShadow: "0 18px 70px rgba(35,35,32,0.12)",
                padding: 12,
              }}
            >
              <img
                src={logoUrl}
                alt=""
                width="100%"
                height="100%"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: "#6b6b67",
                }}
              >
                {SITE_NAME}
              </div>
              <div
                style={{
                  fontSize: 14,
                  letterSpacing: 1.8,
                  textTransform: "uppercase",
                  color: "#e03a1e",
                }}
              >
                Website first
              </div>
            </div>
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 70,
              lineHeight: 0.95,
              letterSpacing: -2.8,
              fontWeight: 800,
              maxWidth: 700,
            }}
          >
            {SITE_DESCRIPTION}
          </h1>

          <p
            style={{
              margin: 0,
              maxWidth: 640,
              fontSize: 26,
              lineHeight: 1.35,
              color: "#6b6b67",
            }}
          >
            Binff Studio
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
