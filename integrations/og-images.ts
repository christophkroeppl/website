import fs from "node:fs"
import path from "node:path"
import { Resvg } from "@resvg/resvg-js"
import satori, { type FontWeight } from "satori"
import sharp from "sharp"
import type { AstroIntegration } from "astro"
import { og, person } from "../src/content/site"
import { buildContext, emitGenerated } from "./build"
import { locales, type Locale } from "../src/i18n/config"
import { parseFrontmatter } from "../src/lib/frontmatter"
import { ogImagePaths } from "../src/lib/og-image"
import { siteUrl } from "../src/content/site"
import { readThemeTokens, type ThemeTokens } from "./theme"

const WIDTH = 1200
const HEIGHT = 630
const PORTRAIT_SIZE = 300
const TITLE_WIDTH = 700
const FONT_DIR = "src/assets/fonts"
const PORTRAIT_FILE = "src/assets/bullet.webp"

const OUTPUTS = Object.fromEntries(
  Object.entries(ogImagePaths).map(([lang, path]) => [lang, `public${path}`]),
) as Record<Locale, string>

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

function readHomeTitle(root: string, lang: Locale): string {
  const raw = fs.readFileSync(path.join(root, "src/content/pages/home", `${lang}.md`), "utf8")
  const title = parseFrontmatter(raw).title
  if (typeof title !== "string" || !title) throw new Error("missing home title")
  return title
}

export function palette(tokens: ThemeTokens) {
  return {
    base: tokens.base100,
    ink: tokens.baseContent,
    inkMuted: `${tokens.baseContent} / 45%`,
    primary: tokens.primary,
    primaryRule: `${tokens.primary} / 85%`,
    primaryRing: `${tokens.primary} / 22%`,
    primaryGlow: `${tokens.primary} / 13%`,
    primaryClear: `${tokens.primary} / 0%`,
    secondary: tokens.secondary,
    accent: tokens.accent,
    accentGlow: `${tokens.accent} / 11%`,
    accentClear: `${tokens.accent} / 0%`,
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

function satoriReady(colors: Palette): Palette {
  return Object.fromEntries(
    Object.entries(colors).map(([key, value]) => [
      key,
      value.replace(/\) \/ ([\d.]+%)$/, " / $1)"),
    ]),
  ) as Palette
}

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
      "astro:config:setup": async ({ command, config }) => {
        const { root } = buildContext(config.root, command)
        const colors = satoriReady(palette(readThemeTokens(root)))
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
            title: readHomeTitle(root, lang),
            subtitle: og.subtitle[lang],
            domain: new URL(siteUrl).host,
            portrait,
            colors,
            fonts,
          })
          emitGenerated(root, OUTPUTS[lang], png)
        }
      },
    },
  }
}
