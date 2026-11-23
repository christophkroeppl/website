import { defineMiddleware } from "astro:middleware"
import { isLinksHost, linksHostRoute } from "./links/host"

function notFound(): Response {
  return new Response("Not Found", {
    status: 404,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "x-robots-tag": "noindex",
    },
  })
}

async function noindex(response: Response | Promise<Response>): Promise<Response> {
  const resolved = await response
  if (!resolved.headers.get("content-type")?.includes("text/html")) return resolved

  const headers = new Headers(resolved.headers)
  headers.set("x-robots-tag", "noindex")

  return new Response(resolved.body, {
    status: resolved.status,
    statusText: resolved.statusText,
    headers,
  })
}

export const onRequest = defineMiddleware((context, next) => {
  const { hostname, pathname } = context.url
  const route = linksHostRoute(hostname, pathname)

  if (route === "block") return notFound()
  if (route === "rewrite") return noindex(next("/links/"))
  if (isLinksHost(hostname)) return noindex(next())

  return next()
})
