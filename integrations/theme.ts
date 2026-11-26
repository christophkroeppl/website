import fs from "node:fs"
import path from "node:path"

export type ThemeTokens = {
  base100: string
  base200: string
  base300: string
  baseContent: string
  primary: string
  secondary: string
  accent: string
  warning: string
  error: string
}

export function rgbFromOklch(value: string, alpha = 1): string {
  const match = /^oklch\(\s*([\d.]+)(%)?\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*[\d.]+)?\s*\)$/.exec(
    value.trim(),
  )
  if (!match) throw new Error(`Unsupported color syntax for rgbFromOklch: ${value}`)
  const lightness = Number(match[1]) / (match[2] ? 100 : 1)
  const chroma = Number(match[3])
  const hue = (Number(match[4]) * Math.PI) / 180
  const a = chroma * Math.cos(hue)
  const b = chroma * Math.sin(hue)
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3
  const linear = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((channel) => {
    const clamped = Math.max(0, Math.min(1, channel))
    return clamped <= 0.0031308
      ? Math.round(clamped * 12.92 * 255)
      : Math.round((1.055 * clamped ** (1 / 2.4) - 0.055) * 255)
  })
  const [red, green, blue] = linear
  return alpha === 1
    ? `rgb(${red}, ${green}, ${blue})`
    : `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

export function themeMix(value: string, percent: number): string {
  return `color-mix(in oklab, ${value} ${percent}%, transparent)`
}

export function readThemeTokens(root: string): ThemeTokens {
  const css = fs.readFileSync(path.join(root, "src/styles/global.css"), "utf8")
  const blocks = [...css.matchAll(/@plugin\s+"daisyui\/theme"\s*\{([\s\S]*?)\n\}/g)]
  const block =
    blocks.find((match) => /default:\s*true/.test(match[1] ?? ""))?.[1] ?? blocks[0]?.[1]

  if (!block) throw new Error('No @plugin "daisyui/theme" block found in src/styles/global.css')

  const values = new Map<string, string>()
  for (const match of block.matchAll(/--color-([a-z0-9-]+):\s*([^;]+);/g)) {
    const name = match[1]
    const value = match[2]
    if (name && value) values.set(name, value.trim())
  }

  const get = (name: string) => {
    const value = values.get(name)
    if (!value) throw new Error(`Missing --color-${name} in the active daisyUI theme`)
    return value
  }

  return {
    base100: get("base-100"),
    base200: get("base-200"),
    base300: get("base-300"),
    baseContent: get("base-content"),
    primary: get("primary"),
    secondary: get("secondary"),
    accent: get("accent"),
    warning: get("warning"),
    error: get("error"),
  }
}

export type ResolvedTheme = ThemeTokens & {
  rgb: (value: string, alpha?: number) => string
  mix: (value: string, percent: number) => string
}

export function resolveTheme(root: string): ResolvedTheme {
  const tokens = readThemeTokens(root)
  return { ...tokens, rgb: rgbFromOklch, mix: themeMix }
}
