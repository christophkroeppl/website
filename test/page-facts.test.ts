import { describe, expect, it } from "vitest"
import { RIS_MEDIA_LAW_LABEL, RIS_MEDIA_LAW_URL } from "../src/lib/page-facts"

describe("page facts", () => {
  it("pins the media-law source", () => {
    expect(RIS_MEDIA_LAW_LABEL).toBe("§ 25 Mediengesetz (RIS)")
    expect(RIS_MEDIA_LAW_URL).toBe(
      "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10000719&Paragraf=25",
    )
  })
})
