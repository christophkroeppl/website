import { describe, expect, it } from "vitest"
import { parseFrontmatter } from "../src/lib/frontmatter"
import { inline, renderFrontmatter, stripFrontmatter, tokenCount } from "../src/lib/text"

describe("inline", () => {
  it("turns anchors into markdown links", () => {
    expect(
      inline(
        'most recently <a class="link link-hover" href="https://tagesdosis.at/" target="_blank" rel="noopener noreferrer">Tagesdosis.at</a> on Bun',
      ),
    ).toBe("most recently [Tagesdosis.at](https://tagesdosis.at/) on Bun")
  })

  it("accepts single quoted hrefs", () => {
    expect(inline("<a href='https://example.com/'>Example</a>")).toBe(
      "[Example](https://example.com/)",
    )
  })

  it("drops remaining tags and normalizes spaces and ampersands", () => {
    expect(inline("<strong>A</strong> &amp; B&nbsp;C")).toBe("A & B C")
  })

  it("keeps entities escaped so they cannot resurface as html", () => {
    expect(inline("&lt;em&gt;not a tag&lt;/em&gt;")).toBe("&lt;em&gt;not a tag&lt;/em&gt;")
  })

  it("leaves plain text untouched", () => {
    expect(inline("Odoo 13→15 · €500,000")).toBe("Odoo 13→15 · €500,000")
  })

  it("stays fast on unterminated anchors", () => {
    const inputs = [
      '<a href="x" '.repeat(2000),
      `${'<a href="x" '.repeat(2000)}>`,
      `${'<a href="x">'.repeat(2000)}unclosed`,
    ]

    for (const input of inputs) {
      const started = performance.now()

      inline(input)

      expect(performance.now() - started, input.slice(0, 24)).toBeLessThan(1000)
    }
  })
})

describe("renderFrontmatter", () => {
  it("produces yaml that parses back to the same values", () => {
    const fields = {
      title: "Projekte — Christoph Kröppl",
      canonical: "https://kroeppl.ch/projekte/",
      lang: "de-AT",
      summary:
        "Open-Source-Projekte und ausgewählte Arbeiten: bases-mcp, guarden und oc-go-usage-display.",
    }

    const block = renderFrontmatter(fields)

    expect(block.startsWith("---\n")).toBe(true)
    expect(block.endsWith("\n---")).toBe(true)
    expect(parseFrontmatter(renderFrontmatter(fields))).toEqual(fields)
  })

  it("survives colons, quotes, hashes and euro signs", () => {
    const fields = { title: 'A "quoted": title # with hash — €500k', lang: "en" }

    expect(parseFrontmatter(renderFrontmatter(fields))).toEqual(fields)
  })
})

describe("stripFrontmatter", () => {
  it("removes the leading yaml block", () => {
    expect(stripFrontmatter('---\ntitle: "X"\n---\n\n# Body\n')).toBe("# Body")
  })

  it("leaves documents without frontmatter alone", () => {
    expect(stripFrontmatter("# Body\n")).toBe("# Body")
  })

  it("keeps horizontal rules in the body", () => {
    expect(stripFrontmatter('---\ntitle: "X"\n---\n\nA\n\n---\n\nB\n')).toBe("A\n\n---\n\nB")
  })
})

describe("tokenCount", () => {
  it("estimates one token per four characters", () => {
    expect(tokenCount("")).toBe(0)
    expect(tokenCount("abcd")).toBe(1)
    expect(tokenCount("abcde")).toBe(2)
  })
})
