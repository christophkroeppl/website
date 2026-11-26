import { describe, expect, it } from "vitest"
import { FEATURED_PROJECT_COUNT, projectPosition, splitProjects } from "../src/lib/projects"

describe("project splitting", () => {
  const items = Array.from({ length: 5 }, (_, index) => index)

  it("splits featured and remaining without overlap", () => {
    const { featured, remaining } = splitProjects(items)
    expect(featured).toEqual([0, 1, 2])
    expect(remaining).toEqual([3, 4])
    expect([...featured, ...remaining]).toEqual(items)
  })

  it("numbers every project sequentially across the split", () => {
    const { featured, remaining } = splitProjects(items)
    const numbers = [
      ...featured.map((_, index) => projectPosition(0, index)),
      ...remaining.map((_, index) => projectPosition(FEATURED_PROJECT_COUNT, index)),
    ]
    expect(numbers).toEqual([1, 2, 3, 4, 5])
  })
})
