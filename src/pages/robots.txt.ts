import type { APIRoute } from "astro"
import { MACHINE_CACHE } from "../lib/cache"
import { robotsTxt } from "../lib/crawl"

export const prerender = false

export const GET: APIRoute = () =>
  new Response(robotsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": MACHINE_CACHE,
    },
  })
