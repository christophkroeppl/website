import { describe, expect, it } from "vitest"
import packageJson from "../package.json"

describe("links icon pack", () => {
  it("is a dev dependency, not a runtime dependency", () => {
    expect(packageJson.devDependencies).toHaveProperty("simple-icons")
    expect(packageJson.dependencies ?? {}).not.toHaveProperty("simple-icons")
  })
})
