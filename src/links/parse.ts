const LINK_KEY = /^(?:PUBLIC_)?(.+?)_LINK(?:_(.+))?$/
const DIRECT_PROTOCOL = /^(?:mailto|tel):/i

export type LinkEnv = Readonly<Record<string, string | undefined>>

export type LinkSource = {
  key: string
  href: string
  slug: string
  variant?: string
  label?: string
  icon?: string
}

export function isLinkKey(key: string): boolean {
  return LINK_KEY.test(key)
}

export function parseLinkSources(env: LinkEnv): LinkSource[] {
  const labels = labelOverrides(env)
  const icons = iconOverrides(env)
  const sources: LinkSource[] = []

  for (const [key, raw] of Object.entries(env)) {
    if (key.endsWith("_LABEL") || key.endsWith("_ICON")) continue

    const match = LINK_KEY.exec(key)
    if (!match || !raw) continue

    const value = raw.trim()
    if (!value) continue

    const [, platform, variant] = match

    sources.push({
      key,
      href: parseHref(key, value),
      slug: platform.toLowerCase().replace(/_/g, "-"),
      variant: variant?.trim() || undefined,
      label: labels.get(key),
      icon: icons.get(key),
    })
  }

  return sources
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

export function isNumericVariant(variant: string): boolean {
  return /^\d+$/.test(variant)
}

export function humanize(value: string): string {
  return value
    .toLowerCase()
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export function linkLabel(title: string, variant?: string): string {
  if (!variant || isNumericVariant(variant)) return title
  return `${title} — ${humanize(variant)}`
}
