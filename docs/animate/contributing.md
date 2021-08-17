## Contributing

If there is something I missed, a mistake, or a feature you would like added please create an issue or a pull request and I'll try to get to it.

> _**Warning**: all contributions must be done on the `beta` branch, by default Gitpod will open on the `beta` branch, but still keep this in mind._

*The `native` initiative uses [Changesets](https://github.com/atlassian/changesets/blob/main/docs/intro-to-using-changesets.md#adding-changesets), for versioning and Changelog generation, you don't need to create one, but it would be amazing if you could.*

## Using Gitpod

You can try out `@okikio/animate` using Gitpod:

[![Open In Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/okikio/native/blob/beta/packages/animate/README.md)

By default Gitpod will start the dev script for you, but if you need to restart the dev script you can do so by typing into the terminal.

```bash
pnpm start
```

Once Gitpod has booted up, click on the `@okikio/animate (no-pjax)` button in the preview, then go to [build/pug/animate.pug](/build/pug/animate.pug) and [build/ts/animate.ts](/build/ts/animate.ts) and start tweaking and testing to your hearts content.

## Runing Locally

You can run `@okikio/animate` locally by first installing some packages via these commands into your terminal,

```bash
npm install -g pnpm
pnpm install -g ultra-runner
pnpm install
pnpm build
```

and then you can test/demo it using this command,

```bash
pnpm start 
```

Once it has booted up, go to [build/pug/](/build/pug/) and [build/ts/](/build/ts/) and start tweaking and testing to your hearts content.

You can build your changes/contributions using,

```bash
pnpm build
```

