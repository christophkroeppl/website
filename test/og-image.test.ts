import { describe, expect, it } from "vitest"
import { ogImagePath, ogImagePaths } from "../src/lib/og-image"

describe("ogImagePath", () => {
  it("owns the localized image paths", () => {
    expect(ogImagePath("de")).toBe("/og.png")
    expect(ogImagePath("en")).toBe("/og-en.png")
    expect(Object.keys(ogImagePaths)).toEqual(["de", "en"])
  })
})
