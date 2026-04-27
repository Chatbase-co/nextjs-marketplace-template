import fs from "node:fs/promises"
import path from "node:path"

import type { AnalyticsEvent } from "@/lib/analytics/types"

function getAnalyticsStoragePath() {
  return (
    process.env.ANALYTICS_STORAGE_PATH?.trim() ||
    (process.env.NODE_ENV === "production"
      ? "/tmp/binff-analytics/events.jsonl"
      : path.join(process.cwd(), ".data", "analytics", "events.jsonl"))
  )
}

async function ensureDirectory(filePath: string) {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
}

export async function appendAnalyticsEvent(event: AnalyticsEvent) {
  const filePath = getAnalyticsStoragePath()
  await ensureDirectory(filePath)
  await fs.appendFile(filePath, `${JSON.stringify(event)}\n`, "utf8")
}

export async function readAnalyticsEvents(monthKey?: string) {
  const filePath = getAnalyticsStoragePath()

  try {
    const raw = await fs.readFile(filePath, "utf8")
    const lines = raw.split("\n").filter(Boolean)
    const events = lines
      .map((line) => {
        try {
          return JSON.parse(line) as AnalyticsEvent
        } catch {
          return null
        }
      })
      .filter((event): event is AnalyticsEvent => event !== null)

    if (!monthKey) {
      return events
    }

    return events.filter((event) => event.createdAt.startsWith(`${monthKey}-`))
  } catch {
    return []
  }
}

