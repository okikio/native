# @okikio/native

View a working example: [https://okikio.github.io/native/packages/native/docs/](https://okikio.github.io/native/packages/native/docs/).

or

Try an online example with Gitpod:

[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/okikio/native)

## Table of Contents
- [@okikio/native](#okikionative)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [Usage](#usage)
  - [API](#api)
    - [Manager](#manager)

## Getting Started

`Native` is a framework who's goal is to make it easier to create complex, performant, light-weight, web applications using native js apis. It was inspired by Rezo Zero's Starting Blocks project, and Barba.js. Both libraries had a major impact on the development of this project. Barba.js is easy to use and elevates the experience of a site with the use of PJAX, while Starting Blocks used native apis to create light-weight but complex web experiences. This project exists as a more flexible alternative to Starting Blocks, but with the same intuitive design and experience (UX/DX) Barba.js provides. It also, allows for web apps to be created without the need of PJAX, and safely switches back to normal HTML controls if JS is disabled.

This project is called a framework but it is more like a guideline, if all you want is a simple starter project that has PJAX built in then you install the project from `npm` once it becomes available, but otherwise you download the project into you workspace and tweak it to match your projects needs and remove all the extra fluff you don't want (By the way, this project works best with treeshaking, so, for the sake of speed, performance, and weight use Rollup or Webpack; Rollup is preferred).

This package is built for es2020, it expects the user to use a build tool support older versions of browsers, the idea being most people are using evergreen browsers, so, why are web developers piling on polyfill code that most users don't need.

## Usage
It is hard to explain how to use the framework, since, it's so encompassing and requires the developer to optimize on their part, but located in [native/build-src](./packages/native/build-src), you will find multiple build files that cna help you create your setup. The pug folder contains `pug` files ([learn about pug](https://pugjs.org/api/getting-started.html)) that format my html in a clean and clear way. The sass folder contains `scss` files ([learn about sass/scss](https://sass-lang.com/guide)) that allow for modern css without the need of polyfill. The ts folder contains `typescript` files ([learn about typescript](https://www.typescriptlang.org/)) that run the framework (typescript is used, because intellisense is better with typescript). Outside the build-src folder, the [gulpfile.js](./packages/native/gulpfile.js) is the tool I used to build this project but other tools should also work, with some amoount of tweaking ([learn about gulp](https://gulpjs.com/)). Explore the files stated above to learn how to get started.

## API
`Native` has multiple different classes, and multiple different catagories of classes, the three different catagories are:
* `Manager`
* `AdvanncedManager`
* `ManagerItem`.

There are seven different and distinct classes, they are:
* `Service`
* `ServiceManager`
* `Page`
* `PageManager`
* `HistoryManager`
* `CONFIG`
* `App`

There are also three project based classes:
* `Router`
* `TransitionManager`
* `PJAX`

Project based classes are optional and are based on the type of project you are making.

The seven distinct class are mandatory classes that are built into the framework.

While the different class catagories (which themselves are classes), are the base classes of the framework.

### Manager
