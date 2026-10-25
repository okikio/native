# native

This repository contains four browser libraries and the Astro site that documents them. Choose the package for the operation your application needs:

| Package | What it provides | Guide |
| --- | --- | --- |
| `@okikio/manager` | A collection built around `Map`, with convenience methods and array results for keys and values. | [Manager](src/content/manager/index.md) |
| `@okikio/emitter` | Named events and listeners for communication between application components. | [Emitter](src/content/emitter/index.md) |
| `@okikio/animate` | Animation controls built on the Web Animations API. | [Animate](src/content/animate/index.md) |
| `@okikio/native` | An application and service model, including optional navigation that replaces page content without a full reload. | [Native](src/content/native/index.md) |

The package implementations live in `packages/`. The documentation site lives in `src/`. A change to the site does not by itself release a new library version.

## Run the documentation site

Use Node 22 and pnpm 9.2.0, as selected in `.mise.toml` and `package.json`. If you use Mise, run `mise install` to provision those tools.

Install the workspace dependencies:

```sh
pnpm install
```

Start the development server:

```sh
pnpm dev
```

Open the local URL printed by Astro. The home page links to the package documentation at `/docs/` and the examples at `/demo/`.

To check and build the site, run:

```sh
pnpm build
```

This command runs `astro check` before `astro build`. After a successful build, use `pnpm preview` to inspect the built site. Resolve reported errors before treating the site as ready to deploy.

## Follow a documentation page

1. Edit the Markdown page under `src/content/`.
2. `src/content.config.ts` loads the Markdown into the `docs` collection.
3. `src/lib/docs.ts` derives page labels, navigation, and URLs from each entry.
4. `src/pages/docs/[...slug].astro` renders the entry with `PagesLayout`.

The route generates both directory-style URLs, such as `/docs/animate/`, and the older `.md` URLs. Keep that mapping in mind when changing a page's path. Existing links may use either form.

## Find the implementation

| Path | What to change there |
| --- | --- |
| `packages/` | Library source, package tests, package manifests, and changelogs. |
| `src/content/` | Package guides and API documentation in Markdown. |
| `src/pages/` | Astro page routes, including the home page and demo. |
| `src/components/` and `src/layouts/` | Reusable site components and page structure. |
| `src/lib/docs.ts` | Documentation IDs, URLs, navigation, and breadcrumbs. |
| `src/style/` | Site styles in CSS. |
| `src/scripts/` | Browser behavior used by the site. |
| `public/` | Assets served without source transformation. |
| `astro.config.ts` | Astro, adapter, icon, and build configuration. |

## Contribute

Read the affected package's guide before changing its public behavior. Describe the problem, the changed behavior, and the checks you ran in the PR. For documentation changes, follow the page from navigation to the rendered content and check its examples and links.

The repository uses [Changesets](https://github.com/changesets/changesets) for package versioning and changelogs. A package change and a documentation-site deployment are separate operations; select the release action that matches the change.

## License

See [LICENSE](LICENSE) for the MIT license.
