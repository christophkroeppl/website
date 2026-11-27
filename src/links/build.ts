import type { LinkSource } from "./parse"
import { resolveSlash, slashVariants, type Probe } from "./slash"
import type { Link, LinkIcon } from "./types"

export type ResolvedIcon = {
  icon: LinkIcon
  title: string
  shadowed?: boolean
}

export type IconResolver = (slug: string, iconSlug: string) => ResolvedIcon

export type BuildLinksInput = {
  sources: LinkSource[]
  probe?: Probe
  resolveIcon: IconResolver
}

export async function buildLinks({
  sources,
  probe,
  resolveIcon,
}: BuildLinksInput): Promise<Link[]> {
  const duplicate = sources.find(
    ({ order }, index) => sources.findIndex((source) => source.order === order) !== index,
  )
  if (duplicate) throw new Error(`Duplicate link order ${duplicate.order}: ${duplicate.key}`)

  const sorted = [...sources].sort((a, b) => a.order - b.order)

  return Promise.all(
    sorted.map(async (source) => {
      const href = probe
        ? await resolveSlash(source.href, probe)
        : (slashVariants(source.href)?.withSlash ?? source.href)
      const { icon, title } = resolveIcon(source.slug, source.icon ?? source.slug)
      return {
        key: source.key,
        href,
        label: source.label ?? title,
        slug: source.slug,
        icon,
      } satisfies Link
    }),
  )
}
