import { describe, expect, it } from "vitest"
import { groupLinks } from "../src/links/group"
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

describe("groupLinks", () => {
  it("keeps single links in their own group", () => {
    expect(groupLinks([link("github"), link("x")])).toEqual([[link("github")], [link("x")]])
  })

  it("groups consecutive links of the same platform", () => {
    const groups = groupLinks([
      link("github"),
      link("bitcr", "BITCR_LINK_HOME"),
      link("bitcr", "BITCR_LINK_USE_CASES"),
      link("x"),
    ])

    expect(groups.map((group) => group.length)).toEqual([1, 2, 1])
    expect(groups[1].map((entry) => entry.key)).toEqual(["BITCR_LINK_HOME", "BITCR_LINK_USE_CASES"])
  })

  it("does not merge links that are not adjacent", () => {
    const groups = groupLinks([link("bitcr"), link("github"), link("bitcr")])
    expect(groups.map((group) => group.length)).toEqual([1, 1, 1])
  })
})
