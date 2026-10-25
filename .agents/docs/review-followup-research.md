# Review follow-up research notes

## Astro 6 content collections follow-up

### Why switch from `import.meta.glob`

The previous docs route used `import.meta.glob()` and then rebuilt routing metadata manually.

Astro content collections are a better fit because they provide:

- typed collection entries
- schema validation for frontmatter
- `getCollection()` and `render()` helpers
- better alignment with Astro 6 content tooling

### Migration approach for this repo

- Keep the markdown files in `src/content/` because no other active tooling in this repo currently consumes them directly.
- Define a single `docs` collection with the Astro 6 `glob()` loader from `astro/loaders`.
- Preserve the original relative file path as the content entry ID so we can continue generating both:
  - clean URLs like `/docs/native/`
  - legacy URLs like `/docs/native/index.md`

### Astro 6 additions relevant here

- Astro 6 continues the content-layer/content-loader direction and makes content collections the preferred typed content API.
- The `render(entry)` API gives a properly typed `Content` component, which removes the need for loose `import.meta.glob()` module casting in the route.

## Mobile sidebar/menu research

### Requested UI behavior

- add a mobile menu button
- place it at the bottom-right corner
- use `astro-icon`
- use a Hugeicons menu icon

### Implementation notes

- `astro-icon` can render Iconify-backed Hugeicons entries directly
- the Iconify package for Hugeicons is `@iconify-json/hugeicons`
- a valid menu icon name is `hugeicons:menu-01`

### Best-practice behavior

- use a real `<button>`
- keep `aria-expanded`, `aria-controls`, and `aria-label` in sync
- close on overlay click and `Escape`
- keep the sidebar open by default on larger screens

## Native CSS migration research

The current site still relied on SCSS mostly for:

- variables
- nesting
- `lighten()` / `darken()`
- one small mixin

Modern CSS covers these well enough for this site via:

- custom properties
- CSS nesting
- `color-mix()`
- `@property`
- `@layer`

### Practical migration plan used here

- replace Sass variables with CSS custom properties in the shared stylesheet
- replace `lighten()` / `darken()` with `color-mix()`
- inline the single mixin as regular CSS declarations
- convert component `<style lang="scss">` blocks to plain `<style>`
- remove the `sass` dependency once no active imports rely on it

### Notes from the requested resources

- The “un-sass” guidance lines up with using native nesting, custom properties, and smaller build pipelines where Sass is no longer providing unique value.
- The standardized CSS improvements from the last several years are sufficient for this docs site, especially since Tailwind v4 is already CSS-first and works naturally with modern CSS primitives.
