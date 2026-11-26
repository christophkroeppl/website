import { describe, expect, it } from "vitest"
import { rgbFromOklch, themeMix } from "../integrations/theme"

describe("rgbFromOklch", () => {
  it("converts the same token satori accepts", () => {
    expect(rgbFromOklch("oklch(0.65 0.2 250)")).toBe("rgb(0, 145, 255)")
  })

  it("supports percentage lightness and alpha", () => {
    expect(rgbFromOklch("oklch(65% 0.2 250 / 0.45)", 0.45)).toBe("rgba(0, 145, 255, 0.45)")
  })

  it("rejects unsupported syntax", () => {
    expect(() => rgbFromOklch("#fff")).toThrow(/Unsupported color syntax/)
  })
})

describe("themeMix", () => {
  it("emits an oklab mix", () => {
    expect(themeMix("oklch(1 0 0)", 16)).toBe("color-mix(in oklab, oklch(1 0 0) 16%, transparent)")
  })
})
