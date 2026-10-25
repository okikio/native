# Thunderstrike reference audit

## Reference material received

The task included a reference `package.json`, `tsconfig.json`, and `astro.config.ts` from a professional Astro 6 site.

That reference uses:

- Astro 6
- `astro-auto-adapter`
- Astro fonts config
- `astro-icon`
- `unplugin-icons`
- Tailwind v4 through `@tailwindcss/vite`
- modern TypeScript strict settings
- environment-aware adapter selection

## What was directly useful for this repo

### 1. Adapter pattern

Useful pattern:

- compute adapter mode from `AUTO_ASTRO_ADAPTER_ENV_VAR`
- keep adapter selection environment-driven
- set Node standalone mode as a stable default

Why it transfers well:

- this repo does not have a fixed deployment adapter yet
- the docs app is small enough that the auto-adapter approach is low-risk

### 2. Fonts API pattern

Useful pattern:

- declare fonts in `astro.config.ts`
- use CSS variables instead of hard-coded font `<link>` tags

Why it transfers well:

- this repo previously loaded Lexend manually
- the new API produces a cleaner base layout

### 3. Icon stack

Useful pattern:

- pair `astro-icon` with `unplugin-icons`
- use icon subsets instead of whole icon fonts

Why it transfers well:

- this repo previously used a font icon for navigation chevrons
- the playback control icons were hand-maintained inline SVG

### 4. Tailwind v4 through Vite

Useful pattern:

- use `@tailwindcss/vite`
- move toward CSS-first theme tokens

Why it transfers well:

- the root app is small
- it already leans on utility classes inside SCSS and Astro components

## Thunderstrike repo/site access note

I attempted to inspect the public GitHub repository and site directly from this environment.

Observed results:

- `github-mcp-server-get_file_contents` for `thunderstrike/blog` returned `404`
- `web_fetch` for `https://github.com/thunderstrike/blog` returned `404`
- `web_fetch` for `https://thunderstrike.co` failed in this sandbox

Conclusion:

- I could not independently verify the live Thunderstrike repository from the network available in this session
- the audit therefore uses the reference files supplied in the task prompt as the authoritative Thunderstrike input

## Dependency comparison: Thunderstrike reference vs this repo

### Shared modernization themes

- Astro 6
- Tailwind 4
- Astro fonts API
- `astro-auto-adapter`
- `astro-icon`
- `unplugin-icons`

### Reference-only packages not needed here

The Thunderstrike example also includes packages that are specific to that blog and not justified for this repo’s docs site:

- `@astrojs/mdx`
- `@astrojs/react`
- `@astrojs/rss`
- `@astrojs/sitemap`
- deployment-specific adapters like Netlify/Vercel/Node/Deno
- CMS/data tooling
- image/font/storage/database packages tied to that app

Why not copy them blindly:

- they would increase complexity without solving a problem in this repo
- this repo’s docs site is currently static markdown + a small demo
- the user asked for modern patterns, not dependency inflation

## Outcome for this repo

The Thunderstrike reference is best used here as a pattern source, not as a package-for-package template.

The right translation for `okikio/native` is:

- adopt the same modern Astro platform pieces
- keep the implementation small and docs-focused
- avoid bringing over app-specific integrations that the current site does not need
