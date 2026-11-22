import { z } from "zod"
import type { APIRoute } from "astro"
import { env as cfEnv } from "cloudflare:workers"

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

export const POST: APIRoute = async ({ request }) => {
  const env = cfEnv as any
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: "Invalid input" }), { status: 400 })
  }
  const { name, email, phone, message, token } = parsed.data

  const secret = env.TURNSTILE_SECRET_KEY
  if (!secret) {
    return new Response(JSON.stringify({ error: "Server misconfigured" }), { status: 500 })
  }

  const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token }),
  })
  const verify = (await verifyRes.json()) as { success: boolean }
  if (!verify.success) {
    return new Response(JSON.stringify({ error: "Turnstile failed" }), { status: 400 })
  }

  const botToken = env.TELEGRAM_BOT_TOKEN
  const chatId = env.TELEGRAM_CHAT_ID
  if (!botToken || !chatId) {
    return new Response(JSON.stringify({ error: "Server misconfigured" }), { status: 500 })
  }

  const text = `New contact form message\nName: ${name}\nEmail: ${email || "-"}\nPhone: ${phone || "-"}\n\n${message}`
  const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  })
  if (!tgRes.ok) {
    return new Response(JSON.stringify({ error: "Failed to send" }), { status: 500 })
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 })
}
