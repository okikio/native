# native

An initiative which aims to make it easy to create complex, light-weight, and performant web applications using modern js. The initiative is a monorepo with 4 smaller packages within it, they are [@okikio/manager](./packages/manager#readme), [@okikio/emitter](./packages/emitter#readme), [@okikio/animate](./packages/animate#readme), and [@okikio/native](./packages/native#readme).


## [@okikio/manager](./packages/manager#readme)

A superset of the Map class, it extends the Map classes capabilities with awesome new features, and relieves some of the inconvient quirks of the Map class.

[Dobumentation](./packages/manager/README.md) <span style="padding-inline: 1rem">|</span> [NPM](https://www.npmjs.com/package/@okikio/manager)


## [@okikio/emitter](./packages/emitter#readme)

A small Event Emitter written in typescript with performance and ease of use in mind.

[Dobumentation](./packages/emitter/README.md) <span style="padding-inline: 1rem">|</span> [NPM](https://www.npmjs.com/package/@okikio/emitter)

## [@okikio/animate](./packages/animate#readme)

An animation library for the modern web. Inspired by animate plus, and animejs, it is a Javascript animation library focused on performance and ease of use. It utilizes the Web Animation API (WAAPI) to deliver fluid animations at a *semi-small* size.

[Dobumentation](./packages/animate/README.md) <span style="padding-inline: 1rem">|</span> [NPM](https://www.npmjs.com/package/@okikio/animate)

## [@okikio/native](./packages/native#readme)

A framework to build custom dynamic web experiences around. It acts as a very light weight to build complex web apps, ranging from PJAX based sites to other Single Page Applications (SPA) (React, Vue, etc...) based sites and web apps.

[Dobumentation](./packages/native/README.md) <span style="padding-inline: 1rem">|</span> [NPM](https://www.npmjs.com/package/@okikio/native)

## Demo & Showcases

  * [josephojo.com](https://josephojo.com)
  * [jabodent.com](https://jabodent.com)
  * [bundle.js.org](https://bundle.js.org)
  * Your site here...
  
> [View a demo &#8594;](https://okikio.github.io/native/demo/)


## API Documentation

Go to [okikio.github.io/native/api](https://okikio.github.io/native/api), for detailed API documentation on the packages under native initiative.

## Contributing

[![Open In Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/okikio/native/blob/beta/README.md)

> _**Note**: By default we use Gitpod for contributions, but you can also use Github Codespaces. You will need to follow each packages documentation on how you contribute changes._

By default Gitpod will start the dev script for you, but if you need to restart the dev script you can do so by typing into the terminal.

```bash
pnpm start
```

Once Gitpod has booted up, go to the [build/pug/](./build/pug/) and [build/ts/](./build/ts/) folders to try out the packages under the `native` initiative.

If there is something I missed, a mistake, or a feature you would like added please create an issue or a pull request and I'll try to get to it.

*The `native` initiative uses [Changesets](https://github.com/atlassian/changesets/blob/main/docs/intro-to-using-changesets.md#adding-changesets), for versioning and Changelog generation, you don't need to create one, but it would be amazing if you could.*

> _**Warning**: all contributions must be done on the `beta` branch, by default Gitpod will open on the `beta` branch, but still keep this in mind._

### Bundling

> ***Note**: All package in the `native` initiative are built for ES2020, This project expects the user to use a build tool to support older versions of browsers, the idea being most people are using evergreen browsers, so, why are web developers piling on polyfill code that most users don't need. I suggest `esbuild`, `rollup`, `typescript` [^1], or `webpack` for bundling the library, and for polyfills `babel` or `polyfill.io`.*

[^1]: **I have found typescript to be the best method for bundling for older browsers e.g. IE11. I only suggest you use `babel` for polyfilling `Promise`, `fetch`, etc...*

I suggest using [bundle.js.org](https://bundle.js.org), if you would like to quickly bundle the package online or check the size of your final bundle.

### File Structure

* [build/](./build) - contains the build files for the demo.
  * [pug/](./build/pug/) - contains the [pug](https://pugjs.org/api/getting-started.html) files for the demo.
  * [scss/](./build/scss/) - contains the [scss](https://sass-lang.com/guide) files for the demo.
  * [ts/](./build/ts/) - contains [typescript](https://www.typescriptlang.org/) files for the demo.
  * [assets/](./build/assets/) - contains favicon, manifest.json, and other assets that we don't want to be processed for the demo.
* [packages/](./packages) - contains the packages under the native initiative.
  * [manager/](./packages/manager) - contains the [@okikio/manager](https://npmjs.com/@okikio/manager) package.
  * [emitter/](./packages/emitter) - contains the [@okikio/emitter](https://npmjs.com/@okikio/emitter) package.
  * [animate/](./packages/animate) - contains the [@okikio/animate](https://npmjs.com/@okikio/animate) package.
  * [native/](./packages/native) - contains the [@okikio/native](https://npmjs.com/@okikio/native) package.

I use a couple conventions when naming my files, these will help you navigate the repo.:
1. `lib/` - lib folders contain the `javascript` results of the source `typescript` files
2. `src/` - src folders contain the source typescript files 
3. `assets/` - assets folders contain unprocessed assets, e.g. images, fonts, etc...
4. `LICENSE` - contains the license
5. `README.md` - contains info. for using the project or package
6. `CHANGELOG.md` - contains a log of all  changes till this point 
7. `TODO.md` - contains goals for specific packages as well as the native initiative as a whole
8. `package.json` - contains info. that npm/pnpm uses to install and publish packages
9. `build.js` - contains a rollup script that builds the typescript files into javascripts files contained in the `lib/` folder
10. `snowpack.config.mjs` - configurations for `Astro's` snowpack setup
11. `tailwind.config.cjs` - configurations for `tailwind`
12. `tsconfig.json` - config for `typescript`
13. `repl.js` - a small js files for testing concepts and finding logic errors, you run it by typing `node repl.js` into your terminal.

```
📦native
 ┣ 📂build
 ┃ ┣ 📂assets
 ┃ ┣ 📂pug
 ┃ ┣ 📂scss
 ┃ ┗ 📂ts
 ┣ 📂docs
 ┣ 📂packages
 ┃ ┣ 📂animate
 ┃ ┣ 📂emitter
 ┃ ┣ 📂manager
 ┃ ┗ 📂native
 ┃ ┃ ┣ 📂lib
 ┃ ┃ ┣ 📂src
 ┃ ┃ ┃ ┣ 📜api.ts
 ┃ ┃ ┣ 📜CHANGELOG.md
 ┃ ┃ ┣ 📜LICENSE
 ┃ ┃ ┣ 📜README.md
 ┃ ┃ ┣ 📜TODO.md
 ┃ ┃ ┣ 📜package.json
 ┃ ┃ ┗ 📜tsconfig.json
 ┣ 📜LICENSE
 ┣ 📜README.md
 ┣ 📜TODO.md
 ┣ 📜build.js
 ┣ 📜repl.js
 ┣ 📜package.json
 ┣ 📜snowpack.config.mjs
 ┣ 📜tailwind.config.cjs
 ┣ 📜tsconfig.json
```

> I ignored some files in the file structure above, thats because they are files that aren't necessary for most contributions, but if you happen to know what the missing files do, and have suggestions I would appreciate any pull-requests or github issues on the matter.

## Licence

See the [LICENSE](./LICENSE) file for license rights and limitations (MIT).
