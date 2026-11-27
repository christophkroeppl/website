import { describe, expect, it } from "vitest"
import { resolveSlash, slashVariants } from "../src/links/slash"

const statuses =
  (map: Record<string, number | undefined>) =>
  async (url: string): Promise<number | undefined> =>
    map[url]

describe("slashVariants", () => {
  it("returns both variants", () => {
    expect(slashVariants("https://example.com/path")).toEqual({
      withSlash: "https://example.com/path/",
      withoutSlash: "https://example.com/path",
    })
    expect(slashVariants("https://example.org/doc/")).toEqual({
      withSlash: "https://example.org/doc/",
      withoutSlash: "https://example.org/doc",
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
    const probe = statuses({ "https://example.com/foo/": 200, "https://example.com/foo": 200 })
    expect(await resolveSlash("https://example.com/foo", probe)).toBe("https://example.com/foo/")
  })

  it("drops the slash when only the bare path works", async () => {
    const probe = statuses({
      "https://example.org/doc/": 404,
      "https://example.org/doc": 200,
    })
    expect(await resolveSlash("https://example.org/doc/", probe)).toBe("https://example.org/doc")
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
    const probe = statuses({ "https://example.net/user/": 403, "https://example.net/user": 403 })
    expect(await resolveSlash("https://example.net/user", probe)).toBe("https://example.net/user/")
  })
})
