import type { Link } from "./types"

export function groupLinks(links: Link[]): Link[][] {
  const groups: Link[][] = []

  for (const link of links) {
    const group = groups[groups.length - 1]
    if (group && group[0].slug === link.slug) group.push(link)
    else groups.push([link])
  }

  return groups
}
