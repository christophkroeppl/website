import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import type { AstroIntegration } from "astro"
import { parseFrontmatter } from "../src/lib/frontmatter"
import { resolveTheme, type ResolvedTheme } from "./theme"

type ProjectMedia = {
  repo: string
  rev: string
  path: string
  slug: string
  kind: "src" | "before" | "after"
}

const assets: ProjectMedia[] = [
  {
    repo: "christophkroeppl/bases-mcp",
    rev: "3442b72bcc5c5512de6e558b3622a9e0fa31f4d5",
    path: "docs/architecture.html",
    slug: "bases-mcp",
    kind: "src",
  },
  {
    repo: "christophkroeppl/guarden",
    rev: "ff49d0c3d89fa5b0437c2803dec3ee7e66b5a82a",
    path: "docs/architecture.html",
    slug: "guarden",
    kind: "src",
  },
  {
    repo: "christophkroeppl/oc-go-usage-display",
    rev: "8bab88e3183c9941f3f9b34e9ce07ed78d21c046",
    path: "docs/compare/opencode.webp",
    slug: "oc-go-usage-display",
    kind: "before",
  },
  {
    repo: "christophkroeppl/oc-go-usage-display",
    rev: "8bab88e3183c9941f3f9b34e9ce07ed78d21c046",
    path: "docs/compare/kilo.webp",
    slug: "oc-go-usage-display",
    kind: "after",
  },
  {
    repo: "christophkroeppl/website",
    rev: "bd1454bda11dfe5eb35c2210b6e3539d63b205a0",
    path: "docs/architecture.html",
    slug: "kroeppl-ch",
    kind: "src",
  },
]

const CACHE_DIR = ".cache/project-media"
const LOCAL_REPO = "christophkroeppl/website"

export function mediaKey(media: ProjectMedia): string {
  return crypto
    .createHash("sha256")
    .update(`${media.repo}:${media.rev}:${media.path}`)
    .digest("hex")
}

export type ArtifactRef = { slug: string; kind: "src" | "before" | "after"; url: string }

export function collectArtifactRefs(root: string): ArtifactRef[] {
  const dir = path.join(root, "src/content/pages/projects")
  const refs: ArtifactRef[] = []

  for (const file of fs.readdirSync(dir).filter((name) => name.endsWith(".md"))) {
    const slug = file.replace(/\.(de|en)\.md$/, "")
    const data = parseFrontmatter(fs.readFileSync(path.join(dir, file), "utf8"))
    const artifact = data.artifact as { src?: string; before?: string; after?: string } | undefined
    if (!artifact) continue

    for (const kind of ["src", "before", "after"] as const) {
      const url = artifact[kind]
      if (typeof url === "string" && url.startsWith("/generated/")) {
        refs.push({ slug, kind, url })
      }
    }
  }

  return refs.filter(
    (ref, index, all) =>
      all.findIndex((other) => other.slug === ref.slug && other.kind === ref.kind) === index,
  )
}

export function publicToDest(url: string): string {
  return url.replace(/^\//, "public/")
}

const STYLE_ID = "project-media-embed"
const SCRIPT_ID = "project-media-embed-viewer"

function buildThemeCss(theme: ResolvedTheme): string {
  const category = (name: string, value: string, percent = 16) => `
      --${name}-fill: ${theme.mix(value, percent)} !important;
      --${name}-stroke: ${value} !important;`

  return `
    html[data-theme] {
      color-scheme: light;
      --bg: ${theme.base100} !important;
      --grid: ${theme.base200} !important;
      --canvas-dot: ${theme.mix(theme.baseContent, 14)} !important;
      --text: ${theme.baseContent} !important;
      --text-muted: ${theme.mix(theme.baseContent, 70)} !important;
      --text-dim: ${theme.mix(theme.baseContent, 45)} !important;
      --text-faint: ${theme.mix(theme.baseContent, 35)} !important;
      --panel: ${theme.mix(theme.base100, 76)} !important;
      --panel-border: ${theme.base300} !important;
      --lane-fill: ${theme.mix(theme.base200, 72)} !important;
      --lane-stroke: ${theme.base300} !important;
      --arrow: ${theme.mix(theme.baseContent, 50)} !important;
      --arrow-emphasis: ${theme.primary} !important;
      --mask: ${theme.base100} !important;
${category("frontend", theme.accent)}
${category("backend", theme.primary)}
${category("database", theme.secondary)}
${category("cloud", theme.warning)}
${category("security", theme.error, 14)}
${category("messagebus", theme.secondary, 14)}
${category("external", theme.baseContent)}
    }`
}

export function embedDiagram(html: string, theme: ResolvedTheme): string {
  if (!html.includes('class="diagram-container"')) {
    throw new Error("Archify output is missing .diagram-container")
  }

  const clean = html
    .replace(new RegExp(`<style id="${STYLE_ID}">[\\s\\S]*?</style>\\s*`, "g"), "")
    .replace(new RegExp(`<script id="${SCRIPT_ID}">[\\s\\S]*?</script>\\s*`, "g"), "")

  const style = `<style id="${STYLE_ID}">
    html, body { width: 100%; height: 100%; margin: 0; padding: 0; overflow: hidden; background: transparent; }
${buildThemeCss(theme)}
    body > *:not(.container) { display: none !important; }
    .container { width: 100% !important; height: 100% !important; max-width: none !important; margin: 0 !important; padding: 0 !important; border: 0 !important; }
    .container > *:not(.diagram-container) { display: none !important; }
    .diagram-container { width: 100% !important; height: 100% !important; margin: 0 !important; padding: 0 !important; border: 0 !important; touch-action: none !important; }
    .diagram-container > svg { display: block; width: 100% !important; height: 100% !important; min-width: 0 !important; }
    html[data-embed="true"] .diagram-nav { display: inline-flex !important; }
    html[data-embed="true"] .diagram-nav > button:not([data-view]) { display: none !important; }
    @media (max-width: 639px) {
      html[data-embed="true"] .diagram-container { padding: 0 0 3.75rem !important; }
    }
  </style>`

  const script = `<script id="${SCRIPT_ID}">
    (function () {
      if (window.__projectMediaViewer) return
      window.__projectMediaViewer = true

      var attempts = 0
      var container
      var active = new Map()
      var startDistance = 0
      var startScale = 1

      function clamp(scale) {
        return Math.max(1, Math.min(3, Math.round(scale * 4) / 4))
      }

      function applyScale(scale) {
        var view = window.Archify.view
        var target = clamp(scale)
        while (view.state().scale < target) view.zoomIn()
        while (view.state().scale > target) view.zoomOut()
      }

      function distance() {
        var points = Array.from(active.values())
        if (points.length < 2) return 0
        return Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y)
      }

      function inDiagram(event) {
        return container && event.target instanceof Element && container.contains(event.target)
      }

      function onDown(event) {
        if (event.pointerType !== 'touch' || !inDiagram(event)) return
        active.set(event.pointerId, { x: event.clientX, y: event.clientY })
        if (active.size === 2) {
          startDistance = Math.max(distance(), 1)
          startScale = window.Archify.view.state().scale
        }
        if (active.size >= 2) {
          event.preventDefault()
          event.stopPropagation()
        }
      }

      function onMove(event) {
        if (!active.has(event.pointerId)) return
        active.set(event.pointerId, { x: event.clientX, y: event.clientY })
        if (active.size < 2) return
        event.preventDefault()
        event.stopPropagation()
        if (startDistance > 0) applyScale(startScale * distance() / startDistance)
      }

      function onEnd(event) {
        if (!active.delete(event.pointerId)) return
        if (active.size >= 2) {
          event.preventDefault()
          event.stopPropagation()
          return
        }
        startDistance = 0
      }

      function installPinch() {
        window.addEventListener('pointerdown', onDown, true)
        window.addEventListener('pointermove', onMove, true)
        window.addEventListener('pointerup', onEnd, true)
        window.addEventListener('pointercancel', onEnd, true)
        window.addEventListener('lostpointercapture', onEnd, true)
      }

      function init() {
        var view = window.Archify && window.Archify.view
        if (!view || typeof view.zoomIn !== 'function') {
          if (attempts++ < 60) requestAnimationFrame(init)
          return
        }
        container = document.querySelector('.diagram-container')
        if (!container) return
        if (window.matchMedia('(max-width: 639px)').matches && view.state().scale === 1) {
          for (var i = 0; i < 4; i++) view.zoomIn()
        }
        installPinch()
      }

      init()
    })()
  </script>`

  const withStyle = clean.includes("</head>")
    ? clean.replace("</head>", `${style}</head>`)
    : `${style}${clean}`

  return withStyle.includes("</body>")
    ? withStyle.replace("</body>", `${script}</body>`)
    : `${withStyle}${script}`
}

export function projectMedia(): AstroIntegration {
  return {
    name: "project-media",
    hooks: {
      "astro:config:setup": async ({ command, config, logger }) => {
        if (command === "sync") return

        const root = fileURLToPath(config.root)
        const theme = resolveTheme(root)
        const refs = collectArtifactRefs(root)
        const produced = new Set<string>()
        const cacheRoot = path.join(root, CACHE_DIR)

        const results = await Promise.all(
          assets.map(async (media) => {
            const ref = refs.find((ref) => ref.slug === media.slug && ref.kind === media.kind)
            if (!ref) {
              throw new Error(`No content reference for project media ${media.slug}/${media.kind}`)
            }

            let buffer: Buffer
            let source: "local" | "cache" | "network"

            if (media.repo === LOCAL_REPO) {
              buffer = await fs.promises.readFile(path.join(root, media.path))
              source = "local"
            } else {
              const key = mediaKey(media)
              const cacheFile = path.join(cacheRoot, `${key}${path.extname(media.path)}`)

              if (fs.existsSync(cacheFile)) {
                buffer = await fs.promises.readFile(cacheFile)
                source = "cache"
              } else {
                const url = `https://raw.githubusercontent.com/${media.repo}/${media.rev}/${media.path}`
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

                await fs.promises.mkdir(cacheRoot, { recursive: true })
                await fs.promises.writeFile(cacheFile, buffer)
                source = "network"
              }
            }

            return { media, ref, source, buffer }
          }),
        )

        for (const { media, ref, buffer } of results) {
          const body = ref.url.endsWith(".html")
            ? Buffer.from(embedDiagram(buffer.toString("utf8"), theme))
            : buffer
          const target = path.join(root, publicToDest(ref.url))

          fs.mkdirSync(path.dirname(target), { recursive: true })
          fs.writeFileSync(target, body)
          produced.add(ref.url)
          logger.info(`Fetched ${media.repo}/${media.path} (${media.rev})`)
        }

        for (const ref of refs) {
          if (!produced.has(ref.url)) {
            throw new Error(`No producer for generated asset ${ref.url}`)
          }
        }
      },
    },
  }
}
