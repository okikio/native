# native

`native` is an initiative which aims to make it easy to create complex, light-weight, and performant web applications using modern js.

## Table of Contents

- [native](#native)
  - [Table of Contents](#table-of-contents)
  - [Getting started](#getting-started)
    - [@okikio/manager](#okikiomanager)
    - [@okikio/emitter](#okikioemitter)
    - [@okikio/animate](#okikioanimate)
    - [@okikio/native](#okikionative)
    - [etc](#etc)
  - [API Documentation](#api-documentation)
  - [Usage](#usage)
  - [Trying it Out](#trying-it-out)
  - [Demo](#demo)
  - [Contributing](#contributing)
  - [Licence](#licence)

## Getting started

The `native` project repo is a monorepo with 4 smaller packages within it, they are:

### [@okikio/manager](./packages/manager#readme)

The Map class is the most efficient way to handle large amounts of controlled data, but it has some inconvient quirks that would be annoying to handle, so I built this package to avoid some of it's quirks and introduce new features.

_Note: you can install it as a seperate package from the rest of the `@okikio/native` framework._
[Read more...](./packages/manager/README.md)

### [@okikio/emitter](./packages/emitter#readme)

A small Event Emitter written in typescript with performance and ease of use in mind. It's pretty self explanitory, there are millions of event emitters like this one, the only difference is that this one is optimized for use in the `@okikio/native` framework.

_Note: you can install it as a seperate package from the rest of the `@okikio/native` framework._
[Read more...](./packages/emitter/README.md)

### [@okikio/animate](./packages/animate#readme)

A truly native animation library that takes full advantage of the Web Animation API to create amazingly pollished experiences on all devices. To future proof animation in an easy to use and effiecient manner, I built this library as a light wrapper around the Web Animation API, that takes on conventional means for creating animation today, allowing developers to get started with modern animation today.

_Note: you can install it as a seperate package from the rest of the `@okikio/native` framework._
[Read more...](./packages/animate/README.md)

### [@okikio/native](./packages/native#readme)

`@okikio/native` is the framework component of the `native` initiative, it bundles all the other packages into iteself. This package encourages the user to download/copy-and-paste the code into their development enviroment of choice, and tweak it to match their projects needs.
[Read more...](./packages/native/README.md)

### etc

***Note**: All package in the `native` initiative are built for ES2020, This project expects the user to use a build tool to support older versions of browsers, the idea being most people are using evergreen browsers, so, why are web developers piling on polyfill code that most users don't need. I suggest `esbuild`, `rollup`, `*typescript`, or `webpack` for bundling the library, and for polyfills `babel` or `polyfill.io`.*

**I have found typescript to be the best method for bundling for older browsers e.g. IE11. I only suggest you use `babel` for polyfilling `Promise`, `fetch`, etc...*

## API Documentation

Go to [okikio.github.io/native/docs](https://okikio.github.io/native/docs), for a more detailed API documentation on the native initiative.

## Usage

Located in [./build](./build), you will find multiple build files that can help you create your setup. The [./build/pug/](./build/pug) folder contains [pug](https://pugjs.org/api/getting-started.html) files; `pug` has features that normal `html` just doesn't have. The [./build/sass/](./build/sass) folder contains [scss](https://sass-lang.com/guide) files that allow for modern css without the need of polyfills. The [./build/ts/](./build/ts/) folder contains [typescript](https://www.typescriptlang.org/) files that the framework runs on; typescript is used because Intellisense is better with typescript. Outside the build folder, the [./gulpfile.js](./gulpfile.js) file, is part of my [gulp](https://gulpjs.com/) config, and is the tool I use to build the `demo`. For your project other tools should also work with some tweaks. Explore the files stated above to learn how to get started. Read more about `native` in the `@okikio/native` [README](./packages/native/README.md). Explore the other packages as well to learn how they all work together.

## Trying it Out

You can try out the `native` initiative via the `@okikio/native` framework.

[![Open In Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/okikio/native/blob/master/README.md)

By default Gitpod will start the dev script for you, but if you need to restart the dev script you can do so by typing into the terminal.

```bash
pnpm demo
```

Once Gitpod has booted up, go to the [./build/pug/](./build/pug/) and [./build/ts/](./build/ts/) folders to try out the packages under the `native` initiative.

## Demo

> [View a demo &#8594;](https://okikio.github.io/native/demo/)

## Contributing

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

If there is something I missed, a mistake, or a feature you would like added please create an issue or a pull request and I'll try to get to it.

*The `native` project uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) as the style of commit, we also use the [Commitizen CLI](http://commitizen.github.io/cz-cli/) to make commits easier.*

## Licence

See the [LICENSE](./LICENSE) file for license rights and limitations (MIT).
