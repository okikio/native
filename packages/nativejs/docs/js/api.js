export const CONFIG_DEFAULTS = {
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
export class CONFIG {
    /**
     * Creates an instance of CONFIG.
     *
     * @param {ICONFIG} config
     * @memberof CONFIG
     */
    constructor(config) {
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
/**
 * Manages complex lists of named data, eg. A page can be stored in a list by of other pages with the url being how the page is stored in the list. Managers use Maps to store data.
 *
 * @export
 * @class Manager
 * @template K
 * @template V
 */
export class Manager {
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
    getList() {
        return this.list;
    }
    /**
     * Get a value stored in the Manager
     *
     * @public
     * @param  {K} key - The key to find in the Manager's list
     * @returns V
     */
    get(key) {
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
    set(key, value) {
        this.list.set(key, value);
        return this;
    }
    /**
     * Returns the keys of all items stored in the Manager
     *
     * @public
     * @returns Array<K>
     */
    keys() {
        return [...this.list.keys()];
    }
    /**
     * Returns the total number of items stored in the Manager
     *
     * @public
     * @returns Number
     */
    size() {
        return this.list.size;
    }
    /**
     * Returns the last item in the Manager who's index is a certain distance from the last item in the Manager
     *
     * @param {number} [distance=1]
     * @returns V
     * @memberof Manager
     */
    last(distance = 1) {
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
    remove(key) {
        this.list.delete(key);
        return this;
    }
    /**
     * Clear the Manager of all its contents
     *
     * @public
     * @returns Manager<K, V>
     */
    clear() {
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
    has(key) {
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
    forEach(callback = (...args) => { }, context) {
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
    methodCall(method, ...args) {
        this.forEach((item) => {
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
    async asyncMethodCall(method, ...args) {
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
export class Storage extends Manager {
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
    set(key, value) {
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
    add(value) {
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
    values() {
        return this.list.values();
    }
}
/**
 * The base class for all AdvancedManager and AdvancedStorage items
 *
 * @export
 * @class ManagerItem
 */
export class ManagerItem {
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
    /**
     * Run after the Manager Item has been registered
     *
     * @returns any
     * @memberof ManagerItem
     */
    install() { }
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
export class AdvancedManager extends Manager {
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
        value.register(this);
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
 * A tweak to the Storage class that makes it self aware of the App class it's instantiated in
 *
 * @export
 * @class AdvancedStorage
 * @extends {Storage<V>}
 * @template V
 */
export class AdvancedStorage extends Storage {
    /**
     * Creates an instance of AdvancedStorage.
     *
     * @param {App} app - The instance of the App class, the Manager is instantiated in
     * @memberof AdvancedStorage
     */
    constructor(app) {
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
    set(key, value) {
        super.set(key, value);
        value.register && value.register(this);
        return this;
    }
    /**
     * Returns the instance the App class
     *
     * @returns App
     * @memberof AdvancedStorage
     */
    getApp() {
        return this.app;
    }
    /**
     * Returns the App config
     *
     * @param {...any} args
     * @returns any
     * @memberof AdvancedStorage
     */
    getConfig(...args) {
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
     * Compares the pathnames of two URLs to each other
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
export const newURL = new _URL();
export const URLString = newURL.getPathname();
/**
 * A quick snapshot of page coordinates, e.g. scroll positions
 *
 * @export
 * @class Coords
 * @implements {ICoords}
 */
export class Coords {
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
export class State {
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
 * @extends {Storage<State>}
 */
export class HistoryManager extends Storage {
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
    addState(value) {
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
 * @extends {AdvancedStorage<Service>}
 */
export class ServiceManager extends AdvancedStorage {
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
 * Represents a new event listener consisting of properties like: callback, scope, name
 *
 * @export
 * @class Listener
 */
export class Listener {
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
 * @extends {Storage<Listener>}
 */
export class Event extends Storage {
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
export class EventEmitter extends Manager {
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
            let i = 0, len = event.size(), value;
            let listener = new Listener({ name, callback, scope });
            for (; i < len; i++) {
                value = event.get(i);
                console.log(value);
                if (value.getCallback() === listener.getCallback() &&
                    value.getScope() === listener.getScope())
                    break;
            }
            event.remove(i);
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
                this.remove(_name);
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
 * Parses strings to DOM
 */
export const PARSER = new DOMParser();
/**
 * A page represents the DOM elements that create each page
 *
 * @export
 * @class Page
 */
export class Page extends ManagerItem {
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
export class PageManager extends AdvancedManager {
    /**
     * Creates an instance of the PageManager
     *
     * @param {App} app
     * @memberof PageManager
     */
    constructor(app) {
        super(app);
        /**
         * Stores all URL's that are currently loading
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
     * Load from cache or by requesting URL via a fetch request, avoid reqesting for the same thing twice by storing the fetch request in "this.loading"
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
        this.loading.remove(urlString);
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
/**
 * Controls the animation between pages
 *
 * @export
 * @class Transition
 */
export class Transition extends ManagerItem {
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
    async start(EventEmiiter) {
        let fromWrapper = this.oldPage.getWrapper();
        let toWrapper = this.newPage.getWrapper();
        document.title = this.newPage.getTitle();
        return new Promise(async (finish) => {
            EventEmiiter.emit("BEFORE_TRANSITION_OUT");
            await new Promise(done => {
                let outMethod = this.out({
                    from: this.oldPage,
                    trigger: this.trigger,
                    done
                });
                if (outMethod instanceof Promise)
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
                let inMethod = this.in({
                    from: this.oldPage,
                    to: this.newPage,
                    trigger: this.trigger,
                    done
                });
                if (inMethod instanceof Promise)
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
export class TransitionManager extends AdvancedManager {
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
export class Block extends Service {
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
export class BlockIntent extends ManagerItem {
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
 * @extends {ServiceManager}
 */
export class BlockManager extends AdvancedStorage {
    /**
     * Creates an instance of BlockManager.
     *
     * @param {App} app
     * @memberof BlockManager
     */
    constructor(app) {
        super(app);
        this.activeBlocks = new AdvancedStorage(app);
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
export class App {
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
     * A shortcut to the App EventEmiiter on method
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
     * A shortcut to the App EventEmiiter off method
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
     * A shortcut to the App EventEmiiter once method
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
     * A shortcut to the App EventEmiiter emit method
     *
     * @param {string} events
     * @param {...any} args
     * @returns App
     * @memberof App
     */
    emit(events, ...args) {
        this.emitter.emit(events, args);
        return this;
    }
}
//# sourceMappingURL=api.js.map