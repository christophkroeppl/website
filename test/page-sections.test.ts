import { describe, expect, it } from "vitest"
import { cvSections } from "../src/lib/page-sections"

describe("cvSections", () => {
  it("keeps the canonical order", () => {
    expect(cvSections.map((section) => section.key)).toEqual([
      "profile",
      "experience",
      "skills",
      "education",
      "certifications",
      "languages",
      "bitcoin",
    ])
  })

  it("uses one accent and one primary section", () => {
    expect(cvSections.filter((section) => section.tone === "primary")).toHaveLength(1)
    expect(cvSections.filter((section) => section.tone === "accent")).toHaveLength(1)
  })
})
