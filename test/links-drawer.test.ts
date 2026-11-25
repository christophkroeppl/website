import { describe, expect, it } from "vitest"
import { drawerLinks } from "../src/links/drawer"
import type { Link } from "../src/links/types"

function link(slug: string, key = slug): Link {
  return {
    key,
    href: "https://example.com/",
    label: slug,
    slug,
    icon: { kind: "svg", viewBox: "0 0 24 24", paths: ["M0 0h24v24H0z"] },
  }
}

const links = [
  link("linkedin"),
  link("instagram"),
  link("facebook"),
  link("x"),
  link("github"),
  link("free-cities-foundation"),
  link("bitcoin"),
  link("bitcr", "BITCR_LINK_HOME"),
  link("bitcr", "BITCR_LINK_USE_CASES"),
  link("website"),
]

describe("drawerLinks", () => {
  it("moves the website directly after github among the visible links", () => {
    expect(drawerLinks(links).visible.map((entry) => entry.slug)).toEqual([
      "linkedin",
      "instagram",
      "facebook",
      "x",
      "github",
      "website",
    ])
  })

  it("marks everything below github except the website as more links", () => {
    expect(drawerLinks(links).more.map((entry) => entry.key)).toEqual([
      "free-cities-foundation",
      "bitcoin",
      "BITCR_LINK_HOME",
      "BITCR_LINK_USE_CASES",
    ])
  })

  it("keeps every link visible when there is no github link", () => {
    const result = drawerLinks([link("x"), link("website")])
    expect(result.visible.map((entry) => entry.slug)).toEqual(["x", "website"])
    expect(result.more).toEqual([])
  })
})
