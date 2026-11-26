import { cloudflareTest } from "@cloudflare/vitest-plugin"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vite-plus"

export default defineConfig({
  plugins: [cloudflareTest({ config: true })],
  resolve: {
    alias: {
      "virtual:astro-localized-routes": fileURLToPath(
        new URL("./test/mocks/localized-routes.ts", import.meta.url),
      ),
    },
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          include: ["test/**/*.test.ts"],
          exclude: [
            "test/icons.test.ts",
            "test/links-deps.test.ts",
            "test/daisyui-include.test.ts",
          ],
        },
      },
      {
        extends: false,
        test: {
          include: [
            "test/icons.test.ts",
            "test/links-deps.test.ts",
            "test/daisyui-include.test.ts",
          ],
          environment: "node",
        },
      },
    ],
  },
})
