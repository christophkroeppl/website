import { describe, expect, it } from "vitest"
import { embedDiagram } from "../integrations/project-media"

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
