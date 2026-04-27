import { readFile } from "node:fs/promises"
import { join } from "node:path"

export const runtime = "nodejs"

export async function GET() {
  const svg = await readFile(join(process.cwd(), "public/logos/binff_logo_vermillion.svg"), "utf8")

  return new Response(svg, {
    headers: {
      "content-type": "image/svg+xml",
      "cache-control": "public, max-age=31536000, immutable",
    },
  })
}
