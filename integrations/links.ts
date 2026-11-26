import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { loadEnv } from "vite"
import type { AstroIntegration } from "astro"
import { resolveIcon } from "./icons"
import { buildLinks } from "../src/links/build"
import { parseLinkSources } from "../src/links/parse"
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
      const key = match?.[1]
      if (!key || order.has(key)) continue
      order.set(key, order.size)
    }
  }

  return order
}

function renderModule(links: Link[]): string {
  return [
    `import type { Link } from "../links/types"`,
    ``,
    `export const links: Link[] = ${JSON.stringify(links, null, 2)}`,
    ``,
  ].join("\n")
}

export function links(): AstroIntegration {
  return {
    name: "links",
    hooks: {
      "astro:config:setup": async ({ command, config, logger }) => {
        const root = fileURLToPath(config.root)
        const mode = command === "build" ? "production" : "development"
        const env = loadEnv(mode, root, "")
        const order = envKeyOrder(root, mode)
        const probing = command === "build" || command === "dev"
        const parsed = await buildLinks({
          sources: parseLinkSources(env),
          order,
          ...(probing ? { probe: probeUrl } : {}),
          resolveIcon: (slug, iconSlug) => {
            const resolved = resolveIcon(root, slug, iconSlug)
            if (resolved.shadowed) {
              logger.info(`${slug}: custom icon overrides ${iconSlug}`)
            }
            return resolved
          },
        })

        const module = renderModule(parsed)

        fs.mkdirSync(path.dirname(path.join(root, OUTPUT_FILE)), { recursive: true })
        fs.writeFileSync(path.join(root, OUTPUT_FILE), module)
        logger.info(`${parsed.length} link(s) generated into ${OUTPUT_FILE}`)
      },
    },
  }
}
