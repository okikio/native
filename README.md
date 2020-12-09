# Native
A framework who's goal is to make it easy to create complex, performant, light-weight, web applications using native js api's.

View a working example: [https://okikio.github.io/native/packages/native/docs/](https://okikio.github.io/native/packages/native/docs/).

or

Try an online example with Gitpod:

[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/okikio/native)

## Table of Contents
- [Native](#native)
  - [Table of Contents](#table-of-contents)
  - [Getting started](#getting-started)
  - [Usage](#usage)

## Getting started

`Native` is a monorepo with 4 smaller packages within it, they are:
* [@okikio/manager](./packages/manager)
  * A superset of the Map class, it gives Map superpowers. The Map class is the most efficient way to handle large amounts of controlled data, but it has some inconvient quirks that would be annoying to just contantly think about, so I built this package to avoid some of it's quirks.
  * Note: you install it as a seperate package from the rest of the native framework.
  * [Read more...](./packages/manager/README.md)
* [@okikio/emitter](./packages/emitter)
  * A small Event Emitter written in typescript with performance and ease of use in mind. It's pretty self explanitory, there are millions of event emitters like this one, the only difference is that this one is optimized for the native framework.
  * Note: you install it as a seperate package from the rest of the native framework.
  * [Read more...](./packages/emitter/README.md)
* [@okikio/animate](./packages/animate)
  * A truly native animation library that takes full advantage of the Web Animation API, to create amazingly pollished and native experiences on all devices. The animation library takes this approach because of the connundrum that occured when mobile devices started being built with 120hz screens. Before this point most devices were 60hz, so developers built for 60hz, but because 60hz was the default, users with 120hz screens missed out on a major selling point of their devices. To future proof animation in an easy to use and effiecient manner, I built this library as a light wrapper around the Web Animation API, that takes on conventional means for creating animation today, allowing developers to get started with modern animation today.
  * Note: you install it as a seperate package from the rest of the native framework.
  * [Read more...](./packages/animate/README.md)
* [@okikio/native](./packages/native)
  * This is the core component of the framework, it has all of the other packages built in. This package encourages the user to download/copy-and-paste the code into their development enviroment of choice, and tweak it to match their projects needs. This package like all other packages is built for es2020, it expects the user to use a build tool support older versions of browsers, the idea being most people are using evergreen browsers, so, why are web developers piling on polyfill code that most users don't need.
  * [Read more...](./packages/native/README.md)

This framework works with the assumtion that the user will use a build tool and a polyfill library to ensure all components work in older browser, I suggest `esbuild`, `rollup`, or `webpack`, and for polyfills `babel` or `polyfill.io`.

## Usage

It is hard to explain how to use the framework, since, it's so encompassing and requires the developer to optimize on their part, but located in [native/build-src](./packages/native/build-src), you will find multiple build files that cna help you create your setup. The pug folder contains `pug` files ([learn about pug](https://pugjs.org/api/getting-started.html)) that format my html in a clean and clear way. The sass folder contains `scss` files ([learn about sass/scss](https://sass-lang.com/guide)) that allow for modern css without the need of polyfill. The ts folder contains `typescript` files ([learn about typescript](https://www.typescriptlang.org/)) that run the framework (typescript is used, because intellisense is better with typescript). Outside the build-src folder, the [gulpfile.js](./packages/native/gulpfile.js) is the tool I used to build this project but other tools should also work, with some amoount of tweaking ([learn about gulp](https://gulpjs.com/)). Explore the files stated above to learn how to get started. Read more in the [@okikio/native readme](./package/native/readm.md).
