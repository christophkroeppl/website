import { bindings, defineConfig } from "cf/config"
import * as entrypoint from "./src/index.ts" with { type: "cf-worker" }

export default defineConfig({
  worker: {
    name: "website",
    compatibilityDate: "2026-11-22",
    entrypoint,
    env: {
      TELEGRAM: bindings.text("telegram"),
    },
  },
})
