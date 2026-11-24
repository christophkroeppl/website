import type { APIRoute } from "astro"
import { robotsTxt } from "../lib/crawl"

export const prerender = false

export const GET: APIRoute = ({ site }) =>
  new Response(robotsTxt(site ?? undefined), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
