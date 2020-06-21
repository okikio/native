/*!
 * nativejs v1.0.0
 * (c) 2020 Okiki Ojo
 * Released under the MIT license
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const CONFIG_DEFAULTS = {
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
/**
 * The Config class
 *
 * @export
 * @class CONFIG
 */
class CONFIG {
    /**
     * Creates an instance of CONFIG.
     *
     * @param {ICONFIG} config
     * @memberof CONFIG
     */
    constructor(config) {
        this.config = Object.assign(Object.assign({}, CONFIG_DEFAULTS), config);
    }
    /**
     * Converts string into data attributes
     *
     * @param {string} value
     * @param {boolean} brackets [brackets=true]
     * @returns string
     * @memberof CONFIG
     */
    toAttr(value, brackets = true) {
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
    getConfig(value, brackets = true) {
        if (typeof value !== "string")
            return this.config;
        let config = this.config[value];
        if (typeof config === "string")
            return this.toAttr(config, brackets);
        return config;
    }
}

/*!
 * managerjs v1.0.9
 * (c) 2020 Okiki Ojo
 * Released under the MIT license
 */

/**
 * Manages complex lists of named data, eg. A page can be stored in a list by of other pages with the url being how the page is stored in the list. Managers use Maps to store data.
 *
 * @export
 * @class Manager
 * @template K
 * @template V
 */
class Manager {
    /**
     * Creates an instance of Manager.
     *
     * @param {Array<[K, V]>} value
     * @memberof Manager
     */
    constructor(value) {
        this.map = new Map(value);
    }
    /**
     * Returns the Manager class's list
     *
     * @returns Map<K, V>
     * @memberof Manager
     */
    getMap() {
        return this.map;
    }
    /**
     * Get a value stored in the Manager
     *
     * @public
     * @param  {K} key - The key to find in the Manager's list
     * @returns V
     */
    get(key) {
        return this.map.get(key);
    }
    /**
     * Returns the keys of all items stored in the Manager as an Array
     *
     * @returns Array<K>
     * @memberof Manager
     */
    keys() {
        return [...this.map.keys()];
    }
    /**
     * Returns the values of all items stored in the Manager as an Array
     *
     * @returns Array<V>
     * @memberof Manager
     */
    values() {
        return [...this.map.values()];
    }
    /**
     * Set a value stored in the Manager
     *
     * @public
     * @param  {K} key - The key where the value will be stored
     * @param  {V} value - The value to store
     * @returns Manager<K, V>
     */
    set(key, value) {
        this.map.set(key, value);
        return this;
    }
    /**
     * Adds a value to Manager, and uses the current size of the Manager as it's key, it works best when all the key in the Manager are numbers
     *
     * @public
     * @param  {V} value
     * @returns Manager<K, V>
     */
    add(value) {
        // @ts-ignore
        this.set(this.size, value);
        return this;
    }
    /**
     * Returns the total number of items stored in the Manager
     *
     * @public
     * @returns Number
     */
    get size() {
        return this.map.size;
    }
    /**
     * Returns the last item in the Manager who's index is a certain distance from the last item in the Manager
     *
     * @param {number} [distance=1]
     * @returns V | undefined
     * @memberof Manager
     */
    last(distance = 1) {
        let key = this.keys()[this.size - distance];
        return this.get(key);
    }
    /**
     * Returns the second last item in the Manager
     *
     * @public
     * @returns V | undefined
     */
    prev() {
        return this.last(2);
    }
    /**
     * Removes a value stored in the Manager, via the key
     *
     * @public
     * @param  {K} key - The key for the key value pair to be removed
     * @returns Manager<K, V>
     */
    delete(key) {
        this.map.delete(key);
        return this;
    }
    /**
     * Clear the Manager of all its contents
     *
     * @public
     * @returns Manager<K, V>
     */
    clear() {
        this.map.clear();
        return this;
    }
    /**
     * Checks if the Manager contains a certain key
     *
     * @public
     * @param {K} key
     * @returns boolean
     */
    has(key) {
        return this.map.has(key);
    }
    /**
     * Returns a new Iterator object that contains an array of [key, value] for each element in the Map object in insertion order.
     *
     * @public
     * @returns IterableIterator<[K, V]>
     */
    entries() {
        return this.map.entries();
    }
    /**
     * Iterates through the Managers contents, calling a callback function every iteration
     *
     * @param {*} [callback=(...args: any): void => { }]
     * @param {object} context
     * @returns Manager<K, V>
     * @memberof Manager
     */
    forEach(callback = (...args) => { }, context) {
        this.map.forEach(callback, context);
        return this;
    }
    /**
     * Allows iteration via the for..of, learn more: [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators]
     *
     * @returns
     * @memberof Manager
     */
    [Symbol.iterator]() {
        return this.entries();
    }
    /**
     * Calls the method of a certain name for all items that are currently installed
     *
     * @param {string} method
     * @param {Array<any>} [args=[]]
     * @returns Manager<K, V>
     * @memberof Manager
     */
    methodCall(method, ...args) {
        this.forEach((item) => {
            item[method](...args);
        });
        return this;
    }
    /**
     * Asynchronously calls the method of a certain name for all items that are currently installed, similar to methodCall
     *
     * @param {string} method
     * @param {Array<any>} [args=[]]
     * @returns Promise<Manager<K, V>>
     * @memberof Manager
     */
    async asyncMethodCall(method, ...args) {
        for await (let [, item] of this.map) {
            await item[method](...args);
        }
        return this;
    }
}

/**
 * The base class for all AdvancedManager and AdvancedStorage items
 *
 * @export
 * @class ManagerItem
 */
class ManagerItem {
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
    getConfig(value, brackets) {
        return this.manager.getConfig(value, brackets);
    }
    ;
    /**
     * Run after the Manager Item has been registered
     *
     * @returns any
     * @memberof ManagerItem
     */
    install() { }
    /**
     * Register the current Manager Item's manager
     *
     * @param {IAdvancedManager} manager
     * @returns ManagerItem
     * @memberof ManagerItem
     */
    register(manager) {
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
class AdvancedManager extends Manager {
    /**
     * Creates an instance of AdvancedManager.
     *
     * @param {App} app - The instance of the App class, the Manager is instantiated in
     * @memberof AdvancedManager
     */
    constructor(app) {
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
    set(key, value) {
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
    getApp() {
        return this.app;
    }
    /**
     * Returns the App config
     *
     * @param {...any} args
     * @returns any
     * @memberof AdvancedManager
     */
    getConfig(...args) {
        return this.app.getConfig(...args);
    }
}

/**
 * Adds new methods to the native URL Object; it seemed cleaner than using a custom method or editing the prototype.
 *
 * This doesn't extend the **Class** object because it's meant to be a small extension of the native URL class.
 *
 * @export
 * @class _URL
 * @extends {URL}
 */
class _URL extends URL {
    // Read up on the native URL class [devdocs.io/dom/url]
    /**
     * Creates an instance of _URL.
     *
     * @param {(string | _URL | URL | Location)} [url=window.location.pathname]
     * @memberof _URL
     */
    constructor(url = window.location.href) {
        super(url instanceof URL ? url.href : url, window.location.origin);
    }
    /**
     * Returns the pathname with the hash
     *
     * @returns string
     * @memberof _URL
     */
    getFullPath() {
        return `${this.pathname}${this.hash}`;
    }
    /**
     * Returns the actual hash without the hashtag
     *
     * @returns string
     * @memberof _URL
     */
    getHash() {
        return this.hash.slice(1);
    }
    /**
     * Removes the hash from the full URL for a clean URL string
     *
     * @returns string
     * @memberof _URL
     */
    clean() {
        return this.toString().replace(/(\/#.*|\/|#.*)$/, '');
    }
    /**
     * Returns the pathname of a URL
     *
     * @returns string
     * @memberof _URL
     */
    getPathname() {
        return this.pathname;
    }
    /**
     * Compares this **_URL** to another **_URL**
     *
     * @param {_URL} url
     * @returns boolean
     * @memberof _URL
     */
    equalTo(url) {
        return this.clean() == url.clean();
    }
    /**
     * Compares the pathname of two URLs to each other
     *
     * @static
     * @param {_URL} a
     * @param {_URL} b
     * @returns boolean
     * @memberof _URL
     */
    static equal(a, b) {
        let urlA = a instanceof _URL ? a : new _URL(a);
        let urlB = b instanceof _URL ? b : new _URL(b);
        return urlA.equalTo(urlB);
    }
}
/**
 * This is the default starting URL, to avoid needless instances of the same class that produce the same value, I defined the default value
 */
const newURL = new _URL();
const URLString = newURL.getPathname();

/**
 * A quick snapshot of page coordinates, e.g. scroll positions
 *
 * @export
 * @class Coords
 * @implements {ICoords}
 */
class Coords {
    /**
     * Creates an instance of Coords.
     *
     * @param {number} [x=window.scrollX]
     * @param {number} [y=window.scrollY]
     * @memberof Coords
     */
    constructor(x = window.scrollX, y = window.scrollY) {
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
class State {
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
    constructor(state = {
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
    getIndex() {
        return this.state.index;
    }
    /**
     * Set state index
     *
     * @param {number} index
     * @returns State
     * @memberof State
     */
    setIndex(index) {
        this.state.index = index;
        return this;
    }
    /**
     * Get state URL
     *
     * @returns _URL
     * @memberof State
     */
    getURL() {
        return this.state.url;
    }
    /**
     * Get state URL as a string
     *
     * @returns string
     * @memberof State
     */
    getURLPathname() {
        return this.state.url.getPathname();
    }
    /**
     * Get state transition
     *
     * @returns string
     * @memberof State
     */
    getTransition() {
        return this.state.transition;
    }
    /**
     * Get state data
     *
     * @returns IStateData
     * @memberof State
     */
    getData() {
        return this.state.data;
    }
    /**
     * Returns the State as an Object
     *
     * @returns object
     * @memberof State
     */
    toJSON() {
        const { url, index, transition, data } = this.state;
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
class HistoryManager extends Manager {
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
    add(value) {
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
    addState(value) {
        let state = value instanceof State ? value : new State(value);
        this.add(state);
        return this;
    }
}

/**
 * Parses strings to DOM
 */
const PARSER = new DOMParser();
/**
 * A page represents the DOM elements that create each page
 *
 * @export
 * @class Page
 */
class Page extends ManagerItem {
    /**
     * Creates an instance of Page, it also creates a new page from response text, or a Document Object
     *
     * @param {_URL} [url=new _URL()]
     * @param {(string | Document)} [dom=document]
     * @memberof Page
     */
    constructor(url = new _URL(), dom = document) {
        super();
        this.url = url;
        if (typeof dom === "string") {
            this.dom = PARSER.parseFromString(dom, "text/html");
        }
        else
            this.dom = dom || document;
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
    install() {
        this.wrapper = this.body.querySelector(this.getConfig("wrapperAttr"));
    }
    /**
     * Returns the current page's URL
     *
     * @returns _URL
     * @memberof Page
     */
    getURL() {
        return this.url;
    }
    /**
     * Returns the current page's URL
     *
     * @returns string
     * @memberof Page
     */
    getPathname() {
        return this.url.pathname;
    }
    /**
     * The page title
     *
     * @returns string
     * @memberof Page
     */
    getTitle() {
        return this.title;
    }
    /**
     * The page's head element
     *
     * @returns Element
     * @memberof Page
     */
    getHead() {
        return this.head;
    }
    /**
     * The page's body element
     *
     * @returns Element
     * @memberof Page
     */
    getBody() {
        return this.body;
    }
    /**
     * The page's wrapper element
     *
     * @returns HTMLElement
     * @memberof Page
     */
    getWrapper() {
        return this.wrapper;
    }
    /**
     * The page's document
     *
     * @returns Document
     * @memberof Page
     */
    getDOM() {
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
class PageManager extends AdvancedManager {
    /**
     * Creates an instance of the PageManager
     *
     * @param {App} app
     * @memberof PageManager
     */
    constructor(app) {
        super(app);
        /**
         * Stores all URLs that are currently loading
         *
         * @protected
         * @type Manager<string, Promise<string>>
         * @memberof PageManager
         */
        this.loading = new Manager();
        this.set(URLString, new Page());
    }
    /**
     * Returns the loading Manager
     *
     * @returns Manager<string, Promise<string>>
     * @memberof PageManager
     */
    getLoading() {
        return this.loading;
    }
    /**
     * Load from cache or by requesting URL via a fetch request, avoid requesting for the same thing twice by storing the fetch request in "this.loading"
     *
     * @param {(_URL | string)} [_url=new _URL()]
     * @returns Promise<Page>
     * @memberof PageManager
     */
    async load(_url = new _URL()) {
        let url = _url instanceof URL ? _url : new _URL(_url);
        let urlString = url.getPathname();
        let page, request;
        if (this.has(urlString)) {
            page = this.get(urlString);
            return Promise.resolve(page);
        }
        if (!this.loading.has(urlString)) {
            request = this.request(urlString);
            this.loading.set(urlString, request);
        }
        else
            request = this.loading.get(urlString);
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
    async request(url) {
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
        }
        catch (err) {
            window.clearTimeout(timeout);
            throw err;
        }
    }
}

/*!
 * @okikio/event-emitter v1.0.5
 * (c) 2020 Okiki Ojo
 * Released under the MIT license
 */

/*!
 * managerjs v1.0.9
 * (c) 2020 Okiki Ojo
 * Released under the MIT license
 */

/**
 * Manages complex lists of named data, eg. A page can be stored in a list by of other pages with the url being how the page is stored in the list. Managers use Maps to store data.
 *
 * @export
 * @class Manager
 * @template K
 * @template V
 */
class Manager$1 {
    /**
     * Creates an instance of Manager.
     *
     * @param {Array<[K, V]>} value
     * @memberof Manager
     */
    constructor(value) {
        this.map = new Map(value);
    }
    /**
     * Returns the Manager class's list
     *
     * @returns Map<K, V>
     * @memberof Manager
     */
    getMap() {
        return this.map;
    }
    /**
     * Get a value stored in the Manager
     *
     * @public
     * @param  {K} key - The key to find in the Manager's list
     * @returns V
     */
    get(key) {
        return this.map.get(key);
    }
    /**
     * Returns the keys of all items stored in the Manager as an Array
     *
     * @returns Array<K>
     * @memberof Manager
     */
    keys() {
        return [...this.map.keys()];
    }
    /**
     * Returns the values of all items stored in the Manager as an Array
     *
     * @returns Array<V>
     * @memberof Manager
     */
    values() {
        return [...this.map.values()];
    }
    /**
     * Set a value stored in the Manager
     *
     * @public
     * @param  {K} key - The key where the value will be stored
     * @param  {V} value - The value to store
     * @returns Manager<K, V>
     */
    set(key, value) {
        this.map.set(key, value);
        return this;
    }
    /**
     * Adds a value to Manager, and uses the current size of the Manager as it's key, it works best when all the key in the Manager are numbers
     *
     * @public
     * @param  {V} value
     * @returns Manager<K, V>
     */
    add(value) {
        // @ts-ignore
        this.set(this.size, value);
        return this;
    }
    /**
     * Returns the total number of items stored in the Manager
     *
     * @public
     * @returns Number
     */
    get size() {
        return this.map.size;
    }
    /**
     * Returns the last item in the Manager who's index is a certain distance from the last item in the Manager
     *
     * @param {number} [distance=1]
     * @returns V | undefined
     * @memberof Manager
     */
    last(distance = 1) {
        let key = this.keys()[this.size - distance];
        return this.get(key);
    }
    /**
     * Returns the second last item in the Manager
     *
     * @public
     * @returns V | undefined
     */
    prev() {
        return this.last(2);
    }
    /**
     * Removes a value stored in the Manager, via the key
     *
     * @public
     * @param  {K} key - The key for the key value pair to be removed
     * @returns Manager<K, V>
     */
    delete(key) {
        this.map.delete(key);
        return this;
    }
    /**
     * Clear the Manager of all its contents
     *
     * @public
     * @returns Manager<K, V>
     */
    clear() {
        this.map.clear();
        return this;
    }
    /**
     * Checks if the Manager contains a certain key
     *
     * @public
     * @param {K} key
     * @returns boolean
     */
    has(key) {
        return this.map.has(key);
    }
    /**
     * Returns a new Iterator object that contains an array of [key, value] for each element in the Map object in insertion order.
     *
     * @public
     * @returns IterableIterator<[K, V]>
     */
    entries() {
        return this.map.entries();
    }
    /**
     * Iterates through the Managers contents, calling a callback function every iteration
     *
     * @param {*} [callback=(...args: any): void => { }]
     * @param {object} context
     * @returns Manager<K, V>
     * @memberof Manager
     */
    forEach(callback = (...args) => { }, context) {
        this.map.forEach(callback, context);
        return this;
    }
    /**
     * Allows iteration via the for..of, learn more: [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators]
     *
     * @returns
     * @memberof Manager
     */
    [Symbol.iterator]() {
        return this.entries();
    }
    /**
     * Calls the method of a certain name for all items that are currently installed
     *
     * @param {string} method
     * @param {Array<any>} [args=[]]
     * @returns Manager<K, V>
     * @memberof Manager
     */
    methodCall(method, ...args) {
        this.forEach((item) => {
            item[method](...args);
        });
        return this;
    }
    /**
     * Asynchronously calls the method of a certain name for all items that are currently installed, similar to methodCall
     *
     * @param {string} method
     * @param {Array<any>} [args=[]]
     * @returns Promise<Manager<K, V>>
     * @memberof Manager
     */
    async asyncMethodCall(method, ...args) {
        for await (let [, item] of this.map) {
            await item[method](...args);
        }
        return this;
    }
}

/**
 * Represents a new event listener consisting of properties like: callback, scope, name
 *
 * @export
 * @class Listener
 */
class Listener {
    /**
     * Creates an instance of Listener.
     *
     * @param {IListener} { callback = () => { }, scope = null, name = "event" }
     * @memberof Listener
     */
    constructor({ callback = () => { }, scope = null, name = "event", }) {
        this.listener = { callback, scope, name };
    }
    /**
     * Returns the callback Function of the Listener
     *
     * @returns ListenerCallback
     * @memberof Listener
     */
    getCallback() {
        return this.listener.callback;
    }
    /**
     * Returns the scope as an Object, from the Listener
     *
     * @returns object
     * @memberof Listener
     */
    getScope() {
        return this.listener.scope;
    }
    /**
     * Returns the event as a String, from the Listener
     *
     * @returns string
     * @memberof Listener
     */
    getEventName() {
        return this.listener.name;
    }
    /**
     * Returns the listener as an Object
     *
     * @returns IListener
     * @memberof Listener
     */
    toJSON() {
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
class Event extends Manager$1 {
    /**
     * Creates an instance of Event.
     *
     * @param {string} [name="event"]
     * @memberof Event
     */
    constructor(name = "event") {
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
class EventEmitter extends Manager$1 {
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
    getEvent(name) {
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
    newListener(name, callback, scope) {
        let event = this.getEvent(name);
        event.add(new Listener({ name, callback, scope }));
        return event;
    }
    /**
     * Adds a listener for a given event
     *
     * @param {EventInput} events
     * @param {ListenerCallback} callback
     * @param {object} scope
     * @returns
     * @memberof EventEmitter
     */
    on(events, callback, scope) {
        // If there is no event break
        if (typeof events == "undefined")
            return this;
        // Create a new event every space
        if (typeof events == "string")
            events = events.split(/\s/g);
        let _name;
        let _callback;
        let _scope;
        // Loop through the list of events
        Object.keys(events).forEach(key => {
            // Select the name of the event from the list
            // Remember events can be {String | Object | Array<string>}
            // Check If events is an Object (JSON like Object, and not an Array)
            if (typeof events == "object" && !Array.isArray(events)) {
                _name = key;
                _callback = events[key];
                _scope = callback;
            }
            else {
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
     * @param {ListenerCallback} [callback]
     * @param {object} [scope]
     * @returns Event
     * @memberof EventEmitter
     */
    removeListener(name, callback, scope) {
        let event = this.getEvent(name);
        if (callback) {
            let i = 0, len = event.size, value;
            let listener = new Listener({ name, callback, scope });
            for (; i < len; i++) {
                value = event.get(i);
                console.log(value);
                if (value.getCallback() === listener.getCallback() &&
                    value.getScope() === listener.getScope())
                    break;
            }
            event.delete(i);
        }
        return event;
    }
    /**
     * Removes a listener from a given event, or it just completely removes an event
     *
     * @param {EventInput} events
     * @param {ListenerCallback} [callback]
     * @param {object} [scope]
     * @returns EventEmitter
     * @memberof EventEmitter
     */
    off(events, callback, scope) {
        // If there is no event break
        if (typeof events == "undefined")
            return this;
        // Create a new event every space
        if (typeof events == "string")
            events = events.split(/\s/g);
        let _name;
        let _callback;
        let _scope;
        // Loop through the list of events
        Object.keys(events).forEach((key) => {
            // Select the name of the event from the list
            // Remember events can be {String | Object | Array<any>}
            // Check If events is an Object (JSON like Object, and not an Array)
            if (typeof events == "object" && !Array.isArray(events)) {
                _name = key;
                _callback = events[key];
                _scope = callback;
            }
            else {
                _name = events[key];
                _callback = callback;
                _scope = scope;
            }
            if (_callback) {
                this.removeListener(_name, _callback, _scope);
            }
            else
                this.delete(_name);
        }, this);
        return this;
    }
    /**
     * Adds a one time event listener for an event
     *
     * @param {EventInput} events
     * @param {ListenerCallback} callback
     * @param {object} scope
     * @returns EventEmitter
     * @memberof EventEmitter
     */
    once(events, callback, scope) {
        // If there is no event break
        if (typeof events == "undefined")
            return this;
        // Create a new event every space
        if (typeof events == "string")
            events = events.split(/\s/g);
        let onceFn = (...args) => {
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
    emit(events, ...args) {
        // If there is no event break
        if (typeof events == "undefined")
            return this;
        // Create a new event every space
        if (typeof events == "string")
            events = events.split(/\s/g);
        // Loop through the list of events
        events.forEach((event) => {
            let listeners = this.getEvent(event);
            const customEvent = new CustomEvent(event, { detail: args });
            window.dispatchEvent(customEvent);
            listeners.forEach((listener) => {
                let { callback, scope } = listener.toJSON();
                callback.apply(scope, args);
            });
        }, this);
        return this;
    }
}

/**
 * Controls specific kinds of actions that require JS
 *
 * @export
 * @class Service
 */
class Service extends ManagerItem {
    /**
     * Method is run once when Service is installed on a ServiceManager
     *
     * @memberof Service
     */
    install() {
        let app = this.manager.getApp();
        this.PageManager = app.getPages();
        this.EventEmitter = app.getEmitter();
        this.HistoryManager = app.getHistory();
        this.ServiceManager = app.getServices();
        this.TransitionManager = app.getTransitions();
    }
    // Called on start of Service
    boot() { }
    // Initialize events
    initEvents() { }
    // Stop events
    stopEvents() { }
    // Stop services
    stop() {
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
class ServiceManager extends AdvancedManager {
    /**
     * Creates an instance of ServiceManager.
     *
     * @param {App} app
     * @memberof ServiceManager
     */
    constructor(app) {
        super(app);
    }
    /**
     * Call the boot method for all Services
     *
     * @returns Promise<void>
     * @memberof ServiceManager
     */
    async boot() {
        await this.asyncMethodCall("boot");
    }
    /**
     * Call the initEvents method for all Services
     *
     * @returns ServiceManager
     * @memberof ServiceManager
     */
    initEvents() {
        this.methodCall("initEvents");
        return this;
    }
    /**
     * Call the stopEvents method for all Services
     *
     * @returns ServiceManager
     * @memberof ServiceManager
     */
    stopEvents() {
        this.methodCall("stopEvents");
        return this;
    }
    /**
     * Call the stop method for all Services
     *
     * @returns ServiceManager
     * @memberof ServiceManager
     */
    stop() {
        this.methodCall("stop");
        return this;
    }
}

/**
 * Controls the animation between pages
 *
 * @export
 * @class Transition
 */
class Transition extends ManagerItem {
    /**
     * Creates an instance of Transition.
     *
     * @memberof Transition
     */
    constructor() {
        super();
        /**
         * Transition name
         *
         * @protected
         * @type string
         * @memberof Transition
         */
        this.name = "Transition";
    }
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
    init({ oldPage, newPage, trigger }) {
        this.oldPage = oldPage;
        this.newPage = newPage;
        this.trigger = trigger;
        this.boot();
        return this;
    }
    // Called on start of Transition
    boot() { }
    // Initialize events
    initEvents() { }
    // Stop events
    stopEvents() { }
    // Stop services
    stop() {
        this.stopEvents();
    }
    /**
     * Returns the Transition's name
     *
     * @returns string
     * @memberof Transition
     */
    getName() {
        return this.name;
    }
    /**
     * Returns the Transition's old page
     *
     * @returns Page
     * @memberof Transition
     */
    getOldPage() {
        return this.oldPage;
    }
    /**
     * Returns the Transition's new page
     *
     * @returns Page
     * @memberof Transition
     */
    getNewPage() {
        return this.newPage;
    }
    /**
     * Returns the Transition's trigger
     *
     * @returns Trigger
     * @memberof Transition
     */
    getTrigger() {
        return this.trigger;
    }
    // Based off the highwayjs Transition class
    /**
     * Transition from current page
     *
     * @param {ITransitionData} { from, trigger, done }
     * @memberof Transition
     */
    out({ done }) {
        done();
    }
    /**
     * Transition into the next page
     *
     * @param {ITransitionData} { from, to, trigger, done }
     * @memberof Transition
     */
    in({ done }) {
        done();
    }
    /**
     * Starts the transition
     *
     * @returns Promise<Transition>
     * @memberof Transition
     */
    async start(EventEmitter) {
        let fromWrapper = this.oldPage.getWrapper();
        let toWrapper = this.newPage.getWrapper();
        document.title = this.newPage.getTitle();
        return new Promise(async (finish) => {
            EventEmitter.emit("BEFORE-TRANSITION-OUT");
            await new Promise(done => {
                let outMethod = this.out({
                    from: this.oldPage,
                    trigger: this.trigger,
                    done
                });
                if (outMethod.then)
                    outMethod.then(done);
            });
            EventEmitter.emit("AFTER-TRANSITION-OUT");
            await new Promise(done => {
                fromWrapper.insertAdjacentElement('beforebegin', toWrapper);
                fromWrapper.remove();
                done();
            });
            EventEmitter.emit("BEFORE-TRANSITION-IN");
            await new Promise(done => {
                let inMethod = this.in({
                    from: this.oldPage,
                    to: this.newPage,
                    trigger: this.trigger,
                    done
                });
                if (inMethod.then)
                    inMethod.then(done);
            });
            EventEmitter.emit("AFTER_TRANSITION_IN");
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
class TransitionManager extends AdvancedManager {
    /**
     * Creates an instance of the TransitionManager
     *
     * @param {App} app
     * @memberof TransitionManager
     */
    constructor(app) { super(app); }
    /**
     * Quick way to add a Transition to the TransitionManager
     *
     * @param {Transition} value
     * @returns TransitionManager
     * @memberof TransitionManager
     */
    add(value) {
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
    async boot({ name, oldPage, newPage, trigger }) {
        let transition = this.get(name);
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
    initEvents() {
        this.methodCall("initEvents");
        return this;
    }
    /**
     * Call the stopEvents method for all Transitions
     *
     * @returns TransitionManager
     * @memberof TransitionManager
     */
    stopEvents() {
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
class Block extends Service {
    /**
     * It initializes the Block
     *
     * @param {string} [name]
     * @param {HTMLElement} [rootElement]
     * @param {string} [selector]
     * @param {number} [index]
     * @memberof Block
     */
    init(name, rootElement, selector, index) {
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
    getRootElement() {
        return this.rootElement;
    }
    /**
     * Get Selector
     *
     * @returns string
     * @memberof Block
     */
    getSelector() {
        return this.selector;
    }
    /**
     * Get Index
     *
     * @returns number
     * @memberof Block
     */
    getIndex() {
        return this.index;
    }
    /**
     * Get the name of the Block
     *
     * @returns string
     * @memberof Block
     */
    getName() {
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
class BlockIntent extends ManagerItem {
    /**
     * Creates an instance of BlockIntent.
     *
     * @param {string} name
     * @param {typeof Block} block
     * @memberof BlockIntent
     */
    constructor(name, block) {
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
    getName() {
        return this.name;
    }
    /**
     * Getter for the Block of the Block Intent
     *
     * @returns {typeof Block}
     * @memberof BlockIntent
     */
    getBlock() {
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
class BlockManager extends AdvancedManager {
    /**
     * Creates an instance of BlockManager.
     *
     * @param {App} app
     * @memberof BlockManager
     */
    constructor(app) {
        super(app);
        this.activeBlocks = new AdvancedManager(app);
    }
    /**
     * Initialize all Blocks
     *
     * @memberof BlockManager
     */
    init() {
        this.forEach((intent) => {
            let name = intent.getName();
            let block = intent.getBlock();
            let selector = `[${this.getConfig("blockAttr", false)}="${name}"]`;
            let rootElements = [...document.querySelectorAll(selector)];
            for (let i = 0, len = rootElements.length; i < len; i++) {
                let newInstance = new block();
                newInstance.init(name, rootElements[i], selector, i);
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
    getActiveBlocks() {
        return this.activeBlocks;
    }
    /**
     * Call the boot method for all Blocks
     *
     * @returns Promise<void>
     * @memberof BlockManager
     */
    async boot() {
        await this.activeBlocks.asyncMethodCall("boot");
    }
    /**
     * Refreshes DOM Elements
     *
     * @memberof BlockManager
     */
    refresh() {
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
    initEvents() {
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
    stopEvents() {
        this.activeBlocks.methodCall("stopEvents");
        return this;
    }
    /**
     * Call the stop method for all Blocks
     *
     * @returns BlockManager
     * @memberof BlockManager
     */
    stop() {
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
class App {
    /**
     * Creates an instance of App.
     *
     * @param {(ICONFIG | CONFIG)} [config={}]
     * @memberof App
     */
    constructor(config = {}) {
        this.register(config);
    }
    /**
     * For registering all managers and the configurations
     *
     * @param {(ICONFIG | CONFIG)} [config={}]
     * @returns App
     * @memberof App
     */
    register(config = {}) {
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
            this.emitter.emit("READY");
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
    getConfig(...args) {
        return this.config.getConfig(...args);
    }
    /**
     * Return the App's EventEmitter
     *
     * @returns EventEmitter
     * @memberof App
     */
    getEmitter() {
        return this.emitter;
    }
    /**
     * Returns the App's BlockManager
     *
     * @returns BlockManager
     * @memberof App
     */
    getBlocks() {
        return this.blocks;
    }
    /**
     * Return the App's ServiceManager
     *
     * @returns ServiceManager
     * @memberof App
     */
    getServices() {
        return this.services;
    }
    /**
     * Return the App's PageManager
     *
     * @returns PageManager
     * @memberof App
     */
    getPages() {
        return this.pages;
    }
    /**
     * Return the App's TransitionManager
     *
     * @returns TransitionManager
     * @memberof App
     */
    getTransitions() {
        return this.transitions;
    }
    /**
     * Return the App's HistoryManager
     *
     * @returns HistoryManager
     * @memberof App
     */
    getHistory() {
        return this.history;
    }
    /**
     * Returns a Block Intent Object from the App's instance of the BlockManager
     *
     * @param {number} key
     * @returns IBlockIntent
     * @memberof App
     */
    getBlock(key) {
        return this.blocks.get(key);
    }
    /**
     * Returns an instance of a Block from the App's instance of the BlockManager
     *
     * @param {number} key
     * @returns Block
     * @memberof App
     */
    getActiveBlock(key) {
        return this.blocks.getActiveBlocks().get(key);
    }
    /**
     * Returns a Service from the App's instance of the ServiceManager
     *
     * @param {number} key
     * @returns Service
     * @memberof App
     */
    getService(key) {
        return this.services.get(key);
    }
    /**
     * Returns a Transition from the App's instance of the TransitionManager
     *
     * @param {string} key
     * @returns Transition
     * @memberof App
     */
    getTransition(key) {
        return this.transitions.get(key);
    }
    /**
     * Returns a State from the App's instance of the HistoryManager
     *
     * @param {number} key
     * @returns State
     * @memberof App
     */
    getState(key) {
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
    get(type, key) {
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
    async loadPage(url) {
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
    async load(type, key) {
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
    addBlock(blockIntent) {
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
    addService(service) {
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
    addTransition(transition) {
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
    addState(state) {
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
    add(type, value) {
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
    async boot() {
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
    stop() {
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
    currentPage() {
        let currentState = this.history.last();
        return this.pages.get(currentState.getURLPathname());
    }
    /**
     * A shortcut to the App EventEmitter on method
     *
     * @param {EventInput} events
     * @param {ListenerCallback} callback
     * @returns App
     * @memberof App
     */
    on(events, callback) {
        this.emitter.on(events, callback, this);
        return this;
    }
    /**
     * A shortcut to the App EventEmitter off method
     *
     * @param {EventInput} events
     * @param {ListenerCallback} callback
     * @returns App
     * @memberof App
     */
    off(events, callback) {
        this.emitter.off(events, callback, this);
        return this;
    }
    /**
     * A shortcut to the App EventEmitter once method
     *
     * @param {string} events
     * @param {ListenerCallback} callback
     * @returns App
     * @memberof App
     */
    once(events, callback) {
        this.emitter.once(events, callback, this);
        return this;
    }
    /**
     * A shortcut to the App EventEmitter emit method
     *
     * @param {(string | any[])} events
     * @param {...any} args
     * @returns App
     * @memberof App
     */
    emit(events, ...args) {
        this.emitter.emit(events, ...args);
        return this;
    }
}

/**
 * Creates a Barba JS like PJAX Service, for the Framework
 *
 * @export
 * @class PJAX
 * @extends {Service}
 */
// Based on Barba JS and StartingBlocks
class PJAX extends Service {
    constructor() {
        super(...arguments);
        /**
         * URLs to ignore when prefetching
         *
         * @private
         * @type boolean
         * @memberof PJAX
         */
        this.ignoreURLs = [];
        /**
         * Whether or not to disable prefetching
         *
         * @private
         *
         * @memberof PJAX
         */
        this.prefetchIgnore = false;
        /**
         * Current state or transitions
         *
         * @private
         * @type boolean
         * @memberof PJAX
         */
        this.isTransitioning = false;
        /**
         * Ignore extra clicks of an anchor element if a transition has already started
         *
         * @private
         * @type boolean
         * @memberof PJAX
         */
        this.stopOnTransitioning = false;
        /**
         * On page change (excluding popstate event) keep current scroll position
         *
         * @private
         * @type boolean
         * @memberof PJAX
         */
        this.stickyScroll = true;
        /**
         * Force load a page if an error occurs
         *
         * @private
         * @type boolean
         * @memberof PJAX
         */
        this.forceOnError = false;
        /**
         * Dictates whether to auto scroll if an hash is present in the window URL
         *
         * @protected
         * @type boolean
         * @memberof PJAX
         */
        this.autoScrollOnHash = true;
    }
    /**
     * Sets the transition state, sets isTransitioning to true
     *
     * @private
     * @memberof PJAX
     */
    transitionStart() {
        this.isTransitioning = true;
    }
    /**
     * Sets the transition state, sets isTransitioning to false
     *
     * @private
     * @memberof PJAX
     */
    transitionStop() {
        this.isTransitioning = false;
    }
    /**
     * Starts the PJAX Service
     *
     * @memberof PJAX
     */
    boot() {
        let current = new State();
        this.HistoryManager.add(current);
        this.changeState("replace", current);
    }
    /**
     * Gets the transition to use for a certain anchor
     *
     * @param {HTMLAnchorElement} el
     * @returns {(string | null)}
     * @memberof PJAX
     */
    getTransitionName(el) {
        if (!el || !el.getAttribute)
            return null;
        let transitionAttr = el.getAttribute(this.getConfig("transitionAttr", false));
        if (typeof transitionAttr === 'string')
            return transitionAttr;
        return null;
    }
    /**
     * Checks to see if the anchor is valid
     *
     * @param {HTMLAnchorElement} el
     * @param {(LinkEvent | KeyboardEvent)} event
     * @param {string} href
     *
     * @memberof PJAX
     */
    validLink(el, event, href) {
        let pushStateSupport = !window.history.pushState;
        let exists = !el || !href;
        let eventMutate = event.which > 1 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey;
        let newTab = el.hasAttribute('target') && el.target === '_blank';
        let crossOrigin = (el.protocol !== location.protocol) ||
            (el.hostname !== location.hostname);
        let download = typeof el.getAttribute('download') === 'string';
        let preventSelf = el.hasAttribute(this.getConfig("preventSelfAttr", false));
        let preventAll = Boolean(el.closest(this.getConfig("preventAllAttr")));
        let prevent = preventSelf && preventAll;
        let sameURL = new _URL().getFullPath() === new _URL(href).getFullPath();
        return !(exists || pushStateSupport || eventMutate || newTab || crossOrigin || download || prevent || sameURL);
    }
    /**
     * Returns the href or an Anchor element
     *
     * @param {HTMLAnchorElement} el
     * @returns {(string | null)}
     * @memberof PJAX
     */
    getHref(el) {
        if (el && el.tagName && el.tagName.toLowerCase() === 'a' && typeof el.href === 'string')
            return el.href;
        return null;
    }
    /**
     * Check if event target is a valid anchor with an href, if so, return the link
     *
     * @param {LinkEvent} event
     *
     * @memberof PJAX
     */
    getLink(event) {
        let el = event.target;
        let href = this.getHref(el);
        while (el && !href) {
            el = el.parentNode;
            href = this.getHref(el);
        }
        // Check for a valid link
        if (!el || !this.validLink(el, event, href))
            return;
        return el;
    }
    /**
     * When an element is clicked.
     *
     * Get valid anchor element.
     * Go for a transition.
     *
     * @param {LinkEvent} event
     * @returns
     * @memberof PJAX
     */
    onClick(event) {
        let el = this.getLink(event);
        if (!el)
            return;
        if (this.isTransitioning && this.stopOnTransitioning) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        let href = this.getHref(el);
        this.EventEmitter.emit("ANCHOR-CLICK CLICK", event);
        this.go({ href, trigger: el, event });
    }
    /**
     * Returns the direction of the State change as a String, either the Back button or the Forward button
     *
     * @param {number} value
     *
     * @memberof PJAX
     */
    getDirection(value) {
        if (Math.abs(value) > 1) {
            // Ex 6-0 > 0 -> forward, 0-6 < 0 -> back
            return value > 0 ? 'forward' : 'back';
        }
        else {
            if (value === 0) {
                return 'popstate';
            }
            else {
                // Ex 6-5 > 0 -> back, 5-6 < 0 -> forward
                return value > 0 ? 'back' : 'forward';
            }
        }
    }
    /**
     * Force a page to go to a certain URL
     *
     * @param {string} href
     * @memberof PJAX
     */
    force(href) {
        window.location.assign(href);
    }
    /**
     * If transition is running force load page.
     * Stop if currentURL is the same as new url.
     * On state change, change the current state history,
     * to reflect the direction of said state change
     * Load page and page transition.
     *
     * @param {string} href
     * @param {Trigger} [trigger='HistoryManager']
     * @param {StateEvent} [event]
     * @memberof PJAX
     */
    go({ href, trigger = 'HistoryManager', event }) {
        // If transition is already running and the go method is called again, force load page
        if (this.isTransitioning && this.stopOnTransitioning) {
            this.force(href);
            return;
        }
        let url = new _URL(href);
        let currentState = this.HistoryManager.last();
        let currentURL = currentState.getURL();
        if (currentURL.equalTo(url)) {
            this.hashAction(url.hash);
            return;
        }
        let transitionName;
        if (event && event.state) {
            this.EventEmitter.emit("POPSTATE", event);
            // If popstate, get back/forward direction.
            let { state } = event;
            let { index, transition, data } = state;
            let currentIndex = currentState.getIndex();
            let difference = currentIndex - index;
            trigger = this.getDirection(difference);
            transitionName = transition;
            // If page remains the same on state change DO NOT run this, it's pointless
            if (trigger !== "popstate") {
                // Keep scroll position
                let { x, y } = data.scroll;
                window.scroll({
                    top: y, left: x,
                    behavior: 'smooth' // 👈 
                });
            }
            // Based on the direction of the state change either remove or add a state
            if (trigger === "back") {
                this.HistoryManager.delete(currentIndex);
                this.EventEmitter.emit(`POPSTATE-BACK`, event);
            }
            else if (trigger === "forward") {
                this.HistoryManager.addState({ url, transition, data });
                this.EventEmitter.emit(`POPSTATE-FORWARD`, event);
            }
        }
        else {
            // Add new state
            transitionName = this.getTransitionName(trigger) || "default";
            const scroll = new Coords();
            const index = this.HistoryManager.size;
            const state = new State({
                url, index,
                transition: transitionName,
                data: { scroll }
            });
            if (this.stickyScroll) {
                // Keep scroll position
                let { x, y } = scroll;
                window.scroll({
                    top: y, left: x,
                    behavior: 'smooth' // 👈 
                });
            }
            else {
                window.scroll({
                    top: 0, left: 0,
                    behavior: 'smooth' // 👈 
                });
            }
            this.HistoryManager.add(state);
            this.changeState("push", state);
            this.EventEmitter.emit("HISTORY-NEW-ITEM", event);
        }
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        this.EventEmitter.emit("GO", event);
        return this.load({ oldHref: currentURL.getPathname(), href, trigger, transitionName });
    }
    /**
     * Either push or replace history state
     *
     * @param {("push" | "replace")} action
     * @param {IState} state
     * @param {_URL} url
     * @memberof PJAX
     */
    changeState(action, state) {
        let url = state.getURL();
        let href = url.getFullPath();
        let json = state.toJSON();
        let args = [json, '', href];
        if (window.history) {
            switch (action) {
                case 'push':
                    window.history.pushState.apply(window.history, args);
                    break;
                case 'replace':
                    window.history.replaceState.apply(window.history, args);
                    break;
            }
        }
    }
    /**
     * Load the new Page as well as a Transition; run the Transition
     *
     * @param {string} oldHref
     * @param {string} href
     * @param {Trigger} trigger
     * @param {string} [transitionName="default"]
     *
     * @memberof PJAX
     */
    async load({ oldHref, href, trigger, transitionName = "default" }) {
        try {
            let oldPage = this.PageManager.get(oldHref);
            let newPage;
            this.EventEmitter.emit("PAGE-LOADING", { href, oldPage, trigger });
            try {
                try {
                    newPage = await this.PageManager.load(href);
                    this.transitionStart();
                    this.EventEmitter.emit("PAGE-LOAD-COMPLETE", { newPage, oldPage, trigger });
                }
                catch (err) {
                    throw `[PJAX] Page load error: ${err}`;
                }
                // --
                // --
                this.EventEmitter.emit("NAVIGATION-START", { oldPage, newPage, trigger, transitionName });
                try {
                    this.EventEmitter.emit("TRANSITION-START", transitionName);
                    let transition = await this.TransitionManager.boot({
                        name: transitionName,
                        oldPage,
                        newPage,
                        trigger
                    });
                    this.EventEmitter.emit("TRANSITION-END", { transition });
                }
                catch (err) {
                    throw `[PJAX] Transition error: ${err}`;
                }
                this.EventEmitter.emit("NAVIGATION-END", { oldPage, newPage, trigger, transitionName });
                this.hashAction();
            }
            catch (err) {
                this.transitionStop();
                throw err;
            }
            this.transitionStop(); // Sets isTransitioning to false
        }
        catch (err) {
            if (this.forceOnError)
                this.force(href);
            else
                console.error(err);
        }
    }
    /**
     * Auto scrolls to an elements position if the element has an hash
     *
     * @param {string} [hash=window.location.hash]
     * @memberof PJAX
     */
    hashAction(hash = window.location.hash) {
        if (this.autoScrollOnHash) {
            let hashID = hash.slice(1);
            if (hashID.length) {
                let el = document.getElementById(hashID);
                if (el) {
                    if (el.scrollIntoView) {
                        el.scrollIntoView({ behavior: 'smooth' });
                    }
                    else {
                        let { left, top } = el.getBoundingClientRect();
                        window.scroll({ left, top, behavior: 'smooth' });
                    }
                }
            }
        }
    }
    /**
     * Check to see if the URL is to be ignored, uses either RegExp of Strings to check
     *
     * @param {_URL} { pathname }
     *
     * @memberof PJAX
     */
    ignoredURL({ pathname }) {
        return this.ignoreURLs.length && this.ignoreURLs.some(url => {
            return typeof url === "string" ? url === pathname : url.exec(pathname) !== null;
        });
    }
    /**
     * When you hover over an anchor, prefetch the event target's href
     *
     * @param {LinkEvent} event
     * @memberof PJAX
     */
    onHover(event) {
        let el = this.getLink(event);
        if (!el)
            return;
        const url = new _URL(this.getHref(el));
        const urlString = url.getPathname();
        // If Url is ignored or already in cache, don't do any think
        if (this.ignoredURL(url) || this.PageManager.has(urlString))
            return;
        this.EventEmitter.emit("ANCHOR-HOVER HOVER", event);
        (async () => {
            try {
                await this.PageManager.load(url);
            }
            catch (err) {
                console.warn("[PJAX] Prefetch error: ", err);
            }
        })();
    }
    /**
     * When History state changes.
     *
     * Get url from State
     * Go for a Barba transition.
     *
     * @param {PopStateEvent} event
     * @memberof PJAX
     */
    onStateChange(event) {
        this.go({ href: window.location.href, trigger: 'popstate', event });
    }
    /**
     * Bind the event listeners to the PJAX class
     *
     * @memberof PJAX
     */
    bindEvents() {
        this.onHover = this.onHover.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onStateChange = this.onStateChange.bind(this);
    }
    /**
     * Initialize DOM Events
     *
     * @memberof PJAX
     */
    initEvents() {
        this.bindEvents();
        if (this.prefetchIgnore !== true) {
            document.addEventListener('mouseover', this.onHover);
            document.addEventListener('touchstart', this.onHover);
        }
        document.addEventListener('click', this.onClick);
        window.addEventListener('popstate', this.onStateChange);
    }
    /**
     * Stop DOM Events
     *
     * @memberof PJAX
     */
    stopEvents() {
        if (this.prefetchIgnore !== true) {
            document.removeEventListener('mouseover', this.onHover);
            document.removeEventListener('touchstart', this.onHover);
        }
        document.removeEventListener('click', this.onClick);
        window.removeEventListener('popstate', this.onStateChange);
    }
}

exports.AdvancedManager = AdvancedManager;
exports.App = App;
exports.Block = Block;
exports.BlockIntent = BlockIntent;
exports.BlockManager = BlockManager;
exports.CONFIG = CONFIG;
exports.CONFIG_DEFAULTS = CONFIG_DEFAULTS;
exports.Coords = Coords;
exports.Event = Event;
exports.EventEmitter = EventEmitter;
exports.HistoryManager = HistoryManager;
exports.Listener = Listener;
exports.Manager = Manager;
exports.ManagerItem = ManagerItem;
exports.PARSER = PARSER;
exports.PJAX = PJAX;
exports.Page = Page;
exports.PageManager = PageManager;
exports.Service = Service;
exports.ServiceManager = ServiceManager;
exports.State = State;
exports.Transition = Transition;
exports.TransitionManager = TransitionManager;
exports.URLString = URLString;
exports._URL = _URL;
exports.newURL = newURL;
