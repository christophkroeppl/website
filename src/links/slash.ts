export type Probe = (url: string) => Promise<number | undefined>

const FILE_EXTENSION =
  /\.(?:html?|xhtml|pdf|png|jpe?g|gif|svg|webp|avif|ico|css|js|mjs|json|xml|txt|csv|zip|gz|tar|mp3|mp4|webm|mov|woff2?|ttf|otf)$/i

export type SlashVariants = {
  withSlash: string
  withoutSlash: string
}

export function slashVariants(href: string): SlashVariants | undefined {
  if (!/^https?:/i.test(href)) return undefined

  const url = new URL(href)
  if (url.search || url.hash || url.pathname === "/") return undefined

  const lastSegment = url.pathname.slice(url.pathname.lastIndexOf("/") + 1)
  if (FILE_EXTENSION.test(lastSegment)) return undefined

  const withoutSlash = url.href.replace(/\/$/, "")
  return { withSlash: `${withoutSlash}/`, withoutSlash }
}

function isBroken(status: number | undefined): boolean {
  return status === undefined || status === 404 || status === 410 || status >= 500
}

export async function resolveSlash(href: string, probe: Probe): Promise<string> {
  const variants = slashVariants(href)
  if (!variants) return href

  const [withSlash, withoutSlash] = await Promise.all([
    probe(variants.withSlash),
    probe(variants.withoutSlash),
  ])

  if (!isBroken(withSlash)) return variants.withSlash
  if (!isBroken(withoutSlash)) return variants.withoutSlash
  return href
}
