import { getCollection, getEntry, render, type CollectionEntry } from "astro:content"
import type { Locale } from "../i18n/locales"
import type { PageId } from "../i18n/routes"

export async function cvFor(lang: Locale): Promise<CollectionEntry<"cv">> {
  const entry = await getEntry("cv", lang)
  if (!entry) throw new Error(`No CV content for locale "${lang}"`)
  return entry
}

export async function homeFor(lang: Locale): Promise<CollectionEntry<"home">> {
  const entry = await getEntry("home", lang)
  if (!entry) throw new Error(`No home content for locale "${lang}"`)
  return entry
}

export async function contactFor(lang: Locale): Promise<CollectionEntry<"contact">> {
  const entry = await getEntry("contact", lang)
  if (!entry) throw new Error(`No contact content for locale "${lang}"`)
  return entry
}

export async function descriptionFor(lang: Locale, page: PageId): Promise<string> {
  if (page === "projects") {
    const entries = await getCollection("pageMeta")
    const entry = entries.find(
      (entry) => entry.data.page === "projects" && entry.data.locale === lang,
    )
    if (!entry) throw new Error(`No projects meta for locale "${lang}"`)
    return entry.data.description
  }

  const entry = await getEntry(page, lang)
  if (!entry) throw new Error(`No ${page} content for locale "${lang}"`)
  return entry.data.description
}

export async function descriptionsFor(lang: Locale): Promise<Record<PageId, string>> {
  const [home, contact, cv, projects, privacy] = await Promise.all([
    descriptionFor(lang, "home"),
    descriptionFor(lang, "contact"),
    descriptionFor(lang, "cv"),
    descriptionFor(lang, "projects"),
    descriptionFor(lang, "privacy"),
  ])

  return { home, contact, cv, projects, privacy }
}

export function renderEntry(
  entry: CollectionEntry<"cv"> | CollectionEntry<"home"> | CollectionEntry<"projects">,
) {
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
