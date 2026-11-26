import { describe, expect, it, vi } from "vitest"

vi.mock("astro:middleware", () => ({ defineMiddleware: (fn: unknown) => fn }))

import { onRequest as middleware } from "../src/middleware"

const onRequest = middleware as unknown as (
  context: never,
  next: () => Response | Promise<Response>,
) => Promise<Response>

const html = () =>
  new Response("<!doctype html><html></html>", {
    headers: { "content-type": "text/html; charset=utf-8" },
  })

function context(url: string, method = "GET") {
  return { url: new URL(url), request: new Request(url, { method }) } as never
}

describe("onRequest", () => {
  it("blocks content twins on the links host", async () => {
    const next = vi.fn(html)
    const response = await onRequest(context("https://links.kroeppl.ch/projekte.md"), next)
    expect(response.status).toBe(404)
    expect(response.headers.get("x-robots-tag")).toBe("noindex")
    expect(next).not.toHaveBeenCalled()
  })

  it("rewrites the links host root and marks it noindex", async () => {
    const next = vi.fn(html)
    const response = await onRequest(context("https://links.kroeppl.ch/"), next)
    expect(next).toHaveBeenCalledWith("/links/")
    expect(response.headers.get("x-robots-tag")).toBe("noindex")
    expect(response.headers.get("cache-control")).toContain("s-maxage=3600")
  })

  it("passes the links page through with noindex and cache", async () => {
    const next = vi.fn(html)
    const response = await onRequest(context("https://links.kroeppl.ch/links/"), next)
    expect(next).toHaveBeenCalled()
    expect(response.headers.get("x-robots-tag")).toBe("noindex")
    expect(response.headers.get("cache-control")).toContain("s-maxage=3600")
  })

  it("caches HTML on the main host", async () => {
    const next = vi.fn(html)
    const response = await onRequest(context("https://kroeppl.ch/"), next)
    expect(response.headers.get("cache-control")).toContain("s-maxage=3600")
  })

  it("leaves non-HTML responses untouched", async () => {
    const next = vi.fn(
      async () => new Response("{}", { headers: { "content-type": "application/json" } }),
    )
    const response = await onRequest(context("https://kroeppl.ch/api/x"), next)
    expect(response.headers.get("cache-control")).toBeNull()
  })

  it("does not cache HEAD responses", async () => {
    const next = vi.fn(html)
    const response = await onRequest(context("https://kroeppl.ch/", "HEAD"), next)
    expect(response.headers.get("cache-control")).toBeNull()
  })
})
