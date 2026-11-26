import type { APIRoute } from "astro"
import { linksHostPolicy, notFound } from "../links/host"
import { MACHINE_CACHE } from "../lib/cache"
import { sitemapBody } from "../lib/crawl"

export const prerender = false

export const GET: APIRoute = ({ url }) => {
  if (linksHostPolicy(url.hostname, url.pathname).kind === "block") return notFound()

  return new Response(sitemapBody(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": MACHINE_CACHE,
    },
  })
}
