import opentype from "opentype.js"

export type Outline = { d: string; width: number }
export type ViewBox = { top: number; height: number; units: number }
export type Font = ReturnType<typeof opentype.parse>

const UNITS = 100

export function outline(font: Font, text: string): Outline {
  const scale = UNITS / font.unitsPerEm
  let x = 0
  const segments: string[] = []
  for (const char of text) {
    const glyph = font.charToGlyph(char)
    if (!glyph || glyph.index === 0) {
      throw new Error(`outline: no glyph for "${char}" in the bundled font`)
    }
    const segment = glyph.getPath(x, 0, UNITS).toPathData(1)
    if (segment) segments.push(segment)
    x += glyph.advanceWidth * scale
  }
  return { d: segments.join(" "), width: Number(x.toFixed(2)) }
}

export function fontViewBox(font: Font): ViewBox {
  const scale = UNITS / font.unitsPerEm
  return {
    top: Number((-font.ascender * scale).toFixed(2)),
    height: Number(((font.ascender - font.descender) * scale).toFixed(2)),
    units: UNITS,
  }
}
