# Astro v6 refactor research notes

## Scope

This repo is a pnpm workspace with:

- a root Astro docs/demo site
- four publishable packages under `packages/`
- existing Node version pinning via `.nvmrc`

The root site was still on Astro 4 + Tailwind 3 and relied on several old patterns:

- removed resource helpers like `Astro.resolve()`
- old markdown rendering flow on the homepage
- direct filesystem globbing in `.astro` components
- font loading via raw `<link>` tags
- custom icon fonts instead of SVG icon tooling

## Current repo findings

### Root app

- `package.json`
  - Astro `^4.10.0`
  - `@astrojs/check` `^0.7.0`
  - Tailwind `3.4.4`
  - no adapter
  - no icon integration
  - no mise config
- `astro.config.ts`
  - empty
- `src/pages`
  - `index.astro` used `Astro.fetchContent('../../README.md')`
  - `demo/index.astro` used old static script path conventions
- `src/layouts/BaseLayout.astro`
  - used `Astro.resolve()` for styles
  - loaded Google Fonts manually
- `src/components/Sidebar.astro`
  - used `fast-glob('docs/**/*.md')`
  - depended on a font icon glyph for chevrons
- `src/content`
  - contains the actual documentation corpus and should be treated as the source of truth

### Workspace/tooling

- `.nvmrc` pins Node `22`
- `pnpm-workspace.yaml` includes `packages/**`
- no `mise.toml` or `.mise.toml` existed

### Validation baseline

I attempted a full `corepack pnpm install` before refactoring.

Observed blocker:

- workspace install failed on `packages/animate` while resolving `npm:@jsr/dynimorius__color-utilities@^1.0.11`
- the environment could not resolve `npm.jsr.io`

This is a repo-level validation issue unrelated to the Astro migration itself, but it affects the ability to do a full clean install in this sandbox.

## Astro v6 research summary

### Astro core

Recommended migration targets for this repo:

- upgrade to Astro 6.x
- keep the site on modern ESM-only patterns
- replace removed APIs with standard imports and Vite URLs
- move markdown docs to a single dynamic route instead of ad-hoc rendering

Practical implications here:

- import global styles directly in layout frontmatter
- use `?url` for client script assets
- build docs pages from `import.meta.glob('/src/content/**/*.md')`

### Astro auto adapter

Best fit for this repo:

- use `astro-auto-adapter` in config
- keep adapter selection environment-driven
- default to server output so the adapter is active and portable
- use Node standalone mode as the safe default fallback

Reasoning:

- the user explicitly requested `astro-auto-adapter`
- deployment target is not pinned in this repo
- auto adapter keeps the site portable while still allowing later hard-pinning if production hosting becomes fixed

### Astro fonts API

Best fit for this repo:

- move typography to the Astro fonts config
- define CSS variables in config and consume them from Tailwind/theme CSS
- self-host through Astro’s providers instead of raw `<link>` tags

Recommended fonts for this refactor:

- Lexend for body/UI text
- Geist Mono for code and demos

Benefits:

- cleaner head markup
- centralized font management
- predictable CSS variable integration

### Icons: `astro-icon` + `unplugin-icons`

Recommended split:

- `astro-icon` for content/UI icons rendered by Astro components
- `unplugin-icons` for direct component imports where a Vite-generated Astro component is convenient

Applied rationale in this repo:

- `astro-icon` is a good replacement for the hand-written playback SVG switch
- `unplugin-icons` is a good replacement for the old sidebar chevron icon font

### Tailwind v4

Best practices for this repo:

- use `@tailwindcss/vite`
- switch to CSS-first configuration
- define custom colors and fonts through `@theme`
- remove reliance on old Tailwind entry directives and old config assumptions

Important migration note:

- this repo already has a lot of SCSS; the least risky path is not a full styling rewrite
- instead, keep SCSS where it provides value, but let Tailwind v4 generate utilities and theme tokens

### Markdown/docs architecture

Recommended structure:

- keep markdown files in `src/content`
- create one catch-all docs route under `src/pages/docs/[...slug].astro`
- generate both:
  - pretty URLs like `/docs/animate/`
  - legacy URLs like `/docs/animate/index.md`

Why this matters:

- existing markdown content already links to many `.md` paths
- dual-route generation preserves those links during migration

## Dependency research and decisions

### New/updated root site dependencies

- `astro` → `^6.1.9`
- `@astrojs/check` → `^0.9.8`
- `tailwindcss` → `^4.2.4`
- `@tailwindcss/vite` → `^4.2.4`
- `astro-auto-adapter` → `^2.5.5`
- `astro-icon` → `^1.1.5`
- `unplugin-icons` → `^23.0.1`
- `@iconify-json/fluent` → `^1.2.45`
- `typescript` → `^6.0.2`

Security check:

- GitHub advisory database returned no known vulnerabilities for the newly added npm packages above

## Mise research

Recommended usage for this repo:

- keep version pinning at the workspace root
- align mise with the existing Node policy from `.nvmrc`
- pin pnpm explicitly because the repo already depends on pnpm workspace behavior

Minimal config:

```toml
[tools]
node = "22"
pnpm = "9.2.0"
```

Why add mise here:

- it complements `.nvmrc` instead of replacing it
- it makes the repo easier to bootstrap in CI/devcontainers/Codespaces
- it keeps Node + pnpm aligned for Astro, Vite, and workspace scripts

## Refactor direction chosen for this repo

1. Upgrade the root docs site to Astro 6.
2. Add `astro-auto-adapter`, Astro fonts config, Tailwind v4, `astro-icon`, and `unplugin-icons`.
3. Replace removed Astro patterns with import-based equivalents.
4. Build docs pages from the markdown corpus in `src/content`.
5. Preserve legacy `.md` documentation links while also exposing clean URLs.
6. Add mise config at the repo root.

## Remaining follow-up items after the core refactor

- resolve the `packages/animate` JSR install blocker cleanly for full workspace installs
- decide whether production should remain on auto-adapter or be pinned to one official deployment adapter
- optionally add richer docs features later:
  - content collections schema
  - syntax highlighting upgrades
  - generated table of contents
  - search
