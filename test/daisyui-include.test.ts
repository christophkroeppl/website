import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

const root = process.cwd()
const componentsDir = join(root, "node_modules/daisyui/components")
const included = new Set(
  readFileSync(join(root, "src/styles/global.css"), "utf8")
    .match(/include:\s*([\s\S]*?);/)?.[1]
    ?.split(",")
    .map((name) => name.trim())
    .filter(Boolean) ?? [],
)

function files(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const pathname = join(dir, entry.name)
    return entry.isDirectory() ? files(pathname) : [pathname]
  })
}

const componentPrefixes: Record<string, string> = {
  button: "btn",
  fileinput: "file-input",
  hover3d: "hover-3d",
  hovergallery: "hover-gallery",
  radialprogress: "radial-progress",
  steps: "step",
  textrotate: "text-rotate",
}

function daisyClasses(): Map<string, string> {
  const classes = new Map<string, string>()
  for (const entry of readdirSync(componentsDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".css")) continue
    const component = entry.name.slice(0, -4)
    const prefix = componentPrefixes[component] ?? component
    const css = readFileSync(join(componentsDir, entry.name), "utf8")
    for (const match of css.matchAll(/\.([a-z][a-z0-9-]*)/g)) {
      const token = match[1]!
      if (token === prefix || token.startsWith(`${prefix}-`)) classes.set(token, component)
    }
  }
  return classes
}

function classTokens(source: string): string[] {
  const tokens: string[] = []
  for (const match of source.matchAll(/class="([^"]*)"/g)) {
    tokens.push(...match[1]!.split(/\s+/))
  }
  for (const match of source.matchAll(/class:list=\{([\s\S]*?)\}/g)) {
    for (const literal of match[1]!.matchAll(/"([^"]*)"|`([^`]*)`/g)) {
      tokens.push(...(literal[1] ?? literal[2] ?? "").split(/\s+/))
    }
  }
  return tokens
}

function rootToken(token: string): string {
  return token.replace(/^[*!]/, "").replace(/^(?:[a-z-]+:)+/, "")
}

describe("daisyUI include list", () => {
  const classes = daisyClasses()

  it("includes every daisyUI class used in Astro markup", () => {
    const missing = new Set<string>()
    for (const file of files(join(root, "src"))) {
      if (!file.endsWith(".astro")) continue
      for (const token of classTokens(readFileSync(file, "utf8"))) {
        const component = classes.get(rootToken(token))
        if (component && !included.has(component)) missing.add(`${file}: ${token} -> ${component}`)
      }
    }
    expect([...missing]).toEqual([])
  })

  it("keeps the daisyUI base needed by the modal", () => {
    for (const name of ["properties", "rootcolor", "rootscrolllock", "rootscrollgutter", "svg"]) {
      expect(included.has(name)).toBe(true)
    }
  })
})
