import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import type { AstroIntegration } from "astro"

type ProjectMedia = {
  repo: string
  branch?: "main" | "develop"
  path: string
  dest: string
}

type ThemeTokens = {
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

const assets: ProjectMedia[] = [
  {
    repo: "christophkroeppl/bases-mcp",
    path: "docs/architecture.html",
    dest: "public/generated/projects/bases-mcp.html",
  },
  {
    repo: "christophkroeppl/guarden",
    branch: "develop",
    path: "docs/architecture.html",
    dest: "public/generated/projects/guarden.html",
  },
  {
    repo: "christophkroeppl/oc-go-usage-display",
    path: "docs/compare/opencode.webp",
    dest: "public/generated/projects/oc-go/opencode.webp",
  },
  {
    repo: "christophkroeppl/oc-go-usage-display",
    path: "docs/compare/kilo.webp",
    dest: "public/generated/projects/oc-go/kilo.webp",
  },
]

const STYLE_ID = "project-media-embed"

function readThemeTokens(root: string): ThemeTokens {
  const css = fs.readFileSync(path.join(root, "src/styles/global.css"), "utf8")
  const blocks = [...css.matchAll(/@plugin\s+"daisyui\/theme"\s*\{([\s\S]*?)\n\}/g)]
  const block = blocks.find((match) => /default:\s*true/.test(match[1]))?.[1] ?? blocks[0]?.[1]

  if (!block) throw new Error('No @plugin "daisyui/theme" block found in src/styles/global.css')

  const values = new Map(
    [...block.matchAll(/--color-([a-z0-9-]+):\s*([^;]+);/g)].map((match) => [
      match[1],
      match[2].trim(),
    ]),
  )

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

async function branchExists(repo: string, branch: string): Promise<boolean | undefined> {
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/branches/${branch}`, {
      headers: {
        accept: "application/vnd.github+json",
        "user-agent": "website-build",
      },
    })

    if (response.ok) return true
    if (response.status === 404) return false
    return undefined
  } catch {
    return undefined
  }
}

async function resolveBranch(media: ProjectMedia): Promise<"main" | "develop"> {
  if (media.branch) return media.branch

  const hasMain = await branchExists(media.repo, "main")
  if (hasMain === false) return "develop"
  return "main"
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
          const branch = await resolveBranch(media)
          const url = `https://raw.githubusercontent.com/${media.repo}/${branch}/${media.path}`
          const target = path.join(root, media.dest)

          try {
            const response = await fetch(url, {
              headers: { "user-agent": "website-build" },
            })

            if (response.status === 404) {
              throw new Error(`Missing project media: ${url}`)
            }

            if (!response.ok) {
              throw new Error(`Failed project media fetch: ${response.status} ${url}`)
            }

            const buffer = Buffer.from(await response.arrayBuffer())
            if (buffer.length === 0) throw new Error(`Empty project media: ${url}`)
            const body = media.dest.endsWith(".html")
              ? Buffer.from(embedDiagram(buffer.toString("utf8"), theme))
              : buffer

            fs.mkdirSync(path.dirname(target), { recursive: true })
            fs.writeFileSync(target, body)
            logger.info(`Fetched ${media.repo}/${media.path} (${branch})`)
          } catch (error) {
            if (responseWas404(error)) throw error

            if (fs.existsSync(target)) {
              if (media.dest.endsWith(".html")) {
                const cached = fs.readFileSync(target, "utf8")
                fs.writeFileSync(target, embedDiagram(cached, theme))
              }

              logger.warn(
                `Using cached ${media.dest}; ${error instanceof Error ? error.message : String(error)}`,
              )
              continue
            }

            throw error
          }
        }
      },
    },
  }
}

function responseWas404(error: unknown): boolean {
  return error instanceof Error && error.message.startsWith("Missing project media:")
}
