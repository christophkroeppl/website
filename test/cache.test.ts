import { describe, expect, it } from "vitest"
import { HTML_CACHE, applyResponsePolicy } from "../src/lib/cache"

const html = () =>
  new Response("<html></html>", { headers: { "content-type": "text/html; charset=utf-8" } })

describe("applyResponsePolicy", () => {
  it("applies cache and noindex in one pass", () => {
    const response = applyResponsePolicy(html(), { cache: "html", noindex: true })
    expect(response.headers.get("cache-control")).toBe(HTML_CACHE)
    expect(response.headers.get("x-robots-tag")).toBe("noindex")
  })

  it("leaves non-html responses untouched", () => {
    const response = new Response("{}", { headers: { "content-type": "application/json" } })
    expect(applyResponsePolicy(response, { cache: "html", noindex: true })).toBe(response)
  })
})
