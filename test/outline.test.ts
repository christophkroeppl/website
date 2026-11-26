import { readFileSync } from "node:fs"
import { join } from "node:path"
import opentype from "opentype.js"
import { describe, expect, it } from "vitest"
import { fontViewBox, outline, type Font } from "../integrations/outline"
import { revealOutlines } from "../src/generated/reveals"

const buffer = readFileSync(join(process.cwd(), "src/assets/fonts/inter-latin-400.woff"))
const font = opentype.parse(
  buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer,
) as Font & {
  getPath(text: string, x: number, y: number, fontSize: number): unknown
}

describe("opentype reveal outlines", () => {
  it("reads the pinned font metrics", () => {
    expect(font.unitsPerEm).toBe(2048)
    expect(font.ascender).toBe(1984)
    expect(font.descender).toBe(-494)
  })

  it("scales the view box to 100 units", () => {
    expect(fontViewBox(font)).toEqual({ top: -96.88, height: 121, units: 100 })
  })

  it("walks glyphs into a path", () => {
    const result = outline(font, "AV Wien")
    expect(result.width).toBe(406.25)
    expect(result.d.startsWith("M")).toBe(true)
    expect(result.d.split("M").filter(Boolean)).toHaveLength(9)
  })

  it("returns an empty path for empty text", () => {
    expect(outline(font, "")).toEqual({ d: "", width: 0 })
  })

  it("rejects characters the bundled Latin font cannot draw", () => {
    expect(() => outline(font, "😀")).toThrow(/no glyph/)
  })

  it("pins the opentype.js substitution failure", () => {
    expect(() => font.getPath("AV Wien", 0, 0, 100)).toThrow(/substitutionType/)
  })

  it("keeps the generated reveal outlines", () => {
    expect(revealOutlines.contact.labels.de.d.startsWith("M")).toBe(true)
    expect(revealOutlines.contact.lines.en.length).toBeGreaterThan(0)
  })
})
