import type { APIRoute } from "astro"
import type { Locale } from "../i18n/locales"
import { llmsIndex } from "../lib/llms"
import { llmsFull } from "../lib/llms-full"

export const prerender = false

const routes: Record<string, { lang: Locale; full: boolean }> = {
  llms: { lang: "de", full: false },
  "llms-full": { lang: "de", full: true },
  "en/llms": { lang: "en", full: false },
  "en/llms-full": { lang: "en", full: true },
}

export const GET: APIRoute = async ({ params }) => {
  const route = routes[params.slug ?? ""]

  if (!route) {
    return new Response("Not Found", {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex",
      },
    })
  }

  const body = route.full ? await llmsFull(route.lang) : llmsIndex(route.lang)

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
