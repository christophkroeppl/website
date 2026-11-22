import { env } from "cloudflare:workers"

export default {
  fetch() {
    return new Response(`Hello ${env.TELEGRAM}!`)
  },
} satisfies ExportedHandler
