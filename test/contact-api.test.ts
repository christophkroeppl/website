import { beforeEach, describe, expect, it, vi } from "vitest"

const { env } = vi.hoisted(() => ({
  env: {
    TURNSTILE_SECRET_KEY: "secret",
    TELEGRAM_BOT_TOKEN: "bot",
    TELEGRAM_CHAT_ID: "chat",
  } as Record<string, string | undefined>,
}))

vi.mock("cloudflare:workers", () => ({ env }))

import { POST } from "../src/pages/api/contact"

const valid = {
  name: "Ada",
  email: "ada@example.com",
  message: "A message that is definitely longer than thirty characters.",
  token: "token",
}

function request(body: unknown): Request {
  return new Request("https://example.com/api/contact/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

const fetchMock = vi.fn()

beforeEach(() => {
  env.TURNSTILE_SECRET_KEY = "secret"
  env.TELEGRAM_BOT_TOKEN = "bot"
  env.TELEGRAM_CHAT_ID = "chat"
  fetchMock.mockReset()
  vi.stubGlobal("fetch", fetchMock)
})

describe("POST /api/contact", () => {
  it("accepts a valid submission", async () => {
    fetchMock
      .mockResolvedValueOnce(new Response(JSON.stringify({ success: true })))
      .mockResolvedValueOnce(new Response("{}", { status: 200 }))
    const response = await POST({ request: request(valid) } as never)
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ ok: true })
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it("rejects invalid JSON", async () => {
    const response = await POST({
      request: new Request("https://example.com/api/contact/", {
        method: "POST",
        body: "not json",
      }),
    } as never)
    expect(response.status).toBe(400)
  })

  it("rejects a misconfigured deployment before parsing the body", async () => {
    delete env.TURNSTILE_SECRET_KEY
    const response = await POST({
      request: new Request("https://example.com/api/contact/", {
        method: "POST",
        body: "not json",
      }),
    } as never)
    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({ error: "Server misconfigured" })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("rejects invalid input", async () => {
    const response = await POST({
      request: request({ name: "Ada", message: valid.message, token: "token" }),
    } as never)
    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: "Email or phone required", field: "email" })
  })

  it("fails when the Turnstile secret is missing", async () => {
    delete env.TURNSTILE_SECRET_KEY
    const response = await POST({ request: request(valid) } as never)
    expect(response.status).toBe(500)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("rejects a failed Turnstile check", async () => {
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ success: false })))
    const response = await POST({ request: request(valid) } as never)
    expect(response.status).toBe(400)
  })

  it("reports an unavailable Turnstile service", async () => {
    fetchMock.mockRejectedValueOnce(new Error("offline"))
    const response = await POST({ request: request(valid) } as never)
    expect(response.status).toBe(502)
    expect(await response.json()).toEqual({
      error: "Upstream unavailable",
      code: "TURNSTILE_UNAVAILABLE",
    })
  })

  it("fails when Telegram config is missing", async () => {
    delete env.TELEGRAM_BOT_TOKEN
    const response = await POST({ request: request(valid) } as never)
    expect(response.status).toBe(500)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("fails when the Telegram chat id is missing", async () => {
    delete env.TELEGRAM_CHAT_ID
    const response = await POST({ request: request(valid) } as never)
    expect(response.status).toBe(500)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("reports a rejected Telegram send", async () => {
    fetchMock
      .mockResolvedValueOnce(new Response(JSON.stringify({ success: true })))
      .mockResolvedValueOnce(new Response("{}", { status: 500 }))
    const response = await POST({ request: request(valid) } as never)
    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({ error: "Failed to send", code: "TELEGRAM_REJECTED" })
  })

  it("reports an unavailable Telegram service", async () => {
    fetchMock
      .mockResolvedValueOnce(new Response(JSON.stringify({ success: true })))
      .mockRejectedValueOnce(new Error("offline"))
    const response = await POST({ request: request(valid) } as never)
    expect(response.status).toBe(502)
    expect(await response.json()).toEqual({
      error: "Upstream unavailable",
      code: "TELEGRAM_UNAVAILABLE",
    })
  })
})
