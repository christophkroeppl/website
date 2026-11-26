export function externalAttrs(
  href: string,
): { target: string; rel: string } | Record<string, never> {
  return href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {}
}
