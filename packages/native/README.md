# @okikio/native

The framework that encourages performance, modern technologies, and great user experiences. The idea behind `@okikio/native` is that it acts as the core to the `native` initiative, it combines all the other package into it a core package that is ~7 KB (minified & compressed).

`@okikio/native` is a guideline on how to create great web experiences, that integrate into the system in use by the user and feel like a cohesive and native experience.

The idea behind it is that when an application feels native it integrates well into prior systems and `just works` and  works well. So, for example, a dark mode that follows the entire system. The `just works` is the key aspect of the framework, it should work without the user skipping a bit of whatever task they are aiming to complete.

On the web this boils down to being performant, efficient, and smooth.

The `@okikio/native` package acchieves performance, high efficiency, and a smooth experience by being heavily modern (relying on passive polyfills that only run on browsers that don't support certain features) and being well optimized.

Currently many websites rely on older code to make sure they reach as wide an audience as possible, hurting performance with large amounts of overhead.

`@okikio/native` uses modern browser api's like the Web Animation API, Maps, pushState, etc.... to achieve high efficiency and performance (as these API can be smartly managed by the browser). The browser API's can be difficult to work with, so, I developed `@okikio/manager`, `@okikio/emitter`, and `@okiko/animate` libraries to make them more managable. I developed these libraries to ensure the framework is well optimized and to avoid larges ammounts of npm dependencies.

You can play with `native` using Gitpod:

[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/okikio/native)

## Table of Contents
- [@okikio/native](#okikionative)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [Demo](#demo)
  - [API](#api)
    - [**ManagerItem**](#manageritem)
      - [MangerItem#manager: IAdvancedManager;](#mangeritemmanager-iadvancedmanager)
      - [MangerItem#app: IApp;](#mangeritemapp-iapp)
      - [MangerItem#config: ICONFIG;](#mangeritemconfig-iconfig)
      - [MangerItem#emitter: EventEmitter;](#mangeritememitter-eventemitter)
      - [MangerItem#key: any;](#mangeritemkey-any)
      - [MangerItem#install(): any;](#mangeriteminstall-any)
      - [MangerItem#register(manager: IAdvancedManager, key: any): ManagerItem;](#mangeritemregistermanager-iadvancedmanager-key-any-manageritem)
      - [MangerItem#uninstall(): any;](#mangeritemuninstall-any)
      - [MangerItem#unregister(manager: IAdvancedManager, key: any): any;](#mangeritemunregistermanager-iadvancedmanager-key-any-any)
      - [Example](#example)
    - [**AdvanncedManager**](#advanncedmanager)
      - [Example](#example-1)
      - [AdvancedManager#....Manager](#advancedmanagermanager)
      - [AdvancedManager#app: IApp;](#advancedmanagerapp-iapp)
      - [AdvancedManager#config: ICONFIG;](#advancedmanagerconfig-iconfig)
      - [AdvancedManager#emitter: EventEmitter;](#advancedmanageremitter-eventemitter)
      - [AdvancedManager#constructor(app: IApp): AdvancedManager<K, V extends ManagerItem>](#advancedmanagerconstructorapp-iapp-advancedmanagerk-v-extends-manageritem)
      - [AdvancedManager#set(key: K, value: V): AdvancedManager<K, V extends ManagerItem>](#advancedmanagersetkey-k-value-v-advancedmanagerk-v-extends-manageritem)
    - [**Service**](#service)
      - [Service#init(...args: any): any](#serviceinitargs-any-any)
      - [Service#boot(...args: any): any](#servicebootargs-any-any)
      - [Service#initEvents(): void](#serviceinitevents-void)
      - [Service#stopEvents(): void](#servicestopevents-void)
      - [Service#stop(): void](#servicestop-void)
      - [Example](#example-2)
    - [**ServiceManager**](#servicemanager)
      - [ServiceManager/#stop()/#boot()/#init(): ServiceManager](#servicemanagerstopbootinit-servicemanager)
    - [**App**](#app)
      - [App#config: ICONFIG;](#appconfig-iconfig)
      - [App#emitter: EventEmitter;](#appemitter-eventemitter)
      - [App#services: ServiceManager;](#appservices-servicemanager)
      - [App#constructor(config: object = {}): App](#appconstructorconfig-object---app)
      - [App#register(config: ICONFIG = {}): App](#appregisterconfig-iconfig---app)
      - [App/#get(key: string): Service/#set(key: string, value: Service): App/#add(value: Service): App](#appgetkey-string-servicesetkey-string-value-service-appaddvalue-service-app)
      - [App#boot(): App](#appboot-app)
      - [App#stop(): App](#appstop-app)
      - [App#on/off(events: EventInput, callback?: ListenerCallback): App](#apponoffevents-eventinput-callback-listenercallback-app)
      - [App#emit(events: string | any[], ...args: any): App](#appemitevents-string--any-args-any-app)
      - [Example](#example-3)
    - [**HistoryManager**](#historymanager)
      - [HistoryManager#states: IState[]](#historymanagerstates-istate)
      - [HistoryManager#pointer: number](#historymanagerpointer-number)
      - [HistoryManager#init(): void](#historymanagerinit-void)
      - [HistoryManager#get(index: number): IState](#historymanagergetindex-number-istate)
      - [HistoryManager#add(value?: IState, historyAction: "replace" | "push" = "push"): HistoryManager](#historymanageraddvalue-istate-historyaction-replace--push--push-historymanager)
      - [HistoryManager#remove(index?: number): HistoryManager](#historymanagerremoveindex-number-historymanager)
      - [HistoryManager#replace(newStates: IState[]): HistoryManager](#historymanagerreplacenewstates-istate-historymanager)
      - [HistoryManager#set(i: number, state: IState): IState](#historymanagerseti-number-state-istate-istate)
      - [HistoryManager#current: IState](#historymanagercurrent-istate)
      - [HistoryManager#last: IState](#historymanagerlast-istate)
      - [HistoryManager#previous: IState | null](#historymanagerprevious-istate--null)
      - [HistoryManager#length: number](#historymanagerlength-number)
      - [#newCoords(x: number = window.scrollX, y: number = window.scrollY): ICoords](#newcoordsx-number--windowscrollx-y-number--windowscrolly-icoords)
      - [#newState(state: IState): IState](#newstatestate-istate-istate)
      - [#changeState(action: "push" | "replace", state: IState, item: object): void](#changestateaction-push--replace-state-istate-item-object-void)
      - [Example](#example-4)

## Getting Started

`native` is a framework who's goal is to make it easier to create complex, performant, light-weight, web applications using native js apis. It was inspired by Rezo Zero's Starting Blocks project, and Barba.js. Both libraries had a major impact on the development of this project. Barba.js is easy to use and elevates the experience of a site with the use of PJAX, while Starting Blocks used native apis to create light-weight but complex web experiences. This project exists as a more flexible alternative to Starting Blocks, but with the same intuitive design and experience (UX/DX) Barba.js provides. It also, allows for web apps to be created without the need of PJAX, and safely switches back to normal HTML controls if JS is disabled.

This project is called a framework but it is more like a guideline, if all you want is a simple starter project that has PJAX built in then you install the project from `npm` once it becomes available, but otherwise you download the project into you workspace and tweak it to match your projects needs and remove all the extra fluff you don't want (By the way, this project works best with treeshaking, so, for the sake of speed, performance, and weight use Rollup or Webpack; Rollup is preferred).

This package is built for es2020, it expects the user to use a build tool support older versions of browsers, the idea being most people are using evergreen browsers, so, why are web developers piling on polyfill code that most users don't need.

## Demo

Located in [./build](https://github.com/okikio/native/tree/master/packages/native/build), you will find multiple build files that can help you create your setup. The [pug folder](https://github.com/okikio/native/tree/master/packages/native/build/pug) contains [pug](https://pugjs.org/api/getting-started.html) files that format my html in a clean and clear way. The [sass folder](https://github.com/okikio/native/tree/master/packages/native/build/sass) contains [scss](https://sass-lang.com/guide) files that allow for modern css without the need of polyfills. The [ts folder](https://github.com/okikio/native/tree/master/packages/native/build/ts) contains [typescript](https://www.typescriptlang.org/) files that the framework runs on; typescript is used, because Intellisense is better with typescript. Outside the build folder, the [gulpfile.js](https://github.com/okikio/native/tree/master/packages/native/gulpfile.js) file, is part of my [gulp](https://gulpjs.com/) config, and is the tool I use to build the demo, for your project other tools should also work, with some amoount of work. Explore the files stated above to learn how to get started.


> [View the Demo  &#8594;](https://okikio.github.io/native/packages/native/demo/)


## API
`@okikio/native` has `5` base classes, they are:
* `ManagerItem`
* `AdvanncedManager`
* `Service`
* `ServiceManager`
* `App`

There are also `6` project based classes:
* `HistoryManager`
* `Router`
* `Page`
* `PageManager`
* `TransitionManager`
* `PJAX`

Project based classes are optional and are based on the type of project you are creating, if they are not used, tree shaking using `rollup`, or `esbuild`, should get rid of them.

The `5 base classes` are mandatory classes that are built into the framework,  tree shaking won't be able to get rid of them.

### **ManagerItem**

MangerItem is a class that can only be stored in the `AdvancedManager` class, it posses is self aware of it's envrioment, so things like the manager it's attached to, and the `App` instance that the `AdvancedManager` is attached to. It can also access data from other `ManagerItem`'s via the `AdvancedManager` and `App`. Be very careful with `ManagerItem` as it references, so, many other classes that if you don't properly dispose of a reference you might create a mermory leak unknowingly. When it comes to references it

`ManagerItem` only gains self awareness after it has been registered with a `AdvancedManager` that has also been instantiated in an `App` (rather non-dynamic isn't it). I didn't use Promises or other dependency injection methods, because it adds complexity and bulk in a way most project don't need. If your project rquires such a dynamic and complex setup you should use WebWorkers and a custom dependency injection setup, this is far out of the scope of this project, so, it will require a custom solution for each project. If in the future `@okikio/native` needs dependency injection I would be willing to build it in.

*Note: when working with WebWorkers don't use more than one or 2 at a time, I have found that two is the maximum that lower end hardware can safely use with max performance.*

#### MangerItem#manager: IAdvancedManager;
```ts
MangerItem.prototype.manager: IAdvancedManager;

/**
 * The AdvancedManager the ManagerItem is attached to;
 * It only gains self awareness after it has been registered to a `AdvancedManager` that has also been instantiated in an `App`
 *
 * @type IAdvancedManager
 */
```

#### MangerItem#app: IApp;
```ts
MangerItem.prototype.app: IApp;

/**
 * The App the ManagerItem is attached to
 *
 * @type IApp
 */
```

#### MangerItem#config: ICONFIG;
```ts
MangerItem.prototype.config: ICONFIG;

/**
 * The Config of the App the ManagerItem is attached to
 *
 * @type ICONFIG
 */
```

#### MangerItem#emitter: EventEmitter;
```ts
MangerItem.prototype.emitter: EventEmitter;

/**
 * The EventEmitter of the App the ManagerItem is attached to
 *
 * @type EventEmitter
 */
```

#### MangerItem#key: any;
```ts
MangerItem.prototype.key: any;

/**
 * The key of ManagerItem when set in a AdvancedManager;
 *
 * @type any
 */
```

#### MangerItem#install(): any;
```ts
MangerItem.prototype.install(): any;

/**
 * Runs after the ManagerItem has been registered. By default it does nothing, but if ManagerItem is extended it can be fairly useful for completing tasks right after it a ManagerItem is added to an AdvancedManager
 *
 * @returns any
 */
```

#### MangerItem#register(manager: IAdvancedManager, key: any): ManagerItem;
```ts
MangerItem.prototype.register(manager: IAdvancedManager, key: any): ManagerItem;

/**
 * Registers the ManagerItem and makes it self aware
 *
 * @param {IAdvancedManager} manager
 * @param {any} key
 * @returns ManagerItem
 */
```

#### MangerItem#uninstall(): any;
```ts
MangerItem.prototype.uninstall(): any;

/**
 * Runs before the ManagerItem has been unregistered. By default it does nothing, but if ManagerItem is extended it can be fairly useful, for disposing of references, etc...
 *
 * @returns any
 */
```

#### MangerItem#unregister(manager: IAdvancedManager, key: any): any;
```ts
MangerItem.prototype.unregister(): any;

/**
 * Unregisters the ManagerItem, removes its self awareness, and removes the ManagerItem from the AdvancedManager. Use this onces you are done with a ManagerItem and want to dispose of it's access to other base classes
 *
 * @returns any
 */
```

#### Example
```ts
import { App, AdvancedManager, ManagerItem } from "@okikio/native";

const app = new App();
const manager = new AdvancedManager(app);
const item = new ManagerItem(); // Not yet self aware
const item2 = new ManagerItem(); // Not yet self aware

// Now ManagerItem is self aware
manager.add(item);
manager.set("item2", item2);

// ManagerItem now has access to App, Config, Manager, Emitter, etc...
console.log(item.app); // => App { ... }
console.log(item.config); // => { ... }
console.log(item.emitter); // => EventEmitter { ... }
console.log(item.manager); // => AdvancedManager { ... }
console.log(item.manager.get("item2")); // => ManagerItem { ... }
console.log(item2.key); // => "item2"
console.log(item); // => ManagerItem { ... }

item2.unregister();

// ManagerItem now has access to App, Config, Manager, Emitter, etc...
console.log(item2.app); // => undefined
console.log(item2.config); // =>undefined
console.log(item2.emitter); // => undefined
console.log(item2.manager); // => undefined
console.log(item2); // => ManagerItem { ... }

// Note: it unregisters the key, and removes the ManagerItem from the AdvancedManager
console.log(item2.key); // => undefined
console.log(item.manager.get("item2")); // => undefined
```

*Note: `Service` extends `ManagerItem`, so, everything that holds for `ManagerItem` also holds for `Service`.*

### **AdvanncedManager**

The `AdvancedManager` class is an extention of the `Manager` class (as in `AdvancedManager` extends `Manager`). `AdvancedManager` has the ability to share details about the `App` class it's attached to, to the `ManagerItem`'s it stores.

For example, `AdvancedManager` can give access to the `App` classes `ServiceManager` to a `ManagerItem` from another `AdvancedManager`, allowing a `ManagerItem` to access `Service`'s running on the `App` inside `ServiceManager`.

#### Example
```ts
import { AdvancedManager, ManagerItem, Service } from "@okikio/native";
const app = new App();
const manager = new AdvancedManager(app);
const item = new ManagerItem(); // Not yet self aware
app.test_manager = manager;

// Now ManagerItem is self aware
manager.set("item", item);

// Not yet self aware; Service extends ManagerItem
const service = new Service();
app.set("service", service); // Now Service is self aware

console.log(item.app.get("service")); // => Service { ... }
console.log(service.app.test_manager); // => AdvancedManager { ... }

let _item = service.app.test_manager.get("item");
console.log(_item); // => ManagerItem { ... }
console.log(_item.key); // => "item"
console.log(item.key); // => "item"
```
#### AdvancedManager#....Manager#
All the properties and methods of the `Manager` class, read `@okikio/manager`'s README to learn more [../manager/README.md](../manager/README.md).

#### AdvancedManager#app: IApp;
```ts
AdvancedManager.prototype.app: IApp;

/**
 * The App the AdvancedManager is attached to
 *
 * @type IApp
 */
```

#### AdvancedManager#config: ICONFIG;
```ts
AdvancedManager.prototype.config: ICONFIG;

/**
 * The Config of the App the AdvancedManager is attached to
 *
 * @type ICONFIG
 */
```

#### AdvancedManager#emitter: EventEmitter;
```ts
AdvancedManager.prototype.emitter: EventEmitter;

/**
 * The EventEmitter of the App the AdvancedManager is attached to
 *
 * @type EventEmitter
 */
```

#### AdvancedManager#constructor(app: IApp): AdvancedManager<K, V extends ManagerItem>
```ts
AdvancedManager.prototype.constructor(app: IApp): AdvancedManager<K, V extends ManagerItem>;
new AdvancedManager(app: IApp): AdvancedManager<K, V extends ManagerItem>;

/**
 * @param {IApp} app - The instance of the App class, the Manager is instantiated in
 */
```

#### AdvancedManager#set(key: K, value: V): AdvancedManager<K, V extends ManagerItem>
```ts
AdvancedManager.prototype.set(key: K, value: V): AdvancedManager<V extends ManagerItem>;

/**
 * Set a value (V extends ManagerItem) in the Manager and register the ManagerItem
 *
 * @param  {K} key - The key where the ManagerItem will be stored
 * @param  {V extends ManagerItem} value - The ManagerItem to store
 * @returns AdvancedManager<K, V extends ManagerItem>
 */
```

The example above should also work to explain how to use the AdvancedManager API's.

*Note: `ServiceManager` extends `AdvancedManager`, so all the properties and methods present, will also work on `ServiceManager`.*


### **Service**
`Service` does everything, it is what enables, `PJAX`, `HistoryManager`, `Router`, `PageManager`, `Page`, and `TransitionManager` to function, even though they are seperate from the `App` class.

`Service` is an extention of `ManagerItem`, that adds extra life-cycle methods for controlling specific kinds of actions that require js.

The life-cycle methods of a `Service` are register, install, init, boot, initEvents, stop, stopEvents, uninstall, and unregister.

Here is a diagram that may aid in your understanding.
[![Life Cycle Diagram](./assets/lifecycle.png)](./assets/lifecycle.png)

The lifecycle is controlled by the `ServiceManager`, the `Service`'s themselves have the lifecycle methods, but only the `ServiceManager` can decide when to call the lifecycle methods of all `Service`'s.

The `ServiceManager` recieves an instruction from the `App` via a method call, to which the `ServiceManager` then initializes all `Service`'s via the `init()` method after all `Service`'s have been initialized the `ServiceManager` then boots all `Service`'s via the `boot()` method, the `boot()` method then initializes any events the `Service` may have via `initEvents()`, that's the lifecycle for starting a `Service`.

To stop `Service`'s the `SeviceManager` calls the `stop()` method, which calls the `stopEvents()` and `unregister()` methods, completely reseting the `Service` to just before it was added to the `ServiceManager`.

*Note: there also exists an `install()` & `register()` method (inherited from `ManagerItem`) that installs and makes a `Service` self aware on addition to the `ServiceManager`. The `stop()` method removes a `Service`'s self awareness, to make a `Service` self aware again, the Service has to be re-added to `ServiceManger`.*

#### Service#init(...args: any): any
```ts
Service.prototype.init(...args: any): any;

/**
 * Called before the start of a Service, represents a constructor of sorts
 *
 * @param  {any} [...args]
 * @returns any
 */
```

#### Service#boot(...args: any): any
```ts
Service.prototype.boot(...args: any): any;

/**
 * Called on start of Service.
 * Calls initEvents() method
 *
 * @param  {any} [...args]
 * @returns any
 */
```

#### Service#initEvents(): void
```ts
Service.prototype.initEvents(): void;

/**
 * Initialize events
 */
```

#### Service#stopEvents(): void
```ts
Service.prototype.stopEvents(): void;

/**
 * Stop events
 */
```

#### Service#stop(): void
```ts
Service.prototype.stop(): void;

/**
 * Stop Service events, and unregister Service
 * Note: A Service can also dispose of itself earlier if need be, but it can only dispose of itself, it can't dispose of other Services without the ServiceManager
 */
```



#### Example
To create a new `Service` you have to extend the `Service` class, like, so,
```ts
import { Service, App, animate } from "@okikio/native";

// Imagine a DIV element with the class name of ".div" exists in the DOM
// This Service animates the motion of a moving DIV
class Move extends Service {
    init() {
        this.div = document.querySelector(".div");

        console.log(this.manager); //= ServiceManager { ... }
        console.log(this.div); //= DIV Element { ... }
        console.log(this); // Service { ... }
    }

    initEvents() {
        // On document load event
        this.emitter.on("ready", this.ready, this);
    }

    async ready() {
        await animate({
            target: this.div,
            transform: ["translateY(0)", `translateY(20px)`],
            onfinish(el) {
                el.style.transform = `translateY(20px)`;
            }
        });

        // Dispose of the Move Service once the animation is over
        // A Service can also dispose of itself earlier if need be
        // Remeber that the stop() method, also calls the stopEvents() method
        this.stop();

        console.log(this.manager); //= undefined
        console.log(this.div); //= undefined
        console.log(this); // Service { ... }
    }

    stopEvents() {
        // Remove document load event listener
        this.emitter.off("ready", this.ready, this);
    }

    uninstall() {
        this.div = undefined;
    }
}

const app = new App();
app.add(new Move());

 // Indicates to the ServiceManager to start initialize and start the Service's
app.boot();
```


### **ServiceManager**
The `ServiceManager` controls the lifecycle of all Services in an App. It extends the `AdvancedManager`, so it gains all the abilities, methods, and properties of the `AdvancedManager`, and extends them with some new methods namely `init()`, `boot()`, and `stop()`, they are basically glorified for loops that call the corresponding methods with the same name for all `Service`'s (since all `Services` have these methods).

#### ServiceManager/#stop()/#boot()/#init(): ServiceManager
```ts
// I didn't bother creating multiple different sections, since they are really simple
Service.prototype.stop(): ServiceManager;
Service.prototype.boot(): ServiceManager;
Service.prototype.init(): ServiceManager;

/**
 * Stop, Boot, & Initialize all Services
 * Note: A Service can call the ServiceManager methods since it's self aware and has access to the ServiceManager, but best not to do that, as it may create unrepairable bugs
 *
 * Let the framework handle the ServiceManager methods for the sake of ease of use
 */
```

### **App**
The `App` class starts the entire process, it controls all managers and services, nothing will and can happen without the `App` class (it's pretty important).

#### App#config: ICONFIG;
```ts
App.prototype.config: ICONFIG;

/**
 * The current Configuration's for the App, acts like settings, the Config is an object with some preset values set, for all self aware content within an App to access. The default values for Config are:
 * {
      wrapperAttr: "wrapper",
      noAjaxLinkAttr: "no-ajax-link",
      noPrefetchAttr: "no-prefetch",
      headers: [
          ["x-partial", "true"]
      ],
      preventSelfAttr: `prevent="self"`,
      preventAllAttr: `prevent="all"`,
      transitionAttr: "transition",
      blockAttr: `block`,
      timeout: 30000
 * }
 *
 * @type ICONFIG
 */
```

#### App#emitter: EventEmitter;
```ts
App.prototype.emitter: EventEmitter;

/**
 * An instance of the EventEmitter
 *
 * @type EventEmitter
 */
```

#### App#services: ServiceManager;
```ts
App.prototype.services: ServiceManager;

/**
 * An instance of the ServiceManager
 *
 * @type ServiceManager
 */
```

#### App#constructor(config: object = {}): App
```ts
App.prototype.constructor(config: object = {}): App;
new App(config: object = {}): App;

/**
 * Registers the Config, as well as creates new instances of the ServiceManager, and the EventEmitter
 *
 * @param {object} [config = {}] - The configurations for the App
 */
```

#### App#register(config: ICONFIG = {}): App
```ts
App.prototype.register(config: ICONFIG = {}): App;

/**
 * Creates new instances of the ServiceManager, EventEmitter and the configurations
 * Emit "ready" event on DOMContentLoaded and/or Window load
 *
 * @param {ICONFIG} [config = {}] - The configurations for the App
 * @return App
 */
```

#### App/#get(key: string): Service/#set(key: string, value: Service): App/#add(value: Service): App
```ts
// Aliases to the ServiceManager methods of the same name
// The act on the App's ServiceManager instance
App.prototype.get(key: string): Service;
App.prototype.set(key: string, value: Service): App;
App.prototype.add(value: Service): App;

/**
 * Shortcuts to adding, setting, and getting Services
 *
 * @param  {string} key - The key where the Service will be stored
 * @param  {Service} value - The Service to store
 * @return {get(): Service / set(): App / add(): App}
 */
```

#### App#boot(): App
```ts
App.prototype.boot(): App;

/**
 * Initialize and the boots all Services,
 * Warning: do NOT, and I repeat do NOT, call the boot() method multiple times, you will run into more bugs than there are in the Safari if you do
 *
 *
 * @return App
 */
```

#### App#stop(): App
```ts
App.prototype.stop(): App;

/**
 * Stops all Services and clears the even emitter of all events and listeners
 *
 * @return App
 */
```

#### App#on/off(events: EventInput, callback?: ListenerCallback): App
```ts
App.prototype.on(events: EventInput, callback?: ListenerCallback): App;
App.prototype.off(events: EventInput, callback?: ListenerCallback): App;

/**
 * Shortcuts to the App EventEmitter on and off methods, they create and remove events and event listeners, read more about @okikio/emitter in [../emitter/README.md](https://github.com/okikio/native/tree/master/packages/emitter/README.md).
 * Note: the scope of the events are automatically set to the App
 *
 * @param  {EventInput} events - Takes event name, and supports all the different ways to represent events that @okikio/amitter offers
 * @param  {ListenerCallback} [callback?] - Event Listener
 * @return App
 */
```

#### App#emit(events: string | any[], ...args: any): App
```ts
App.prototype.emit(events: string | any[], ...args: any): App;

/**
 * Shortcuts to the App EventEmitter emit method, emits (triggers) events and event listeners, read more about @okikio/emitter in [../emitter/README.md](https://github.com/okikio/native/tree/master/packages/emitter/README.md)
 *
 * @param  {string | any[]} events - Takes event names, and supports all the different ways to represent events that @okikio/amitter offers
 * @param  {any} [...args] - Arguments to pass to the events
 * @return App
 */
```

#### Example
```ts
import { Service, App, animate } from "@okikio/native";

let el = document.querySelector(".div");

// Imagine a DIV element with the class name of ".div" exists in the DOM
// This Service animates the motion of a moving DIV
class Move extends Service {
    init() {
        this.div = el;
    }

    initEvents() {
        // On document load event
        this.emitter.on("ready", this.ready, this);
    }

    async ready() {
        await animate({
            target: this.div,
            transform: ["translateY(0)", `translateY(20px)`],
            onfinish(el) {
                el.style.transform = `translateY(20px)`;
            }
        });

        // Fire all event listerners for "move-animation-done", with the argument "this.div"
        this.emitter.emit("move-animation-done", this.div);
    }

    uninstall() {
        this.div = undefined;
    }
}

// Imagine a DIV element with the class name of ".div" exists in the DOM
// This Service animates the opacity of the DIV
class Fade extends Service {
    init() {
        this.div = el;
    }

    initEvents() {
        // On document "move-animation-done" event
        this.emitter.on("move-animation-done", this.run, this);
    }

    async run() {
        await animate({
            target: this.div,
            opacity: ["1", `0.25`, `1`],
            onfinish(el) {
                el.style.opacity = `1`;
            }
        });

        // Remeber the stop() method removes access to the EventEmitter, App, ServiceManager, etc...
        let { emitter } = this;
        this.stop();

        // Fire "app-stop" event
        emitter.emit("app-stop");

        // Be carefull here, it's possibile to have a memory leak if you don't dispose of emitter
        emitter = undefined;
    }

    stopEvents() {
        // Remove "move-animation-done" event listener
        this.emitter.off("move-animation-done", this.run, this);
    }

    uninstall() {
        this.div = undefined;
    }
}

const app = new App();
app.add(new Move());
app.set("fade", new Fade()); // Sets the Fade Service in ServiceManager under the key "fade"

console.log(app.get("fade")); //= Service { ... }

let listener = (div) => {
    console.log("Move Animation is Done", div); //= Move Animation is Done, DIV Element { ... }
    app.off("move-animation-done", listener); // Only run this listener for "move-animation-done" once, remove the listener after the first run
};

// Listen for the "move-animation-done" event
app.on("move-animation-done", listener);

 // Indicates to the ServiceManager to initialize and start Service's
app.boot(); // Only call this once, it will cause bugs if you call it multiple times

let finish = () => {
    // Stops and clears ServiceManager and EventEmitter
    app.stop();

    console.log(app.emitter.size); //= 0
    console.log(app.services.size); //= 0
    console.log(el); //= DIV Element { ... }
    el = undefined; // Release reference
};

// This is different from the on() method of the App class, its has direct access to the EventEmitter
app.emitter.on("app-stop", finish);
```

---

These are the the `5` base classes, but there are also `6` project based classes, namely:
* `HistoryManager`
* `Router`
* `Page`
* `PageManager`
* `TransitionManager`
* `PJAX`

### **HistoryManager**
`HistoryManager` is a `Service` that keeps a record of the history of the App; it stores only the states of Pages. A state represents the current status of a page, consisting of properties like: url, transition, and data. `HistoryManager` is an extention of the `Service` class.

#### HistoryManager#states: IState[]
```ts
HistoryManager.prototype.states: IState[];

/**
 * An array of states
 *
 * @type IState[]
 */
```

#### HistoryManager#pointer: number
```ts
HistoryManager.prototype.pointer: number;

/**
 * Current position of a state in the states array
 *
 * @type number
 */
```

#### HistoryManager#init(): void
```ts
HistoryManager.prototype.init(): void;

/**
 * Initializes the states array, and replace the history pushState data with the states array
 */
```

#### HistoryManager#get(index: number): IState
```ts
HistoryManager.prototype.get(index: number): IState;

/**
 * Get a state based on it's index
 *
 * @param {number} index - Index of state
 * @return IState
 */
```

#### HistoryManager#add(value?: IState, historyAction: "replace" | "push" = "push"): HistoryManager
```ts
HistoryManager.prototype.add(value?: IState, historyAction: "replace" | "push" = "push"): HistoryManager;

/**
 * Add a state to HistoryManager and change the history pushState data based on the historyAction specified
 *
 * @param {IState} [value?] - State to add
 * @param {"replace" | "push"} [historyAction = "push"] - Which pushState method to use to update the page history
 * @return HistoryManager
 */
```

#### HistoryManager#remove(index?: number): HistoryManager
```ts
HistoryManager.prototype.remove(index?: number): HistoryManager;

/**
 * Remove state by the index, or by removing the last state in the states array and decrease the pointer by 1, if an index isn't specified
 *
 * @param {number} [index?] - Index of state to remove
 * @return HistoryManager
 */
```

#### HistoryManager#replace(newStates: IState[]): HistoryManager
```ts
HistoryManager.prototype.replace(newStates: IState[]): HistoryManager;

/**
 * Replaces the states array with another states array, this is later used when going back and forward in page history
 *
 * @param {IState[]} newStates - Array of states to replace with current array of states
 * @return HistoryManager
 */
```

#### HistoryManager#set(i: number, state: IState): IState
```ts
HistoryManager.prototype.set(i: number, state: IState): IState;

/**
 * Set state by index
 *
 * @param {number} i - Index to place state in states array
 * @param {IState} state - State to set
 * @return IState
 */
```

#### HistoryManager#current: IState
```ts
HistoryManager.prototype.current: IState;

/**
 * Get the current state by the pointer
 *
 * @type IState
 */
```

#### HistoryManager#last: IState
```ts
HistoryManager.prototype.last: IState;

/**
 * Get the last state (top of the history stack)
 *
 * @type IState
 */
```

#### HistoryManager#previous: IState | null
```ts
HistoryManager.prototype.previous: IState | null;

/**
 * Get the previous state or return null if there is not a previous number
 *
 * @type IState | null
 */
```

#### HistoryManager#length: number
```ts
HistoryManager.prototype.length: number;

/**
 * The length of the states array
 *
 * @type number
 */
```

#### #newCoords(x: number = window.scrollX, y: number = window.scrollY): ICoords
```ts
newCoords(x: number = window.scrollX, y: number = window.scrollY): ICoords;

/**
 * A quick snapshot of a pages scroll coordinates
 *
 * @param {number} [x = window.scrollX] - Scroll coordinates in the x axis
 * @param {number} [y = window.scrollY] - Scroll coordinates in the y axis
 * @return ICoords
 */
```

#### #newState(state: IState): IState
```ts
newState(state: IState = {
	url: getHashedPath(newURL()),
	index: 0,
	transition: "default",
	data: {
		scroll: newCoords(),
		trigger: "HistoryManager"
	}
}): IState;

/**
 * Creates a new state; Remember a state represents the current status of the page consisting of properties like: url, transition, and data
 *
 * @param {IState} [state = {
    url: getHashedPath(newURL()),
    index: 0,
    transition: "default",
    data: {
      scroll: newCoords(),
      trigger: "HistoryManager"
    }
  }]
 * @return IState
 */
```

#### #changeState(action: "push" | "replace", state: IState, item: object): void
```ts
changeState(action: "push" | "replace", state: IState, item: object): void;

/**
 * Either push or replace history state using pushState
 *
 * @param {"push" | "replace"} action - push or replace history state
 * @param {IState} state - new state
 * @param {object} item - an history item containing the current states array from the HistoryManager
 */
```

#### Example
The `HistoryManager` methods aren't really meant to be used, you are just supposed to create a new instance of the `HistoryManager` and attach it to the app.

```ts
// ...
app.set("HistoryManager", new HistoryManager());
// ...
```

*Note: the `HistoryManager` needs to be present in an `App` for the `PJAX` service to function.*

This example is the go method for the `PJAX` service.

```ts
// ...
go({
    href,
    trigger = "HistoryManager",
    event,
}) {
    // If transition is already running and the go method is called again, force load page
    if (this.isTransitioning && this.stopOnTransitioning ||
        !this.manager.has("TransitionManager") ||

        // The PJAX service will only work if the HistoryManager is set as a Service in the App's ServiceManager
        !this.manager.has("HistoryManager") ||
        !this.manager.has("PageManager")) {
        this.force(href);
        return;
    }

    // Get HistoryManager Service if it exists
    const history = this.manager.get("HistoryManager") as IHistoryManager;
    let scroll = { x: 0, y: 0 };
    let currentState = history.current;
    let currentURL = currentState.url;
    if (equal(currentURL, href)) {
        return;
    }

    let transitionName: string;
    if (event && (event as PopStateEvent).state) {
        this.emitter.emit("POPSTATE", event);

        // If popstate, get back/forward direction.
        let { state }: { state: IHistoryItem } = event as PopStateEvent;
        let { index } = state;
        let currentIndex = currentState.index;
        let difference = currentIndex - index;

        // Get the current state from the history pointer
        let _state = history.get(history.pointer);
        transitionName = _state.transition;
        scroll = _state.data.scroll;

        // Replace the states array with a popstate event (forward or backward page) states array
        history.replace(state.states);
        history.pointer = index;

        trigger = this.getDirection(difference);

        // Based on the direction of the state change either remove or add a state
        this.emitter.emit(trigger === "back" ? `POPSTATE_BACK` : `POPSTATE_FORWARD`, event);

    } else {
        // Add new state
        transitionName = this.getTransitionName(trigger as HTMLAnchorElement) ||
            "default";

        scroll = newCoords();

        let state = newState({
            url: href,
            transition: transitionName,
            data: { scroll },
        });

        // Add the new state to the HistoryManager
        history.add(state);
        this.emitter.emit("HISTORY_NEW_ITEM", event);
    }

    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }

    this.emitter.emit("GO", event);
    return this.load({
        oldHref: currentURL,
        href,
        trigger,
        transitionName,
        scroll,
    });
}
// ...
```
