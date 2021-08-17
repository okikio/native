
## Contributing

If there is something I missed, a mistake, or a feature you would like added please create an issue or a pull request and I'll try to get to it.

> _**Warning**: all contributions must be done on the `beta` branch, by default Gitpod will open on the `beta` branch, but still keep this in mind._

*The `native` initiative uses [Changesets](https://github.com/atlassian/changesets/blob/main/docs/intro-to-using-changesets.md#adding-changesets), for versioning and Changelog generation, you don't need to create one, but it would be amazing if you could.*

### Using Gitpod

You can try out `@okikio/manager` using [Gitpod](https://www.gitpod.io/) (it's a free to use online IDE):

[![Open In Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/okikio/native/blob/beta/packages/manager/README.md)

You can start the dev script by typing into the terminal,

```bash
pnpm --filter "@okikio/manager" exec -- npm test --watch
```

Once Gitpod has booted up, go to [packages/manager/tests/test.ts](/packages/manager/tests/test.ts) and start tweaking and testing to your hearts content.

### Runing Locally

You can run `@okikio/manager` locally by first installing some packages via these commands into your terminal,

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
pnpm --filter "@okikio/manager" test 
# For continouous testing
pnpm --filter "@okikio/manager" exec -- npm test --watch
```

Once it has booted up, go to [packages/manager/tests/test.ts](/packages/manager/tests/test.ts) and start tweaking and testing to your hearts content.
