import { describe, expect, it, vi } from "vitest"
import { buildLinks } from "../src/links/build"
import { parseLinkSources, type LinkEnv, type LinkSource } from "../src/links/parse"

const sources: LinkSource[] = [
  { key: "LINK_02_B", order: 2, href: "https://b.example/", slug: "b" },
  { key: "LINK_01_A", order: 1, href: "https://a.example/", slug: "a" },
  { key: "LINK_03_C", order: 3, href: "https://c.example/path", slug: "c", icon: "custom-c" },
]

const icon = { kind: "svg" as const, viewBox: "0 0 24 24", paths: ["M0 0"] }

describe("buildLinks", () => {
  it("orders by index regardless of source order, probes slashes and derives labels", async () => {
    const resolveIcon = vi.fn((slug: string, iconSlug: string) => {
      expect(iconSlug).toBe(slug === "c" ? "custom-c" : slug)
      return { icon, title: slug.toUpperCase() }
    })
    const probe = vi.fn(async (url: string) => (url.endsWith("/") ? 200 : 404))

    const links = await buildLinks({ sources, probe, resolveIcon })

    expect(links.map((link) => link.key)).toEqual(["LINK_01_A", "LINK_02_B", "LINK_03_C"])
    expect(links[0]?.href).toBe("https://a.example/")
    expect(links[2]?.href).toBe("https://c.example/path/")
    expect(links[2]?.label).toBe("C")
    expect(links[2]?.icon).toBe(icon)
    expect(resolveIcon).toHaveBeenCalledTimes(3)
  })

  it("orders by index regardless of env key insertion order", async () => {
    const env = {
      LINK_02_INSTAGRAM: "https://social.example/x",
      LINK_01_LINKEDIN: "https://social.example/y",
    }
    const build = (source: LinkEnv) =>
      buildLinks({
        sources: parseLinkSources(source),
        resolveIcon: () => ({ icon, title: "Title" }),
      })

    expect((await build(env)).map((link) => link.slug)).toEqual(["linkedin", "instagram"])
    expect(
      (await build(Object.fromEntries(Object.entries(env).reverse()))).map((link) => link.slug),
    ).toEqual(["linkedin", "instagram"])
  })

  it("rejects duplicate order indexes from env keys", async () => {
    await expect(
      buildLinks({
        sources: parseLinkSources({
          LINK_01_A: "https://a.example/",
          LINK_01_B: "https://b.example/",
        }),
        resolveIcon: () => ({ icon, title: "Title" }),
      }),
    ).rejects.toThrow(/Duplicate link order 1/)
  })

  it("rejects duplicate order indexes", async () => {
    await expect(
      buildLinks({
        sources: [
          ...sources,
          { key: "LINK_01_D", order: 1, href: "https://d.example/", slug: "d" },
        ],
        resolveIcon: () => ({ icon, title: "Title" }),
      }),
    ).rejects.toThrow(/Duplicate link order 1/)
  })

  it("uses the slash variant without a probe", async () => {
    const links = await buildLinks({
      sources,
      resolveIcon: () => ({ icon, title: "Title" }),
    })

    expect(links[0]?.href).toBe("https://a.example/")
  })
})
