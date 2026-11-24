import type { APIRoute } from "astro"
import { LINKS_HOST } from "../links/host"
import { sitemapXml } from "../lib/crawl"

export const prerender = false

export const GET: APIRoute = ({ site, url }) => {
  if (url.hostname === LINKS_HOST) {
    return new Response("Not Found", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  }

  return new Response(sitemapXml(site ?? undefined), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
