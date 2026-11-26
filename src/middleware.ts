import { defineMiddleware } from "astro:middleware"
import { applyResponsePolicy } from "./lib/cache"
import { linksHostPolicy, notFound } from "./links/host"

export const onRequest = defineMiddleware(async (context, next) => {
  const { hostname, pathname } = context.url
  const policy = linksHostPolicy(hostname, pathname)

  if (policy.kind === "block") return notFound()
  const response = policy.kind === "rewrite" ? next(policy.target) : next()
  return applyResponsePolicy(await response, {
    cache: "html",
    noindex: policy.kind === "rewrite" || policy.noindex,
  })
})
