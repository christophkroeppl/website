import { cloudflare } from "@cloudflare/vite-plugin"
import { defineConfig } from "vite-plus"

export default defineConfig({
  plugins: [cloudflare()],
  fmt: {
    astro: true,
    ignorePatterns: [".agents/**", "src/generated/**"],
    overrides: [
      {
        files: [".vscode/extensions.json"],
        options: { printWidth: 1 },
      },
    ],
    semi: false,
    useTabs: false,
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  staged: {
    "*": "astro sync && vp check --fix",
  },
})
