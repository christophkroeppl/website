import fs from "node:fs"
import path from "node:path"
import { createRequire } from "node:module"
import { humanize } from "../src/links/parse"
import type { LinkIcon } from "../src/links/types"

const require = createRequire(import.meta.url)

const CUSTOM_DIR = "public/icons"
const CUSTOM_EXTENSIONS = ["svg", "webp", "png", "jpg", "jpeg", "ico"] as const
const DEFAULT_VIEW_BOX = "0 0 24 24"

const titleOverrides: Record<string, string> = {
  bitcr: "BitCredit",
  linkedin: "LinkedIn",
}

export type ResolvedIcon = {
  icon: LinkIcon
  title: string
  shadowed: boolean
}

export function resolveIcon(projectRoot: string, slug: string, iconSlug = slug): ResolvedIcon {
  const pack = readPackIcon(iconSlug)
  const title = pack?.title ?? titleOverrides[slug] ?? humanize(slug)
  const custom = resolveCustomIcon(projectRoot, iconSlug)

  if (custom) return { icon: custom, title, shadowed: Boolean(pack) }
  if (pack) {
    return {
      icon: { kind: "svg", viewBox: pack.viewBox, paths: [pack.path] },
      title,
      shadowed: false,
    }
  }

  throw new Error(
    `No icon for "${iconSlug}". Add ${CUSTOM_DIR}/${iconSlug}.<svg|webp|png|jpg|ico>.`,
  )
}

type PackIcon = { title: string; viewBox: string; path: string }

function readPackIcon(slug: string): PackIcon | undefined {
  let file: string
  try {
    file = require.resolve(`simple-icons/icons/${slug}.svg`)
  } catch {
    return undefined
  }

  const source = fs.readFileSync(file, "utf8")
  const pathData = readPaths(source, `simple-icons/icons/${slug}.svg`)[0]
  if (!pathData) return undefined

  return {
    title: readTitle(source) ?? humanize(slug),
    viewBox: readViewBox(source),
    path: pathData,
  }
}

function resolveCustomIcon(projectRoot: string, slug: string): LinkIcon | undefined {
  for (const extension of CUSTOM_EXTENSIONS) {
    const relative = `${CUSTOM_DIR}/${slug}.${extension}`
    const file = path.join(projectRoot, relative)
    if (!fs.existsSync(file)) continue

    if (extension === "svg") {
      const source = fs.readFileSync(file, "utf8")
      const fillRule = readFillRule(source)
      return {
        kind: "svg",
        viewBox: readViewBox(source),
        paths: readPaths(source, relative),
        ...(fillRule ? { fillRule } : {}),
      }
    }

    return { kind: "file", src: `/${relative.slice("public/".length)}` }
  }

  return undefined
}

function readTitle(source: string): string | undefined {
  return /<title>([^<]+)<\/title>/.exec(source)?.[1]
}

function readViewBox(source: string): string {
  return /viewBox="([^"]+)"/.exec(source)?.[1] ?? DEFAULT_VIEW_BOX
}

function readPaths(source: string, relative: string): string[] {
  if (/<(?:circle|ellipse|rect|polygon|polyline|line|use)\b/.test(source)) {
    throw new Error(`${relative}: only <path> elements are supported`)
  }
  if (/\btransform=/.test(source)) {
    throw new Error(`${relative}: transforms are not supported`)
  }

  const paths = [...source.matchAll(/<path\b[^>]*\sd="([^"]+)"/g)].flatMap((match) => {
    const d = match[1]
    return d ? [d] : []
  })

  if (paths.length === 0) throw new Error(`${relative}: no <path d="..."> to inline`)
  return paths
}

function readFillRule(source: string): "evenodd" | "nonzero" | undefined {
  const rule = /<(?:g|path)\b[^>]*fill-rule="(evenodd|nonzero)"/.exec(source)?.[1]
  return rule as "evenodd" | "nonzero" | undefined
}
