import { defineMiddleware } from "astro:middleware"
import { linksHostPolicy, notFound } from "./links/host"

async function htmlHeaders(
  response: Response | Promise<Response>,
  set: (headers: Headers) => void,
): Promise<Response> {
  const resolved = await response
  if (!resolved.headers.get("content-type")?.includes("text/html")) return resolved

  const headers = new Headers(resolved.headers)
  set(headers)

  return new Response(resolved.body, {
    status: resolved.status,
    statusText: resolved.statusText,
    headers,
  })
}

function noindex(response: Response | Promise<Response>): Promise<Response> {
  return htmlHeaders(response, (headers) => headers.set("x-robots-tag", "noindex"))
}

async function cache(response: Response | Promise<Response>, method: string): Promise<Response> {
  const resolved = await response
  if (method !== "GET" || resolved.status !== 200) return resolved

  return htmlHeaders(resolved, (headers) =>
    headers.set("cache-control", "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400"),
  )
}

export const onRequest = defineMiddleware((context, next) => {
  const { hostname, pathname } = context.url
  const policy = linksHostPolicy(hostname, pathname)

  if (policy.kind === "block") return notFound()
  if (policy.kind === "rewrite") {
    return cache(noindex(next(policy.target)), context.request.method)
  }
  if (policy.noindex) return cache(noindex(next()), context.request.method)

  return cache(next(), context.request.method)
})
