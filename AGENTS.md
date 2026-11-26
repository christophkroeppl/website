Always run `cf previews deploy` after implementing changes and check result yourself via tool or browser before you present it to the user.

## Generated code

`src/generated/` is gitignored and written by the build integrations on every
`astro sync`, `dev`, and `build`. Always go through the package scripts
(`bun run dev|build|check|test|typecheck`); the pre-commit hook runs `astro sync` first.

## Prerendering and hostnames

The site runs `output: "server"` and routes the links subdomain in `src/middleware.ts`.
Astro forbids rewriting an on-demand route to a prerendered one (`ForbiddenRewrite`),
so a page the middleware rewrites to must stay on-demand; bake its data at build time
instead of setting `prerender = true`.

## Icon packs

Icon packs are build-time only: add them as devDependencies and import them from
`integrations/` (never from a page), so the Worker bundle carries only the used icons.

## Unlighthouse v1 beta caveats

Use `unlighthouse.config.ts` for production and `unlighthouse.preview.config.ts`
with `UNLIGHTHOUSE_SITE` for a preview Worker.

- Preview Workers send `X-Robots-Tag: noindex`; omit the SEO category for preview scans.
- `sitemap.xml` always lists production URLs (`Astro.site` comes from build-time `siteUrl`),
  so preview scans need `scanner.sitemap: false` and the HTML crawler.
- Canonical and `x-default` alternates point at production. Set
  `scanner.ignoreI18nPages: false` or `--enable-i18n-pages`, otherwise preview scans
  audit zero routes.
- `defineUnlighthouseConfig` types are broken in `1.0.0-beta.1` (`TS2349`); export a
  plain config object instead.
- The 0.x config guide does not apply to v1: config `hooks`, Puppeteer options,
  dynamic/custom sampling and legacy robots.txt rules are ignored. Node >= 24.13.1 required.
