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
