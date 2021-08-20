## API

I highly suggest going through the [API documentation](/docs/api/modules/_okikio_native.md), for a more detailed documentation of the API's.

### Summary 

`@okikio/native` has `5` base classes and `5` project classes, the base classes are:

- `ManagerItem`
- `AdvanncedManager`
- `Service`
- `ServiceManager`
- `App`

While the `5` project classes are:

- `HistoryManager`
- `TransitionManager`
- `PageManager/Page`
- `PJAX`
- `Router`

Project classes are optional and are based on the type of project you are creating, if they are not used, tree shaking using `rollup`, `webpack`, or `esbuild` should get rid of them.

The `5 base classes` are mandatory classes that are built into the framework (tree shaking won't be able to get rid of them).

*Note: all classes that aren't base classes are `Service`'s, or they extend the `Service` class in some way.*

### Types

Many typescript types are used in the docs, for more info about these types go to [@types](/packages/native/@types).

### Events

In total there are 25 events, they are:

### PageManager events

- "REQUEST_ERROR" - During a fetch request, if an error other than a timeout occurs
- "TIMEOUT_ERROR" - A fetch request timeout error

e.g.

```ts
// ...
app.on("REQUEST_ERROR" | "TIMEOUT_ERROR", (err: Error, url: string) => {
    // ...
})
```

### PJAX events

- "ANCHOR_HOVER" / "HOVER" - When you hover over an anchor
- "ANCHOR_CLICK" / "CLICK" - When a valid anchor element element is clicked and just before navigation starts
- "PREFETCH" - When a prefetch is called with no errors

e.g.

```ts
// ...
app.on("ANCHOR_HOVER" | "HOVER" | "ANCHOR_CLICK" | "CLICK" | "PREFETCH", (event: LinkEvent) => {
    // ...
})
```

- "POPSTATE" - When moving through page history, either forward or backward
- "POPSTATE_BACK" - When going back in page history
- "POPSTATE_FORWARD" - When going forward in page history
- "HISTORY_NEW_ITEM" - When a valid link is clicked and new state is added to history
- "GO" - If transition is not running and if current url is different from the new url.

e.g.

```ts
// ...
app.on("POPSTATE" | "POPSTATE_BACK" | "POPSTATE_FORWARD" | "HISTORY_NEW_ITEM" | "GO", (event: StateEvent) => {
    // ...
})
```

- "NAVIGATION_START" - Before loading new page and building them
- "PAGE_LOADING" - Fires when page starts loading
- "PAGE_LOAD_COMPLETE" - Fires when page load is complete
- "NAVIGATION_END" - After transitions, page load & build, etc... Fires to indicate the entire navigation process is complete

e.g.

```ts
// ...
app.on("NAVIGATION_START", ({ oldHref, href, trigger, transitionName, scroll }: {
    oldHref: string,
    href: string,
    trigger: TypeTrigger,
    transitionName: string,
    scroll: ICoords
}) => {
    // ...
});

app.on("PAGE_LOADING", ({ href, oldHref, trigger, scroll }: {
    oldHref: string,
    href: string,
    trigger: TypeTrigger,
    scroll: ICoords
}) => {
    // ...
});

app.on("PAGE_LOAD_COMPLETE", ({ newPage, oldPage, trigger, scroll }: {
    newPage: IPage,
    oldPage: IPage,
    trigger: TypeTrigger,
    scroll: ICoords
}) => {
    // ...
});

app.on("NAVIGATION_END", ({ newPage, oldPage, trigger, transitionName, scroll }: {
    newPage: IPage,
    oldPage: IPage,
    trigger: TypeTrigger,
    transitionName: string,
    scroll: ICoords
}) => {
    // ...
});
```

### TransitionManager events

- "TRANSITION_START" - Indicates the start of the transition process
- "BEFORE_TRANSITION_OUT" - Before transitioning the old page out
- "AFTER_TRANSITION_OUT" - After transitioning the old page out
- "CONTENT_INSERT" - After the new page gets added to the DOM
- "CONTENT_REPLACED" - After the new page has replaced the old page (the old page has been removed from the DOM)
- "BEFORE_TRANSITION_IN" - Before transitioning the new page in
- "AFTER_TRANSITION_IN" - After transitioning the new page in
- "TRANSITION_END" -  Indicates the end of the transition process

e.g.

```ts
// ...
app.on("TRANSITION_START" | "TRANSITION_END", ({ oldPage, newPage, trigger, scroll, ignoreHashAction }: {
    newPage: IPage,
    oldPage: IPage,
    trigger: TypeTrigger,
    transitionName: string,
    ignoreHashAction: boolean,
    scroll: ICoords
}) => {
    // ...
});

app.on("BEFORE_TRANSITION_OUT" | "AFTER_TRANSITION_OUT" | "CONTENT_INSERT" | "CONTENT_REPLACED" | "BEFORE_TRANSITION_IN" | "AFTER_TRANSITION_IN", ({ newPage, oldPage, trigger, scroll, ignoreHashAction }: {
    newPage: IPage,
    oldPage: IPage,
    trigger: TypeTrigger,
    ignoreHashAction: boolean,
    scroll: ICoords
}) => {
    // ...
});
```

### App events

- "READY" / "ready" - Fires when the DOM Content has fully loaded
- "SCROLL" / "scroll" - Fires when the user scrolls (notes the scrolling is throttled to avoid lag and jank)
- "RESIZE" / "resize" - Fires when the user resizes window (notes the resize is throttled and debouced to avoid lag and jank)

e.g.

```ts
// ...
app.on("READY" | "ready" | "SCROLL" | "scroll" | "RESIZE" | "resize", () => {
    // ...
});
```

### **ManagerItem**

`MangerItem` is a class that can only be stored in the `AdvancedManager` class, it is self aware of it's envrioment, so the `ManagerItem` is aware of the `AdvancedManager` it's stored in, and the `App` instance that the `AdvancedManager` is attached to. It can also access data from other `ManagerItem`'s via the `AdvancedManager` and `App`. Be very careful with `ManagerItem` as it references, so, many other classes that if you don't properly dispose of a reference you might create a mermory leak unknowingly.

`ManagerItem` only gains self awareness after it has been registered with an `AdvancedManager` that has also been instantiated in an `App` (rather non-dynamic isn't it). I didn't use Promises or other dependency injection methods because it adds complexity and bulk in a way most project don't need. If your project requires such a dynamic and complex setup you should use WebWorkers and a custom dependency injection setup, but that is far out of the scope of this framework for now, unfortunately a custom solution will be require for each project. If in the future `@okikio/native` needs dependency injection I would be willing to build it in.

*Note: when working with WebWorkers don't use more than one or 2 at a time, I have found that two is the maximum that lower end hardware can safely use with max performance.*

#### MangerItem#manager: IAdvancedManager

```typescript
MangerItem.prototype.manager: IAdvancedManager;

/**
 * The AdvancedManager the ManagerItem is attached to;
 * It only gains self awareness after it has been registered to a `AdvancedManager` that has also been instantiated in an `App`
 *
 * @type IAdvancedManager
 */
```

#### MangerItem#app: IApp

```typescript
MangerItem.prototype.app: IApp;

/**
 * The App the ManagerItem is attached to
 *
 * @type IApp
 */
```

#### MangerItem#config: ICONFIG

```typescript
MangerItem.prototype.config: ICONFIG;

/**
 * The Config of the App the ManagerItem is attached to
 *
 * @type ICONFIG
 */
```

#### MangerItem#emitter: EventEmitter

```typescript
MangerItem.prototype.emitter: EventEmitter;

/**
 * The EventEmitter of the App the ManagerItem is attached to
 *
 * @type EventEmitter
 */
```

#### MangerItem#key: any

```typescript
MangerItem.prototype.key: any;

/**
 * The key of ManagerItem when set in a AdvancedManager;
 *
 * @type any
 */
```

#### MangerItem#install(): any

```typescript
MangerItem.prototype.install(): any;

/**
 * Runs after the ManagerItem has been registered. By default it does nothing, but if ManagerItem is extended it can be fairly useful for completing tasks right after it a ManagerItem is added to an AdvancedManager
 *
 * @returns any
 */
```

#### MangerItem#register(manager: IAdvancedManager, key: any): ManagerItem

```typescript
MangerItem.prototype.register(manager: IAdvancedManager, key: any): ManagerItem;

/**
 * Registers the ManagerItem and makes it self aware
 *
 * @param {IAdvancedManager} manager
 * @param {any} key
 * @returns ManagerItem
 */
```

#### MangerItem#uninstall(): any

```typescript
MangerItem.prototype.uninstall(): any;

/**
 * Runs before the ManagerItem has been unregistered. By default it does nothing, but if ManagerItem is extended it can be fairly useful, for disposing of references, etc...
 *
 * @returns any
 */
```

#### MangerItem#unregister(manager: IAdvancedManager, key: any): any

```typescript
MangerItem.prototype.unregister(): any;

/**
 * Unregisters the ManagerItem, removes its self awareness, and removes the ManagerItem from the AdvancedManager. Use this onces you are done with a ManagerItem and want to dispose of it's access to other base classes
 *
 * @returns any
 */
```

#### Example

```typescript
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

The `AdvancedManager` class is an extention of the `Manager` class (`AdvancedManager` extends `Manager`). `AdvancedManager` has the ability to share details about the `App` class it's attached to -- to the `ManagerItem`'s it stores.

For example, `AdvancedManager` can give access to the `App` classes `ServiceManager` to a `ManagerItem` from another `AdvancedManager`, allowing a `ManagerItem` to access `Service`'s running on the `App` inside `ServiceManager` (say that 5 time fast, 😂).

#### Example

```typescript
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

All the properties and methods of the `Manager` class, read [@okikio/manager's docs](/docs/manager/index.md) to learn more.

#### AdvancedManager#app: IApp

```typescript
AdvancedManager.prototype.app: IApp;

/**
 * The App the AdvancedManager is attached to
 *
 * @type IApp
 */
```

#### AdvancedManager#config: ICONFIG

```typescript
AdvancedManager.prototype.config: ICONFIG;

/**
 * The Config of the App the AdvancedManager is attached to
 *
 * @type ICONFIG
 */
```

#### AdvancedManager#emitter: EventEmitter

```typescript
AdvancedManager.prototype.emitter: EventEmitter;

/**
 * The EventEmitter of the App the AdvancedManager is attached to
 *
 * @type EventEmitter
 */
```

#### AdvancedManager#constructor(app: IApp): AdvancedManager<K, V extends ManagerItem>

```typescript
AdvancedManager.prototype.constructor(app: IApp): AdvancedManager<K, V extends ManagerItem>;
new AdvancedManager(app: IApp): AdvancedManager<K, V extends ManagerItem>;

/**
 * @param {IApp} app - The instance of the App class, the Manager is instantiated in
 */
```

#### AdvancedManager#set(key: K, value: V): AdvancedManager<K, V extends ManagerItem>

```typescript
AdvancedManager.prototype.set(key: K, value: V): AdvancedManager<V extends ManagerItem>;

/**
 * Set a value (V extends ManagerItem) in the Manager and register the ManagerItem
 *
 * @param  {K} key - The key where the ManagerItem will be stored
 * @param  {V extends ManagerItem} value - The ManagerItem to store
 * @returns AdvancedManager<K, V extends ManagerItem>
 */
```

The example above should also work to explain how to use the `AdvancedManager` API's.

*Note: `ServiceManager` extends `AdvancedManager`, so all the properties and methods present, will also work on `ServiceManager`.*

### **Service**

`Service` does everything, it is what enables, `PJAX`, `HistoryManager`, `Router`, `PageManager`, and `TransitionManager` to function, even though they are seperate from the `App` class.

`Service` is an extention of `ManagerItem`, that adds extra life-cycle methods for controlling specific kinds of actions that require js.

The life-cycle methods of a `Service` are register(), install(), init(), boot(), initEvents(), stop(), stopEvents(), uninstall(), and unregister().

#### *Life-cycle*

Here is a diagram that may aid in your understanding.
[![Life Cycle Diagram](https://raw.githubusercontent.com/okikio/native/beta/packages/native/assets/lifecycle.png)](/packages/native/assets/lifecycle.png)

The life-cycle is controlled by the `ServiceManager`, the `Service`'s themselves have the life-cycle methods, but only the `ServiceManager` can decide when to call the life-cycle methods of all `Service`'s.

The `ServiceManager` recieves instruction from the `App` via a method call, to which the `ServiceManager` then initializes all `Service`'s via the `init()` method, and after all `Service`'s have been initialized the `ServiceManager` then boots all `Service`'s via the `boot()` method, the `boot()` method then initializes any events the `Service` may have via `initEvents()`, that's the life-cycle for starting a `Service`.

To stop the `Service`'s the `SeviceManager` calls the `stop()` method for all `Service`'s, which calls the `stopEvents()` and `unregister()` methods, completely reseting the `Service` to just before it was added to the `ServiceManager`.

*Note: there also exists an `install()` & `register()` method (inherited from `ManagerItem`) that installs and makes a `Service` self aware on addition to the `ServiceManager`. The `stop()` method removes a `Service`'s self awareness, to make a `Service` self aware again, the Service has to be re-added to `ServiceManger`.*

*Note: all classes that aren't base classes are `Service`'s, or they extend the `Service` class in some way.*

#### Service#init(...args: any): any

```typescript
Service.prototype.init(...args: any): any;

/**
 * Called before the start of a Service, represents a constructor of sorts
 *
 * @param  {any} [...args]
 * @returns any
 */
```

#### Service#boot(...args: any): any

```typescript
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

```typescript
Service.prototype.initEvents(): void;

/**
 * Initialize events
 */
```

#### Service#stopEvents(): void

```typescript
Service.prototype.stopEvents(): void;

/**
 * Stop events
 */
```

#### Service#stop(): void

```typescript
Service.prototype.stop(): void;

/**
 * Stop Service events, and unregister Service
 * Note: A Service can also dispose of itself earlier if need be, but it can only dispose of itself, it can't dispose of other Services without the ServiceManager
 */
```

#### Example

To create a new `Service` you have to extend the `Service` class, like, so,

```typescript
import { Service, App } from "@okikio/native";
import { animate } from "@okikio/animate";

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

The `ServiceManager` controls the life-cycle of all `Service`'s in an `App`. It extends the `AdvancedManager`, so it gains all the abilities, methods, and properties of the `AdvancedManager`, and extends them with some new methods namely `init()`, `boot()`, and `stop()`, they are basically glorified for loops that call the corresponding methods with the same name for all `Service`'s (since all `Services` have these methods).

#### ServiceManager/#stop()/#boot()/#init(): ServiceManager

```typescript
// I didn't bother creating multiple different sections, since they are really simple
Service.prototype.stop(): ServiceManager;
Service.prototype.boot(): ServiceManager;
Service.prototype.init(): ServiceManager;

/**
 * Stop, Boot, & Initialize all Services
 * Note: A Service can call the ServiceManager methods since it's self aware and has access to the ServiceManager, but best not to do that as it may create hard to find bugs
 */
```

### **App**

The `App` class starts the entire process, it controls all managers and services, nothing will and can happen without the `App` class (it's pretty important).

The `App` is where most/all of the configuration for a project will occur. To change the config for a `Service` use the same name for the property you are trying to change,
e.g. If you are trying to change the `PageManager`'s max number of pages, use the property `maxPages: 6`.

*On a side note: on `App` boot, the `App` starts listenining for the document DOMContentLoaded event, if it is emitted, the `App` "READY" and "ready" events are emitted as well.*

#### App#config: ICONFIG

```typescript
App.prototype.config: ICONFIG;

/**
 * The current Configuration's for the App, acts like settings for the app. The Config is an object with some preset values set, for all self aware classes within an App to access. The default values for Config are:
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

 * To change the Config for another Service use the same name as the property you are trying to change,
 * e.g. If you are trying to change the PageMAnager's max number of pages, use the property `maxPages: 6`
 *
 * @type ICONFIG
 */
```

#### App#emitter: EventEmitter

```typescript
App.prototype.emitter: EventEmitter;

/**
 * An instance of the EventEmitter
 *
 * @type EventEmitter
 */
```

#### App#services: ServiceManager

```typescript
App.prototype.services: ServiceManager;

/**
 * An instance of the ServiceManager
 *
 * @type ServiceManager
 */
```

#### App#constructor(config: object = {}): App

```typescript
App.prototype.constructor(config: object = {}): App;
new App(config: object = {}): App;

/**
 * Registers the Config, as well as creates new instances of the ServiceManager, and the EventEmitter
 *
 * @param {object} [config = {}] - The configurations for the App
 */
```

#### App#register(config: ICONFIG = {}): App

```typescript
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

```typescript
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

```typescript
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

```typescript
App.prototype.stop(): App;

/**
 * Stops all Services and clears the even emitter of all events and listeners
 *
 * @return App
 */
```

#### App#on/off(events: EventInput, callback?: ListenerCallback): App

```typescript
App.prototype.on(events: EventInput, callback?: ListenerCallback): App;
App.prototype.off(events: EventInput, callback?: ListenerCallback): App;

/**
 * Shortcuts to the App EventEmitter on and off methods, they create and remove events and event listeners, read more about @okikio/emitter in [/docs/emitter/index.md](/docs/emitter/index.md).
 * Note: the scope of the events are automatically set to the App
 *
 * @param  {EventInput} events - Takes event name, and supports all the different ways to represent events that @okikio/amitter offers
 * @param  {ListenerCallback} [callback?] - Event Listener
 * @return App
 */
```

#### App#emit(events: string | any[], ...args: any): App

```typescript
App.prototype.emit(events: string | any[], ...args: any): App;

/**
 * Shortcuts to the App EventEmitter emit method, emits (triggers) events and event listeners, read more about @okikio/emitter in [/docs/emitter/index.md](/docs/emitter/index.md)
 *
 * @param  {string | any[]} events - Takes event names, and supports all the different ways to represent events that @okikio/amitter offers
 * @param  {any} [...args] - Arguments to pass to the events
 * @return App
 */
```

#### Example

```typescript
import { Service, App } from "@okikio/native";
import { animate } from "@okikio/animate";

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

These are the the `5` base classes as stated above, but there are also `5` project based classes, namely:

- `HistoryManager`
- `TransitionManager`
- `PageManager/Page`
- `PJAX`
- `Router`

These classes are all `Services`, but they have very specific names, so when using them make sure to use the names specified above as their keys in `app.set("...", ...)`.

E.g.

```typescript
// ...
app.set("TransitionManager", new TransitionManager(/* ... */));
app.set("HistoryManager", new HistoryManager());
app.set("PageManager", new PageManager());

// PJAX relies on HistoryManager, PageManager, and TransitionManager, so, to ensure that nothing breaks, all these classes need to be present with the name stated in the forms they've been stated

// Note: PJAX doesn't need Router to function, Router adds extra functionality that is often needed but not crucial. Router is often used for highlighting navbar links to pages that have changed via PJAX, but a custom solution can also be made that is smaller and lighter, so, its not absolutely necessary
app.set("PJAX", new PJAX());
// ...
```

### **HistoryManager**

`HistoryManager` is a `Service` that keeps a record of the history of the `App`; it stores only the states of pages. A state represents the current status of a page, consisting of properties like: url, transition, and data. `HistoryManager` is an extention of the `Service` class.

#### HistoryManager#states: IState[]

```typescript
HistoryManager.prototype.states: IState[];

/**
 * An array of states
 *
 * @type IState[]
 */
```

#### HistoryManager#pointer: number

```typescript
HistoryManager.prototype.pointer: number;

/**
 * Current position of a state in the states array
 *
 * @type number
 */
```

#### HistoryManager#init(): void

```typescript
HistoryManager.prototype.init(): void;

/**
 * Initializes the states array, and replace the history pushState data with the states array
 */
```

#### HistoryManager#get(index: number): IState

```typescript
HistoryManager.prototype.get(index: number): IState;

/**
 * Get a state based on it's index
 *
 * @param {number} index - Index of state
 * @return IState
 */
```

#### HistoryManager#add(value?: IState, historyAction: "replace" | "push" = "push"): HistoryManager

```typescript
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

```typescript
HistoryManager.prototype.remove(index?: number): HistoryManager;

/**
 * Remove state by the index, or by removing the last state in the states array and decrease the pointer by 1, if an index isn't specified
 *
 * @param {number} [index?] - Index of state to remove
 * @return HistoryManager
 */
```

#### HistoryManager#replace(newStates: IState[]): HistoryManager

```typescript
HistoryManager.prototype.replace(newStates: IState[]): HistoryManager;

/**
 * Replaces the states array with another states array, this is later used when going back and forward in page history
 *
 * @param {IState[]} newStates - Array of states to replace with current array of states
 * @return HistoryManager
 */
```

#### HistoryManager#set(i: number, state: IState): IState

```typescript
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

```typescript
HistoryManager.prototype.current: IState;

/**
 * Get the current state by the pointer
 *
 * @type IState
 */
```

#### HistoryManager#last: IState

```typescript
HistoryManager.prototype.last: IState;

/**
 * Get the last state (top of the history stack)
 *
 * @type IState
 */
```

#### HistoryManager#previous: IState | null

```typescript
HistoryManager.prototype.previous: IState | null;

/**
 * Get the previous state or return null if there is not a previous number
 *
 * @type IState | null
 */
```

#### HistoryManager#length: number

```typescript
HistoryManager.prototype.length: number;

/**
 * The length of the states array
 *
 * @type number
 */
```

#### #newCoords(x: number = window.scrollX, y: number = window.scrollY): ICoords

```typescript
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

```typescript
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

```typescript
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

```typescript
// ...
app.set("HistoryManager", new HistoryManager());
// ...
```

*Note: the `HistoryManager` needs to be present in an `App` for the `PJAX` service to function.*

This example is the go() method for the `PJAX` service.

```typescript
// ...
go({
    href,
    trigger = "HistoryManager",
    event,
}) {
    // If transition is already running and the go() method is called again, force load page
    if (this.isTransitioning && this.onTransitionPreventClick ||

        // The PJAX service will only work if the HistoryManager is set as a Service in the App's ServiceManager
        !this.manager.has("TransitionManager") ||
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

---

*Note: thus far I have given you a detailed overview of the API's that make up the base classes as well as the `HistoryManager` (as an example of a complex project based class), but from this point onward the difficulty will drastically increaase, but because the next classes are project based classes they will only need to be instantiated into an `App`'s `ServiceManager` using a specific name to be used, with little to no config required on you part. PS. this is getting really tiring to document, so, for the next classes I will skimp out on aspects I feel aren't useful for the type of projects you want or need, if you would like more detail just look through the code for the framework, as well as the [demo/ts folder](/docs/demo/ts/). Also, **all classes that aren't base classes are `Service`'s, or they extend the `Service` class in some way.***

---

### **TransitionManager**

As the name implies it controls the transitions between pages (there can be many differing transition animations). By default the `TransitionManager` has a simple replace transition with no animation and that supports hashes. To understand the `TransitionManager` you have to first understand how to instantiate it. To instantiate the `TransitionManager`,

```typescript
// ...
// If no parameters are present the TransitionManager will just use the default transition (the default transition can be overridden)
const transitionManager = new TransitionManager();

// or

// You can declare transitions as an Array of [key, value] arrays in the parameter (similar to Maps), if you set the key to "default", it will replace the default transition

// A transition object
const Fade = {
    name: "default", // This isn't nesscary but it can be nice when debugging transitions, you can use it to identify which transition is occuring
    duration: 500,
    manualScroll: true,

    out({ from }: ITransitionData) {
        let { duration } = this;
        let fromWrapper = from.wrapper;
        return animate({
            target: fromWrapper,
            opacity: [1, 0],
            duration
        }).on("finish", function () {
            this.stop();
        });
    },

    in({ to, scroll }: ITransitionData) {
        let { duration } = this;
        let toWrapper = to.wrapper;

        // Support for hashes are built in
        window.scroll(scroll.x, scroll.y);
        return animate({
            target: toWrapper,
            opacity: [0, 1],
            duration
        }).then(function () {
            this.stop();
        });
    }
};

const transitionManager = new TransitionManager([
    ["default", Fade] // The new default transition is Fade
    ["fade", Fade] // A Fade transition named "fade"
]);
// ...
```

The `TransitionManager` accepts transitions from both the `App` config as well as the arguments it was instantiated with, but by default it will prefer the arguments it was instantiated with (do note the config property is `transitions: [....]`).

For example,

```typescript
// ...
// You can declare transitions as an Array of [key, value] arrays in the parameter (similar to Maps), if you set the key to "default", it will replace the default transition

// A transition object
const Fade = {
    name: "default", // This isn't nesscary but it can be nice when debugging transitions, you can use it to identify which transition is occuring
    duration: 500,
    manualScroll: true,

    out({ from }) {
        let { duration } = this;
        let fromWrapper = from.wrapper;
        return animate({
            target: fromWrapper,
            opacity: [1, 0],
            duration,
            onfinish(el: { style: { opacity: string } }) {
                el.style.opacity = "0";
            }
        }).on("finish", function () {
            this.stop();
        });
    },

    in({ to, scroll }) {
        let { duration } = this;
        let toWrapper = to.wrapper;

        // Support for hashes are built in
        window.scroll(scroll.x, scroll.y);
        return animate({
            target: toWrapper,
            opacity: [0, 1],
            duration
        }).then(function () {
            this.stop();
        });
    }
};

const transitionManager = new TransitionManager([
    ["default", Fade] // The new default transition is Fade
    ["fade", Fade] // A Fade transition named "fade"
]);

const app = new App({
    // The TransitionManager will completely ignore this, because it has been instantiated with transitions, and those are usually the one that is intended for use
    transitions: [
        ["default", {}]
        ["fade", {}]
    ]
});

app.set("TransitionManager", TransitionManager);
// ...
```

A transition is an object with some methods and properties pre-defined to control page transition animation.

It looks like this:

```typescript
// ...
const Fade = {
    // This is required to let PJAX, know that this transition can also handle scrolling automatically, but if your transition doesn't need to handle scroll then it's not needed
    manualScroll: true,

    // Initialize some data that the transition may needs, it's not necessary. It is called before the transition in() or out() methods
    /**
        The init(data: object) methods have a data object paremter

        data is an object with 4 properties
        * newPage: Page - The new page you are transitioning to
        * oldPage: Page - The old page you are transitioning from
        * trigger: HTMLAnchorElement | "HistoryManager" | "popstate" | "back" | "forward" - The trigger for the transition, popstate, HistoryManager, or an anchor element.
        * scroll: { x: number, y: number } - Stores the scroll position of the page required after transition (except the scroll doesn't take into account hashes)
        *
        * E.g.
        * init(data: {
            oldPage: Page,
            newPage: Page,
            trigger: HTMLAnchorElement | "HistoryManager" | "popstate" | "back" | "forward",
            scroll: { x: number, y: number },
        }) {}
     */
    init({ oldPage, newPage, trigger, scroll }) {
        // ...
        this.mainElement = document.getElementById('big-transition');
        this.spinnerElement = this.mainElement.querySelector('.spinner');
        this.horizontalElements = [...this.mainElement.querySelector('#big-transition-horizontal').querySelectorAll('div')];
        this.maxLength = this.horizontalElements.length;
        // ...
    }

    /**
        The out(data: ITransitionData) & in(data: ITransitionData) methods have a ITransitionData parameter

        ITransitionData is an object with 3 properties and 1 method
        * to: Page - The Page you are transitioning to
        * from: Page - The Page you are transitioning from
        * trigger: HTMLAnchorElement | "HistoryManager" | "popstate" | "back" | "forward" - The trigger for the transition, popstate, HistoryManager, or an anchor element.
        * scroll: { x: number, y: number } - Stores the scroll position of the page required after transition (so, if a hash is required or going back to previous pages scroll position, etc...),
        * done(): void - The callback method that has to be called once the animation is done. It doesn't return anything
    */

    // The out() method dictates what to do when the old page transitions out
    out({ from, to, scroll, trigger, done }) {
        let fromWrapper = from.wrapper;

        // done() indicates that the out() transition is done, it can now remove the old page and start the in() transition
        done();
    },

    // The in() method dictates what to do when the new page transitions in

    // hashes can only affect the in() scroll ITransitionData. The new page only gets added to the DOM after the out() transition, so to find the scroll position of the element the hash is supposed to represent can only happen in the in() method

    // Try your best to only apply scroll to the in() method
    in({ to, from, scroll, trigger, done }) {
        let toWrapper = to.wrapper;

        // Support for hashes are built in
        window.scroll(scroll.x, scroll.y);

        // done() indicates that the in() transition is done, it can now stop the transition
        done();
    }
};

// or
// you can also do this

const Fade = {
    // This is required to let PJAX, know that this transition can also handle scrolling automatically, but if your transition doesn't need to handle scroll then it's not needed
    manualScroll: true,

    // Initialize some data that the transition may needs, it's not necessary. It is called before the transition in() or out() methods
    /**
        The init(data: object) methods have a data object paremter

        data is an object with 4 properties
        * newPage: Page - The new page you are transitioning to
        * oldPage: Page - The old page you are transitioning from
        * trigger: HTMLAnchorElement | "HistoryManager" | "popstate" | "back" | "forward" - The trigger for the transition, popstate, HistoryManager, or an anchor element.
        * scroll: { x: number, y: number } - Stores the scroll position of the page required after transition (except the scroll doesn't take into account hashes)
        *
        * E.g.
        * init(data: {
            oldPage: Page,
            newPage: Page,
            trigger: HTMLAnchorElement | "HistoryManager" | "popstate" | "back" | "forward",
            scroll: { x: number, y: number },
        }) {}
     */
    init({ oldPage, newPage, trigger, scroll }) {
        // ...
        this.mainElement = document.getElementById('big-transition');
        this.spinnerElement = this.mainElement.querySelector('.spinner');
        this.horizontalElements = [...this.mainElement.querySelector('#big-transition-horizontal').querySelectorAll('div')];
        this.maxLength = this.horizontalElements.length;
        // ...
    }

    /**
        The out(data: ITransitionData) & in(data: ITransitionData) methods have a ITransitionData parameter

        ITransitionData is an object with 3 properties and 1 method
        * to: Page - The Page you are transitioning to
        * from: Page - The Page you are transitioning from
        * trigger: HTMLAnchorElement | "HistoryManager" | "popstate" | "back" | "forward" - The trigger for the transition, popstate, HistoryManager, or an anchor element.
        * scroll: { x: number, y: number } - Stores the scroll position of the page required after transition (so, if a hash is required or going back to previous pages scroll position, etc...),
        * done(): void - The callback method that has to be called once the animation is done. It doesn't return anything
    */

    // The out() method dictates what to do when the old page transitions out
    out({ from, to, scroll, trigger, done }) {
        return new Promise(resolve => {
            // Once the promise has resolved, the transition moves on to the in() transition method
            resolve();
        });
    },

    // The in() method dictates what to do when the new page transitions in

    // hashes can only affect the in() scroll ITransitionData. The new page only gets added to the DOM after the out() transition, so to find the scroll position of the element the hash is supposed to represent can only happen in the in() method

    // Try your best to only apply scroll to the in() method
    in({ to, from, scroll, trigger, done }) {
        // Support for hashes are built in
        window.scroll(scroll.x, scroll.y);

        // Since `@okikio/animate` is promise-like, it will resolve the transition once the animation is done
        return animate({
            target: this.horizontalElements,
            keyframes: [
                { transform: "scaleX(1)" },
                { transform: "scaleX(0)" },
            ],
            // @ts-ignore
            delay(i) {
                return delay * (i + 1);
            },
            onfinish(el) {
                el.style.transform = `scaleX(0)`;
            },
            easing: "out-cubic",
            duration: 500
        });
    }
};
// ...
```

### **PageManager/Page**

The `PageManager` acts as a `Page` cache, by default it stores `Page` object in an `AdvancedManager` instance, which is then stored in an internal property called `PageManager.prototype.pages: AdvancedManager<string, Page>`.

The `Page` class is a class meant to store a `Page`'s data. By default `Page`'s only store HTML documents as strings, but if the `Page.prototype.build()` method is called, the `Page` will build the page's DOM and set the url, data, title, head, body, dom, and wrapper properties of the `Page` class, using the [`DOMParser`](https://developer.mozilla.org/en-US/docs/Web/API/DOMParser), and when the `Page.prototype.uninstall()` method is called it resets the DOM for that `Page` including the url, data, title, head, body, dom, and wrapper properties of the `Page` class.

The `PageManager` handles the fetching of a `Page`'s HTML document data, and ensures that if it currently is already loaded in the cache, there aren't multiple reqests for it, it does this through `PageManager.prototype.load(_url: string | URL = newURL()): Promise<Page>`. The `load()` method returns a `Promise` which resolves to a `Page` class. The `PageManager` also has a maximum amount of `Page`'s it will accept, which is set to 5 by default (though this can be changed through the `App` config `maxPages` property).

*Note: `Page`'s are self-aware since they extend `ManagerItem`.*

### **PJAX**

The `PJAX` class is the key `Service` that creates the smooth, lightweight, and performant experience the `native` initiative aims for. Through the use of the `HistoryManager`, the `PageManager`, and the `TransitionManager`, the `PJAX` service creates an almost sureal and smooth transition between webpages that makes a website/webapp feel like a native application.

Pjax stands for [pushState + Ajax](https://github.com/defunkt/jquery-pjax), with pushState being the method used to manage a pages history, and Ajax being the method being used to request pages. Pjax is a form progressive enhancement which creates fluid and smooth transitions between your website's pages, it also reduce the delay between pages, and minimizes the browser HTTP requests.

To use the `PJAX` `Service` all the pages must follow a similar layout with the same js, and css. Above all every page must have a wrapper element, this is indicated by the `data-wrapper` attribute (the attribute can be changed in the `App` config using the property `wrapperAttr`).

For example:

```html
<body>
    <!-- Content Before e.g. navbar, header, style, etc... -->
    <div data-wrapper>
        <!-- ... -->
    </div>
    <!-- Content After e.g. footer, copyright, script, etc... -->
</body>
```

`PJAX` looks for the wrapper between pages and switches out the old page's wrapper with a new pages wrapper (it also changes the title as well).

_**Note**: by default `PJAX` will prefetch pages based on the links it hovers over if they don't contain any `data-prevent` behavior (this setting can be changed via the `App`'s config using the property `prefetchIgnore`). When you hover over a link the "ANCHOR_HOVER" and "HOVER" events fire, but if a link is a valid prefetch, the "PREFETCH" event will fire._

Once `PJAX` has been started, it will listen for an anchor click (when an anchor is clicked, the `App` emits "ANCHOR_CLICK" and "CLICK" events), if the anchor is valid, `PJAX` will start the process of switching out the page wrappers (a link being valid means it doesn't link to an external site, it doesn't have a target="_blank" attribute, it isn't a download link, the data-prevent attribute isn't set to "self", or "all", etc...) [the data-prevent="self" and the data-prevent="all" attributes are set by the `App`'s config using the property `preventSelfAttr` and `preventAllAttr`].

_**Note**: the `TIMEOUT_ERROR` event fires if a page request times out or a general `REQUEST_ERROR` event fires if its some other form of error with the request._

The `preventSelf` attribute basically states don't allow `PJAX` to work with an anchor with this attribute, while the preventAll attribute basically states don't allow PJAX to work with all anchors underneat an element with this attribute.

If the url of the page to switch out is in the `preventURLs` array (an array of strings and RegExp's `PJAX` is supposed to ignore) [it can be set via the `App` config using the property `preventURLs`, `PJAX` will ignore it].

_**Note**: `preventURLs`, `cacheIgnore`, and `prefetchIgnore` all support Array's of paths and regex's from [path-to-regexp](https://www.npmjs.com/package/path-to-regexp)_

If the `PJAX` property `onTransitionPreventClick` is set to true `PJAX` will disallow clicks when pages are transitioning (this can be set via the `App`'s config using the property `onTransitionPreventClick`).

In order for `PJAX` to continue, all the condition stated above must first be met, and if they're all met, then it will start the process of switching page wrappers.

First, it will collect information like the transition to use, which comes from the data-transition attribute of the anchor (the transition attibute can be changed by the `App`'s config using the property `transitionAttr`), then `PJAX` captures the pages scroll positions, the new pages url, etc... and adds this to `HistoryManager` which also handles the pushState aspect of the history record. The `HistoryManager` then triggers the `HISTORY_NEW_ITEM` and `GO` events.

Secondly, `PJAX` loads and builds the pages required (both the old and new page) using the `PageManager` (the "NAVIGATION_START" event is fired at around this point). While the pages are loading, the "PAGE_LOADING" event is fired. Once the page loading has finished the "PAGE_LOAD_COMPLETE" event is fired.

Lastly, `PJAX` loads the required transition from the `TransitionManager` and then starts it (the "TRANSITION_START" event is fired at around this point). If the `PJAX.prototype.stickyScroll` property is set to true (it can be changed by the `App`'s config with a property of the same name) the transitions will receive the scroll coords of the previous page and scroll to that point. If the `PJAX.prototype.ignoreHashAction` property is set to true (it can be changed by the `App`'s config with a property of the same name) `PJAX` will ignore hash scrolling.

 If the `PJAX.prototype.forceOnError` is true, as it sounds it will force a page switch via the browsers normal methods (it can be changed by the `App`'s config with a property of the same name). After all this the "TRANSITION_END" and "NAVIGATION_END" events are fired.

During the transition this events will be called in this order:

- "BEFORE_TRANSITION_OUT" - Before transitioning the old page out
- "AFTER_TRANSITION_OUT" - After transitioning the old page out
- "CONTENT_INSERT" - After the new page gets added to the DOM
- "CONTENT_REPLACED" - After the new page has replace the old page (the old page has been removed from the DOM)
- "BEFORE_TRANSITION_IN" - Before transitioning the new page in
- "AFTER_TRANSITION_IN" - After transitioning the new page in

When a user moves backward or forward in page history the window popstate event gets triggered. First, `PJAX` determines the direction backward or forward. Then it emits the "POPSTATE" event, depending on the direction a "POPSTATE_BACK" or a "POPSTATE_FORWARD" event gets fired. The `HistoryManager` then replaces the current state with either the previous or next pages state. Using a similar process to when a user clicks an anchor the rest of the process follows.

To use `PJAX` is just a simple create a new instance, ensure `HistoryManager`, `PageManager`, and `TransitionManager` are present and accounted for and everything is golden.

For example:

```typescript
// ...
app
    .set("HistoryManager", new HistoryManager())
    .set("PageManager", new PageManager())
    .set("TransitionManager", new TransitionManager([
        ["default", Fade],
        ["BigTransition", BigTransition],
        ["Slide", Slide],
        ["SlideLeft", SlideLeft],
        ["SlideRight", SlideRight]
    ]))
    .add(new PJAX());
// ...
```

### **Router**

The `Router` service uses a list of objects called IRoute which complete certain actions when route paths match the current url, or when moving from one url to another.

Also, `Router` supports [path-to-regexp](https://www.npmjs.com/package/path-to-regexp), so, you can use all the express like url syntax's you are used to, however, I might refactor it to use the new `URLPattern` web standard in a future update. `URLPattern` accomplishes the same goal in a similar way to `path-to-regex` without needing to install `path-to-regex`. I suggest learning more about `URLPattern` on [web.dev/urlpattern](https://web.dev/urlpattern/).

_**Note**: at least either `to` or `from` must be present, in `to, from` path mode_

```typescript
interface IRoute {
    path: {
        // At least either to or from must be present, in `to, from` path mode
        to?: string | RegExp | Array<string | RegExp> | boolean,
        from?: string | RegExp | Array<string | RegExp> | boolean
    } | string | RegExp | Array<string | RegExp> | boolean,
    method: (...args) => {}
}
```

To add a new IRoute,

```typescript
// ...
const router = new Router([
    // You can the routes here as well
    {
        // When the path is /index.html/
        path: "index.html",

        /**
         * from - The array from searching using the RegExp.exec on the from path
         * to - The array from searching using the RegExp.exec on the to path
         * path = { from, to } - The acctual paths
        */
        method({ from, to, path: { from, to } }) {
            console.log("index.html");
        }
    }
]);

// or
router
    .add({
        // When moving from /index.html/ to /about.html/ run the  method
        path: {
            from: /index.html/,
            to: /about.html/
        },
        method() {
            console.log("Going to about.html from index.html");
        }
    })

    .add({
        // Going to index.html, from every other page including index.html to index.html
        path: "index.html",
        method() {
            console.log("Going to index.html from everything else");
        }
    })

    .add({
        // Going to index.html, from every other page `including` index.html to index.html
        // The same as the route above
        path: {
            from: true,
            to: "index.html",
        },
        method() {
            console.log("Going to index.html from everything else");
        }
    })

    .add({
        // Going from index.html, to every other page `excluding` index.html to index.html
        path: {
            from: "/index.html",
            to: false,
        },
        method() {
            console.log("Going to everything else except index.html from index.html");
        }
    })

    .add({
        // Going from every other page `excluding` index.html, to index.html
        path: {
            from: false,
            to: "/index.html",
        },
        method() {
            console.log("Going from everything else except index.html to index.html");
        }
    });
// ...
```