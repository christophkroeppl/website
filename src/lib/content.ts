import { getEntry, render, type CollectionEntry } from "astro:content"
import type { Locale } from "../i18n/locales"

export async function cvFor(lang: Locale): Promise<CollectionEntry<"cv">> {
  const entry = await getEntry("cv", lang)
  if (!entry) throw new Error(`No CV content for locale "${lang}"`)
  return entry
}

export function renderEntry(entry: CollectionEntry<"cv">) {
  return render(entry)
}

export function pickById<T extends { id: string }>(items: T[], ids: string[], source: string): T[] {
  const byId = new Map(items.map((item) => [item.id, item]))
  return ids.map((id) => {
    const item = byId.get(id)
    if (!item) throw new Error(`${source} references unknown id "${id}"`)
    return item
  })
}
