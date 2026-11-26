import type { AstroIntegration } from "astro"
import { buildContext, emitGenerated } from "./build"
import { loadBuildEnv } from "./build-env"
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
        const { root, mode } = buildContext(config.root, command)
        const env = loadBuildEnv(mode, root)
        const order = new Map(Object.keys(env).map((key, index) => [key, index]))
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

        emitGenerated(root, OUTPUT_FILE, module)
        logger.info(`${parsed.length} link(s) generated into ${OUTPUT_FILE}`)
      },
    },
  }
}
