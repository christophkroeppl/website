import { loadEnv } from "vite"

export function loadBuildEnv(mode: string, root: string): Record<string, string> {
  return loadEnv(mode, root, "")
}
