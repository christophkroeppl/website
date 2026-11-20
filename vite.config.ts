import { cloudflare } from "@cloudflare/vite-plugin"
import { defineConfig } from "vite-plus"

export default defineConfig({
  plugins: [cloudflare()],
  fmt: {
    ignorePatterns: [".agents/**"],
    semi: false,
    useTabs: false,
    overrides: [
      {
        files: [".vscode/extensions.json"],
        options: { printWidth: 1 },
      },
    ],
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  staged: {
    "*": "vp check --fix",
  },
})
