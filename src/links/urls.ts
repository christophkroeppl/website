import { links } from "../generated/links"

export function firstLinkHref(slug: string): string | undefined {
  return links.find((link) => link.slug === slug)?.href
}
