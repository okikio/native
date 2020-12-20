# @okikio/native

The framework that encourages performance, modern technologies, and great user experiences. The idea behind `@okikio/native` is that it acts as the core to the `native` initiative, it combines all the other package into it a core package this is less than 7.25 KB.

`@okikio/native` is a guideline on how to create great web experiences, that integrate into the system in use by the user and feel like a cohesive and native experience.

The idea behind it is that when an application feels native it integrates well into prior systems and `just works` and  works well. So, for example, a dark mode that follows the entire system. The `just works` is the key aspect of the framework, it should work without the user skipping a bit of whatever task they are aiming to complete.

On the web this boils down to being performant, efficient, and smooth.

The `@okikio/native` package acchieves performance, high efficiency, and a smooth experience by being heavily modern (relying on passive polyfills that only run on browsers that don't support certain features) and being well optimized.

Currently many websites rely on older code to make sure they reach as wide an audience as possible, hurting performance with large amounts of overhead.

`@okikio/native` uses modern browser api's like the Web Animation API, Maps, pushState, etc.... to achieve high efficiency and performance (as these API can be smartly managed by the browser). The browser API's can be difficult to work with, so, I developed `@okikio/manager`, `@okikio/emitter`, and `@okiko/animate` libraries to make them more managable. I developed these libraries to ensure the framework is well optimized and to avoid larges ammounts of npm dependencies.

> [View a working example  &#8594;](https://okikio.github.io/native/packages/native/demo/)

You can play with the online example with Gitpod:

[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/okikio/native)

## Table of Contents
- [@okikio/native](#okikionative)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [Usage](#usage)
  - [API](#api)
    - [ManagerItem](#manageritem)
    - [AdvanncedManager](#advanncedmanager)

## Getting Started

`Native` is a framework who's goal is to make it easier to create complex, performant, light-weight, web applications using native js apis. It was inspired by Rezo Zero's Starting Blocks project, and Barba.js. Both libraries had a major impact on the development of this project. Barba.js is easy to use and elevates the experience of a site with the use of PJAX, while Starting Blocks used native apis to create light-weight but complex web experiences. This project exists as a more flexible alternative to Starting Blocks, but with the same intuitive design and experience (UX/DX) Barba.js provides. It also, allows for web apps to be created without the need of PJAX, and safely switches back to normal HTML controls if JS is disabled.

This project is called a framework but it is more like a guideline, if all you want is a simple starter project that has PJAX built in then you install the project from `npm` once it becomes available, but otherwise you download the project into you workspace and tweak it to match your projects needs and remove all the extra fluff you don't want (By the way, this project works best with treeshaking, so, for the sake of speed, performance, and weight use Rollup or Webpack; Rollup is preferred).

This package is built for es2020, it expects the user to use a build tool support older versions of browsers, the idea being most people are using evergreen browsers, so, why are web developers piling on polyfill code that most users don't need.

## Usage
It is hard to explain how to use the framework, since, it's so encompassing and requires the developer to optimize on their part, but located in [native/build-src](./packages/native/build-src), you will find multiple build files that cna help you create your setup. The pug folder contains `pug` files ([learn about pug](https://pugjs.org/api/getting-started.html)) that format my html in a clean and clear way. The sass folder contains `scss` files ([learn about sass/scss](https://sass-lang.com/guide)) that allow for modern css without the need of polyfill. The ts folder contains `typescript` files ([learn about typescript](https://www.typescriptlang.org/)) that run the framework (typescript is used, because intellisense is better with typescript). Outside the build-src folder, the [gulpfile.js](./packages/native/gulpfile.js) is the tool I used to build this project but other tools should also work, with some amoount of tweaking ([learn about gulp](https://gulpjs.com/)). Explore the files stated above to learn how to get started.

## API
`@okikio/native` has 5 base classes, they are:
* `AdvanncedManager`
* `Service`
* `ServiceManager`
* `ManagerItem`
* `App`

There are also 6 project based classes:
* `Router`
* `TransitionManager`
* `Page`
* `PageManager`
* `HistoryManager`
* `PJAX`

Project based classes are optional and are based on the type of project you are creating, if they are not used tree shaking using `rollup`, or `esbuild`, should get rid of them.

The `5 base classes` are mandatory classes that are built into the framework, to which tree shaking will not be able to get rid of.

### ManagerItem

A class the can only be stored in the `AdvancedManager` class

    /**
     * The AdvancedManager the ManagerItem is attached to
     *
     * @public
     * @type IAdvancedManager
     * @memberof ManagerItem
     */
    public manager: IAdvancedManager;

    /**
     * The App the ManagerItem is attached to
     *
     * @public
     * @type App
     * @memberof ManagerItem
    */
    public app: App;

    /**
     * The Config of the App the ManagerItem is attached to
     *
     * @public
     * @type ICONFIG
     * @memberof ManagerItem
    */
    public config: ICONFIG;
    public emitter: EventEmitter;
    public key: any;

    /**
     * Creates an instance of ManagerItem.
     *
     * @memberof ManagerItem
     */
    constructor() { }

    /**
     * Run after the Manager Item has been registered
     *
     * @returns any
     * @memberof ManagerItem
     */
    public install(): any { }

    /**
     * Register the current Manager Item's manager
     *
     * @param {IAdvancedManager} manager
     * @returns ManagerItem
     * @memberof ManagerItem
     */
    public register(manager: IAdvancedManager, key: any): ManagerItem {
        this.manager = manager;
        this.app = manager.app;
        this.config = manager.config;
        this.emitter = manager.emitter;
        this.key = key;
        this.install();
        return this;
    }

    public uninstall(): any { }

    public unregister() {
        this.uninstall();

        this.manager.remove(this.key);
        this.key = undefined;
        this.manager = undefined;
        this.app = undefined;
        this.config = undefined;
        this.emitter = undefined;
    }


### AdvanncedManager

The `AdvancedManager` class is a superset of the `Manager` class, which has the ability to share details about the `App` class it's attached to, to the `ManagerItem`'s it stores.

So, for example, `AdvancedManager` can give access to the `App` classes `ServiceManager` to `ManagerItem`'s, allowing `ManagerItem`'s to access  `Service`'s running on the `App`.
