import type { APIRoute } from "astro"
import { localeMeta, locales, type Locale } from "../i18n/locales"
import { MACHINE_CACHE, NO_STORE } from "../lib/cache"
import { descriptionsFor } from "../lib/content"
import { llmsFull, llmsIndex } from "../lib/llms"
import { otherLocale } from "../lib/seo"

export const prerender = false

const routes = Object.fromEntries(
  locales.flatMap((lang) => {
    const prefix = localeMeta[lang].prefix.replace(/^\//, "")
    const slug = (name: string) => (prefix ? `${prefix}/${name}` : name)
    return [
      [slug("llms"), { lang, full: false }],
      [slug("llms-full"), { lang, full: true }],
    ] as const
  }),
) as Record<string, { lang: Locale; full: boolean }>

export const GET: APIRoute = async ({ params }) => {
  const route = routes[params.slug ?? ""]

  if (!route) {
    return new Response("Not Found", {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": NO_STORE,
        "X-Robots-Tag": "noindex",
      },
    })
  }

  if (route.full) {
    return new Response(await llmsFull(route.lang), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": MACHINE_CACHE,
      },
    })
  }

  const descriptions = await descriptionsFor(route.lang)
  const otherDescriptions = await descriptionsFor(otherLocale(route.lang))
  const body = llmsIndex(route.lang, descriptions, otherDescriptions)

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": MACHINE_CACHE,
    },
  })
}
