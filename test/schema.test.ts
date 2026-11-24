import { describe, expect, it } from "vitest"
import {
  breadcrumbNode,
  graph,
  isProfile,
  itemListNode,
  personNode,
  projectNode,
  webPageNode,
  websiteNode,
} from "../src/lib/schema"
import type { ProjectData } from "../src/content.config"
import { person } from "../src/content/site"
import { links } from "../src/generated/links"
import { pagePaths } from "../src/i18n/routes"
import { siteUrl } from "../src/lib/seo"

const url = `${siteUrl}${pagePaths.projects.de}`

const knowsAbout = {
  de: [
    "ERP & Unternehmenssoftware",
    "Sprachen & Laufzeiten",
    "Frontend & Produkt",
    "Infrastruktur & Betrieb",
    "Agentic Engineering & KI",
    "Delivery & Methodik",
  ],
  en: [
    "ERP & business software",
    "Languages & runtimes",
    "Frontend & product",
    "Infrastructure & operations",
    "Agentic engineering & AI",
    "Delivery & practice",
  ],
}
const knowsLanguage = ["de", "en", "fr"]
const facts = (lang: "de" | "en") => ({ knowsAbout: knowsAbout[lang], knowsLanguage })

const project: ProjectData = {
  locale: "de",
  id: "bases-mcp",
  order: 1,
  name: "bases-mcp",
  tagline: "Obsidian Bases, lesbar für Agenten.",
  summary: "Ein MCP-Server.",
  stack: ["Rust"],
  status: "Öffentlich",
  links: [
    { label: "Website", href: "https://example.com/" },
    { label: "GitHub", href: "https://github.com/example/bases-mcp" },
  ],
  highlights: ["Sechs Tools."],
  artifact: {
    kind: "html",
    src: "/generated/projects/bases-mcp.html",
    title: "bases-mcp",
    aspect: "16/10",
  },
}

describe("personNode", () => {
  it("is stable across locales and lists only profile links", () => {
    const sameAs = personNode("de", facts("de")).sameAs as string[]

    expect(personNode("de", facts("de"))["@id"]).toBe(personNode("en", facts("en"))["@id"])
    expect(personNode("en", facts("en")).url).toBe(`${siteUrl}/`)
    expect(sameAs).toContain("https://www.linkedin.com/in/christoph-kroeppl/")
    expect(sameAs).toContain("https://github.com/christophkroeppl/")
    expect(sameAs).not.toContain(`${siteUrl}/`)
    expect(sameAs).not.toContain("https://bitcoin.org/en/bitcoin-paper")
    expect(sameAs).not.toContain("https://free-cities.org/")
    expect(sameAs.length).toBeLessThan(links.length)
  })
})

describe("websiteNode", () => {
  it("points at the default locale and the person", () => {
    const node = websiteNode()

    expect(node.url).toBe(`${siteUrl}/`)
    expect(node.publisher).toEqual({ "@id": personNode("de", facts("de"))["@id"] })
  })
})

describe("webPageNode", () => {
  it("uses a specific schema type per page", () => {
    const base = { lang: "de", title: "Titel", description: "Beschreibung", url } as const

    expect(webPageNode({ ...base, page: "projects" })["@type"]).toBe("CollectionPage")
    expect(webPageNode({ ...base, page: "cv" })["@type"]).toBe("ProfilePage")
    expect(webPageNode({ ...base, page: "contact" })["@type"]).toBe("ContactPage")
    expect(webPageNode({ ...base, page: "home" })["@type"]).toBe("WebPage")
  })

  it("omits the description when there is none", () => {
    const node = webPageNode({ lang: "de", page: "home", title: "Titel", url })
    expect("description" in node).toBe(false)
  })
})

describe("breadcrumbNode", () => {
  it("is omitted on the home page", () => {
    expect(breadcrumbNode({ lang: "de", page: "home", title: "Start", url })).toBeUndefined()
  })

  it("links the page to the home page", () => {
    const node = breadcrumbNode({ lang: "en", page: "projects", title: "Projects", url })
    const items = node?.itemListElement as { position: number; item: string }[]

    expect(items.map((item) => item.position)).toEqual([1, 2])
    expect(items[0]?.item).toBe(`${siteUrl}/en/`)
    expect(items[1]?.item).toBe(url)
  })
})

describe("projectNode", () => {
  it("uses the repository link and the stack", () => {
    const node = projectNode(project, url)

    expect(node["@type"]).toBe("SoftwareSourceCode")
    expect(node.codeRepository).toBe("https://github.com/example/bases-mcp")
    expect(node.programmingLanguage).toEqual(["Rust"])
    expect(node["@id"]).toBe(`${url}#bases-mcp`)
  })
})

describe("itemListNode", () => {
  it("numbers the projects from one and references them by id", () => {
    const nodes = [projectNode(project, url), projectNode({ ...project, id: "guarden" }, url)]
    const node = itemListNode(nodes, url)
    const items = node.itemListElement as {
      position: number
      name: string
      item: { "@id": string }
    }[]

    expect(node.numberOfItems).toBe(2)
    expect(items.map((item) => item.position)).toEqual([1, 2])
    expect(items.map((item) => item.name)).toEqual(["bases-mcp", "bases-mcp"])
    expect(items.map((item) => item.item["@id"])).toEqual(nodes.map((entry) => entry["@id"]))
  })
})

describe("project node text", () => {
  it("puts the long summary in description and the short pitch in abstract", () => {
    const node = projectNode(project, url)

    expect(node.description).toBe(project.summary)
    expect(node.abstract).toBe(project.tagline)
  })

  it("rejects lookalike repository hosts", () => {
    const node = projectNode(
      { ...project, links: [{ label: "GitHub", href: "https://gist.github.com/example/abc" }] },
      url,
    )

    expect("codeRepository" in node).toBe(false)
  })
})

describe("locale placement", () => {
  it("keeps inLanguage on pages only", () => {
    expect("inLanguage" in personNode("de", facts("de"))).toBe(false)
    expect("inLanguage" in websiteNode()).toBe(false)
    expect(webPageNode({ lang: "en", page: "home", title: "T", url }).inLanguage).toBe("en")
    expect(webPageNode({ lang: "de", page: "home", title: "T", url }).inLanguage).toBe("de-AT")
  })

  it("localises person fields but keeps the identity url stable", () => {
    const de = personNode("de", facts("de"))
    const en = personNode("en", facts("en"))

    expect(de.jobTitle).not.toBe(en.jobTitle)
    expect(de.description).not.toBe(en.description)
    expect((de.address as { addressLocality: string }).addressLocality).toBe(
      person.addressLocality.de,
    )
    expect((en.address as { addressLocality: string }).addressLocality).toBe(
      person.addressLocality.en,
    )
    expect(de.url).toBe(en.url)
    expect("image" in de).toBe(false)
  })

  it("uses the supplied knowledge fields", () => {
    const de = personNode("de", facts("de"))
    const en = personNode("en", facts("en"))

    expect(de.jobTitle).toBe(person.jobTitle.de)
    expect(en.jobTitle).toBe(person.jobTitle.en)
    expect(de.knowsAbout).toEqual(knowsAbout.de)
    expect(en.knowsAbout).toEqual(knowsAbout.en)
    expect(de.knowsLanguage).toEqual(["de", "en", "fr"])
    expect(en.knowsLanguage).toEqual(de.knowsLanguage)
  })
})

describe("page relations", () => {
  it("points about at the person only on profile pages", () => {
    const page = (id: Parameters<typeof webPageNode>[0]["page"]) =>
      (webPageNode({ lang: "de", page: id, title: "T", url }).about as { "@id": string })["@id"]

    expect(page("home")).toBe(personNode("de", facts("de"))["@id"])
    expect(page("cv")).toBe(personNode("de", facts("de"))["@id"])
    expect(page("contact")).toBe(personNode("de", facts("de"))["@id"])
    expect(page("privacy")).toBe(websiteNode()["@id"])
    expect(page("projects")).toBe(websiteNode()["@id"])
  })

  it("sets mainEntity per page", () => {
    const main = (id: Parameters<typeof webPageNode>[0]["page"]) =>
      webPageNode({ lang: "de", page: id, title: "T", url }).mainEntity as
        | { "@id": string }
        | undefined

    expect(main("home")?.["@id"]).toBe(personNode("de", facts("de"))["@id"])
    expect(main("cv")?.["@id"]).toBe(personNode("de", facts("de"))["@id"])
    expect(main("projects")?.["@id"]).toBe(`${url}#projects`)
    expect(main("privacy")).toBeUndefined()
  })
})

describe("graph", () => {
  it("wraps nodes and drops empty entries", () => {
    const result = graph([personNode("de", facts("de")), undefined]) as {
      "@context": string
      "@graph": unknown[]
    }

    expect(result["@context"]).toBe("https://schema.org")
    expect(result["@graph"]).toHaveLength(1)
  })
})

describe("isProfile", () => {
  it("accepts exact profile hosts", () => {
    expect(isProfile("https://github.com/christophkroeppl/")).toBe(true)
    expect(isProfile("https://www.linkedin.com/in/christoph-kroeppl/")).toBe(true)
    expect(isProfile("https://x.com/christophkrppl/")).toBe(true)
  })

  it("rejects lookalike hosts", () => {
    expect(isProfile("https://gist.github.com/user/")).toBe(false)
    expect(isProfile("https://notgithub.com/user/")).toBe(false)
    expect(isProfile("https://github.com.evil.com/user/")).toBe(false)
  })

  it("rejects non-profile links and invalid urls", () => {
    expect(isProfile("https://bitcoin.org/en/bitcoin-paper")).toBe(false)
    expect(isProfile("not a url")).toBe(false)
  })
})

describe("projectNode links", () => {
  it("prefers the link labelled GitHub", () => {
    const node = projectNode(
      {
        ...project,
        links: [
          { label: "Website", href: "https://github.com/example/other" },
          { label: "GitHub", href: "https://github.com/example/bases-mcp" },
        ],
      },
      url,
    )

    expect(node.codeRepository).toBe("https://github.com/example/bases-mcp")
  })

  it("omits the repository when there is no github link", () => {
    const node = projectNode(
      { ...project, links: [{ label: "Website", href: "https://example.com/" }] },
      url,
    )

    expect("codeRepository" in node).toBe(false)
  })

  it("keeps only real programming languages from the stack", () => {
    const node = projectNode({ ...project, stack: ["Rust", "MCP", "stdio"] }, url)

    expect(node.programmingLanguage).toEqual(["Rust"])
  })

  it("accepts a language declared in the skills content", () => {
    const node = projectNode({ ...project, stack: ["Bash", "MCP"] }, url)

    expect(node.programmingLanguage).toEqual(["Bash"])
  })

  it("omits programmingLanguage when the stack has no language", () => {
    const node = projectNode({ ...project, stack: ["MCP", "stdio"] }, url)

    expect("programmingLanguage" in node).toBe(false)
  })
})

describe("graph dedupe", () => {
  it("keeps one node per @id, last wins", () => {
    const first = { "@type": "Person", "@id": "https://kroeppl.ch/#person", name: "old" }
    const second = { "@type": "Person", "@id": "https://kroeppl.ch/#person", name: "new" }
    const result = graph([first, second]) as { "@graph": { name: string }[] }

    expect(result["@graph"]).toHaveLength(1)
    expect(result["@graph"][0]?.name).toBe("new")
  })

  it("keeps anonymous nodes", () => {
    const result = graph([{ "@type": "Thing" }, personNode("de", facts("de"))]) as {
      "@graph": unknown[]
    }

    expect(result["@graph"]).toHaveLength(2)
  })
})
