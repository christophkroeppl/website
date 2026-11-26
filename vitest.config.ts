import { cloudflareTest } from "@cloudflare/vitest-plugin"
import { defineConfig } from "vite-plus"

export default defineConfig({
  plugins: [cloudflareTest({ config: true })],
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
