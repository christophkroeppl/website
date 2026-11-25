import type { Link } from "./types"

export type DrawerLinks = {
  visible: Link[]
  more: Link[]
}

export function drawerLinks(links: Link[]): DrawerLinks {
  const github = links.findIndex((link) => link.slug === "github")
  const pivot = github === -1 ? links.length : github + 1
  const website = links.find((link) => link.slug === "website")

  const visible = links.slice(0, pivot).filter((link) => link.slug !== "website")
  if (website) visible.push(website)

  const more = links.slice(pivot).filter((link) => link.slug !== "website")

  return { visible, more }
}
