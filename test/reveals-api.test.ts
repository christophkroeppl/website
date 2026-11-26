import { describe, expect, it, vi } from "vitest"
import { MACHINE_CACHE, NO_STORE } from "../src/lib/cache"

vi.mock("../src/generated/reveals", () => ({
  revealOutlines: {
    contact: {
      viewBox: { top: 0, height: 100, units: 100 },
      labels: {
        de: { d: "M0 0", width: 10 },
        en: { d: "M0 0", width: 20 },
      },
      lines: { de: ["M0 0L10 10"], en: ["M0 0L20 20"] },
    },
    empty: {
      viewBox: { top: 0, height: 100, units: 100 },
      labels: {
        de: { d: "M0 0", width: 10 },
        en: { d: "M0 0", width: 20 },
      },
      lines: { de: [], en: [] },
    },
  },
}))

import { GET } from "../src/pages/api/reveals/[id]"

function call(id: string | undefined, lang?: string, part?: string) {
  const search = new URLSearchParams()
  if (lang) search.set("lang", lang)
  if (part) search.set("part", part)
  const url = new URL("https://example.com/api/reveals/" + (id ?? "") + "?" + search)
  return GET({ request: new Request(url), url: new URL(url), params: { id } } as never)
}

describe("GET /api/reveals/[id]", () => {
  it("returns a cacheable outline", async () => {
    const response = await call("contact", "de")
    expect(response.status).toBe(200)
    expect(response.headers.get("cache-control")).toBe(MACHINE_CACHE)
    expect(await response.json()).toEqual({
      viewBox: { top: 0, height: 100, units: 100 },
      lines: ["M0 0L10 10"],
    })

    const explicit = await call("contact", "de", "lines")
    expect(explicit.status).toBe(200)
    expect(await explicit.json()).toEqual({
      viewBox: { top: 0, height: 100, units: 100 },
      lines: ["M0 0L10 10"],
    })
  })

  it("returns a cacheable label", async () => {
    const response = await call("contact", "de", "label")
    expect(response.status).toBe(200)
    expect(response.headers.get("cache-control")).toBe(MACHINE_CACHE)
    expect(await response.json()).toEqual({
      viewBox: { top: 0, height: 100, units: 100 },
      label: { d: "M0 0", width: 10 },
    })
  })

  it("returns 400 for an unknown part", async () => {
    const response = await call("contact", "de", "nope")
    expect(response.status).toBe(400)
    expect(response.headers.get("cache-control")).toBe(NO_STORE)
  })

  it("returns 404 for an unknown id", async () => {
    const response = await call("missing", "de")
    expect(response.status).toBe(404)
    expect(response.headers.get("cache-control")).toBe(NO_STORE)
  })

  it("returns 400 for a missing or invalid locale", async () => {
    const missing = await call("contact")
    expect(missing.status).toBe(400)
    expect(missing.headers.get("cache-control")).toBe(NO_STORE)

    const invalid = await call("contact", "fr")
    expect(invalid.status).toBe(400)
    expect(invalid.headers.get("cache-control")).toBe(NO_STORE)
  })

  it("returns 503 for an empty outline", async () => {
    const response = await call("empty", "de")
    expect(response.status).toBe(503)
    expect(response.headers.get("cache-control")).toBe(NO_STORE)
  })
})
