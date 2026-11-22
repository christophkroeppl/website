import type { APIRoute } from "astro"
import { revealOutlines, type GeneratedReveal } from "../../../generated/reveals"
import type { Locale } from "../../../i18n/ui"

const LOCALES: Locale[] = ["de", "en"]

function respond(status: number, body?: unknown) {
  return new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  })
}

export const GET: APIRoute = ({ request, params }) => {
  const site = request.headers.get("sec-fetch-site")
  if (site && site !== "same-origin") {
    return respond(403)
  }

  const id = params.id
  if (!id || !Object.hasOwn(revealOutlines, id)) {
    return respond(404)
  }

  const lang = new URL(request.url).searchParams.get("lang")
  if (!lang || !LOCALES.includes(lang as Locale)) {
    return respond(400)
  }

  const entry: GeneratedReveal = (revealOutlines as Record<string, GeneratedReveal>)[id]
  const lines = entry.lines[lang as Locale]
  if (lines.length === 0) {
    return respond(503)
  }

  return respond(200, { viewBox: entry.viewBox, lines })
}
