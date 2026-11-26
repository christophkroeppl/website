export const ASSET_EXTENSION =
  /\.(?:avif|css|gif|ico|jpeg|jpg|js|json|map|mjs|otf|png|svg|ttf|webp|woff2?)$/i

export const FILE_EXTENSION =
  /\.(?:html?|xhtml|pdf|png|jpe?g|gif|svg|webp|avif|ico|css|js|mjs|json|xml|txt|csv|zip|gz|tar|mp3|mp4|webm|mov|woff2?|ttf|otf)$/i

export function hasAssetExtension(pathname: string): boolean {
  return ASSET_EXTENSION.test(pathname.slice(pathname.lastIndexOf("/") + 1))
}
