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
  link("ambassador"),
  link("github"),
  link("url1"),
  link("url2"),
  link("url3", "LINK_10_URL3"),
  link("url4", "LINK_11_URL4"),
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
      "ambassador",
      "website",
    ])
  })

  it("marks everything below github except the website as more links", () => {
    expect(drawerLinks(links).more.map((entry) => entry.key)).toEqual([
      "url1",
      "url2",
      "LINK_10_URL3",
      "LINK_11_URL4",
    ])
  })

  it("keeps every link visible when there is no github link", () => {
    const result = drawerLinks([link("x"), link("website")])
    expect(result.visible.map((entry) => entry.slug)).toEqual(["x", "website"])
    expect(result.more).toEqual([])
  })
})
