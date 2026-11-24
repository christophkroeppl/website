import { describe, expect, it } from "vitest"
import { absoluteUrl } from "../src/lib/urls"
import { siteUrl } from "../src/lib/seo"

describe("absoluteUrl", () => {
  it("resolves paths against the production origin", () => {
    expect(absoluteUrl("/projekte/")).toBe(`${siteUrl}/projekte/`)
    expect(absoluteUrl("/", "https://example.com")).toBe("https://example.com/")
  })
})
