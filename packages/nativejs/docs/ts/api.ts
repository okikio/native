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

/**
 * Manages complex lists of named data, eg. A page can be stored in a list by of other pages with the url being how the page is stored in the list. Managers use Maps to store data.
 *
 * @export
 * @class Manager
 * @template K
 * @template V
 */
export class Manager<K, V> {
	/**
	 * The complex list of named data, to which the Manager controls
	 *
	 * @protected
	 * @type Map<K, V>
	 * @memberof Manager
	 */
    protected list: Map<K, V>;

	/**
	 * Creates an instance of the Manager class.
	 *
	 * @memberof Manager
	 * @constructor
	 */
    constructor() {
        this.list = new Map();
    }

	/**
	 * Returns the Manager class's list
	 *
	 * @returns Map<K, V>
	 * @memberof Manager
	 */
    public getList(): Map<K, V> {
        return this.list;
    }

	/**
	 * Get a value stored in the Manager
	 *
	 * @public
	 * @param  {K} key - The key to find in the Manager's list
	 * @returns V
	 */
    public get(key: K): V {
        return this.list.get(key);
    }

	/**
	 * Set a value stored in the Manager
	 *
	 * @public
	 * @param  {K} key - The key where the value will be stored
	 * @param  {V} value - The value to store
	 * @returns Manager<K, V>
	 */
    public set(key: K, value: V): Manager<K, V> {
        this.list.set(key, value);
        return this;
    }

	/**
	 * Returns the keys of all items stored in the Manager
	 *
	 * @public
	 * @returns Array<K>
	 */
    public keys(): Array<K> {
        return [...this.list.keys()];
    }

	/**
	 * Returns the total number of items stored in the Manager
	 *
	 * @public
	 * @returns Number
	 */
    public size(): number {
        return this.list.size;
    }

    /**
	 * Returns the last item in the Manager who's index is a certain distance from the last item in the Manager
     *
     * @param {number} [distance=1]
     * @returns V
     * @memberof Manager
     */
    public last(distance: number = 1): V {
        let size = this.size();
        let key = this.keys()[size - distance];
        return this.get(key);
    }

	/**
	 * Returns the second last item in the Manager
	 *
	 * @public
	 * @returns V
	 */
    public prev(): V {
        return this.last(2);
    }

	/**
	 * Removes a value stored in the Manager, via the key
	 *
	 * @public
	 * @param  {K} key - The key for the key value pair to be removed
	 * @returns Manager<K, V>
	 */
    public remove(key: K): Manager<K, V> {
        this.list.delete(key);
        return this;
    }

	/**
	 * Clear the Manager of all its contents
	 *
	 * @public
	 * @returns Manager<K, V>
	 */
    public clear(): Manager<K, V> {
        this.list.clear();
        return this;
    }

	/**
	 * Checks if the Manager contains a certain key
	 *
	 * @public
	 * @param {K} key
	 * @returns boolean
	 */
    public has(key: K): boolean {
        return this.list.has(key);
    }

	/**
	 * Iterates through the Managers contents, calling a callback function every iteration
	 *
	 * @param {*} [callback=(...args: any): void => { }]
	 * @param {object} context
	 * @returns Manager<K, V>
	 * @memberof Manager
	 */
    public forEach(
        callback: any = (...args: any): void => { },
        context?: object
    ): Manager<K, V> {
        this.list.forEach(callback, context);
        return this;
    }

	/**
	 * Calls the method of a certain name for all items that are currently installed
	 *
	 * @param {string} method
	 * @param {Array<any>} [args=[]]
	 * @returns Manager<K, V>
	 * @memberof Manager
	 */
    public methodCall(method: string, ...args: any): Manager<K, V> {
        this.forEach((item: V) => {
            // @ts-ignore
            item[method](...args);
        });
        return this;
    }

	/**
	 * Asyncronously calls the method of a certain name for all items that are currently installed, similar to methodCall
	 *
	 * @param {string} method
	 * @param {Array<any>} [args=[]]
	 * @returns Promise<Manager<K, V>>
	 * @memberof Manager
	 */
    public async asyncMethodCall(method: string, ...args: any): Promise<Manager<K, V>> {
        for await (let [, item] of this.list) {
            // @ts-ignore
            await item[method](...args);
        }
        return this;
    }
}

/**
 * Controls lists of a certain type that follow chronological order, meant for the History class. Storage use Sets to store data.
 *
 * @export
 * @class Storage
 * @extends {Manager<number, V>}
 * @template V
 */
export class Storage<V> extends Manager<number, V> {
	/**
	 * Creates an instance of Storage.
	 *
	 * @memberof Storage
	 */
    constructor() {
        super();
    }

	/**
	 * Sets a value in the **Storage** class
	 *
	 * @param {number} key
	 * @param {V} value
	 * @returns Storage<V>
	 * @memberof Storage
	 */
    public set(key: number, value: V): Storage<V> {
        super.set(key, value);
        return this;
    }

	/**
	 * Adds a value to Storage
	 *
	 * @public
	 * @param  {V} value
	 * @returns Storage<V>
	 */
    public add(value: V): Storage<V> {
        let size = this.size();
        this.set(size, value);
        return this;
    }

	/**
	 * Lists all values stored in Storage.
	 *
	 * @returns IterableIterator<V>
	 * @memberof Storage
	 */
    public values(): IterableIterator<V> {
        return this.list.values();
    }
}

export type IAdvancedManager = AdvancedManager<any, ManagerItem> | AdvancedStorage<ManagerItem>;

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

    /**
     * Run after the Manager Item has been registered
     *
     * @returns any
     * @memberof ManagerItem
     */
    public install(): any { }
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
    public set(key: K, value: V): AdvancedManager<K, V> {
        super.set(key, value);
        value.register(this);
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
 * A tweak to the Storage class that makes it self aware of the App class it's instantiated in
 *
 * @export
 * @class AdvancedStorage
 * @extends {Storage<V>}
 * @template V
 */
export class AdvancedStorage<V extends ManagerItem> extends Storage<V> {
	/**
	 * The instance of the App class, the Manager is instantiated in
	 *
	 * @private
	 * @type App
	 * @memberof AdvancedStorage
	 */
    private app: App;

	/**
	 * Creates an instance of AdvancedStorage.
	 *
	 * @param {App} app - The instance of the App class, the Manager is instantiated in
	 * @memberof AdvancedStorage
	 */
    constructor(app: App) {
        super();
        this.app = app;
    }

	/**
	 * Set a value stored in AdvancedStorage
	 *
	 * @public
	 * @param  {number} key - The number key where the value will be stored
	 * @param  {V} value - The value to store
	 * @returns AdvancedStorage<V>
	 */
    public set(key: number, value: V): AdvancedStorage<V> {
        super.set(key, value);
        value.register(this);
        return this;
    }

	/**
	 * Returns the instance the App class
	 *
	 * @returns App
	 * @memberof AdvancedStorage
	 */
    public getApp(): App {
        return this.app;
    }

	/**
	 * Returns the App config
	 *
     * @param {...any} args
     * @returns any
	 * @memberof AdvancedStorage
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
     * @param {(string | _URL | URL | Location)} [url=window.location.href]
	 * @memberof _URL
	 */
    constructor(url: any = window.location.href) {
        super(url instanceof URL ? url.href : url, window.location.href);
    }

	/**
	 * Removes the hash from the URL for a clean URL string
	 *
	 * @returns string
	 * @memberof _URL
	 */
    public clean(): string {
        return this.toString().replace(/(\/#.*|\/|#.*)$/, '');
    }

	/**
	 * Compares this clean **_URL** to another clean **_URL**
	 *
	 * @param {_URL} url
	 * @returns boolean
	 * @memberof _URL
	 */
    public compare(url: _URL): boolean {
        return this.clean() == url.clean();
    }

	/**
	 * Compares two clean URLs to each other
	 *
	 * @static
	 * @param {_URL} a
	 * @param {_URL} b
	 * @returns boolean
	 * @memberof _URL
	 */
    static compare(a: _URL, b: _URL): boolean {
        return a.compare(b);
    }
}

/**
 * This is the default starting URL, to avoid needless instances of the same class that produce the same value, I defined the default value
 */
export const newURL = new _URL();
export const URLString = newURL.clean();

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
    public getCleanURL(): string {
        return this.state.url.clean();
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
        const { url, index, transition, data } = this.state;
        return {
            url: url.clean(), index, transition, data
        };
    }
}

/**
 * History of the site, stores only the State class
 *
 * @export
 * @class HistoryManager
 * @extends {Storage<State>}
 */
export class HistoryManager extends Storage<State> {
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
        let index = this.size();
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
 * @extends {AdvancedStorage<Service>}
 */
export class ServiceManager extends AdvancedStorage<Service> {
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
	 * @returns Promise<ServiceManager>
	 * @memberof ServiceManager
	 */
    public async boot(): Promise<ServiceManager> {
        await this.asyncMethodCall("boot");
        return this;
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
 * @extends {Storage<Listener>}
 */
export class Event extends Storage<Listener> {
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

/**
 * An event emitter
 *
 * @export
 * @class EventEmitter
 * @extends {Manager<string, Event>}
 */
export class EventEmitter extends Manager<string, Event> {
	/**
	 * Creates an instance of EventEmitter.
	 *
	 * @memberof EventEmitter
	 */
    constructor() {
        super();
    }

    /**
	 * Gets events, if event doesn't exist create a new Event
     *
     * @param {string} name
     * @returns Event
     * @memberof EventEmitter
     */
    public getEvent(name: string): Event {
        let event = this.get(name);
        if (!(event instanceof Event)) {
            this.set(name, new Event(name));
            return this.get(name);
        }

        return event;
    }
	/**
	 * Creates a new listener and adds it to the event
	 *
	 * @param {string} name
	 * @param {ListenerCallback} callback
	 * @param {object} scope
	 * @returns Event
	 * @memberof EventEmitter
	 */
    public newListener(
        name: string,
        callback: ListenerCallback,
        scope: object
    ): Event {
        let event = this.getEvent(name);
        event.add(new Listener({ name, callback, scope }));
        return event;
    }

	/**
	 * Adds a listener for a given event
	 *
	 * @param {(string | object | Array<any>)} events
	 * @param {ListenerCallback} callback
	 * @param {object} scope
	 * @returns
	 * @memberof EventEmitter
	 */
    public on(
        events: string | object | Array<any>,
        callback: ListenerCallback,
        scope: object
    ): EventEmitter {
        // If there is no event break
        if (typeof events == "undefined") return this;

        // Create a new event every space
        if (typeof events == "string") events = events.split(/\s/g);

        let _name: string;
        let _callback: ListenerCallback;
        let _scope: object;

        // Loop through the list of events
        Object.keys(events).forEach((key) => {
            // Select the name of the event from the list
            // Remember events can be {String | Object | Array<any>}

            // Check If events is an Object (JSON like Object, and not an Array)
            if (typeof events == "object" && !Array.isArray(events)) {
                _name = key;
                _callback = events[key];
                _scope = callback;
            } else {
                _name = events[key];
                _callback = callback;
                _scope = scope;
            }

            this.newListener(_name, _callback, _scope);
        }, this);
        return this;
    }

	/**
	 * Removes a listener from an event
	 *
	 * @param {string} name
	 * @param {ListenerCallback} callback
	 * @param {object} scope
	 * @returns Event
	 * @memberof EventEmitter
	 */
    public removeListener(
        name: string,
        callback: ListenerCallback,
        scope: object
    ): Event {
        let event: Event = this.getEvent(name);

        if (callback) {
            let i = 0,
                len: number = event.size(),
                value: Listener;
            let listener = new Listener({ name, callback, scope });
            for (; i < len; i++) {
                value = event.get(i);
                if (
                    value.getCallback() === listener.getCallback() &&
                    value.getScope() === listener.getScope()
                )
                    break;
            }

            event.remove(i);
        }
        return event;
    }

	/**
	 * Removes a listener from a given event, or it just completely removes an event
	 *
	 * @param {(string | object | Array<any>)} events
	 * @param {ListenerCallback} callback
	 * @param {object} scope
	 * @returns EventEmitter
	 * @memberof EventEmitter
	 */
    public off(
        events: string | object | Array<any>,
        callback: ListenerCallback,
        scope: object
    ): EventEmitter {
        // If there is no event break
        if (typeof events == "undefined") return this;

        // Create a new event every space
        if (typeof events == "string") events = events.split(/\s/g);

        let _name: string;
        let _callback: ListenerCallback;
        let _scope: object;

        // Loop through the list of events
        Object.keys(events).forEach((key) => {
            // Select the name of the event from the list
            // Remember events can be {String | Object | Array<any>}

            // Check If events is an Object (JSON like Object, and not an Array)
            if (typeof events == "object" && !Array.isArray(events)) {
                _name = key;
                _callback = events[key];
                _scope = callback;
            } else {
                _name = events[key];
                _callback = callback;
                _scope = scope;
            }

            if (_callback) {
                this.removeListener(_name, _callback, _scope);
            } else this.remove(_name);
        }, this);
        return this;
    }

	/**
	 * Adds a one time event listener for an event
	 *
	 * @param {(string | object | Array<any>)} events
	 * @param {ListenerCallback} callback
	 * @param {object} scope
	 * @returns EventEmitter
	 * @memberof EventEmitter
	 */
    public once(
        events: string | object | Array<any>,
        callback: ListenerCallback,
        scope: object
    ): EventEmitter {
        // If there is no event break
        if (typeof events == "undefined") return this;

        // Create a new event every space
        if (typeof events == "string") events = events.split(/\s/g);

        let onceFn: ListenerCallback = (...args) => {
            this.off(events, onceFn, scope);
            callback.apply(scope, args);
        };

        this.on(events, onceFn, scope);
        return this;
    }

	/**
	 * Call all listeners within an event
	 *
	 * @param {(string | Array<any>)} events
     * @param {...any} args
	 * @returns EventEmitter
	 * @memberof EventEmitter
	 */
    public emit(
        events: string | Array<any>,
        ...args: any
    ): EventEmitter {
        // If there is no event break
        if (typeof events == "undefined") return this;

        // Create a new event every space
        if (typeof events == "string") events = events.split(/\s/g);

        // Loop through the list of events
        events.forEach((event: string) => {
            let listeners: Event = this.getEvent(event);
            listeners.forEach((listener: Listener) => {
                let { callback, scope }: IListener = listener.toJSON();
                callback.apply(scope, args);
            });
        }, this);
        return this;
    }
}

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
	 * @type Element
	 * @memberof Page
	 */
    private wrapper: Element;

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
        if (typeof dom == "string") {
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
	 * @returns Element
	 * @memberof Page
	 */
    public getWrapper(): Element {
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

    /**
     * Load from cache or by requesting URL via a fetch request
     *
     * @param {(_URL | string)} [_url=new _URL()]
     * @returns Promise<Page>
     * @memberof PageManager
     */
    public async load(_url: _URL | string = new _URL()): Promise<Page> {
        let url: _URL = _url instanceof URL ? _url : new _URL(_url);
        let urlString: string = url.clean();
        let page: Page;
        if (this.has(urlString)) {
            page = this.get(urlString);
            return Promise.resolve(page);
        }

        let response = await this.request(urlString);
        page = new Page(url, response);
        this.set(urlString, page);
        return page;
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
export class Transition  extends ManagerItem {
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
        return this;
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
	 * @param {ITransitionData} { from, to, trigger, done }
	 * @memberof Transition
	 */
    public out({ from, to, trigger, done }: ITransitionData): any {
        done();
    }

	/**
	 * Transition into the next page
	 *
	 * @param {ITransitionData} { from, trigger, done }
	 * @memberof Transition
	 */
    public in({ from, trigger, done }: ITransitionData): any {
        done();
    }

    /**
     * Starts the transition
     *
     * @returns Promise<any>
     * @memberof Transition
     */
    public async boot(): Promise<Transition> {
        document.title = this.newPage.getTitle();
        return new Promise(resolve => {
            let inMethod: Promise<any> = this.in({
                from: this.oldPage,
                to: this.newPage,
                trigger: this.trigger,
                done: resolve
            });

            if (inMethod instanceof Promise) inMethod.then(resolve);
        }).then(() => {
            let fromWrapper = this.oldPage.getWrapper();
            let toWrapper = this.newPage.getWrapper();
            fromWrapper.insertAdjacentElement('beforebegin', toWrapper);
            fromWrapper.remove();

            return new Promise(resolve => {
                let outMethod = this.out({
                    from: this.newPage,
                    trigger: this.trigger,
                    done: resolve
                });

                if (outMethod instanceof Promise) outMethod.then(resolve);
            });
        });
    }
}

/**
 * Controls which animation between pages to use
 *
 * @export
 * @class TransitionManager
 * @extends {Manager<string, Transition>}
 */
export class TransitionManager extends Manager<string, Transition> {
	/**
	 * Creates an instance of the TransitionManager
	 *
	 * @memberof TransitionManager
	 * @constructor
	 */
    constructor() { super(); }

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
        return await transition.boot();
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
        this.transitions = new TransitionManager();
        this.services = new ServiceManager(this);
        this.history = new HistoryManager();
        this.pages = new PageManager(this);
        this.emitter = new EventEmitter();
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
     * @param {string} type
     * @param {*} key
     * @returns App
     * @memberof App
     */
    public get(type: string, key: any): App {
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
     * @param {string} type
     * @param {*} key
     * @returns App
     * @memberof App
     */
    public async load(type: string, key: any): Promise<any> {
        switch (type.toLowerCase()) {
            case "page":
                return await this.loadPage(key);
                break;
            default:
                return Promise.resolve(this.get(type, key));
        }
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
     * @param {string} type
     * @param {*} value
     * @returns App
     * @memberof App
     */
    public add(type: string, value: any): App {
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
        await this.services.boot();
        this.services.initEvents();
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
        return this.pages.get(currentState.getCleanURL());
    }

    /**
     * A shortcut to the App EventEmiiter on method
     *
     * @param {string} events
     * @param {ListenerCallback} callback
     * @returns App
     * @memberof App
     */
    public on(events: string, callback: ListenerCallback): App {
        this.emitter.on(events, callback, this);
        return this;
    }

    /**
     * A shortcut to the App EventEmiiter off method
     *
     * @param {string} events
     * @param {ListenerCallback} callback
     * @returns App
     * @memberof App
     */
    public off(events: string, callback: ListenerCallback): App {
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
     * @param {string} events
     * @param {...any} args
     * @returns App
     * @memberof App
     */
    public emit(events: string, ...args: any): App {
        this.emitter.emit(events, args);
        return this;
    }
}
