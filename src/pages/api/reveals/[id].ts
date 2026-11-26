import type { APIRoute } from "astro"
import { revealOutlines, type GeneratedReveal } from "../../../generated/reveals"
import { isLocale } from "../../../i18n/locales"
import { MACHINE_CACHE, NO_STORE } from "../../../lib/cache"

function respond(status: number, body?: unknown, cache = NO_STORE) {
  return new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": cache,
    },
  })
}

export const GET: APIRoute = ({ url, params }) => {
  const id = params.id
  const lang = url.searchParams.get("lang")
  const part = url.searchParams.get("part")

  if (!lang || !isLocale(lang)) {
    return respond(400)
  }
  if (part && part !== "label" && part !== "lines") {
    return respond(400)
  }

  const entry = (revealOutlines as Record<string, GeneratedReveal | undefined>)[id ?? ""]
  if (!entry) return respond(404)

  if (part === "label") {
    return respond(200, { viewBox: entry.viewBox, label: entry.labels[lang] }, MACHINE_CACHE)
  }

  const lines = entry.lines[lang]
  if (lines.length === 0) {
    return respond(503)
  }

  return respond(200, { viewBox: entry.viewBox, lines }, MACHINE_CACHE)
}
