import { describe, expect, it } from "vitest"
import { pageMeta } from "../src/lib/page-meta"
import { pageRoutes } from "../src/i18n/routes"

describe("pageMeta", () => {
  it("covers every page", () => {
    expect(Object.keys(pageMeta).sort()).toEqual(Object.keys(pageRoutes).sort())
  })
})
