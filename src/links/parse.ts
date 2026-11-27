const LINK_KEY = /^LINK_(\d{2})_(.+)$/
const DIRECT_PROTOCOL = /^(?:mailto|tel):/i

export type LinkEnv = Readonly<Record<string, string | undefined>>

export type LinkSource = {
  key: string
  order: number
  href: string
  slug: string
  label?: string
  icon?: string
}

export function parseLinkSources(env: LinkEnv): LinkSource[] {
  const labels = labelOverrides(env)
  const icons = iconOverrides(env)
  return Object.entries(env).flatMap(([key, raw]) => {
    if (key.endsWith("_LABEL") || key.endsWith("_ICON")) return []

    const match = LINK_KEY.exec(key)
    const value = raw?.trim()
    if (!match || !value) return []

    const [, rawOrder, platform] = match
    if (!platform) return []

    const label = labels.get(key)
    const icon = icons.get(key)

    return [
      {
        key,
        order: Number(rawOrder),
        href: parseHref(key, value),
        slug: platform.toLowerCase().replace(/_/g, "-"),
        ...(label === undefined ? {} : { label }),
        ...(icon === undefined ? {} : { icon }),
      },
    ]
  })
}

function labelOverrides(env: LinkEnv): Map<string, string> {
  const labels = new Map<string, string>()

  for (const [key, raw] of Object.entries(env)) {
    if (!key.endsWith("_LABEL")) continue
    const value = raw?.trim()
    if (value) labels.set(key.slice(0, -"_LABEL".length), value)
  }

  return labels
}

function iconOverrides(env: LinkEnv): Map<string, string> {
  const icons = new Map<string, string>()

  for (const [key, raw] of Object.entries(env)) {
    if (!key.endsWith("_ICON")) continue
    const value = raw?.trim()
    if (value) icons.set(key.slice(0, -"_ICON".length), value)
  }

  return icons
}

export function parseHref(key: string, value: string): string {
  if (DIRECT_PROTOCOL.test(value)) {
    const [, target] = /^[a-z]+:(.*)$/i.exec(value) ?? []
    if (!target?.trim()) throw new Error(`${key}: missing destination in "${value}"`)
    return value
  }

  let url: URL
  try {
    url = new URL(value)
  } catch {
    throw new Error(`${key}: "${value}" is not an absolute URL`)
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`${key}: "${value}" must use http, https, mailto or tel`)
  }

  return url.href
}

export function humanize(value: string): string {
  return value
    .toLowerCase()
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}
