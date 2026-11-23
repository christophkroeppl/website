import fs from "node:fs"
import path from "node:path"
import * as simpleIcons from "simple-icons"
import { humanize } from "./parse"
import type { IconPack, LinkIcon } from "./types"

const CUSTOM_DIR = "public/icons"
const CUSTOM_EXTENSIONS = ["svg", "webp", "png", "jpg", "jpeg", "ico"] as const
const DEFAULT_VIEW_BOX = "0 0 24 24"

type PackIcon = { slug: string; title: string; path: string }

function isPackIcon(value: unknown): value is PackIcon {
  if (typeof value !== "object" || value === null) return false
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.slug === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.path === "string"
  )
}

const packIcons = new Map<string, PackIcon>()

for (const value of Object.values(simpleIcons) as unknown[]) {
  if (isPackIcon(value)) packIcons.set(value.slug, value)
}

const titleOverrides: Record<string, string> = {
  bitcr: "BitCredit",
  linkedin: "LinkedIn",
}

export const defaultIconPack = "simple-icons"

export const iconPacks: Record<string, IconPack> = {
  [defaultIconPack]: {
    name: defaultIconPack,
    resolve: (slug) => packIcons.get(slug),
  },
}

export function resolveIcon(
  projectRoot: string,
  slug: string,
  pack: IconPack,
  iconSlug = slug,
): { icon: LinkIcon; title: string } {
  const title = pack.resolve(slug)?.title ?? titleOverrides[slug] ?? humanize(slug)
  const custom = resolveCustomIcon(projectRoot, iconSlug)
  const packIcon = pack.resolve(iconSlug)

  if (custom) return { icon: custom, title }
  if (packIcon) {
    return { icon: { kind: "svg", viewBox: DEFAULT_VIEW_BOX, paths: [packIcon.path] }, title }
  }

  throw new Error(
    `No icon for "${iconSlug}" in pack "${pack.name}". Add ${CUSTOM_DIR}/${iconSlug}.<svg|webp|png|jpg|ico> or use another LINKS_ICON_PACK.`,
  )
}

function resolveCustomIcon(projectRoot: string, slug: string): LinkIcon | undefined {
  for (const extension of CUSTOM_EXTENSIONS) {
    const relative = `${CUSTOM_DIR}/${slug}.${extension}`
    const file = path.join(projectRoot, relative)
    if (!fs.existsSync(file)) continue

    if (extension === "svg") {
      const source = fs.readFileSync(file, "utf8")
      return {
        kind: "svg",
        viewBox: readViewBox(source),
        paths: readPaths(source, relative),
        fillRule: readFillRule(source),
      }
    }

    return { kind: "file", src: `/${relative.slice("public/".length)}` }
  }

  return undefined
}

function readViewBox(source: string): string {
  return /viewBox="([^"]+)"/.exec(source)?.[1] ?? DEFAULT_VIEW_BOX
}

function readPaths(source: string, relative: string): string[] {
  const paths = [...source.matchAll(/<path\b[^>]*\sd="([^"]+)"/g)].map((match) => match[1])

  if (paths.length === 0) throw new Error(`${relative}: no <path d="..."> to inline`)
  return paths
}

function readFillRule(source: string): "evenodd" | "nonzero" | undefined {
  const rule = /fill-rule="(evenodd|nonzero)"/.exec(source)?.[1]
  return rule as "evenodd" | "nonzero" | undefined
}
