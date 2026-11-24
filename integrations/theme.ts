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
