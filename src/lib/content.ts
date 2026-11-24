import { getCollection, getEntry, render, type CollectionEntry } from "astro:content"
import type { Locale } from "../i18n/locales"

export async function cvFor(lang: Locale): Promise<CollectionEntry<"cv">> {
  const entry = await getEntry("cv", lang)
  if (!entry) throw new Error(`No CV content for locale "${lang}"`)
  return entry
}

export function renderEntry(entry: CollectionEntry<"cv"> | CollectionEntry<"projects">) {
  return render(entry)
}

export async function projectsFor(lang: Locale): Promise<CollectionEntry<"projects">[]> {
  const entries = await getCollection("projects")
  return entries
    .filter((entry) => entry.data.locale === lang)
    .toSorted((a, b) => a.data.order - b.data.order)
}

export async function rolesFor(lang: Locale): Promise<CollectionEntry<"experience">[]> {
  const entries = await getCollection("experience")
  return entries
    .filter((entry) => entry.data.locale === lang)
    .toSorted((a, b) => a.data.order - b.data.order)
    .map((entry) => ({ ...entry, id: entry.id.replace(/\.[^.]+$/, "") }))
}

export async function skillsFor(lang: Locale): Promise<CollectionEntry<"skills">[]> {
  const entries = await getCollection("skills")
  return entries
    .filter((entry) => entry.data.locale === lang)
    .toSorted((a, b) => a.data.order - b.data.order)
    .map((entry) => ({ ...entry, id: entry.id.replace(/\.[^.]+$/, "") }))
}

export function pickById<T extends { id: string }>(items: T[], ids: string[], source: string): T[] {
  const byId = new Map(items.map((item) => [item.id, item]))
  return ids.map((id) => {
    const item = byId.get(id)
    if (!item) throw new Error(`${source} references unknown id "${id}"`)
    return item
  })
}
