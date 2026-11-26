import { describe, expect, it } from "vitest"
import { FILE_EXTENSION, hasAssetExtension } from "../src/links/extensions"

describe("link path extensions", () => {
  it("shares asset detection with the links host", () => {
    expect(hasAssetExtension("/_astro/BaseLayout.css")).toBe(true)
    expect(hasAssetExtension("/llms.txt")).toBe(false)
    expect(hasAssetExtension("/projekte.md")).toBe(false)
  })

  it("keeps slash detection for file-like URLs", () => {
    expect(FILE_EXTENSION.test("llms.txt")).toBe(true)
    expect(FILE_EXTENSION.test("projekte")).toBe(false)
  })
})
