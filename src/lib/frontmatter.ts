import { parse } from "yaml"

export function parseFrontmatter(source: string): Record<string, unknown> {
  const match = /^---\n([\s\S]*?)\n---/.exec(source)
  if (!match) return {}
  return (parse(match[1] ?? "") ?? {}) as Record<string, unknown>
}
