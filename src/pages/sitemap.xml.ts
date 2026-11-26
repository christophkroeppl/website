import type { APIRoute } from "astro"
import { linksHostPolicy, notFound } from "../links/host"
import { MACHINE_CACHE } from "../lib/cache"
import { sitemapXml } from "../lib/crawl"

export const prerender = false

export const GET: APIRoute = ({ site, url }) => {
  if (linksHostPolicy(url.hostname, url.pathname).kind === "block") return notFound()

  return new Response(sitemapXml(site ?? undefined), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": MACHINE_CACHE,
    },
  })
}
