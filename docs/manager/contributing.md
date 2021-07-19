
## Contributing

If there is something I missed, a mistake, or a feature you would like added please create an issue or a pull request and I'll try to get to it.

_**Note**: all contributions must be done on the `beta` branch._

*The `native` initiative uses [Changesets](https://github.com/atlassian/changesets/blob/main/docs/intro-to-using-changesets.md#adding-changesets), for versioning and Changelog generation, you don't need to create one, but it would be amazing if you could.*

### Using Gitpod

You can try out `@okikio/manager` using Gitpod:

[![Open In Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/okikio/native/blob/beta/packages/manager/README.md)

By default Gitpod will start the dev script for you, but if you need to restart the dev script you can do so by typing into the terminal.

```bash
pnpm test-dev --filter "@okikio/manager"
```

Once Gitpod has booted up, go to [./tests/test.ts](../../packages/manager/tests/test.ts) and start tweaking and testing to your hearts content.

### Runing Locally

You can run `@okikio/manager` locally by first installing some packages via these commands into your terminal,

```bash
npm install -g pnpm && pnpm install -g gulp ultra-runner commitizen && pnpm install && pnpm build
```

You can build your changes/contributions using,

```bash
pnpm build
```

You can test your changes/contributions using,

```bash
pnpm test-dev --filter "@okikio/manager"
```

Once it has booted up, go to [./tests/test.ts](../../packages/manager/tests/test.ts) and start tweaking and testing to your hearts content.
