import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import {
  collectArtifactRefs,
  embedDiagram,
  mediaKey,
  publicToDest,
} from "../integrations/project-media"

function artifactRoot(): string {
  const root = mkdtempSync(join(tmpdir(), "project-media-"))
  const dir = join(root, "src/content/pages/projects")
  mkdirSync(dir, { recursive: true })
  for (const lang of ["de", "en"]) {
    writeFileSync(
      join(dir, `bases-mcp.${lang}.md`),
      `---\nartifact:\n  src: /generated/projects/bases-mcp.html\n---\n`,
    )
  }
  return root
}

const source = `<!DOCTYPE html>
<html data-embed="true">
<head><style>.diagram-nav { display: flex; }</style></head>
<body>
  <div class="container">
    <div class="diagram-container">
      <svg viewBox="0 0 100 50"></svg>
      <div class="diagram-nav">
        <button id="btn-route-probe"></button>
        <button data-view="out"></button>
        <button data-view="reset"><span data-view-percent>100%</span></button>
        <button data-view="in"></button>
      </div>
    </div>
  </div>
</body>
</html>`

const tokens = {
  base100: "#fff",
  base200: "#eee",
  base300: "#ddd",
  baseContent: "#111",
  primary: "#00f",
  secondary: "#0f0",
  accent: "#f0f",
  warning: "#fa0",
  error: "#f00",
  rgb: (value: string, alpha = 1) => `rgba(${value}, ${alpha})`,
  mix: (value: string, percent: number) => `color-mix(in oklab, ${value} ${percent}%, transparent)`,
}

describe("embedDiagram", () => {
  it("keeps the zoom stepper and adds a pinch handler exactly once", () => {
    const result = embedDiagram(source, tokens)

    expect(result.match(/id="project-media-embed"/g)).toHaveLength(1)
    expect(result.match(/id="project-media-embed-viewer"/g)).toHaveLength(1)
    expect(result).toContain(
      'html[data-embed="true"] .diagram-nav { display: inline-flex !important; }',
    )
    expect(result).toMatch(/html\[data-embed="true"\] \.diagram-nav > button:not\(\[data-view\]\)/)
    expect(result).toContain("touch-action: none !important")
    expect(result).toContain("pointerdown'")
    expect(result).toContain("zoomIn()")

    expect(embedDiagram(result, tokens)).toBe(result)
  })
})

describe("collectArtifactRefs", () => {
  it("returns content references deduplicated across locales", () => {
    const root = artifactRoot()
    try {
      expect(collectArtifactRefs(root)).toEqual([
        {
          slug: "bases-mcp",
          kind: "src",
          url: "/generated/projects/bases-mcp.html",
        },
      ])
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })
})

describe("publicToDest", () => {
  it("maps a public URL to its build destination", () => {
    expect(publicToDest("/generated/projects/bases-mcp.html")).toBe(
      "public/generated/projects/bases-mcp.html",
    )
  })
})

describe("mediaKey", () => {
  it("keys remote media by repo, rev and path", () => {
    const media = {
      repo: "christophkroeppl/oc-go-usage-display",
      rev: "8bab88e3183c9941f3f9b34e9ce07ed78d21c046",
      path: "docs/compare/opencode.webp",
      slug: "oc-go-usage-display",
      kind: "before" as const,
    }

    expect(mediaKey(media)).toBe(mediaKey(media))
    expect(mediaKey({ ...media, rev: "other" })).not.toBe(mediaKey(media))
  })
})
