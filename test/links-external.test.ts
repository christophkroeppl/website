import { describe, expect, it } from "vitest"
import { externalAttrs } from "../src/links/external"

describe("externalAttrs", () => {
  it("opens http links in a new tab", () => {
    expect(externalAttrs("https://example.com")).toEqual({
      target: "_blank",
      rel: "noopener noreferrer",
    })
  })

  it("leaves mailto, tel and relative links alone", () => {
    expect(externalAttrs("mailto:a@example.com")).toEqual({})
    expect(externalAttrs("tel:+431234")).toEqual({})
    expect(externalAttrs("/links")).toEqual({})
  })
})
