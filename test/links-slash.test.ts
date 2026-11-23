import { describe, expect, it } from "vitest"
import { resolveSlash, slashVariants } from "../src/links/slash"

const statuses =
  (map: Record<string, number | undefined>) =>
  async (url: string): Promise<number | undefined> =>
    map[url]

describe("slashVariants", () => {
  it("returns both variants", () => {
    expect(slashVariants("https://x.com/christophkrppl")).toEqual({
      withSlash: "https://x.com/christophkrppl/",
      withoutSlash: "https://x.com/christophkrppl",
    })
    expect(slashVariants("https://bitcoin.org/en/bitcoin-paper/")).toEqual({
      withSlash: "https://bitcoin.org/en/bitcoin-paper/",
      withoutSlash: "https://bitcoin.org/en/bitcoin-paper",
    })
  })

  it("ignores roots, files, queries, fragments and non-http", () => {
    for (const href of [
      "https://example.com/",
      "https://example.com/file.pdf",
      "https://example.com/search?q=1",
      "https://example.com/page#top",
      "mailto:mail@example.com",
      "tel:+4312345678",
    ]) {
      expect(slashVariants(href)).toBeUndefined()
    }
  })
})

describe("resolveSlash", () => {
  it("prefers the slashed variant when both work", async () => {
    const probe = statuses({ "https://x.com/foo/": 200, "https://x.com/foo": 200 })
    expect(await resolveSlash("https://x.com/foo", probe)).toBe("https://x.com/foo/")
  })

  it("drops the slash when only the bare path works", async () => {
    const probe = statuses({
      "https://bitcoin.org/en/bitcoin-paper/": 404,
      "https://bitcoin.org/en/bitcoin-paper": 200,
    })
    expect(await resolveSlash("https://bitcoin.org/en/bitcoin-paper/", probe)).toBe(
      "https://bitcoin.org/en/bitcoin-paper",
    )
  })

  it("keeps the given value when neither variant works", async () => {
    const href = "https://example.com/foo"
    const probe = statuses({ "https://example.com/foo/": 404, "https://example.com/foo": 500 })
    expect(await resolveSlash(href, probe)).toBe(href)
  })

  it("keeps the given value when the probe fails", async () => {
    const href = "https://example.com/foo"
    expect(await resolveSlash(href, statuses({}))).toBe(href)
  })

  it("treats forbidden responses as reachable", async () => {
    const probe = statuses({ "https://linkedin.com/in/x/": 403, "https://linkedin.com/in/x": 403 })
    expect(await resolveSlash("https://linkedin.com/in/x", probe)).toBe(
      "https://linkedin.com/in/x/",
    )
  })
})
