import { Manager, EventEmitter, animate } from "./modules.js";
export { Manager, EventEmitter, animate };

// The config variables
export interface ICONFIG {
    prefix?: string;
    wrapperAttr?: string;
    noAjaxLinkAttr?: string;
    noPrefetchAttr?: "no-prefetch";
    headers?: string[][];
    preventSelfAttr?: string;
    preventAllAttr?: string;
    transitionAttr?: string;
    blockAttr?: string;
    timeout?: number
}

export const CONFIG_DEFAULTS: ICONFIG = {
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
};

export type ConfigKeys = keyof ICONFIG;

/**
 * The Config class
 *
 * @export
 * @class CONFIG
 */
export class CONFIG {
    /**
     * The current Configuration
     *
     * @protected
     * @type ICONFIG
     * @memberof CONFIG
     */
    protected config: ICONFIG;

    /**
     * Creates an instance of CONFIG.
     *
     * @param {ICONFIG} config
     * @memberof CONFIG
     */
    constructor(config: ICONFIG) {
        this.config = Object.assign({ ...CONFIG_DEFAULTS }, config);
    }

    /**
     * Converts string into data attributes
     *
     * @param {string} value
     * @param {boolean} brackets [brackets=true]
     * @returns string
     * @memberof CONFIG
     */
    public toAttr(value: string, brackets: boolean = true): string {
        let { prefix } = this.config;
        let attr = `data${prefix ? "-" + prefix : ""}-${value}`;
        return brackets ? `[${attr}]` : attr;
    }

    /**
     * Selects config vars, and formats them for use, or simply returns the current configurations for the framework
     *
     * @param {ConfigKeys} value
     * @param {boolean} [brackets=true]
     * @returns any
     * @memberof CONFIG
     */
    public getConfig(value?: ConfigKeys, brackets: boolean = true): any {
        if (typeof value !== "string")
            return this.config;

        let config = this.config[value];
        if (typeof config === "string")
            return this.toAttr(config, brackets);
        return config;
    }
}

export type IAdvancedManager = AdvancedManager<any, ManagerItem>;

/**
 * The base class for all AdvancedManager and AdvancedStorage items
 *
 * @export
 * @class ManagerItem
 */
export class ManagerItem {
    /**
     * The AdvancedManager or AdvancedStorage the ManagerItem is attached to
     *
     * @protected
     * @type IAdvancedManager
     * @memberof ManagerItem
     */
    protected manager: IAdvancedManager;

    /**
     * Creates an instance of ManagerItem.
     * 
     * @memberof ManagerItem
     */
    constructor() { }

    /**
     * The getConfig method for accessing the Configuration of the current App
     *
     * @param {ConfigKeys} [value]
     * @param {boolean} [brackets]
     * @returns any
     * @memberof ManagerItem
     */
    protected getConfig(value?: ConfigKeys, brackets?: boolean): any {
        return this.manager.getConfig(value, brackets);
    };

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
    public register(manager: IAdvancedManager): ManagerItem {
        this.manager = manager;
        this.install();
        return this;
    }
}

/**
 * A tweak to the Manager class that makes it self aware of the App class it's instantiated in
 *
 * @export
 * @class AdvancedManager
 * @extends {Manager<K, V>}
 * @template K
 * @template V
 */
export class AdvancedManager<K, V extends ManagerItem> extends Manager<K, V> {
	/**
	 * The instance of the App class, the Manager is instantiated in
	 *
	 * @private
	 * @type App
	 * @memberof AdvancedManager
	 */
    private app: App;

	/**
	 * Creates an instance of AdvancedManager.
	 *
	 * @param {App} app - The instance of the App class, the Manager is instantiated in
	 * @memberof AdvancedManager
	 */
    constructor(app: App) {
        super();
        this.app = app;
    }

	/**
	 * Set a value stored in the Manager
	 *
	 * @public
	 * @param  {K} key - The key where the value will be stored
	 * @param  {V} value - The value to store
	 * @returns AdvancedManager<K, V>
	 */
    public set(key: K, value: V) {
        super.set(key, value);
        typeof value.register === "function" && value.register(this);
        return this;
    }

	/**
	 * Returns the instance the App class
	 *
	 * @returns App
	 * @memberof AdvancedManager
	 */
    public getApp(): App {
        return this.app;
    }

	/**
	 * Returns the App config
	 *
     * @param {...any} args
     * @returns any
	 * @memberof AdvancedManager
	 */
    public getConfig(...args: any): any {
        return this.app.getConfig(...args);
    }
}

/**
 * Adds new methods to the native URL Object; it seemed cleaner than using a custom method or editing the prototype.
 *
 * This doesn't extend the **Class** object because it's meants to be a small extention of the native URL class.
 *
 * @export
 * @class _URL
 * @extends {URL}
 */
export class _URL extends URL {
    // Read up on the native URL class [devdocs.io/dom/url]
	/**
	 * Creates an instance of _URL.
	 *
     * @param {(string | _URL | URL | Location)} [url=window.location.pathname]
	 * @memberof _URL
	 */
    constructor(url: any = window.location.href) {
        super(url instanceof URL ? url.href : url, window.location.origin);
    }

    /**
     * Returns the pathname with the hash
     *
     * @returns string
     * @memberof _URL
     */
    public getFullPath(): string {
        return `${this.pathname}${this.hash}`;
    }

    /**
     * Returns the actual hash without the hashtag
     *
     * @returns string
     * @memberof _URL
     */
    public getHash(): string {
        return this.hash.slice(1);
    }

    /**
	 * Removes the hash from the full URL for a clean URL string
	 *
	 * @returns string
	 * @memberof _URL
	 */
    public clean(): string {
        return this.toString().replace(/(\/#.*|\/|#.*)$/, '');
    }

	/**
	 * Returns the pathname of a URL
	 *
	 * @returns string
	 * @memberof _URL
	 */
    public getPathname(): string {
        return this.pathname;
    }

	/**
	 * Compares this **_URL** to another **_URL**
	 *
	 * @param {_URL} url
	 * @returns boolean
	 * @memberof _URL
	 */
    public equalTo(url: _URL): boolean {
        return this.clean() == url.clean();
    }

	/**
	 * Compares the pathnames of two URLs to each other
	 *
	 * @static
	 * @param {_URL} a
	 * @param {_URL} b
	 * @returns boolean
	 * @memberof _URL
	 */
    static equal(a: _URL | string, b: _URL | string): boolean {
        let urlA = a instanceof _URL ? a : new _URL(a);
        let urlB = b instanceof _URL ? b : new _URL(b);
        return urlA.equalTo(urlB);
    }
}

/**
 * This is the default starting URL, to avoid needless instances of the same class that produce the same value, I defined the default value
 */
export const newURL = new _URL();
export const URLString = newURL.getPathname();

export type LinkEvent = MouseEvent | TouchEvent;
export type StateEvent = LinkEvent | PopStateEvent;
export type Trigger = HTMLAnchorElement | "HistoryManager" | "popstate" | "back" | "forward";

export interface ICoords {
    readonly x: number;
    readonly y: number;
}

export interface IStateData {
    scroll: ICoords;
    [key: string]: any;
}

export interface IState {
    url: _URL;
    index?: number;
    transition: string;
    data: IStateData;
}

/**
 * A quick snapshot of page coordinates, e.g. scroll positions
 *
 * @export
 * @class Coords
 * @implements {ICoords}
 */
export class Coords implements ICoords {
    public x: number;
    public y: number;

	/**
	 * Creates an instance of Coords.
	 *
	 * @param {number} [x=window.scrollX]
	 * @param {number} [y=window.scrollY]
	 * @memberof Coords
	 */
    constructor(x: number = window.scrollX, y: number = window.scrollY) {
        this.x = x;
        this.y = y;
    }
}

/**
 * Represents the current status of the page consisting of properties like: url, transition, and data
 *
 * @export
 * @class State
 */
export class State {
	/**
	 * The current state data
	 *
	 * @private
	 * @type IState
	 * @memberof State
	 */
    private state: IState;

	/**
	 * Creates an instance of State.
	 * @param {IState} {
     *         url = new _URL(),
	 *         index = 0,
	 *         transition = "default",
	 *         data = {
	 *             scroll: new StateCoords(),
	 *             trigger: "HistoryManager"
	 *         }
	 *     }
	 * @memberof State
	 */
    constructor(state: IState = {
        url: new _URL(),
        index: 0,
        transition: "default",
        data: {
            scroll: new Coords(),
            trigger: "HistoryManager"
        }
    }) {
        this.state = state;
    }

	/**
	 * Get state index
	 *
	 * @returns number
	 * @memberof State
	 */
    public getIndex(): number {
        return this.state.index;
    }

	/**
	 * Set state index
	 *
	 * @param {number} index
	 * @returns State
	 * @memberof State
	 */
    public setIndex(index: number): State {
        this.state.index = index;
        return this;
    }

	/**
	 * Get state URL
	 *
	 * @returns _URL
	 * @memberof State
	 */
    public getURL(): _URL {
        return this.state.url;
    }

	/**
	 * Get state URL as a string
	 *
	 * @returns string
	 * @memberof State
	 */
    public getURLPathname(): string {
        return this.state.url.getPathname();
    }

	/**
	 * Get state transition
	 *
	 * @returns string
	 * @memberof State
	 */
    public getTransition(): string {
        return this.state.transition;
    }

	/**
	 * Get state data
	 *
	 * @returns IStateData
	 * @memberof State
	 */
    public getData(): IStateData {
        return this.state.data;
    }

	/**
	 * Returns the State as an Object
	 *
	 * @returns object
	 * @memberof State
	 */
    public toJSON(): object {
        const { url, index, transition, data }: IState = this.state;
        return {
            url: url.getFullPath(), index, transition, data
        };
    }
}

/**
 * History of the site, stores only the State class
 *
 * @export
 * @class HistoryManager
 * @extends {Manager<number, State>}
 */
export class HistoryManager extends Manager<number, State> {
	/**
	 * Creates an instance of the HistoryManager class, which inherits properties and methods from the Storage class.
	 *
	 * @memberof HistoryManager
	 * @constructor
	 */
    constructor() {
        super();
    }

	/**
	 * Sets the index of the state before adding to HistoryManager
	 *
	 * @param {State} value
	 * @returns HistoryManager
	 * @memberof HistoryManager
	 */
    public add(value: State): HistoryManager {
        let state = value;
        let index = this.size;
        super.add(state);
        state.setIndex(index);
        return this;
    }

	/**
	 * Quick way to add a State to the HistoryManager
	 *
	 * @param {IState} value
	 * @returns HistoryManager
	 * @memberof HistoryManager
	 */
    public addState(value: IState | State): HistoryManager {
        let state = value instanceof State ? value : new State(value);
        this.add(state);
        return this;
    }
}

/**
 * Controls specific kinds of actions that require JS
 *
 * @export
 * @class Service
 */
export class Service extends ManagerItem {
	/**
	 * Stores access to the App class's EventEmitter
	 *
	 * @protected
	 * @type EventEmitter
	 * @memberof Service
	 */
    protected EventEmitter: EventEmitter;

	/**
	 * Stores access to the App class's PageManager
	 *
	 * @protected
	 * @type PageManager
	 * @memberof Service
	 */
    protected PageManager: PageManager;

	/**
	 * Stores access to the App class's HistoryManager
	 *
	 * @protected
	 * @type HistoryManager
	 * @memberof Service
	 */
    protected HistoryManager: HistoryManager;

	/**
	 * Stores the ServiceManager the service is install on
	 *
	 * @protected
	 * @type ServiceManager
	 * @memberof Service
	 */
    protected ServiceManager: ServiceManager;

	/**
	 * Stores access to the App's TransitionManager
	 *
	 * @protected
	 * @type TransitionManager
	 * @memberof Service
	 */
    protected TransitionManager: TransitionManager;

	/**
	 * Method is run once when Service is installed on a ServiceManager
     *
	 * @memberof Service
	 */
    public install(): void {
        let app = this.manager.getApp();
        this.PageManager = app.getPages();
        this.EventEmitter = app.getEmitter();
        this.HistoryManager = app.getHistory();
        this.ServiceManager = app.getServices();
        this.TransitionManager = app.getTransitions();
    }

    // Called on start of Service
    public boot(): void { }

    // Initialize events
    public initEvents(): void { }

    // Stop events
    public stopEvents(): void { }

    // Stop services
    public stop(): void {
        this.stopEvents();
    }
}

/**
 * The Service Manager controls the lifecycle of all services in an App
 *
 * @export
 * @class ServiceManager
 * @extends {AdvancedManager<number, Service>}
 */
export class ServiceManager extends AdvancedManager<number, Service> {
    /**
     * Creates an instance of ServiceManager.
     *
     * @param {App} app
     * @memberof ServiceManager
     */
    constructor(app: App) {
        super(app);
    }

	/**
	 * Call the boot method for all Services
	 *
	 * @returns Promise<void>
	 * @memberof ServiceManager
	 */
    public async boot(): Promise<void> {
        await this.asyncMethodCall("boot");
    }

	/**
	 * Call the initEvents method for all Services
	 *
	 * @returns ServiceManager
	 * @memberof ServiceManager
	 */
    public initEvents(): ServiceManager {
        this.methodCall("initEvents");
        return this;
    }

	/**
	 * Call the stopEvents method for all Services
	 *
	 * @returns ServiceManager
	 * @memberof ServiceManager
	 */
    public stopEvents(): ServiceManager {
        this.methodCall("stopEvents");
        return this;
    }

	/**
	 * Call the stop method for all Services
	 *
	 * @returns ServiceManager
	 * @memberof ServiceManager
	 */
    public stop(): ServiceManager {
        this.methodCall("stop");
        return this;
    }
}

export type ListenerCallback = (...args: any) => void;
export interface IListener {
    readonly callback: ListenerCallback;
    readonly scope: object;
    readonly name: string;
}

/**
 * Represents a new event listener consisting of properties like: callback, scope, name
 *
 * @export
 * @class Listener
 */
export class Listener {
	/**
	 * The current listener data
	 *
	 * @private
	 * @type IListener
	 * @memberof Listener
	 */
    private listener: IListener;

	/**
	 * Creates an instance of Listener.
	 *
	 * @param {IListener} { callback = () => { }, scope = null, name = "event" }
	 * @memberof Listener
	 */
    constructor({
        callback = () => { },
        scope = null,
        name = "event",
    }: IListener) {
        this.listener = { callback, scope, name };
    }

	/**
	 * Returns the callback Function of the Listener
	 *
	 * @returns ListenerCallback
	 * @memberof Listener
	 */
    public getCallback(): ListenerCallback {
        return this.listener.callback;
    }

	/**
	 * Returns the scope as an Object, from the Listener
	 *
	 * @returns object
	 * @memberof Listener
	 */
    public getScope(): object {
        return this.listener.scope;
    }

	/**
	 * Returns the event as a String, from the Listener
	 *
	 * @returns string
	 * @memberof Listener
	 */
    public getEventName(): string {
        return this.listener.name;
    }

	/**
	 * Returns the listener as an Object
	 *
	 * @returns IListener
	 * @memberof Listener
	 */
    public toJSON(): IListener {
        return this.listener;
    }
}

/**
 * Represents a new event listener consisting of properties like: callback, scope, name
 *
 * @export
 * @class Event
 * @extends {Manager<number, Listener>}
 */
export class Event extends Manager<number, Listener> {
	/**
	 * The name of the event
	 *
	 * @private
	 * @type string
	 * @memberof Event
	 */
    private name: string;

	/**
	 * Creates an instance of Event.
	 *
	 * @param {string} [name="event"]
	 * @memberof Event
	 */
    constructor(name: string = "event") {
        super();
        this.name = name;
    }
}

export type EventInput = string | object | Array<string>;

/**
 * An event emitter
 *
 * @export
 * @class EventEmitter
 * @extends {Manager<string, Event>}
 */
// export class EventEmitter extends Manager<string, Event> {
// 	/**
// 	 * Creates an instance of EventEmitter.
// 	 *
// 	 * @memberof EventEmitter
// 	 */
//     constructor() {
//         super();
//     }

//     /**
// 	 * Gets events, if event doesn't exist create a new Event
//      *
//      * @param {string} name
//      * @returns Event
//      * @memberof EventEmitter
//      */
//     public getEvent(name: string): Event {
//         let event = this.get(name);
//         if (!(event instanceof Event)) {
//             this.set(name, new Event(name));
//             return this.get(name);
//         }

//         return event;
//     }
// 	/**
// 	 * Creates a new listener and adds it to the event
// 	 *
// 	 * @param {string} name
// 	 * @param {ListenerCallback} callback
// 	 * @param {object} scope
// 	 * @returns Event
// 	 * @memberof EventEmitter
// 	 */
//     public newListener(
//         name: string,
//         callback: ListenerCallback,
//         scope: object
//     ): Event {
//         let event = this.getEvent(name);
//         event.add(new Listener({ name, callback, scope }));
//         return event;
//     }

// 	/**
// 	 * Adds a listener for a given event
// 	 *
// 	 * @param {EventInput} events
// 	 * @param {ListenerCallback} callback
// 	 * @param {object} scope
// 	 * @returns
// 	 * @memberof EventEmitter
// 	 */
//     public on(
//         events: EventInput,
//         callback?: ListenerCallback,
//         scope?: object
//     ): EventEmitter {
//         // If there is no event break
//         if (typeof events == "undefined") return this;

//         // Create a new event every space
//         if (typeof events == "string") events = events.split(/\s/g);

//         let _name: string;
//         let _callback: ListenerCallback;
//         let _scope: object;

//         // Loop through the list of events
//         Object.keys(events).forEach(key => {
//             // Select the name of the event from the list
//             // Remember events can be {String | Object | Array<string>}

//             // Check If events is an Object (JSON like Object, and not an Array)
//             if (typeof events == "object" && !Array.isArray(events)) {
//                 _name = key;
//                 _callback = events[key];
//                 _scope = callback;
//             } else {
//                 _name = events[key];
//                 _callback = callback;
//                 _scope = scope;
//             }

//             this.newListener(_name, _callback, _scope);
//         }, this);
//         return this;
//     }

// 	/**
// 	 * Removes a listener from an event
// 	 *
// 	 * @param {string} name
// 	 * @param {ListenerCallback} [callback]
// 	 * @param {object} [scope]
// 	 * @returns Event
// 	 * @memberof EventEmitter
// 	 */
//     public removeListener(
//         name: string,
//         callback: ListenerCallback,
//         scope: object
//     ): Event {
//         let event: Event = this.getEvent(name);

//         if (callback) {
//             let i = 0,
//                 len: number = event.size,
//                 value: Listener;
//             let listener = new Listener({ name, callback, scope });
//             for (; i < len; i++) {
//                 value = event.get(i);
//                 if (
//                     value.getCallback() === listener.getCallback() &&
//                     value.getScope() === listener.getScope()
//                 )
//                     break;
//             }

//             event.delete(i);
//         }
//         return event;
//     }

// 	/**
// 	 * Removes a listener from a given event, or it just completely removes an event
// 	 *
// 	 * @param {EventInput} events
// 	 * @param {ListenerCallback} [callback]
// 	 * @param {object} [scope]
// 	 * @returns EventEmitter
// 	 * @memberof EventEmitter
// 	 */
//     public off(
//         events: EventInput,
//         callback?: ListenerCallback,
//         scope?: object
//     ): EventEmitter {
//         // If there is no event break
//         if (typeof events == "undefined") return this;

//         // Create a new event every space
//         if (typeof events == "string") events = events.split(/\s/g);

//         let _name: string;
//         let _callback: ListenerCallback;
//         let _scope: object;

//         // Loop through the list of events
//         Object.keys(events).forEach((key) => {
//             // Select the name of the event from the list
//             // Remember events can be {String | Object | Array<any>}

//             // Check If events is an Object (JSON like Object, and not an Array)
//             if (typeof events == "object" && !Array.isArray(events)) {
//                 _name = key;
//                 _callback = events[key];
//                 _scope = callback;
//             } else {
//                 _name = events[key];
//                 _callback = callback;
//                 _scope = scope;
//             }

//             if (_callback) {
//                 this.removeListener(_name, _callback, _scope);
//             } else this.delete(_name);
//         }, this);
//         return this;
//     }

// 	/**
// 	 * Adds a one time event listener for an event
// 	 *
// 	 * @param {EventInput} events
// 	 * @param {ListenerCallback} callback
// 	 * @param {object} scope
// 	 * @returns EventEmitter
// 	 * @memberof EventEmitter
// 	 */
//     public once(
//         events: EventInput,
//         callback: ListenerCallback,
//         scope: object
//     ): EventEmitter {
//         // If there is no event break
//         if (typeof events == "undefined") return this;

//         // Create a new event every space
//         if (typeof events == "string") events = events.split(/\s/g);

//         let onceFn: ListenerCallback = (...args) => {
//             this.off(events, onceFn, scope);
//             callback.apply(scope, args);
//         };

//         this.on(events, onceFn, scope);
//         return this;
//     }

// 	/**
// 	 * Call all listeners within an event
// 	 *
// 	 * @param {(string | Array<any>)} events
//      * @param {...any} args
// 	 * @returns EventEmitter
// 	 * @memberof EventEmitter
// 	 */
//     public emit(
//         events: string | Array<any>,
//         ...args: any
//     ): EventEmitter {
//         // If there is no event break
//         if (typeof events == "undefined") return this;

//         // Create a new event every space
//         if (typeof events == "string") events = events.split(/\s/g);

//         // Loop through the list of events
//         events.forEach((event: string) => {
//             let listeners: Event = this.getEvent(event);

//             const customEvent: CustomEvent<any> = new CustomEvent(event, { detail: args })
//             window.dispatchEvent(customEvent);

//             listeners.forEach((listener: Listener) => {
//                 let { callback, scope }: IListener = listener.toJSON();
//                 callback.apply(scope, args);
//             });
//         }, this);
//         return this;
//     }
// }

/**
 * Parses strings to DOM
 */
export const PARSER: DOMParser = new DOMParser();

/**
 * A page represents the DOM elements that create each page
 *
 * @export
 * @class Page
 */
export class Page extends ManagerItem {
	/**
	 * Holds the DOM of the current page
	 *
	 * @private
	 * @type Document
	 * @memberof Page
	 */
    private dom: Document;

	/**
	 * Holds the wrapper element to be swapped out of each Page
	 *
	 * @private
	 * @type HTMLElement
	 * @memberof Page
	 */
    private wrapper: HTMLElement;

	/**
	 * Holds the title of each page
	 *
	 * @private
	 * @type string
	 * @memberof Page
	 */
    private title: string;

	/**
	 * Holds the head element of each page
	 *
	 * @private
	 * @type Element
	 * @memberof Page
	 */
    private head: Element;

	/**
	 * Holds the body element of each page
	 *
	 * @private
	 * @type Element
	 * @memberof Page
	 */
    private body: Element;

	/**
	 * The URL of the current page
	 *
	 * @private
	 * @type _URL
	 * @memberof Page
	 */
    private url: _URL;

	/**
	 * Creates an instance of Page, it also creates a new page from response text, or a Document Object
	 *
	 * @param {_URL} [url=new _URL()]
	 * @param {(string | Document)} [dom=document]
	 * @memberof Page
	 */
    constructor(url: _URL = new _URL(), dom: string | Document = document) {
        super();
        this.url = url;
        if (typeof dom === "string") {
            this.dom = PARSER.parseFromString(dom, "text/html");
        } else this.dom = dom || document;

        const { title, head, body } = this.dom;
        this.title = title;
        this.head = head;
        this.body = body;
    }

    /**
     * Runs once the the manager and config have been registered
     *
     * @returns void
     * @memberof Page
     */
    public install(): void {
        this.wrapper = this.body.querySelector(this.getConfig("wrapperAttr"));
    }

	/**
	 * Returns the current page's URL
	 *
	 * @returns _URL
	 * @memberof Page
	 */
    public getURL(): _URL {
        return this.url;
    }

	/**
	 * Returns the current page's URL
	 *
	 * @returns string
	 * @memberof Page
	 */
    public getPathname(): string {
        return this.url.pathname;
    }

	/**
	 * The page title
	 *
	 * @returns string
	 * @memberof Page
	 */
    public getTitle(): string {
        return this.title;
    }

	/**
	 * The page's head element
	 *
	 * @returns Element
	 * @memberof Page
	 */
    public getHead(): Element {
        return this.head;
    }

	/**
	 * The page's body element
	 *
	 * @returns Element
	 * @memberof Page
	 */
    public getBody(): Element {
        return this.body;
    }

	/**
	 * The page's wrapper element
	 *
	 * @returns HTMLElement
	 * @memberof Page
	 */
    public getWrapper(): HTMLElement {
        return this.wrapper;
    }

	/**
	 * The page's document
	 *
	 * @returns Document
	 * @memberof Page
	 */
    public getDOM(): Document {
        return this.dom;
    }
}

/**
 * Controls which page to be load
 *
 * @export
 * @class PageManager
 * @extends {AdvancedManager<string, Page>}
 */
export class PageManager extends AdvancedManager<string, Page> {
    /**
     * Stores all URL's that are currently loading
     *
     * @protected
     * @type Manager<string, Promise<string>>
     * @memberof PageManager
     */
    protected loading: Manager<string, Promise<string>> = new Manager();

	/**
	 * Creates an instance of the PageManager
	 *
     * @param {App} app
	 * @memberof PageManager
	 */
    constructor(app: App) {
        super(app);
        this.set(URLString, new Page());
    }

    /**
     * Returns the loading Manager
     *
     * @returns Manager<string, Promise<string>>
     * @memberof PageManager
     */
    public getLoading(): Manager<string, Promise<string>> {
        return this.loading;
    }

    /**
     * Load from cache or by requesting URL via a fetch request, avoid reqesting for the same thing twice by storing the fetch request in "this.loading"
     *
     * @param {(_URL | string)} [_url=new _URL()]
     * @returns Promise<Page>
     * @memberof PageManager
     */
    public async load(_url: _URL | string = new _URL()): Promise<Page> {
        let url: _URL = _url instanceof URL ? _url : new _URL(_url);
        let urlString: string = url.getPathname();
        let page: Page, request: Promise<string>;
        if (this.has(urlString)) {
            page = this.get(urlString);
            return Promise.resolve(page);
        }

        if (!this.loading.has(urlString)) {
            request = this.request(urlString);
            this.loading.set(urlString, request);
        } else request = this.loading.get(urlString);

        let response = await request;
        this.loading.delete(urlString);

        page = new Page(url, response);
        this.set(urlString, page);
        return page;
    }

    /**
     * Starts a fetch request
     *
     * @param {string} url
     * @returns Promise<string>
     * @memberof PageManager
     */
    public async request(url: string): Promise<string> {
        const headers = new Headers(this.getConfig("headers"));
        const timeout = window.setTimeout(() => {
            window.clearTimeout(timeout);
            throw "Request Timed Out!";
        }, this.getConfig("timeout"));

        try {
            let response = await fetch(url, {
                mode: 'same-origin',
                method: "GET",
                headers: headers,
                cache: "default",
                credentials: "same-origin",
            });

            window.clearTimeout(timeout);
            if (response.status >= 200 && response.status < 300) {
                return await response.text();
            }

            const err = new Error(response.statusText || "" + response.status);
            throw err;
        } catch (err) {
            window.clearTimeout(timeout);
            throw err;
        }
    }
}

/**
 * The async function type, allows for smooth transition between Promises
 */
export type asyncFn = (err?: any, value?: any) => void;
export interface ITransition {
    oldPage: Page,
    newPage: Page,
    trigger: Trigger
}
export interface ITransitionData {
    from?: Page,
    to?: Page,
    trigger?: Trigger,
    done: asyncFn
}

/**
 * Controls the animation between pages
 *
 * @export
 * @class Transition
 */
export class Transition extends ManagerItem {
	/**
	 * Transition name
	 *
	 * @protected
	 * @type string
	 * @memberof Transition
	 */
    protected name: string = "Transition";

	/**
	 * The page to transtion from
	 *
	 * @protected
	 * @type Page
	 * @memberof Transition
	 */
    protected oldPage: Page;

	/**
	 * Page to transition to
	 *
	 * @protected
	 * @type Page
	 * @memberof Transition
	 */
    protected newPage: Page;

	/**
	 * What triggered the transition to occur
	 *
	 * @protected
	 * @type Trigger
	 * @memberof Transition
	 */
    protected trigger: Trigger;

    /**
     * Creates an instance of Transition.
     *
     * @memberof Transition
     */
    constructor() { super(); }

	/**
	 * Initialize the transition
	 *
	 * @param {ITransition} {
	 * 		oldPage,
	 * 		newPage,
	 * 		trigger
	 * 	}
     * @returns Transition
	 * @memberof Transition
	 */
    public init({
        oldPage,
        newPage,
        trigger
    }: ITransition): Transition {
        this.oldPage = oldPage;
        this.newPage = newPage;
        this.trigger = trigger;
        this.boot();
        return this;
    }

    // Called on start of Transition
    public boot(): void { }

    // Initialize events
    public initEvents(): void { }

    // Stop events
    public stopEvents(): void { }

    // Stop services
    public stop(): void {
        this.stopEvents();
    }

	/**
	 * Returns the Transition's name
	 *
	 * @returns string
	 * @memberof Transition
	 */
    public getName(): string {
        return this.name;
    }

	/**
	 * Returns the Transition's old page
	 *
	 * @returns Page
	 * @memberof Transition
	 */
    public getOldPage(): Page {
        return this.oldPage;
    }

	/**
	 * Returns the Transition's new page
	 *
	 * @returns Page
	 * @memberof Transition
	 */
    public getNewPage(): Page {
        return this.newPage;
    }

	/**
	 * Returns the Transition's trigger
	 *
	 * @returns Trigger
	 * @memberof Transition
	 */
    public getTrigger(): Trigger {
        return this.trigger;
    }

    // Based off the highwayjs Transition class
	/**
	 * Transition from current page
	 *
	 * @param {ITransitionData} { from, trigger, done }
	 * @memberof Transition
	 */
    public out({ done }: ITransitionData): any {
        done();
    }

	/**
	 * Transition into the next page
	 *
	 * @param {ITransitionData} { from, to, trigger, done }
	 * @memberof Transition
	 */
    public in({ done }: ITransitionData): any {
        done();
    }

    /**
     * Starts the transition
     *
     * @returns Promise<Transition>
     * @memberof Transition
     */
    public async start(EventEmiiter: EventEmitter): Promise<Transition> {
        let fromWrapper = this.oldPage.getWrapper();
        let toWrapper = this.newPage.getWrapper();
        document.title = this.newPage.getTitle();

        return new Promise(async finish => {
            EventEmiiter.emit("BEFORE_TRANSITION_OUT");
            await new Promise(done => {
                let outMethod: Promise<any> = this.out({
                    from: this.oldPage,
                    trigger: this.trigger,
                    done
                });

                if (outMethod.then)
                    outMethod.then(done);
            });

            EventEmiiter.emit("AFTER_TRANSITION_OUT");

            await new Promise(done => {
                fromWrapper.insertAdjacentElement('beforebegin', toWrapper);
                fromWrapper.remove();
                done();
            });

            EventEmiiter.emit("BEFORE_TRANSITION_IN");

            await new Promise(done => {
                let inMethod: Promise<any> = this.in({
                    from: this.oldPage,
                    to: this.newPage,
                    trigger: this.trigger,
                    done
                });

                if (inMethod.then)
                    inMethod.then(done);
            });

            EventEmiiter.emit("AFTER_TRANSITION_IN");
            finish();
        });
    }
}

/**
 * Controls which animation between pages to use
 *
 * @export
 * @class TransitionManager
 * @extends {AdvancedManager<string, Transition>}
 */
export class TransitionManager extends AdvancedManager<string, Transition> {
	/**
	 * Creates an instance of the TransitionManager
	 *
     * @param {App} app
	 * @memberof TransitionManager
	 */
    constructor(app: App) { super(app); }

	/**
	 * Quick way to add a Transition to the TransitionManager
	 *
	 * @param {Transition} value
	 * @returns TransitionManager
	 * @memberof TransitionManager
	 */
    public add(value: Transition): TransitionManager {
        let name = value.getName();
        this.set(name, value);
        return this;
    }

    /**
     * Runs a transition
     *
     * @param {{ name: string, oldPage: Page, newPage: Page, trigger: Trigger }} { name, oldPage, newPage, trigger }
     * @returns Promise<void>
     * @memberof TransitionManager
     */
    public async boot({ name, oldPage, newPage, trigger }: { name: string, oldPage: Page, newPage: Page, trigger: Trigger }): Promise<Transition> {
        let transition: Transition = this.get(name);
        transition.init({
            oldPage,
            newPage,
            trigger
        });

        let EventEmitter = this.getApp().getEmitter();
        return await transition.start(EventEmitter);
    }

	/**
	 * Call the initEvents method for all Transitions
	 *
	 * @returns TransitionManager
	 * @memberof TransitionManager
	 */
    public initEvents(): TransitionManager {
        this.methodCall("initEvents");
        return this;
    }

	/**
	 * Call the stopEvents method for all Transitions
	 *
	 * @returns TransitionManager
	 * @memberof TransitionManager
	 */
    public stopEvents(): TransitionManager {
        this.methodCall("stopEvents");
        return this;
    }
}

/**
 * Services that interact with specific Components to achieve certain actions
 *
 * @export
 * @class Block
 * @extends {Service}
 */
export class Block extends Service {
    /**
     * The name of the Block
     *
     * @protected
     * @type string
     * @memberof Block
     */
    protected name: string;

    /**
     * Query selector string 
     *
     * @protected
     * @type string
     * @memberof Block
     */
    protected selector: string;

    /**
     * Index of Block in a BlockManager 
     *
     * @protected
     * @type number
     * @memberof Block
     */
    protected index: number;

    /**
     * The Root Element of a Block
     *
     * @protected
     * @type HTMLElement
     * @memberof Block
     */
    protected rootElement: HTMLElement;

    /**
     * It initializes the Block
     *
     * @param {string} [name]
     * @param {HTMLElement} [rootElement]
     * @param {string} [selector]
     * @param {number} [index]
     * @memberof Block
     */
    public init(name?: string, rootElement?: HTMLElement, selector?: string, index?: number) {
        this.rootElement = rootElement;
        this.name = name;
        this.selector = selector;
        this.index = index;
    }

    /**
     * Get Root Element
     *
     * @returns HTMLElement
     * @memberof Block
     */
    public getRootElement(): HTMLElement {
        return this.rootElement;
    }

    /**
     * Get Selector
     *
     * @returns string
     * @memberof Block
     */
    public getSelector(): string {
        return this.selector;
    }

    /**
     * Get Index
     *
     * @returns number
     * @memberof Block
     */
    public getIndex(): number {
        return this.index;
    }

    /**
     * Get the name of the Block
     *
     * @returns string
     * @memberof Block
     */
    public getName(): string {
        return this.name;
    }
}

/**
 * Creates a new Block Intent Class
 *
 * @export
 * @class BlockIntent
 * @extends {ManagerItem}
 */
export class BlockIntent extends ManagerItem {
    /**
     * The name of the Block
     *
     * @protected
     * @type string
     * @memberof BlockIntent
     */
    protected name: string;

    /**
     * The Block Class
     *
     * @protected
     * @type {typeof Block}
     * @memberof BlockIntent
     */
    protected block: typeof Block;

    /**
     * Creates an instance of BlockIntent.
     *
     * @param {string} name
     * @param {typeof Block} block
     * @memberof BlockIntent
     */
    constructor(name: string, block: typeof Block) {
        super();
        this.name = name;
        this.block = block;
    }

    /**
     * Getter for name of Block Intent
     *
     * @returns string
     * @memberof BlockIntent
     */
    public getName(): string {
        return this.name;
    }

    /**
     * Getter for the Block of the Block Intent
     *
     * @returns {typeof Block}
     * @memberof BlockIntent
     */
    public getBlock(): typeof Block {
        return this.block;
    }
}

/**
 * A Service Manager designed to handle only Block Services, it refreshes on Page Change
 *
 * @export
 * @class BlockManager
 * @extends {AdvancedManager<number, BlockIntent>}
 */
export class BlockManager extends AdvancedManager<number, BlockIntent> {
    /**
     * A list of Active Blocks 
     *
     * @protected
     * @type {AdvancedManager<number, Block>}
     * @memberof BlockManager
     */
    protected activeBlocks: AdvancedManager<number, Block>;

    /**
     * Creates an instance of BlockManager.
     *
     * @param {App} app
     * @memberof BlockManager
     */
    constructor(app: App) {
        super(app);
        this.activeBlocks = new AdvancedManager(app);
    }

	/**
	 * Initialize all Blocks
	 *
	 * @memberof BlockManager
	 */
    public init() {
        this.forEach((intent: BlockIntent) => {
            let name: string = intent.getName();
            let block: typeof Block = intent.getBlock();
            let selector: string = `[${this.getConfig("blockAttr", false)}="${name}"]`;
            let rootElements: Node[] = [...document.querySelectorAll(selector)];

            for (let i = 0, len = rootElements.length; i < len; i++) {
                let newInstance: Block = new block();
                newInstance.init(name, rootElements[i] as HTMLElement, selector, i);
                this.activeBlocks.set(i, newInstance);
            }
        });
    }

    /**
     * Getter for activeBlocks in BlockManager
     *
     * @returns
     * @memberof BlockManager
     */
    public getActiveBlocks() {
        return this.activeBlocks;
    }

	/**
	 * Call the boot method for all Blocks
	 *
	 * @returns Promise<void>
	 * @memberof BlockManager
	 */
    public async boot(): Promise<void> {
        await this.activeBlocks.asyncMethodCall("boot");
    }

    /**
     * Refreshes DOM Elements
     *
     * @memberof BlockManager
     */
    public refresh() {
        const EventEmitter = this.getApp().getEmitter();
        EventEmitter.on("BEFORE_TRANSITION_OUT", () => {
            this.stop();
        });

        EventEmitter.on("AFTER_TRANSITION_IN", () => {
            this.init();
            this.boot();
            // this.activeBlocks.methodCall("initEvents");
        });
    }

	/**
	 * Call the initEvents method for all Blocks
	 *
	 * @returns BlockManager
	 * @memberof BlockManager
	 */
    public initEvents(): BlockManager {
        this.activeBlocks.methodCall("initEvents");
        this.refresh();
        return this;
    }

	/**
	 * Call the stopEvents method for all Blocks
	 *
	 * @returns BlockManager
	 * @memberof BlockManager
	 */
    public stopEvents(): BlockManager {
        this.activeBlocks.methodCall("stopEvents");
        return this;
    }

	/**
	 * Call the stop method for all Blocks
	 *
	 * @returns BlockManager
	 * @memberof BlockManager
	 */
    public stop(): BlockManager {
        this.activeBlocks.methodCall("stop");
        this.activeBlocks.clear();
        return this;
    }
}


/**
 * The App class starts the entire process, it controls all managers and all services
 *
 * @export
 * @class App
 */
export class App {
    /**
     * A new instance of the HistoryManager
     *
     * @protected
     * @type HistoryManager
     * @memberof App
     */
    protected history: HistoryManager;

    /**
     * A new instance of the TransitionManager
     *
     * @protected
     * @type TransitionManager
     * @memberof App
     */
    protected transitions: TransitionManager;

    /**
     * A new instance of the ServiceManager
     *
     * @protected
     * @type ServiceManager
     * @memberof App
     */
    protected services: ServiceManager;

    /**
     * A new instance of the BlockManager
     *
     * @protected
     * @type BlockManager
     * @memberof App
     */
    protected blocks: BlockManager;

    /**
     * A new instance of an EventEmitter
     *
     * @protected
     * @type EventEmitter
     * @memberof App
     */
    protected emitter: EventEmitter;

    /**
     * A new instance of the PageManager
     *
     * @protected
     * @type PageManager
     * @memberof App
     */
    protected pages: PageManager;

    /**
     * The current Configuration's for the framework
     *
     * @protected
     * @type CONFIG
     * @memberof App
     */
    protected config: CONFIG;

    /**
     * Creates an instance of App.
     *
     * @param {(ICONFIG | CONFIG)} [config={}]
     * @memberof App
     */
    constructor(config: object = {}) {
        this.register(config);
    }

    /**
     * For registering all managers and the configurations
     *
     * @param {(ICONFIG | CONFIG)} [config={}]
     * @returns App
     * @memberof App
     */
    public register(config: ICONFIG | CONFIG = {}): App {
        this.config = config instanceof CONFIG ? config : new CONFIG(config);
        this.transitions = new TransitionManager(this);
        this.services = new ServiceManager(this);
        this.blocks = new BlockManager(this);
        this.history = new HistoryManager();
        this.pages = new PageManager(this);
        this.emitter = new EventEmitter();

        let handler = (() => {
            document.removeEventListener("DOMContentLoaded", handler);
            window.removeEventListener("load", handler);
            this.emitter.emit("ready");
        }).bind(this);

        document.addEventListener("DOMContentLoaded", handler);
        window.addEventListener("load", handler);
        return this;
    }

    /**
     * Returns the current configurations for the framework
     *
     * @param {...any} args
     * @returns any
     * @memberof App
     */
    public getConfig(...args: any): any {
        return this.config.getConfig(...args);
    }

    /**
     * Return the App's EventEmitter
     *
     * @returns EventEmitter
     * @memberof App
     */
    public getEmitter(): EventEmitter {
        return this.emitter;
    }

    /**
     * Returns the App's BlockManager
     *
     * @returns BlockManager
     * @memberof App
     */
    public getBlocks(): BlockManager {
        return this.blocks;
    }

    /**
     * Return the App's ServiceManager
     *
     * @returns ServiceManager
     * @memberof App
     */
    public getServices(): ServiceManager {
        return this.services;
    }

    /**
     * Return the App's PageManager
     *
     * @returns PageManager
     * @memberof App
     */
    public getPages(): PageManager {
        return this.pages;
    }

    /**
     * Return the App's TransitionManager
     *
     * @returns TransitionManager
     * @memberof App
     */
    public getTransitions(): TransitionManager {
        return this.transitions;
    }

    /**
     * Return the App's HistoryManager
     *
     * @returns HistoryManager
     * @memberof App
     */
    public getHistory(): HistoryManager {
        return this.history;
    }

    /**
     * Returns a Block Intent Object from the App's instance of the BlockManager
     *
     * @param {number} key
     * @returns IBlockIntent
     * @memberof App
     */
    public getBlock(key: number): BlockIntent {
        return this.blocks.get(key);
    }

    /**
     * Returns an instance of a Block from the App's instance of the BlockManager
     *
     * @param {number} key
     * @returns Block
     * @memberof App
     */
    public getActiveBlock(key: number): Block {
        return this.blocks.getActiveBlocks().get(key);
    }

    /**
     * Returns a Service from the App's instance of the ServiceManager
     *
     * @param {number} key
     * @returns Service
     * @memberof App
     */
    public getService(key: number): Service {
        return this.services.get(key);
    }

    /**
     * Returns a Transition from the App's instance of the TransitionManager
     *
     * @param {string} key
     * @returns Transition
     * @memberof App
     */
    public getTransition(key: string): Transition {
        return this.transitions.get(key);
    }

    /**
     * Returns a State from the App's instance of the HistoryManager
     *
     * @param {number} key
     * @returns State
     * @memberof App
     */
    public getState(key: number): State {
        return this.history.get(key);
    }

    /**
     * Based on the type, it will return either a Transition, a Service, or a State from their respective Managers
     *
     * @param {("service" | "transition" | "state" | "block" | string)} type
     * @param {any} key
     * @returns App
     * @memberof App
     */
    public get(type: "service" | "transition" | "state" | "block" | string, key: any): App {
        switch (type.toLowerCase()) {
            case "service":
                this.getService(key);
                break;
            case "transition":
                this.getTransition(key);
                break;
            case "state":
                this.getState(key);
                break;
            case "block":
                this.getActiveBlock(key);
                break;
            default:
                throw `Error: can't get type '${type}', it is not a recognized type. Did you spell it correctly.`;
        }
        return this;
    }

    /**
     * Returns a Page
     *
     * @param {string} url
     * @returns Promise<Page>
     * @memberof App
     */
    public async loadPage(url: string): Promise<Page> {
        return await this.pages.load(url);
    }

    /**
     * Based on the type, it will return load a Transition, a Service, a State, or a Page from their respective Managers
     *
     * @param {("page" | string)} type
     * @param {any} key
     * @returns App
     * @memberof App
     */
    public async load(type: "page" | string, key: any): Promise<any> {
        switch (type.toLowerCase()) {
            case "page":
                return await this.loadPage(key);
            default:
                return Promise.resolve(this.get(type, key));
        }
    }

    /**
     * Adds a Block Intent to the App's instance of the BlockManager
     *
     * @param {BlockIntent} blockIntent
     * @returns App
     * @memberof App
     */
    public addBlock(blockIntent: BlockIntent): App {
        this.blocks.add(blockIntent);
        return this;
    }

    /**
     * Adds a Service to the App's instance of the ServiceManager
     *
     * @param {Service} service
     * @returns App
     * @memberof App
     */
    public addService(service: Service): App {
        this.services.add(service);
        return this;
    }

    /**
     * Adds a Transition to the App's instance of the TransitionManager
     *
     * @param {Transition} transition
     * @returns App
     * @memberof App
     */
    public addTransition(transition: Transition): App {
        this.transitions.add(transition);
        return this;
    }

    /**
     * Adds a State to the App's instance of the HistoryManager
     *
     * @param {(IState | State)} state
     * @returns App
     * @memberof App
     */
    public addState(state: IState | State): App {
        this.history.addState(state);
        return this;
    }

    /**
     * Based on the type, it will add either a Transition, a Service, or a State to their respective Managers
     *
     * @param {("service" | "transition" | "state")} type
     * @param {any} value
     * @returns App
     * @memberof App
     */
    public add(type: "service" | "transition" | "state" | "block", value: any): App {
        switch (type.toLowerCase()) {
            case "service":
                this.addService(value);
                break;
            case "transition":
                this.addTransition(value);
                break;
            case "state":
                this.addState(value);
                break;
            case "block":
                this.addBlock(value);
                break;
            default:
                throw `Error: can't add type '${type}', it is not a recognized type. Did you spell it correctly.`;
        }
        return this;
    }

    /**
     * Start the App and the ServiceManager
     *
     * @returns Promise<App>
     * @memberof App
     */
    public async boot(): Promise<App> {
        this.blocks.init();
        await this.services.boot();
        await this.blocks.boot();
        this.services.initEvents();
        this.blocks.initEvents();
        this.transitions.initEvents();
        return Promise.resolve(this);
    }

    /**
     * Stop the App and the ServiceManager
     *
     * @returns App
     * @memberof App
     */
    public stop(): App {
        this.services.stop();
        this.blocks.stop();
        this.transitions.stopEvents();
        return this;
    }

    /**
     * Returns the current page in the PageManager
     *
     * @returns Page
     * @memberof App
     */
    public currentPage(): Page {
        let currentState = this.history.last();
        return this.pages.get(currentState.getURLPathname());
    }

    /**
     * A shortcut to the App EventEmiiter on method
     *
     * @param {EventInput} events
     * @param {ListenerCallback} callback
     * @returns App
     * @memberof App
     */
    public on(events: EventInput, callback?: ListenerCallback): App {
        this.emitter.on(events, callback, this);
        return this;
    }

    /**
     * A shortcut to the App EventEmiiter off method
     *
     * @param {EventInput} events
     * @param {ListenerCallback} callback
     * @returns App
     * @memberof App
     */
    public off(events: EventInput, callback?: ListenerCallback): App {
        this.emitter.off(events, callback, this);
        return this;
    }

    /**
     * A shortcut to the App EventEmiiter once method
     *
     * @param {string} events
     * @param {ListenerCallback} callback
     * @returns App
     * @memberof App
     */
    public once(events: string, callback: ListenerCallback): App {
        this.emitter.once(events, callback, this);
        return this;
    }

    /**
     * A shortcut to the App EventEmiiter emit method
     *
     * @param {(string | any[])} events
     * @param {...any} args
     * @returns App
     * @memberof App
     */
    public emit(events: string | any[], ...args: any): App {
        this.emitter.emit(events, ...args);
        return this;
    }
}
