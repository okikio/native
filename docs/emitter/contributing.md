## Contributing

If there is something I missed, a mistake, or a feature you would like added please create an issue or a pull request and I'll try to get to it.

> _**Warning**: all contributions must be done on the `beta` branch, by default Gitpod will open on the `beta` branch, but still keep this in mind._

*The `native` initiative uses [Changesets](https://github.com/atlassian/changesets/blob/main/docs/intro-to-using-changesets.md#adding-changesets), for versioning and Changelog generation, you don't need to create one, but it would be amazing if you could.*


### Using Gitpod

You can try out `@okikio/emitter` using Gitpod:

[![Open In Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/okikio/native/blob/beta/packages/emitter/README.md)

By default Gitpod will start the dev script for you, but if you need to restart the dev script you can do so by typing into the terminal.

```bash
pnpm --filter "@okikio/emitter" exec -- npm test --watch
```

Once Gitpod has booted up, go to [packages/manager/tests/test.ts](/packages/emitter/tests/test.ts) and start tweaking and testing to your hearts content.

### Runing Locally

You can run `@okikio/emitter` locally by first installing some packages via these commands into your terminal,

```bash
npm install -g pnpm
pnpm install -g ultra-runner
pnpm install
```

You can build your changes/contributions using,

```bash
pnpm build
```

You can test your changes/contributions using,

```bash
# For a single test
pnpm test --filter "@okikio/emitter"
# For continouous testing
pnpm --filter "@okikio/emitter" exec -- npm test --watch
```

Once it has booted up, go to [packages/emitter/tests/test.ts](/packages/emitter/tests/test.ts) and start tweaking and testing to your hearts content.