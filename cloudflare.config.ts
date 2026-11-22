import { defineConfig } from "cf/config"

export default defineConfig({
  worker: {
    name: "website",
    compatibilityDate: "2026-11-22",
  },
})
