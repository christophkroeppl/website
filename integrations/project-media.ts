import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import type { AstroIntegration } from "astro"
import { readThemeTokens, type ThemeTokens } from "./theme"

type ProjectMedia = {
  repo: string
  rev: string
  path: string
  dest: string
}

const assets: ProjectMedia[] = [
  {
    repo: "christophkroeppl/bases-mcp",
    rev: "3442b72bcc5c5512de6e558b3622a9e0fa31f4d5",
    path: "docs/architecture.html",
    dest: "public/generated/projects/bases-mcp.html",
  },
  {
    repo: "christophkroeppl/guarden",
    rev: "ff49d0c3d89fa5b0437c2803dec3ee7e66b5a82a",
    path: "docs/architecture.html",
    dest: "public/generated/projects/guarden.html",
  },
  {
    repo: "christophkroeppl/oc-go-usage-display",
    rev: "8bab88e3183c9941f3f9b34e9ce07ed78d21c046",
    path: "docs/compare/opencode.webp",
    dest: "public/generated/projects/oc-go/opencode.webp",
  },
  {
    repo: "christophkroeppl/oc-go-usage-display",
    rev: "8bab88e3183c9941f3f9b34e9ce07ed78d21c046",
    path: "docs/compare/kilo.webp",
    dest: "public/generated/projects/oc-go/kilo.webp",
  },
]

const STYLE_ID = "project-media-embed"

function buildThemeCss(tokens: ThemeTokens): string {
  const mix = (value: string, percent: number) =>
    `color-mix(in oklab, ${value} ${percent}%, transparent)`
  const category = (name: string, value: string, percent = 16) => `
      --${name}-fill: ${mix(value, percent)} !important;
      --${name}-stroke: ${value} !important;`

  return `
    html[data-theme] {
      color-scheme: light;
      --bg: ${tokens.base100} !important;
      --grid: ${tokens.base200} !important;
      --canvas-dot: ${mix(tokens.baseContent, 14)} !important;
      --text: ${tokens.baseContent} !important;
      --text-muted: ${mix(tokens.baseContent, 70)} !important;
      --text-dim: ${mix(tokens.baseContent, 45)} !important;
      --text-faint: ${mix(tokens.baseContent, 35)} !important;
      --panel: ${mix(tokens.base100, 76)} !important;
      --panel-border: ${tokens.base300} !important;
      --lane-fill: ${mix(tokens.base200, 72)} !important;
      --lane-stroke: ${tokens.base300} !important;
      --arrow: ${mix(tokens.baseContent, 50)} !important;
      --arrow-emphasis: ${tokens.primary} !important;
      --mask: ${tokens.base100} !important;
${category("frontend", tokens.accent)}
${category("backend", tokens.primary)}
${category("database", tokens.secondary)}
${category("cloud", tokens.warning)}
${category("security", tokens.error, 14)}
${category("messagebus", tokens.secondary, 14)}
${category("external", tokens.baseContent)}
    }`
}

function embedDiagram(html: string, tokens: ThemeTokens): string {
  if (!html.includes('class="diagram-container"')) {
    throw new Error("Archify output is missing .diagram-container")
  }

  const clean = html.replace(new RegExp(`<style id="${STYLE_ID}">[\\s\\S]*?</style>\\s*`, "g"), "")
  const style = `<style id="${STYLE_ID}">
    html, body { width: 100%; height: 100%; margin: 0; padding: 0; overflow: hidden; background: transparent; }
${buildThemeCss(tokens)}
    body > *:not(.container) { display: none !important; }
    .container { width: 100% !important; height: 100% !important; max-width: none !important; margin: 0 !important; padding: 0 !important; border: 0 !important; }
    .container > *:not(.diagram-container) { display: none !important; }
    .diagram-container { width: 100% !important; height: 100% !important; margin: 0 !important; padding: 0 !important; border: 0 !important; }
    .diagram-container > svg { display: block; width: 100% !important; height: 100% !important; }
  </style>`

  return clean.includes("</head>")
    ? clean.replace("</head>", `${style}</head>`)
    : `${style}${clean}`
}

export function projectMedia(): AstroIntegration {
  return {
    name: "project-media",
    hooks: {
      "astro:config:setup": async ({ command, config, logger }) => {
        if (command === "sync") return

        const root = fileURLToPath(config.root)
        const theme = readThemeTokens(root)

        for (const media of assets) {
          const url = `https://raw.githubusercontent.com/${media.repo}/${media.rev}/${media.path}`
          const target = path.join(root, media.dest)

          let buffer: Buffer
          try {
            const response = await fetch(url, {
              signal: AbortSignal.timeout(15000),
              headers: { "user-agent": "website-build" },
            })

            if (!response.ok) throw new Error(`HTTP ${response.status}`)

            buffer = Buffer.from(await response.arrayBuffer())
            if (buffer.length === 0) throw new Error("empty response")
          } catch (error) {
            throw new Error(
              `Failed project media ${media.repo}/${media.path}@${media.rev}: ${error instanceof Error ? error.message : String(error)}`,
            )
          }

          const body = media.dest.endsWith(".html")
            ? Buffer.from(embedDiagram(buffer.toString("utf8"), theme))
            : buffer

          fs.mkdirSync(path.dirname(target), { recursive: true })
          fs.writeFileSync(target, body)
          logger.info(`Fetched ${media.repo}/${media.path} (${media.rev})`)
        }
      },
    },
  }
}
