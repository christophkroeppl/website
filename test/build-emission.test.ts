import { mkdtempSync, readFileSync, existsSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { emitGenerated } from "../integrations/build"

describe("emitGenerated", () => {
  it("creates nested directories and overwrites on a second emit", () => {
    const root = mkdtempSync(join(tmpdir(), "emit-"))
    const relative = "generated/deep/file.ts"

    emitGenerated(root, relative, "first")
    expect(readFileSync(join(root, relative), "utf8")).toBe("first")

    emitGenerated(root, relative, "second")
    expect(readFileSync(join(root, relative), "utf8")).toBe("second")
    expect(existsSync(join(root, "generated/deep"))).toBe(true)
  })
})
