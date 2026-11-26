import { describe, expect, it, vi } from "vitest"

vi.mock("../src/generated/reveals", () => ({
  revealOutlines: {
    contact: {
      viewBox: "0 0 100 100",
      lines: { de: ["M0 0L10 10"], en: ["M0 0L20 20"] },
    },
    empty: {
      viewBox: "0 0 100 100",
      lines: { de: [], en: [] },
    },
  },
}))

import { GET } from "../src/pages/api/reveals/[id]"

function call(id: string | undefined, lang?: string, site?: string) {
  const suffix = lang ? "?lang=" + lang : ""
  const url = new URL("https://example.com/api/reveals/" + (id ?? "") + suffix)
  const request = new Request(url, { headers: site ? { "sec-fetch-site": site } : {} })
  return GET({ request, params: { id } } as never)
}

describe("GET /api/reveals/[id]", () => {
  it("returns an outline", async () => {
    const response = await call("contact", "de")
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ viewBox: "0 0 100 100", lines: ["M0 0L10 10"] })
  })

  it("rejects a foreign origin", async () => {
    expect((await call("contact", "de", "cross-site")).status).toBe(403)
  })

  it("returns 404 for an unknown id", async () => {
    expect((await call("missing", "de")).status).toBe(404)
  })

  it("returns 400 for a missing or invalid locale", async () => {
    expect((await call("contact")).status).toBe(400)
    expect((await call("contact", "fr")).status).toBe(400)
  })

  it("returns 503 for an empty outline", async () => {
    expect((await call("empty", "de")).status).toBe(503)
  })
})
