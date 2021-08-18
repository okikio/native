# @okikio/native

[NPM](https://www.npmjs.com/package/@okikio/native) <span style="padding-inline: 1rem">|</span> [API Guide](/docs/native/api.md) <span style="padding-inline: 1rem">|</span> [Licence](/packages/native/LICENSE) 

`native` is an initiative that encourages performance, modern technologies, and great user experiences. The idea behind `@okikio/native` is that it acts as the core framework to the `native` initiative, it combines all the other package into it a core package that is **~7.21 KB** (minified & gzipped).

> _**Note**: `@okikio/native` is treeshakable, so you only need to use the features required for your project and the other portions can be removed. The absolute minimum functional treeshaken size is **~1.75 KB** (minified & gzipped)._

[@okikio/native](/docs/native/index.md) is a guideline on how to create great web experiences that integrate into the system in a way that feels like a cohesive and native experience.

The idea behind it is that, when an app feels native, it means that it integrates well into the systems and `just works`, for example, a dark mode that follows the entire system. The `just works` aspect is key to the framework, it should work without the user skipping a beat. On the web this boils down to being performant, efficient, and smooth.

The `@okikio/native` package achieves performance, high efficiency, and a smooth experience by being heavily modern (relying on passive polyfills to support older browsers) and being well optimized.

`@okikio/native` uses modern browser api's like the Maps, pushState, etc.... to achieve high efficiency and performance. The browser API's can be difficult to work with, so, I developed [@okikio/manager](https://www.npmjs.com/package/@okikio/manager), [@okikio/emitter](https://www.npmjs.com/package/@okikio/emitter), and [@okiko/animate](https://www.npmjs.com/package/@okikio/animate) libraries to make them more managable. I developed these libraries to ensure the framework is well optimized and to avoid large number of dependencies.


## Getting Started

[@okikio/native](/docs/native/index.md) was inspired by Rezo Zero's Starting Blocks project, and barbajs. Both libraries had a major impact on the development of this project. barbajs is easy to use and elevates the experience of a site with the use of PJAX, while Starting Blocks uses modern apis to create performant but complex web experiences. This project exists as a more flexible alternative to Starting Blocks, but with the same intuitive design and experience (UX/DX) barbajs provides. The framework doesn't need PJAX to function, and best of all if PJAX is enabled it can safely switch back to normal browser controls if something goes wrong.

This project is called a framework but it is more like a guideline, if all you want is a simple starter project that has PJAX built in then you install the project from [npm](https://www.npmjs.com/package/@okikio/native), but otherwise you download the project into you workspace and tweak it to match your projects needs and remove all the extra fluff you don't want (this project works best with treeshaking, you can use rollup, webpack, or esbuild for this; esbuild is preferred).

This package is built for ES2020, it expects the user to use a build tool to support older versions of browsers, the idea being most people are using evergreen browsers, so, why are web developers piling on polyfill code that most users don't need.

## Installation

You can install [@okikio/native](/docs/native/index.md) from [npm](https://www.npmjs.com/package/@okikio/native) via `npm i @okikio/native`, `pnpm i @okikio/native` or `yarn add @okikio/native`.

You can use `@okikio/native` on the web via:

- [https://unpkg.com/@okikio/native](https://unpkg.com/@okikio/native)
- [https://cdn.skypack.dev/@okikio/native](https://cdn.skypack.dev/@okikio/native)
- [https://cdn.jsdelivr.net/npm/@okikio/native](https://cdn.jsdelivr.net/npm/@okikio/native)

Once installed it can be used like this:

```typescript
// There is,
//      .cjs - Common JS Module
//      .mjs - Modern ES Module
//      .js - IIFE
import { App, PJAX } from "@okikio/native";
import { App, PJAX } from "https://unpkg.com/@okikio/native";
import { App, PJAX } from "https://cdn.jsdelivr.net/npm/@okikio/native";
// Or
import { App, PJAX } from "https://cdn.skypack.dev/@okikio/native";

// Via script tag
<script src="https://unpkg.com/@okikio/native/lib/api.js"></script>
// Do note, on the web you need to do this, if you installed it via the script tag:
const { App, PJAX } = window.native;
```

## Demo & Showcase

  * [josephojo.com](https://josephojo.com)
  * [jabodent.com](https://jabodent.com)
  * Your site here...

> [View the Demo  &#8594;](/docs/demo/)

## Usage

By default `@okikio/native` is very open ended in how you use it. You first create a new App, and then add Services, the App is the boss of the operation, while Services are workers that accomplish specific tasks.

For example,

```ts
import { App, Service, getConfig } from "@okikio/native";

const app = new App({
    serviceOptions: "Some Options",
    containerAttr: "container"
});

// Read more about Service in API section
// This basically shows off all the methods ExampleService inherited from being a Service that extends ManagerItem
class ExampleService extends Service {
    /** The constructor doesn't do anything by default, but you can add stuff to it */
    constructor() { }

    /** Register the current Service's manager */
    register(manager, key) {
        console.log("register()");

        /** The AdvancedManager the Service is attached to */
        this.manager = manager;

        /** The App the Service is attached to */
        this.app = manager.app;

        /** The Config of the App the Service is attached to */
        this.config = manager.config;

        /** The EventEmitter of the App the Service is attached to */
        this.emitter = manager.emitter;

        /** The key to where Service is stored in an AdvancedManager */
        this.key = key;

        this.install();
        return this;
    }

    /** Run after the Service has been registered */
    install() {
        console.log("register()");

        // All methods called after install have access to App event emitter, properties, Services, and Config
        console.log(this.config.serviceOptions);
        console.log(getConfig(this.config, "containerAttr", true)); //= "[data-container]"
    }

    /**
     * This method is called by the ServiceManager, so don't worry about it
     */
    /** Called before the start of a Service, represents a constructor of sorts */
    init(...args) {
        console.log("init()");
    }

    /**
     * This method is called by the ServiceManager, so don't worry about it
     */
    /** Called on start of Service */
    boot(...args) {
        console.log("boot()");
        this.initEvents();
    }

    /** Initialize events */
    initEvents() {
        // The "ready" event is defined by the App class, that only runs when the DOM is fully ready
        // The App class also defines a "scroll", and "resize" event
        // but those events are throttled to give the best performance
        this.emitter.on("ready", () => {
            console.log("initEvents()")
        });
    }

    /** Stop events */
    stopEvents() {
        console.log("stopEvents()");

        // Normally you would remove events and their event listeners here
        // But it's best not remove `ready` as it's an App wide event
    }

    /** Basically removes a Service, in order to recover the Service, it needs to be re-added to the App class */
    unregister() {
        console.log("unregister()");
        this.uninstall();

        // Remove everything, make sure there are no more reference to these objects
        // in order to ensure everything works well
        this.manager.remove(this.key);
        this.key = null;
        this.manager = null;
        this.app = null;
        this.config = null;
        this.emitter = null;
    }

    /** Run before the Service has been unregistered */
    uninstall() {
        console.log("uninstall()");
    }

    /**
     * This method `can be` called by the ServiceManager but you can also call it when you wish
     */
    /** Stop Service */
    stop() {
        console.log("stop()");

        this.stopEvents();
        this.unregister();
    }
}

app
    .add(new ExampleService())
    // or
    .set("ExampleService", new ExampleService());

try {
    console.log(app.get("ExampleService")) //= ExampleService { ... }

    app.on("resize", () => {
        console.log("App resizing");
    });

    app.boot();
} catch (e) {
    console.warn(e)
}
```

### PJAX

If you would like to use PJAX on your site you would probably want a setup like this,

Setup your HTML pages with this,

```html
<head>
    ...
</head>
<body>
    <!-- put here content that will not change
    between your pages, like <header> or <nav> -->

    <main data-wrapper>
        <!-- put here the content you wish to change
        between your pages, like your main content <h1> or <p> -->

        <!-- This will be prefetched on hover, and clicking on it will start the Fade transition -->
        <a href="./about.html" data-transition="fade">About</a>

        <!-- This won't be prefetched nor will PJAX run when clicked -->
        <a href="./other.html" data-prevent="self">Other</a>

        <!-- This will use the default replace transition, and will scroll to #image-5 -->
        <a href="./other.html#image-5">Last</a>
    </main>

    <!-- put here content that will not change
    between your pages, like <footer> -->
</body>
```

Then add this to your javascript,

```ts
import {  App, PJAX, TransitionManager, HistoryManager, PageManager, Router } from "@okikio/native";
import { animate } from "@okikio/animate";
const app = new App();

//= Fade Transition
const Fade = {
    name: "default",

    // Fade Out Old Page
    out({ from }) {
        let fromWrapper = from.wrapper;

        return animate({
            target: fromWrapper,
            opacity: [1, 0],
            duration: 500,
        })
    },

    // Fade In New Page
    async in({ to }) {
        let toWrapper = to.wrapper;

        await animate({
            target: toWrapper,
            opacity: [0, 1],
            duration: 500
        });
    }
};

app
    // Note only these 3 Services must be set under the names specified
    .set("HistoryManager", new HistoryManager())
    .set("PageManager", new PageManager())
    .set("TransitionManager", new TransitionManager([
        ["fade", Fade],
    ]))

    // The names of these Services don't really matter
    .set("Router", new Router())
    .add(new PJAX());

try {
    // Router is a router, depending on the page path it will run certain tasks
    // It support regexp and paths that path-to-regex supports
    const router = app.get("Router");
    router.add({
        path: "./index?(.html)?",
        method() {
            console.log("Run on Index page");
        }
    })

    // Note these events are emitted by the PJAX Service
    app.on({
        HOVER() {
            console.log("Print a value on hover over link")
        },
        CLICK() {
            console.log("Print something when a link is clicked")
        },
        NAVIGATION_START() {
            console.log("Print before you start loading pages and prior to transitioning")
        },
        // etc...
    })

    // While this event is emitted by the App
    app.on("resize", () => {
        console.log("App resizing");
    });

    app.boot();
} catch (e) {
    console.warn(e)
}
```

### Wrapper

The `wrapper` is the element with the `data-wrapper` attribute; it's the part of the page that get's switched out with new content. There can only be one `wrapper` per page, if there are multiple `wrapper`s the first `wrapper` will count as the wrapper for the page.

### Configuration

`@okikio/native` comes with some default configuration but these can be changed, by default these are the configurations it comes with. You can also create your own custom configurations.

```ts
export interface ICONFIG {
    /**
     * The Prefix attached to data attributes
     */
    prefix?: string;

    /**
     * The attribute used to identify wrappers
     * @default `wrapper` as in `data-wrapper`
    */
    wrapperAttr?: string;

    /**
     * Headers to attach to fetch requests done by the PageManager
     * e.g. if you only want to load a partial output containing only the wrapper
     *
     * @default `[]`
     * @example
     * ```ts
     * headers: [
     *      ["partial-output", "true"]
     * ]
     * ```
     */
    headers?: string[][];

    /**
     * Attribute used to identify anchors that don't want PJAX enabled
     * @default `prevent="self"` as in `data-prevent="self"`
     */
    preventSelfAttr?: string;

    /**
     * Attribute used to identify elements that don't want PJAX enabled for themeselves and their child elements
     * @default `prevent="all"` as in `data-prevent="all"`
     */
    preventAllAttr?: string;

    /**
     * Attribute used to identify transition an anchor wants to use, the value you set will select the transition used by name
     * _**Note**: transition names are case sensitive_
     * @default `transition` as in `data-transition`
     */
    transitionAttr?: string;

    /**
     * The amount of time in milliseconds to wait before counting the PageManagers fetch requests as timed out
     * @default `2000`
     */
    timeout?: number;

    /**
     * The maximum amount of pages to have in the cache at any moment in time;
     * PageManager removes pages from the cache to ensure content doesn't become stale;
     * and memory usage isn't too high
     * @default `5`
     */
    maxPages?: number;

    /**
     * The resize event is debounced by this amount of time (in miliseconds)
     * @default `100`
     */
    resizeDelay?: number;

    /**
     * Ignore extra clicks of an anchor element if a transition has already started
     * by default PJAX will reload the page on multiple clicks but this allows you to stop extra clicks
     * from affecting the current transition
     * @default `true`
     */
    onTransitionPreventClick?: boolean;

    /**
     * Specifies which urls to always fetch from the web
     * It also accepts boolean values:
     * - `true` means always fetch from the web for all urls
     * - `false` means always try to fetch from the cache
     * @default `false`
     */
    cacheIgnore?: boolean | IgnoreURLsList;

    /**
     * Specifies which urls to not prefetch
     * It also accepts boolean values:
     * - `true` means don't prefetch any anchor
     * - `false` means always prefetch all anchors
     * @default `false`
     */
    prefetchIgnore?: boolean | IgnoreURLsList;

    /**
     * Specifies which urls to not use PJAX for
     * @default `[]`
     */
    preventURLs?: boolean | IgnoreURLsList;

    /**
     * On page change (excluding popstate events, and hashes) keep current scroll position
     * @default `false`
     */
    stickyScroll?: boolean;

    /**
     * Force load a page if an error occurs
     * @default `true`
     */
    forceOnError?: boolean;

    /**
     * Don't do anything if the url has a hash
     * @default `false`
     */
    ignoreHashAction?: boolean;

    /**
     * TransitionManagers regestered transitions
     * @default `[]`
     */
    transitions?: Array<[string, ITransition]>;
    [key: string]: any;
}
```

### Animations & extras

By default `@okikio/native` doesn't come bundled with [@okikio/animate](https://www.npmjs.com/package/@okikio/animate), [@okikio/emitter](https://www.npmjs.com/package/@okikio/emitter), and [@okikio/manager](https://www.npmjs.com/package/@okikio/manager). Theses packages are all part of the [native initiative](https://github.com/okikio/native). You can install `@okikio/animate` as a seperate package and use it to create smooth transtions when using `@okikio/native`, however, you can also use other animations libraries if you wish.

```ts
import { App } from "@okikio/native";
import { animate } from "@okikio/animate";
// ...
```

Read through the [API guide](/docs/native/api.md) to learn more. 

## Browser & Node Support

| Chrome | Edge | Firefox |
| ------ | ---- | ------- |
| > 51   | > 14 | > 54    |

Learn about polyfilling, bundling, and more in the [platform support guide](/docs/native/platform-support.md).


## Contributing

If there is something I missed, a mistake, or a feature you would like added please create an issue or a pull request on the `beta` branch and I'll try to get to it.

Read through the [contributing documentation](/docs/native/contributing.md) for detailed guides.

## Licence

See the [LICENSE](/LICENSE) file for license rights and limitations (MIT).
