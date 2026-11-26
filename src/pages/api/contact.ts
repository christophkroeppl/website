import { z } from "zod"
import type { APIRoute } from "astro"
import { env as cfEnv } from "cloudflare:workers"

function json(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  })
}

const schema = z
  .object({
    name: z.string().min(1).max(100),
    email: z.email().optional().or(z.literal("")),
    phone: z.string().max(50).optional().or(z.literal("")),
    message: z.string().min(30).max(1500),
    token: z.string().min(1),
  })
  .refine((data) => Boolean(data.email || data.phone), {
    message: "Email or phone required",
    path: ["email"],
  })

type ContactConfig = {
  secret: string
  botToken: string
  chatId: string
}

function contactConfig(): ContactConfig | undefined {
  const secret = cfEnv.TURNSTILE_SECRET_KEY
  const botToken = cfEnv.TELEGRAM_BOT_TOKEN
  const chatId = cfEnv.TELEGRAM_CHAT_ID

  if (!secret || !botToken || !chatId) return undefined
  return { secret, botToken, chatId }
}

export const POST: APIRoute = async ({ request }) => {
  const config = contactConfig()
  if (!config) {
    return json({ error: "Server misconfigured" }, 500)
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json({ error: "Invalid JSON" }, 400)
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return json({ error: issue?.message ?? "Invalid input", field: issue?.path[0] }, 400)
  }
  const { name, email, phone, message, token } = parsed.data

  let verify: { success: boolean }
  try {
    const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: config.secret, response: token }),
      signal: AbortSignal.timeout(5000),
    })
    verify = (await verifyRes.json()) as { success: boolean }
  } catch {
    return json({ error: "Upstream unavailable", code: "TURNSTILE_UNAVAILABLE" }, 502)
  }
  if (!verify.success) {
    return json({ error: "Turnstile failed" }, 400)
  }

  const text = `New contact form message\nName: ${name}\nEmail: ${email || "-"}\nPhone: ${phone || "-"}\n\n${message}`
  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${config.botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: config.chatId, text }),
      signal: AbortSignal.timeout(5000),
    })
    if (!tgRes.ok) {
      return json({ error: "Failed to send", code: "TELEGRAM_REJECTED" }, 500)
    }
  } catch {
    return json({ error: "Upstream unavailable", code: "TELEGRAM_UNAVAILABLE" }, 502)
  }

  return json({ ok: true }, 200)
}
