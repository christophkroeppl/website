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

export const GET: APIRoute = ({ request, params }) => {
  const id = params.id
  if (!id || !Object.hasOwn(revealOutlines, id)) {
    return respond(404)
  }

  const lang = new URL(request.url).searchParams.get("lang")
  if (!lang || !isLocale(lang)) {
    return respond(400)
  }

  const entry = (revealOutlines as Record<string, GeneratedReveal | undefined>)[id]
  if (!entry) return respond(404)
  const lines = entry.lines[lang]
  if (lines.length === 0) {
    return respond(503)
  }

  return respond(200, { viewBox: entry.viewBox, lines }, MACHINE_CACHE)
}
