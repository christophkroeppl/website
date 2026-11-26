import { linkLabel, type LinkSource } from "./parse"
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
  order: Map<string, number>
  probe?: Probe
  resolveIcon: IconResolver
}

export async function buildLinks({
  sources,
  order,
  probe,
  resolveIcon,
}: BuildLinksInput): Promise<Link[]> {
  const sorted = sources
    .map((source, index) => ({ source, index }))
    .sort(
      (a, b) =>
        (order.get(a.source.key) ?? Infinity) - (order.get(b.source.key) ?? Infinity) ||
        a.index - b.index,
    )
    .map(({ source }) => source)

  return Promise.all(
    sorted.map(async (source) => {
      const href = probe
        ? await resolveSlash(source.href, probe)
        : (slashVariants(source.href)?.withSlash ?? source.href)
      const { icon, title } = resolveIcon(source.slug, source.icon ?? source.slug)
      return {
        key: source.key,
        href,
        label: source.label ?? linkLabel(title, source.variant),
        slug: source.slug,
        icon,
      } satisfies Link
    }),
  )
}
