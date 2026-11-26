import fs from "node:fs"
import path from "node:path"
import opentype from "opentype.js"
import type { AstroIntegration } from "astro"
import { locales, type Locale } from "../src/i18n/config"
import { useTranslations } from "../src/i18n/ui"
import { reveals } from "../src/reveals/registry"
import { buildContext, emitGenerated, type BuildContext } from "./build"
import { loadBuildEnv } from "./build-env"
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

export function generateReveals(ctx: BuildContext, env: Record<string, string>) {
  const font = loadFont(ctx.root)
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

  emitGenerated(ctx.root, OUTPUT_FILE, source)
}

export function revealOutlines(): AstroIntegration {
  return {
    name: "reveal-outlines",
    hooks: {
      "astro:config:setup": ({ command, config }) => {
        const ctx = buildContext(config.root, command)
        generateReveals(ctx, loadBuildEnv(ctx.mode, ctx.root))
      },
    },
  }
}
