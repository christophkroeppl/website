import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import packageJson from "../package.json"

function files(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const pathname = join(dir, entry.name)
    return entry.isDirectory() ? files(pathname) : [pathname]
  })
}

describe("icon boundary", () => {
  it("keeps node-only icon resolution out of the runtime tree", () => {
    for (const file of files("src")) {
      if (!/\.(ts|astro)$/.test(file)) continue
      const source = readFileSync(file, "utf8")
      expect(source, file).not.toContain('from "simple-icons"')
      expect(source, file).not.toContain('from "node:fs"')
      expect(source, file).not.toContain('from "node:path"')
    }
  })

  it("keeps simple-icons as a dev dependency", () => {
    expect(packageJson.devDependencies).toHaveProperty("simple-icons")
    expect(packageJson.dependencies ?? {}).not.toHaveProperty("simple-icons")
  })
})
