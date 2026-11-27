import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { resolveIcon } from "../integrations/icons"

const root = process.cwd()

describe("resolveIcon", () => {
  it("resolves a pack icon and its title", () => {
    const { icon, title, shadowed } = resolveIcon(root, "github")
    expect(title).toBe("GitHub")
    expect(shadowed).toBe(false)
    expect(icon.kind).toBe("svg")
    if (icon.kind === "svg") expect(icon.paths.length).toBeGreaterThan(0)
  })

  it("prefers a custom icon without a pack shadow for linkedin", () => {
    const { icon, title, shadowed } = resolveIcon(root, "linkedin")
    expect(title).toBe("LinkedIn")
    expect(shadowed).toBe(false)
    expect(icon.kind).toBe("svg")
  })

  it("reports shadowing only when a custom icon overrides a pack icon", () => {
    const tmp = mkdtempSync(join(tmpdir(), "icons-"))
    mkdirSync(join(tmp, "public/icons"), { recursive: true })
    writeFileSync(
      join(tmp, "public/icons/github.svg"),
      '<svg viewBox="0 0 24 24"><path d="M0 0h1v1H0z"/></svg>',
    )
    expect(resolveIcon(tmp, "github").shadowed).toBe(true)
  })

  it("supports a group fill-rule", () => {
    const tmp = mkdtempSync(join(tmpdir(), "icons-"))
    mkdirSync(join(tmp, "public/icons"), { recursive: true })
    writeFileSync(
      join(tmp, "public/icons/test.svg"),
      '<svg viewBox="0 0 10 10"><g fill-rule="evenodd"><path d="M0 0h10v10H0z"/></g></svg>',
    )
    const { icon } = resolveIcon(tmp, "test")
    expect(icon).toMatchObject({ kind: "svg", fillRule: "evenodd" })
  })

  it("rejects unsupported SVG shapes", () => {
    const tmp = mkdtempSync(join(tmpdir(), "icons-"))
    mkdirSync(join(tmp, "public/icons"), { recursive: true })
    writeFileSync(
      join(tmp, "public/icons/test.svg"),
      '<svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="5"/></svg>',
    )
    expect(() => resolveIcon(tmp, "test")).toThrow(/only <path>/)
  })
})
