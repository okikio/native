# Native

`native` is a framework which aims to make it easy to create complex, light-weight, and performant web applications using modern js api's.

You can play with `@okikio/native` using Gitpod:

[![Edit with Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/okikio/native)

_Start the dev script by typing into the terminal_

```bash
ultra pnpm demo:watch --filter *native
```

Once Gitpod has booted up, go to the `./packages/native/build folder` and start tweaking and testing to your hearts content.

## Table of Contents

- [Native](#native)
  - [Table of Contents](#table-of-contents)
  - [Getting started](#getting-started)
    - [@okikio/manager](#okikiomanager)
    - [@okikio/emitter](#okikioemitter)
    - [@okikio/animate](#okikioanimate)
    - [@okikio/native](#okikionative)
  - [Usage](#usage)
  - [Demo](#demo)
  - [Contributing](#contributing)
  - [Licence](#licence)

## Getting started

`native` is a monorepo with 4 smaller packages within it, they are:

### [@okikio/manager](./packages/manager)

-   A superset of the Map class, it gives Map superpowers. The Map class is the most efficient way to handle large amounts of controlled data, but it has some inconvient quirks that would be annoying to handle, so I built this package to avoid some of it's quirks.
-   _Note: you can install it as a seperate package from the rest of the `native` framework._
-   [Read more...](./packages/manager/README.md)

### [@okikio/emitter](./packages/emitter)

-   A small event emitter written in typescript with performance and ease of use in mind. It's pretty self explanitory, there are millions of event emitters like this one, the only difference is that this one is optimized for use in the `native` framework.
-   _Note: you can install it as a seperate package from the rest of the `native` framework._
-   [Read more...](./packages/emitter/README.md)

### [@okikio/animate](./packages/animate)

-   A truly native animation library that takes full advantage of the Web Animation API to create amazingly pollished experiences on all devices. The animation library takes this approach because of the connundrum that occured when mobile devices started being built with 120hz screens. Before this point most devices were 60hz, so developers built for 60hz, but this caused many users to lose out on the benefits of their 120hz device. To future proof animation in an easy to use and effiecient manner, I built this library as a light wrapper around the Web Animation API, that takes on conventional means for creating animation today, allowing developers to get started with modern animation today.
-   _Note: you can install it as a seperate package from the rest of the `native` framework._
-   [Read more...](./packages/animate/README.md)

### [@okikio/native](./packages/native)

-   This is the core component of the framework, it bundles all the other packages into iteself. This package encourages the user to download/copy-and-paste the code into their development enviroment of choice, and tweak it to match their projects needs. This package (like all other packages in the `native` framework) is built for ES2020, it expects the user to use a build tool to support older versions of browsers, the idea being most people are using evergreen browsers, so, why are web developers piling on polyfill code that most users don't need.
-   [Read more...](./packages/native/README.md)

This framework works with the assumtion that the user will use a build tool and a polyfill library to ensure all components work in older browser, I suggest `esbuild`, `rollup`, or `webpack`, and for polyfills `babel` or `polyfill.io`.

## Usage

Located in [./packages/native/build](https://github.com/okikio/native/tree/master/packages/native/build), you will find multiple build files that can help you create your setup. The [/pug folder](https://github.com/okikio/native/tree/master/packages/native/build/pug) contains [pug](https://pugjs.org/api/getting-started.html) files that format my html in a clean and clear way. The [/sass folder](https://github.com/okikio/native/tree/master/packages/native/build/sass) contains [scss](https://sass-lang.com/guide) files that allow for modern css without the need of polyfills. The [/ts folder](https://github.com/okikio/native/tree/master/packages/native/build/ts) contains [typescript](https://www.typescriptlang.org/) files that the framework runs on; typescript is used because Intellisense is better with typescript. Outside the build folder, the [gulpfile.js](https://github.com/okikio/native/tree/master/packages/native/gulpfile.js) file, is part of my [gulp](https://gulpjs.com/) config, and is the tool I use to build the demo. For your project other tools should also work with some tweaks. Explore the files stated above to learn how to get started. Read more about `native` in the [@okikio/native README](./packages/native/README.md). Explore the other packages as well to learn how they all work together.

## Demo

> [View a demo &#8594;](https://okikio.github.io/native/packages/native/demo/)

## Contributing

If there is something I missed, a mistake, or a feature you would like added please create an issue or a pull request and I'll try to get to it.

## Licence

See the [LICENSE](./LICENSE) file for license rights and limitations (MIT).
