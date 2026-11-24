export function inline(value: string): string {
  return value
    .replace(
      /<a\b[^>]{0,256}?href=(?:"([^"]+)"|'([^']+)')[^>]{0,256}>([\s\S]*?)<\/a>/g,
      (_match, double: string | undefined, single: string | undefined, label: string) =>
        `[${label}](${double ?? single})`,
    )
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
}

export function renderFrontmatter(fields: Record<string, string>): string {
  const lines = Object.entries(fields).map(([key, value]) => `${key}: ${JSON.stringify(value)}`)

  return ["---", ...lines, "---"].join("\n")
}

export function stripFrontmatter(markdown: string): string {
  return markdown.replace(/^---\n[\s\S]*?\n---\n+/, "").trim()
}

export function tokenCount(markdown: string): number {
  return Math.ceil(markdown.length / 4)
}
