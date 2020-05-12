// The config variables
export const CONFIG = {
    wrapperAttr: "wrapper",
    noAjaxLinkAttr: "no-ajax-link",
    noPrefetchAttr: "no-prefetch",
    headers: [
        ["x-partial", "true"]
    ],
    timeout: 30000
};
/**
 * Converts string into data attributes
 *
 * @param {string} value
 */
export const toAttr = (value) => `[data-${value}]`;
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
     * @returns {Map<K, V>}
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
     * @returns IterableIterator<K>
     */
    keys() {
        return this.list.keys();
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
     * @public
     * @param {Number} [distance=0] - Distance from the last item in the Manager
     * @returns V
     */
    last(distance = 0) {
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
        return this.last(1);
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
     * @returns Boolean
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
     * Returns the instance the App class
     *
     * @returns App
     * @memberof AdvancedManager
     */
    getApp() {
        return this.app;
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
        let size = this.size() + 1;
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
     * Returns the instance the App class
     *
     * @returns App
     * @memberof AdvancedStorage
     */
    getApp() {
        return this.app;
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
     * @param {(string | _URL | URL | Location)} [url=window.location]
     * @memberof _URL
     */
    constructor(url = window.location) {
        super(url.toString());
    }
    /**
     * Returns the _URL's hostname and pathname as a string
     *
     * @returns string
     * @memberof _URL
     */
    toStr() {
        return `${this.host}${this.pathname}`;
    }
    /**
     * Removes the hash from the URL for a clean URL string
     *
     * @returns string
     * @memberof _URL
     */
    clean() {
        return this.toStr().replace(/#.*/, "");
    }
    /**
     * Compares this clean **_URL** to another clean **_URL**
     *
     * @param {_URL} url
     * @returns boolean
     * @memberof _URL
     */
    compare(url) {
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
    static compare(a, b) {
        return a.compare(b);
    }
}
/**
 * This is the default starting URL, to avoid needless instances of the same class that produce the same value, I defined the default value
 */
export const newURL = new _URL();
export const URLString = newURL.clean();
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
     *         url = newURL,
     *         index = 0,
     *         transition = "none",
     *         data = {
     *             scroll: new StateCoords(),
     *             trigger: "HistoryManager",
     *             event: "ReplaceState"
     *         }
     *     }
     * @memberof State
     */
    constructor({ url = newURL, index = 0, transition = "none", data = {
        scroll: new Coords(),
        trigger: "HistoryManager",
        event: "ReplaceState",
    } }) {
        this.state = { index, url, transition, data };
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
     * @returns IState
     * @memberof State
     */
    toJSON() {
        return this.state;
    }
}
/**
 * History of the site, stores only the State class
 *
 * @export
 * @class HistoryManager
 * @extends {AdvancedStorage<State>}
 */
export class HistoryManager extends AdvancedStorage {
    /**
     * Creates an instance of the HistoryManager class, which inherits properties and methods from the Storage class.
     *
     * @param {App} app
     * @memberof HistoryManager
     * @constructor
     */
    constructor(app) {
        super(app);
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
        state.setIndex(index);
        super.add(state);
        return this;
    }
    /**
     * Quick way to add a State to the HistoryManager
     *
     * @param {IState} value
     * @returns HistoryManager
     * @memberof HistoryManager
     */
    addItem(value) {
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
export class Service {
    /**
     * Method is run once when Service is installed on a ServiceManager
     *
     * @param {IService} {
     *         PageManager,
     *         EventEmitter,
     *         HistoryManager,
     *         ServiceManager,
     *         TransitionManager
     *     }
     * @memberof Service
     */
    install({ PageManager, EventEmitter, HistoryManager, ServiceManager, TransitionManager, }) {
        this.PageManager = PageManager;
        this.EventEmitter = EventEmitter;
        this.HistoryManager = HistoryManager;
        this.ServiceManager = ServiceManager;
        this.TransitionManager = TransitionManager;
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
 * A service that interacts with the DOM
 *
 * @abstract
 * @extends {Service}
 */
export class Component extends Service {
    /**
     * Creates an instance of Component.
     *
     * @param {string} query
     * @memberof Component
     */
    constructor(query) {
        super();
        /**
         * The Component name
         *
         * @protected
         * @type string
         * @memberof Component
         */
        this.name = "Component";
        this.query = query;
        this.el = document.querySelectorAll(this.query);
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
 * @extends {AdvancedManager<Event>}
 */
export class EventEmitter extends AdvancedManager {
    /**
     * Creates an instance of EventEmitter.
     *
     * @param {App} app
     * @memberof EventEmitter
     */
    constructor(app) {
        super(app);
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
     * @param {(string | object | Array<any>)} events
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
    removeListener(name, callback, scope) {
        let event = this.getEvent(name);
        if (callback) {
            let i = 0, len = event.size(), value;
            let listener = new Listener({ name, callback, scope });
            for (; i < len; i++) {
                value = event.get(i);
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
     * @param {(string | object | Array<any>)} events
     * @param {ListenerCallback} callback
     * @param {object} scope
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
     * @param {(string | object | Array<any>)} events
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
     * @param {Array<any>} [args=[]]
     * @returns EventEmitter
     * @memberof EventEmitter
     */
    emit(events, args = []) {
        // If there is no event break
        if (typeof events == "undefined")
            return this;
        // Create a new event every space
        if (typeof events == "string")
            events = events.split(/\s/g);
        // Loop through the list of events
        events.forEach((event) => {
            let listeners = this.getEvent(event);
            listeners.forEach((listener) => {
                let { callback, scope } = listener.toJSON();
                callback.apply(scope, args);
            });
        }, this);
        return this;
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
     * Creates an instance of a ServiceManager
     *
     * @param {App} app
     * @memberof ServiceManager
     * @constructor
     */
    constructor(app) {
        super(app);
    }
    /**
     * Calls the method of the same method name for all service that are currently installed
     *
     * @param {string} method
     * @param {Array<any>} [args=[]]
     * @returns
     * @memberof ServiceManager
     */
    methodCall(method, ...args) {
        this.forEach((service) => {
            service[method].call(this, ...args);
        });
        return this;
    }
    /**
     * Call the install method for all Services
     *
     * @returns ServiceManager
     * @memberof ServiceManager
     */
    install() {
        const { getPages, getEmitter, getHistory, getServices, getTransitions, } = this.getApp();
        return this.methodCall("install", {
            PageManager: getPages(),
            EventEmitter: getEmitter(),
            HistoryManager: getHistory(),
            ServiceManager: getServices(),
            TransitionManager: getTransitions(),
        });
    }
    /**
     * Call the install boot for all Services
     *
     * @returns ServiceManager
     * @memberof ServiceManager
     */
    boot() {
        return this.methodCall("boot");
    }
    /**
     * Call the install initEvents for all Services
     *
     * @returns ServiceManager
     * @memberof ServiceManager
     */
    initEvents() {
        return this.methodCall("initEvents");
    }
    /**
     * Call the install stopEvents for all Services
     *
     * @returns ServiceManager
     * @memberof ServiceManager
     */
    stopEvents() {
        return this.methodCall("stopEvents");
    }
    /**
     * Call the install stop for all Services
     *
     * @returns ServiceManager
     * @memberof ServiceManager
     */
    stop() {
        return this.methodCall("stop");
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
export class Page {
    /**
     * Creates an instance of Page, it also creates a new page from response text, or a Document Object
     *
     * @param {_URL} [url=newURL]
     * @param {(string | Document)} [dom=document]
     * @memberof Page
     */
    constructor(url = newURL, dom = document) {
        this.url = url;
        if (typeof dom == "string") {
            this.dom = PARSER.parseFromString(dom, "text/html");
        }
        else
            this.dom = dom || document;
        const { title, head, body } = this.dom;
        this.title = title;
        this.head = head;
        this.body = body;
        this.wrapper = this.body.querySelector(toAttr(CONFIG.wrapperAttr));
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
     * @returns Element
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
 * Controls the animation between pages
 *
 * @export
 * @class Transition
 */
export class Transition {
    constructor() {
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
     * @memberof Transition
     */
    init({ oldPage, newPage, trigger }) {
        this.oldPage = oldPage;
        this.newPage = newPage;
        this.trigger = trigger;
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
     * @param {ITransitionData} { from, to, trigger, done }
     * @memberof Transition
     */
    out({ from, to, trigger, done }) {
        return done();
    }
    /**
     * Transition into the next page
     *
     * @param {ITransitionData} { from, trigger, done }
     * @memberof Transition
     */
    in({ from, trigger, done }) {
        return done();
    }
}
/**
 * Controls which animation between pages to use
 *
 * @export
 * @class TransitionManager
 * @extends {AdvancedManager<Transition>}
 */
export class TransitionManager extends AdvancedManager {
    /**
     * Creates an instance of the TransitionManager
     *
     * @param {App} app
     * @memberof TransitionManager
     * @constructor
     */
    constructor(app) {
        super(app);
    }
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
}
/**
 * Controls which page to be load
 *
 * @export
 * @class PageManager
 * @extends {AdvancedManager<Page>}
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
        this.set(URLString, new Page());
    }
    /**
     * Starts a fetch request
     *
     * @param {string} url
     * @returns Promise<string>
     * @memberof PageManager
     */
    async request(url) {
        const headers = new Headers(CONFIG.headers);
        const timeout = window.setTimeout(() => {
            window.clearTimeout(timeout);
            throw "Request Timed Out!";
        }, CONFIG.timeout);
        try {
            let response = await fetch(url, {
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
    /**
     * Load from cache or by requesting URL via a fetch request
     *
     * @param {(_URL | string)} [_url=newURL]
     * @returns Promise<Page>
     * @memberof PageManager
     */
    async load(_url = newURL) {
        let url = _url instanceof URL ? _url : new _URL(_url);
        let urlString = url.clean();
        let page;
        if (this.has(urlString)) {
            page = this.get(urlString);
            return Promise.resolve(page);
        }
        try {
            let response = await this.request(urlString);
            page = new Page(url, response);
            this.set(urlString, page);
            return page;
        }
        catch (err) {
            console.error(err);
        }
    }
}
/**
 * The App class starts the entire process, it controls all managers and all services
 *
 * @export
 * @class App
 */
export default class App {
    /**
     * Creates an instance of App
     *
     * @memberof App
     */
    constructor() {
        this.history = new HistoryManager(this);
        this.transitions = new TransitionManager(this);
        this.services = new ServiceManager(this);
        this.emitter = new EventEmitter(this);
        this.pages = new PageManager(this);
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
     * @param {string} type
     * @param {*} key
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
            default:
                throw `Error: can't get type '${type}', it is not a recognized type. Did you spell it correctly.`;
        }
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
        this.history.addItem(state);
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
     * Based on the type, it will add either a Transition, a Service, or a State to their respective Managers
     *
     * @param {string} type
     * @param {*} value
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
            default:
                throw `Error: can't add type '${type}', it is not a recognized type. Did you spell it correctly.`;
        }
        return this;
    }
    /**
     * A shortcut to the App EventEmiiter on method
     *
     * @param {string} events
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
     * @param {string} events
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