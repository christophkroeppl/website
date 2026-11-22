declare module "opentype.js" {
  export interface Path {
    toPathData(decimalPlaces?: number): string
  }

  export interface Glyph {
    index: number
    advanceWidth: number
    getPath(x: number, y: number, fontSize: number): Path
  }

  export interface Font {
    unitsPerEm: number
    ascender: number
    descender: number
    charToGlyph(char: string): Glyph
  }

  export function parse(buffer: ArrayBuffer): Font

  const opentype: { parse: typeof parse }
  export default opentype
}
