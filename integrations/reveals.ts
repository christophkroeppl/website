import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { loadEnv } from "vite"
import opentype from "opentype.js"
import type { AstroIntegration } from "astro"
import { locales, type Locale } from "../src/i18n/config"
import { useTranslations } from "../src/i18n/ui"
import { reveals } from "../src/reveals/registry"
import { fontViewBox, outline, type Font, type Outline } from "./outline"

const FONT_FILE = "src/assets/fonts/inter-latin-400.woff"
const OUTPUT_FILE = "src/generated/reveals.ts"

function loadFont(root: string): Font {
  const buffer = fs.readFileSync(path.join(root, FONT_FILE))
  return opentype.parse(
    buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer,
  )
}

type GeneratedReveal = {
  viewBox: ReturnType<typeof fontViewBox>
  labels: Record<Locale, Outline>
  lines: Record<Locale, Outline[]>
}

function byLocale<T>(build: (lang: Locale) => T): Record<Locale, T> {
  return Object.fromEntries(locales.map((lang) => [lang, build(lang)])) as Record<Locale, T>
}

export function generateReveals(root: URL, mode: string) {
  const dir = fileURLToPath(root.href)
  const font = loadFont(dir)
  const env = loadEnv(mode, dir, "")
  const viewBox = fontViewBox(font)

  const generated = Object.fromEntries(
    Object.entries(reveals).map(([id, revealable]) => {
      const labels = byLocale((lang) => outline(font, useTranslations(lang)(revealable.label)))
      const lines = byLocale((lang) =>
        revealable.lines(env, lang).map((text) => outline(font, text)),
      )
      return [id, { viewBox, labels, lines } satisfies GeneratedReveal]
    }),
  )

  const source = [
    `import type { Locale } from "../i18n/locales"`,
    `import type { RevealId } from "../reveals/registry"`,
    ``,
    `export type Outline = { d: string; width: number }`,
    ``,
    `export type ViewBox = { top: number; height: number; units: number }`,
    ``,
    `export type GeneratedReveal = {`,
    `  viewBox: ViewBox`,
    `  labels: Record<Locale, Outline>`,
    `  lines: Record<Locale, Outline[]>`,
    `}`,
    ``,
    `export const revealOutlines: Record<RevealId, GeneratedReveal> = ${JSON.stringify(generated, null, 2)}`,
    ``,
  ].join("\n")

  fs.mkdirSync(path.dirname(path.join(dir, OUTPUT_FILE)), { recursive: true })
  fs.writeFileSync(path.join(dir, OUTPUT_FILE), source)
}

export function revealOutlines(): AstroIntegration {
  return {
    name: "reveal-outlines",
    hooks: {
      "astro:config:setup": ({ command, config }) => {
        generateReveals(config.root, command === "build" ? "production" : "development")
      },
    },
  }
}
