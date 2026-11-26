export const HTML_CACHE = "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400"
export const MACHINE_CACHE = "public, max-age=3600"
export const NO_STORE = "no-store"

export function applyResponsePolicy(
  response: Response,
  policy: { cache?: "html"; noindex?: boolean },
): Response {
  if (!response.headers.get("content-type")?.includes("text/html")) return response

  const headers = new Headers(response.headers)
  if (policy.noindex) headers.set("x-robots-tag", "noindex")
  if (policy.cache === "html") headers.set("cache-control", HTML_CACHE)

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}
