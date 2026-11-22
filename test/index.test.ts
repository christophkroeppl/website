import { SELF } from "cloudflare:test"
import { expect, it } from "vite-plus/test"

it("responds using the configured Worker binding", async () => {
  const response = await SELF.fetch("https://example.com/")
  expect(response.status).toBe(200)
  expect(await response.text()).toBe("Hello TELEGRAM!")
})
