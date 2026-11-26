import { links } from "../generated/links"
import { pathFor, type PageId } from "../i18n/routes"
import { defaultLocale, type Locale } from "../i18n/locales"
import { programmingLanguages } from "../content/programming-languages"
import { person } from "../content/site"
import { pick } from "../content/types"
import type { ProjectData } from "../content.config"
import { buildTime } from "./build-time"
import { pageMeta, type PageMeta } from "./page-meta"
import { inLanguage } from "./seo"
import { absoluteUrl } from "./urls"

export type Node = {
  "@type": string
  "@id"?: string
  [key: string]: unknown
}

export function makeNode(type: string, fields: Record<string, unknown>, id?: string): Node {
  if (!type) throw new Error("Schema.org node requires @type")
  return {
    "@type": type,
    ...(id ? { "@id": id } : {}),
    ...fields,
  }
}

const personId = absoluteUrl("/#person")
const websiteId = absoluteUrl("/#website")

const profileHosts = [
  "linkedin.com",
  "instagram.com",
  "facebook.com",
  "x.com",
  "twitter.com",
  "github.com",
  "threads.net",
  "bsky.app",
  "mastodon.social",
  "t.me",
]

function hostname(href: string): string | undefined {
  try {
    return new URL(href).hostname.replace(/^www\./, "")
  } catch {
    return undefined
  }
}

export function isProfile(href: string): boolean {
  const host = hostname(href)
  if (!host) return false
  return profileHosts.some((candidate) => host === candidate)
}

export function personNode(
  lang: Locale,
  {
    knowsAbout,
    knowsLanguage,
    description,
    employers,
    mainEntityOfPage,
  }: {
    knowsAbout: string[]
    knowsLanguage: string[]
    description: string
    employers: string[]
    mainEntityOfPage?: string
  },
): Node {
  return makeNode(
    "Person",
    {
      name: person.name,
      url: absoluteUrl(pathFor("home", defaultLocale)),
      description,
      jobTitle: pick(lang, person.jobTitle),
      knowsAbout,
      knowsLanguage,
      alumniOf: employers.map((name) => ({ "@type": "Organization", name })),
      address: {
        "@type": "PostalAddress",
        addressLocality: pick(lang, person.addressLocality),
        addressCountry: "AT",
      },
      sameAs: links.map((link) => link.href).filter(isProfile),
      ...(mainEntityOfPage ? { mainEntityOfPage: { "@id": mainEntityOfPage } } : {}),
    },
    personId,
  )
}

export function websiteNode(): Node {
  return makeNode(
    "WebSite",
    {
      url: absoluteUrl("/"),
      name: person.name,
      publisher: { "@id": personId },
    },
    websiteId,
  )
}

export function webPageNode({
  lang,
  page,
  title,
  description,
  url,
}: {
  lang: Locale
  page: PageId
  title: string
  description?: string
  url: string
}): Node {
  const meta: PageMeta = pageMeta[page]
  const mainEntity =
    meta.mainEntity === "person"
      ? personId
      : meta.mainEntity === "projects"
        ? `${url}#projects`
        : undefined

  return makeNode(
    meta.type,
    {
      url,
      name: title,
      dateModified: buildTime,
      ...(description ? { description } : {}),
      inLanguage: inLanguage(lang),
      isPartOf: { "@id": websiteId },
      about: { "@id": meta.about === "person" ? personId : websiteId },
      ...(mainEntity ? { mainEntity: { "@id": mainEntity } } : {}),
    },
    `${url}#webpage`,
  )
}

export function breadcrumbNode({
  lang,
  page,
  title,
  url,
}: {
  lang: Locale
  page: PageId
  title: string
  url: string
}): Node | undefined {
  if (!pageMeta[page].breadcrumb) return undefined

  return makeNode(
    "BreadcrumbList",
    {
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: person.name,
          item: absoluteUrl(pathFor("home", lang)),
        },
        { "@type": "ListItem", position: 2, name: title, item: url },
      ],
    },
    `${url}#breadcrumb`,
  )
}

export function projectNode(project: ProjectData, url: string): Node {
  const github = project.links.filter((link) => hostname(link.href) === "github.com")
  const repository = (github.find((link) => link.label === "GitHub") ?? github[0])?.href
  const languages = project.stack.filter((item) => programmingLanguages.has(item))

  return makeNode(
    "SoftwareSourceCode",
    {
      name: project.name,
      description: project.summary,
      abstract: project.tagline,
      url: `${url}#${project.id}`,
      ...(repository ? { codeRepository: repository } : {}),
      ...(languages.length > 0 ? { programmingLanguage: languages } : {}),
      author: { "@id": personId },
      license: `https://spdx.org/licenses/${project.license}.html`,
    },
    `${url}#${project.id}`,
  )
}

export function itemListNode(nodes: Node[], url: string): Node {
  return makeNode(
    "ItemList",
    {
      numberOfItems: nodes.length,
      itemListElement: nodes.map((node, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: node.name,
        item: { "@id": node["@id"] },
      })),
    },
    `${url}#projects`,
  )
}

export function graph(nodes: (Node | undefined)[]): { "@context": string; "@graph": Node[] } {
  const entities = new Map<string, Node>()
  const anonymous: Node[] = []

  for (const node of nodes) {
    if (!node) continue
    const id = node["@id"]
    if (typeof id !== "string") {
      anonymous.push(node)
      continue
    }

    const existing = entities.get(id)
    if (existing && JSON.stringify(existing) !== JSON.stringify(node)) {
      throw new Error(`Conflicting schema.org @id: ${id}`)
    }
    if (!existing) entities.set(id, node)
  }

  return {
    "@context": "https://schema.org",
    "@graph": [...entities.values(), ...anonymous],
  }
}
