---
layout: layout:PagesLayout
---

## Contributing

If there is something I missed, a mistake, or a feature you would like added please create an issue or a pull request and I'll try to get to it.

> _**Warning**: all contributions must be done on the `beta` branch. By default Gitpod will open on the `beta` branch, but still keep this in mind._

*The `native` initiative uses [Changesets](https://github.com/atlassian/changesets/blob/main/docs/intro-to-using-changesets.md#adding-changesets), for versioning and Changelog generation, you don't need to create one, but it would be amazing if you could.*

### Using Gitpod

You can try out `@okikio/native` using [Gitpod](https://www.gitpod.io/) (it's a free to use online IDE):

[![Open In Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/okikio/native/blob/beta/packages/native/README.md)

You can start the dev script by typing into the terminal,

```bash
pnpm start
```

*`pnpm start` will launch a small demo website built using [`Astro`](https://astro.build), all changes to the `build folder` should be reflected live (you may need to reload the webpage if your changes aren't appearing).*

> _**Note**: I used [`Astro`](https://astro.build) & [`solidjs`](https://www.solidjs.com/) for the demo website, you may need to go through those resources before you understand how the demo works._

Once Gitpod has booted up, go to the [demo folder](/docs/demo) and start tweaking and testing to your hearts content. 

### Runing Locally

You can run `@okikio/native` locally by first installing some packages via these commands into your terminal,

```bash
npm install -g pnpm
pnpm install -g ultra-runner
pnpm install
```

You can test your changes/contributions using,

```bash
pnpm start
```

*`pnpm start` will launch a small demo website built using [`Astro`](https://astro.build), all changes to the `build folder` should be reflected live (you may need to reload the webpage if your changes aren't appearing).*

You can build your changes/contributions using,

```bash
pnpm build
```

> _**Note**: I used [`Astro`](https://astro.build) & [`solidjs`](https://www.solidjs.com/) for the demo website, you may need to go through those resources before you understand how the demo works._

Once Gitpod has booted up, go to the [demo folder](/docs/demo) and start tweaking and testing to your hearts content.