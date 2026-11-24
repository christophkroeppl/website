import { links } from "../generated/links"
import { pathFor, type PageId } from "../i18n/routes"
import type { Locale } from "../i18n/locales"
import { programmingLanguages } from "../content/programming-languages"
import { person } from "../content/site"
import { pick } from "../content/types"
import { pageDescription } from "./seo"
import type { ProjectData } from "../content.config"
import { inLanguage } from "./seo"
import { absoluteUrl } from "./urls"

export type Node = Record<string, unknown>

const personId = absoluteUrl("/#person")
const websiteId = absoluteUrl("/#website")

const personNodeOnPage = new Set<PageId>(["home", "cv", "contact"])

const pageType: Record<PageId, string> = {
  home: "WebPage",
  contact: "ContactPage",
  cv: "ProfilePage",
  projects: "CollectionPage",
  privacy: "WebPage",
}

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
  { knowsAbout, knowsLanguage }: { knowsAbout: string[]; knowsLanguage: string[] },
): Node {
  return {
    "@type": "Person",
    "@id": personId,
    name: person.name,
    url: absoluteUrl(pathFor("home", "de")),
    description: pageDescription(lang, "home"),
    jobTitle: pick(lang, person.jobTitle),
    knowsAbout,
    knowsLanguage,
    address: {
      "@type": "PostalAddress",
      addressLocality: pick(lang, person.addressLocality),
      addressCountry: "AT",
    },
    sameAs: links.map((link) => link.href).filter(isProfile),
  }
}

export function websiteNode(): Node {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    url: absoluteUrl("/"),
    name: person.name,
    publisher: { "@id": personId },
  }
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
  return {
    "@type": pageType[page],
    "@id": `${url}#webpage`,
    url,
    name: title,
    ...(description ? { description } : {}),
    inLanguage: inLanguage(lang),
    isPartOf: { "@id": websiteId },
    about: { "@id": personNodeOnPage.has(page) ? personId : websiteId },
    ...(mainEntityOf(page, url) ? { mainEntity: { "@id": mainEntityOf(page, url) } } : {}),
  }
}

function mainEntityOf(page: PageId, url: string): string | undefined {
  if (page === "home" || page === "cv") return personId
  if (page === "projects") return `${url}#projects`
  return undefined
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
  if (page === "home") return undefined

  return {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: person.name,
        item: absoluteUrl(pathFor("home", lang)),
      },
      { "@type": "ListItem", position: 2, name: title, item: url },
    ],
  }
}

export function projectNode(project: ProjectData, url: string): Node {
  const github = project.links.filter((link) => hostname(link.href) === "github.com")
  const repository = (github.find((link) => link.label === "GitHub") ?? github[0])?.href
  const languages = project.stack.filter((item) => programmingLanguages.has(item))

  return {
    "@type": "SoftwareSourceCode",
    "@id": `${url}#${project.id}`,
    name: project.name,
    description: project.summary,
    abstract: project.tagline,
    url: `${url}#${project.id}`,
    ...(repository ? { codeRepository: repository } : {}),
    ...(languages.length > 0 ? { programmingLanguage: languages } : {}),
    author: { "@id": personId },
  }
}

export function itemListNode(nodes: Node[], url: string): Node {
  return {
    "@type": "ItemList",
    "@id": `${url}#projects`,
    numberOfItems: nodes.length,
    itemListElement: nodes.map((node, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: node.name,
      item: { "@id": node["@id"] },
    })),
  }
}

export function graph(nodes: (Node | undefined)[]): Node {
  const entities = new Map<string, Node>()
  const anonymous: Node[] = []

  for (const node of nodes) {
    if (!node) continue
    const id = node["@id"]
    if (typeof id === "string") entities.set(id, node)
    else anonymous.push(node)
  }

  return {
    "@context": "https://schema.org",
    "@graph": [...entities.values(), ...anonymous],
  }
}
