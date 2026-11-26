import { describe, expect, it, vi } from "vitest"
import { buildLinks } from "../src/links/build"
import type { LinkSource } from "../src/links/parse"

const sources: LinkSource[] = [
  { key: "B_LINK", href: "https://b.example/", slug: "b" },
  { key: "A_LINK", href: "https://a.example/", slug: "a" },
  { key: "C_LINK", href: "https://c.example/path", slug: "c", variant: "work", icon: "custom-c" },
]

const order = new Map([
  ["A_LINK", 0],
  ["B_LINK", 1],
  ["C_LINK", 2],
])

const icon = { kind: "svg" as const, viewBox: "0 0 24 24", paths: ["M0 0"] }

describe("buildLinks", () => {
  it("orders by env order, probes slashes and derives labels", async () => {
    const resolveIcon = vi.fn((slug: string, iconSlug: string) => {
      expect(iconSlug).toBe(slug === "c" ? "custom-c" : slug)
      return { icon, title: slug.toUpperCase() }
    })
    const probe = vi.fn(async (url: string) => (url.endsWith("/") ? 200 : 404))

    const links = await buildLinks({ sources, order, probe, resolveIcon })

    expect(links.map((link) => link.key)).toEqual(["A_LINK", "B_LINK", "C_LINK"])
    expect(links[0]?.href).toBe("https://a.example/")
    expect(links[2]?.href).toBe("https://c.example/path/")
    expect(links[2]?.label).toBe("C — Work")
    expect(links[2]?.icon).toBe(icon)
    expect(resolveIcon).toHaveBeenCalledTimes(3)
  })

  it("uses the slash variant without a probe", async () => {
    const links = await buildLinks({
      sources,
      order,
      resolveIcon: () => ({ icon, title: "Title" }),
    })

    expect(links[0]?.href).toBe("https://a.example/")
  })
})
