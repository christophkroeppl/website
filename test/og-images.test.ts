import { describe, expect, it } from "vitest"
import { palette } from "../integrations/og-images"

const tokens = {
  base100: "oklch(99% 0.005 95)",
  base200: "oklch(97% 0.008 95)",
  base300: "oklch(93.3% 0.012 95)",
  baseContent: "oklch(24% 0.012 95)",
  primary: "oklch(47% 0.12 164)",
  secondary: "oklch(54% 0.14 55)",
  accent: "oklch(48% 0.12 255)",
  warning: "oklch(75% 0.15 78)",
  error: "oklch(52% 0.18 25)",
}

describe("og palette", () => {
  it("passes theme tokens to satori with alpha suffixes", () => {
    const colors = palette(tokens)

    expect(colors.base).toBe(tokens.base100)
    expect(colors.primary).toBe(tokens.primary)
    expect(colors.primaryGlow).toBe(`${tokens.primary} / 13%`)
    expect(colors.accentClear).toBe(`${tokens.accent} / 0%`)
  })
})
