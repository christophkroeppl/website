import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { loadEnv } from "vite"
import type { AstroIntegration } from "astro"
import { iconPacks, defaultIconPack, resolveIcon } from "../src/links/icons"
import { linkLabel, parseLinkSources } from "../src/links/parse"
import { resolveSlash, slashVariants } from "../src/links/slash"
import type { Link } from "../src/links/types"

const OUTPUT_FILE = "src/generated/links.ts"

async function probeUrl(url: string): Promise<number | undefined> {
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(5000),
      headers: { "user-agent": "Mozilla/5.0 (compatible; links-probe)" },
    })
    await response.body?.cancel()
    return response.status
  } catch {
    return undefined
  }
}

const ENV_FILES = (mode: string) => [".env", ".env.local", `.env.${mode}`, `.env.${mode}.local`]

function envKeyOrder(root: string, mode: string): Map<string, number> {
  const order = new Map<string, number>()

  for (const file of ENV_FILES(mode)) {
    const pathname = path.join(root, file)
    if (!fs.existsSync(pathname)) continue

    for (const line of fs.readFileSync(pathname, "utf8").split("\n")) {
      const match = /^\s*(?:export\s+)?([A-Za-z0-9_]+)\s*=/.exec(line)
      if (!match || order.has(match[1])) continue
      order.set(match[1], order.size)
    }
  }

  return order
}

function renderModule(links: Link[], tagline: string): string {
  return [
    `import type { Link } from "../links/types"`,
    ``,
    `export const links: Link[] = ${JSON.stringify(links, null, 2)}`,
    ``,
    `export const tagline = ${JSON.stringify(tagline)}`,
    ``,
  ].join("\n")
}

export function links(): AstroIntegration {
  return {
    name: "links",
    hooks: {
      "astro:config:setup": async ({ command, config, injectRoute, logger }) => {
        injectRoute({ pattern: "/links", entrypoint: "./src/linktree/links.astro" })

        const root = fileURLToPath(config.root)
        const mode = command === "build" ? "production" : "development"
        const env = loadEnv(mode, root, "")
        const packName = env.LINKS_ICON_PACK?.trim() || defaultIconPack
        const pack = iconPacks[packName]

        if (!pack) {
          throw new Error(
            `Unknown LINKS_ICON_PACK "${packName}". Known packs: ${Object.keys(iconPacks).join(", ")}`,
          )
        }

        const order = envKeyOrder(root, mode)
        const probing = command === "build" || command === "dev"
        const parsed = await Promise.all(
          parseLinkSources(env)
            .sort((a, b) => (order.get(a.key) ?? Infinity) - (order.get(b.key) ?? Infinity))
            .map(async (source) => {
              const href = probing
                ? await resolveSlash(source.href, probeUrl)
                : (slashVariants(source.href)?.withSlash ?? source.href)

              if (href !== source.href) logger.info(`${source.key}: ${href}`)

              const { icon, title } = resolveIcon(root, source.slug, pack, source.icon)
              return {
                key: source.key,
                href,
                label: source.label ?? linkLabel(title, source.variant),
                slug: source.slug,
                icon,
              } satisfies Link
            }),
        )

        const module = renderModule(
          parsed,
          env.LINKS_TAGLINE?.trim() ?? "",
        )

        fs.mkdirSync(path.dirname(path.join(root, OUTPUT_FILE)), { recursive: true })
        fs.writeFileSync(path.join(root, OUTPUT_FILE), module)
        logger.info(`${parsed.length} link(s) generated into ${OUTPUT_FILE}`)
      },
    },
  }
}
