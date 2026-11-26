import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

export type BuildContext = {
  root: string
  mode: string
  command: string
}

export function buildContext(configRoot: URL, command: string): BuildContext {
  const root = fileURLToPath(configRoot)
  const mode = command === "build" ? "production" : "development"

  return { root, mode, command }
}

export function emitGenerated(root: string, relative: string, body: string | Buffer): void {
  const target = path.join(root, relative)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, body)
}
