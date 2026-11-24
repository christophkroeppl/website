import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { Resvg } from "@resvg/resvg-js"
import satori, { type FontWeight } from "satori"
import sharp from "sharp"
import type { AstroIntegration } from "astro"
import { home, og, person } from "../src/content/site"
import { locales, type Locale } from "../src/i18n/locales"
import { siteUrl } from "../src/lib/seo"
import { readThemeTokens, type ThemeTokens } from "./theme"

const WIDTH = 1200
const HEIGHT = 630
const PORTRAIT_SIZE = 300
const TITLE_WIDTH = 700
const FONT_DIR = "src/assets/fonts"
const PORTRAIT_FILE = "src/assets/bullet.webp"

const OUTPUTS = {
  de: "public/og.png",
  en: "public/og-en.png",
} satisfies Record<Locale, string>

type Style = Record<string, string | number>
type Node = { type: string; props: Record<string, unknown> }

const node = (type: string, style: Style, children?: unknown): Node => ({
  type,
  props: { style, children },
})

const image = (src: string, size: number, style: Style): Node => ({
  type: "img",
  props: { src, width: size, height: size, style },
})

function oklch(value: string): [number, number, number] {
  const match = /oklch\(\s*([\d.]+)(%)?\s+([\d.]+)\s+([\d.]+)\s*\)/.exec(value)
  if (!match) throw new Error(`Unsupported color in the active daisyUI theme: ${value}`)

  const lightnessValue = match[1]
  const chromaValue = match[3]
  const hueValue = match[4]
  if (!lightnessValue || !chromaValue || !hueValue)
    throw new Error(`Unsupported color in the active daisyUI theme: ${value}`)
  const lightness = Number(lightnessValue) / (match[2] ? 100 : 1)
  const chroma = Number(chromaValue)
  const hue = (Number(hueValue) * Math.PI) / 180
  const a = chroma * Math.cos(hue)
  const b = chroma * Math.sin(hue)

  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3

  const linear = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]

  return linear.map((channel) => {
    const clamped = Math.max(0, Math.min(1, channel))
    const gamma = clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * clamped ** (1 / 2.4) - 0.055
    return Math.round(gamma * 255)
  }) as [number, number, number]
}

function rgb(value: string, alpha = 1): string {
  const [red, green, blue] = oklch(value)
  return alpha === 1
    ? `rgb(${red}, ${green}, ${blue})`
    : `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

function palette(tokens: ThemeTokens) {
  return {
    base: rgb(tokens.base100),
    ink: rgb(tokens.baseContent),
    inkMuted: rgb(tokens.baseContent, 0.45),
    primary: rgb(tokens.primary),
    primaryRule: rgb(tokens.primary, 0.85),
    primaryRing: rgb(tokens.primary, 0.22),
    primaryGlow: rgb(tokens.primary, 0.13),
    primaryClear: rgb(tokens.primary, 0),
    secondary: rgb(tokens.secondary),
    accent: rgb(tokens.accent),
    accentGlow: rgb(tokens.accent, 0.11),
    accentClear: rgb(tokens.accent, 0),
  }
}

function font(root: string, file: string, name: string, weight: FontWeight) {
  return {
    name,
    data: fs.readFileSync(path.join(root, FONT_DIR, file)),
    weight,
    style: "normal" as const,
  }
}

type Palette = ReturnType<typeof palette>

type CardOptions = {
  title: string
  subtitle: string
  domain: string
  portrait: string
  colors: Palette
}

function card({ title, subtitle, domain, portrait, colors }: CardOptions): Node {
  return node(
    "div",
    {
      width: WIDTH,
      height: HEIGHT,
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      padding: "76px 80px 66px",
      position: "relative",
      backgroundColor: colors.base,
      backgroundImage: `radial-gradient(56rem 32rem at 4% -14%, ${colors.primaryGlow}, ${colors.primaryClear} 68%), radial-gradient(48rem 28rem at 98% -8%, ${colors.accentGlow}, ${colors.accentClear} 66%)`,
      color: colors.ink,
      fontFamily: "Inter",
    },
    [
      node(
        "div",
        {
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontFamily: "Geist Mono",
          fontSize: 15,
          fontWeight: 500,
          letterSpacing: "0.34em",
          textTransform: "uppercase",
          color: colors.accent,
        },
        [
          node("div", {
            width: 28,
            height: 2,
            borderRadius: 9999,
            backgroundColor: colors.secondary,
          }),
          node("div", { display: "flex" }, person.name),
        ],
      ),
      node("div", {
        marginTop: 26,
        width: "100%",
        height: 2,
        backgroundColor: colors.primaryRule,
      }),
      node(
        "div",
        {
          marginTop: 60,
          width: TITLE_WIDTH,
          fontSize: 80,
          fontWeight: 600,
          lineHeight: 1.04,
          letterSpacing: "-0.045em",
        },
        title,
      ),
      image(portrait, PORTRAIT_SIZE, {
        position: "absolute",
        top: 152,
        left: WIDTH - 80 - PORTRAIT_SIZE,
        borderRadius: 9999,
        objectFit: "cover",
        boxShadow: `0 0 0 3px ${colors.primaryRing}`,
      }),
      node("div", { flexGrow: 1 }),
      node("div", { display: "flex", flexDirection: "column" }, [
        node(
          "div",
          {
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 27,
            fontWeight: 500,
            letterSpacing: "-0.01em",
            color: colors.primary,
          },
          [
            node("div", {
              width: 3,
              height: 30,
              borderRadius: 9999,
              backgroundColor: colors.secondary,
            }),
            node("div", { display: "flex" }, subtitle),
          ],
        ),
        node(
          "div",
          {
            marginTop: 14,
            paddingLeft: 19,
            fontFamily: "Geist Mono",
            fontSize: 20,
            letterSpacing: "0.02em",
            color: colors.inkMuted,
          },
          domain,
        ),
      ]),
    ],
  )
}

async function render(
  options: CardOptions & { fonts: ReturnType<typeof font>[] },
): Promise<Buffer> {
  const { fonts, ...cardOptions } = options
  const svg = await satori(card(cardOptions), {
    width: WIDTH,
    height: HEIGHT,
    fonts,
  })
  return new Resvg(svg).render().asPng()
}

export function ogImages(): AstroIntegration {
  return {
    name: "og-images",
    hooks: {
      "astro:config:setup": async ({ config }) => {
        const root = fileURLToPath(config.root)
        const colors = palette(readThemeTokens(root))
        const fonts = [
          font(root, "inter-latin-500.woff2", "Inter", 500),
          font(root, "inter-latin-600.woff2", "Inter", 600),
          font(root, "geist-mono-latin-500.woff2", "Geist Mono", 500),
        ]
        const portrait = `data:image/png;base64,${(
          await sharp(fs.readFileSync(path.join(root, PORTRAIT_FILE)))
            .png()
            .toBuffer()
        ).toString("base64")}`

        for (const lang of locales) {
          const png = await render({
            title: home.title[lang],
            subtitle: og.subtitle[lang],
            domain: new URL(siteUrl).host,
            portrait,
            colors,
            fonts,
          })
          fs.writeFileSync(path.join(root, OUTPUTS[lang]), png)
        }
      },
    },
  }
}
