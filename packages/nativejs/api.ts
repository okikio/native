// The config variables
const Config = {
    wrapper: "",
    anchorLink: "a"
};


/**
 * Manages complex lists of named data, eg. A page can be stored in a list by of other pages with the url being how the page is stored in the list. Managers use Maps to store data.
 *
 * @export
 * @class Manager
 * @template T
 */
export class Manager<T> {
    /**
     * The complex list of named data, to which the Manager controls
     *
     * @protected
     * @type {Map<any, T>}
     * @memberof Manager
     */
    protected list: Map<any, T>;

    /**
     * Creates an instance of the Manager class.
     *
     * @memberof Manager
     * @constructor
     */
    constructor () {
        this.list = new Map();
    }

    /**
     * Returns the Manager class's list
     *
     * @returns {Map<any, T>}
     * @memberof Manager
     */
    public getList(): Map<any, T> {
        return this.list;
    }

    /**
     * Get a value stored in the Manager
     *
     * @public
     * @param  {*} key - The key to find in the Manager's list
     * @return {T}
     */
    public get (key: any): T {
        return this.list.get(key);
    }

    /**
     * Set a value stored in the Manager
     *
     * @public
     * @param  {*} key - The key where the value will be stored
     * @param  {T} value - The value to store
     * @return {Manager<T>}
     */
    public set (key: any, value: T): Manager<T> {
        this.list.set(key, value);
        return this;
    }

    /**
     * Returns the keys of all items stored in the Manager
     *
     * @public
     * @return {IterableIterator<any>}
     */
    public keys (): IterableIterator<any> {
        return this.list.keys();
    }

    /**
     * Returns the total number of items stored in the Manager
     *
     * @public
     * @return {Number}
     */
    public size (): number {
        return this.list.size;
    }

    /**
     * Returns the last item in the Manager who's index is a certain distance from the last item in the Manager
     *
     * @public
     * @param {Number} [distance=0] - Distance from the last item in the Manager
     * @return {T}
     */
    public last (distance: number = 0): T {
        let size = this.size();
        let key = this.keys()[size - distance];
        return this.get(key);
    }

    /**
     * Returns the second last item in the Manager
     *
     * @public
     * @return {T}
     */
    public prev (): T {
        return this.last(1);
    }

    /**
     * Removes a value stored in the Manager, via the key
     *
     * @public
     * @param  {*} key - The key for the key value pair to be removed
     * @return {Manager<T>}
     */
    public remove (key: any): Manager<T> {
        this.list.delete(key);
        return this;
    }

    /**
     * Clear the Manager of all its contents
     *
     * @public
     * @return {Manager<T>}
     */
    public clear (): Manager<T> {
        this.list.clear();
        return this;
    }

    /**
     * Checks if the Manager contains a certain key
     *
     * @public
     * @param {*} key
     * @return {Boolean}
     */
    public has (key: any): boolean {
        return this.list.has(key);
    }
}

/**
 * A tweak to the Manager class that makes it self aware of the App class it's instantiated in
 *
 * @export
 * @class AdvancedManager
 * @extends {Manager<T>}
 * @template T
 */
export class AdvancedManager<T> extends Manager<T> {
    /**
     * The instance of the App class, the Manager is instantiated in
     *
     * @private
     * @type {App}
     * @memberof AdvancedManager
     */
    private app: App;

    /**
     * Creates an instance of AdvancedManager.
     *
    * @param {App} app - The instance of the App class, the Manager is instantiated in
     * @memberof AdvancedManager
     */
    constructor (app: App) {
        super();
        this.app = app;
    }

    /**
     * Returns the instance the App class
     *
     * @returns {App}
     * @memberof AdvancedManager
     */
    public getApp(): App {
        return this.app;
    }
}

/**
 * Controls lists of a certain type that follow chronological order, meant for the History class. Storage use Sets to store data.
 *
 * @export
 * @class Storage
 * @extends {Manager<T>}
 * @template T
 */
export class Storage<T> extends Manager<T> {
    /**
     * Creates an instance of Storage.
     *
     * @memberof Storage
     */
    constructor() {
        super();
    }

    /**
     * Get a value stored in Storage, the key must be a number though.
     *
     * @param {number} key
     * @returns {T}
     * @memberof Storage
     */
    public get (key: number): T {
        return super.get(key);
    }

    /**
     * Sets a value in the **Storage** class
     *
     * @param {number} key
     * @param {T} value
     * @returns {Storage<T>}
     * @memberof Storage
     */
    public set (key: number, value: T): Storage<T> {
        super.set(key, value);
        return this;
    }

    /**
     * Adds a value to Storage
     *
     * @public
     * @param  {T} value
     * @return {Storage<T>}
     */
    public add (value: T): Storage<T> {
        let size = this.size() + 1;
        this.set(size, value);
        return this;
    }

    /**
     * Lists all values stored in Storage.
     *
     * @returns {IterableIterator<T>}
     * @memberof Storage
     */
    public values (): IterableIterator<T> {
        return this.list.values();
    }
}

/**
 * A tweak to the Storage class that makes it self aware of the App class it's instantiated in
 *
 * @export
 * @class AdvancedStorage
 * @extends {Storage<T>}
 * @template T
 */
export class AdvancedStorage<T> extends Storage<T> {
    /**
     * The instance of the App class, the Manager is instantiated in
     *
     * @private
     * @type {App}
     * @memberof AdvancedStorage
     */
    private app: App;

    /**
     * Creates an instance of AdvancedStorage.
     *
     * @param {App} app - The instance of the App class, the Manager is instantiated in
     * @memberof AdvancedStorage
     */
    constructor (app: App) {
        super();
        this.app = app;
    }

    /**
     * Returns the instance the App class
     *
     * @returns {App}
     * @memberof AdvancedStorage
     */
    public getApp(): App {
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
     * @param {string} [url=window.location.toString()]
     * @memberof _URL
     */
    constructor (url: string = window.location.toString()) {
        super(url);
    }

    /**
     * Removes the hash from the URL for a clean URL string
     *
     * @returns {string}
     * @memberof _URL
     */
    public clean (): string {
        return this.toString().replace(/#.*/, '');
    }

    /**
     * Compares this clean **_URL** to another clean **_URL**
     *
     * @param {_URL} url
     * @returns {boolean}
     * @memberof _URL
     */
    public compare (url: _URL): boolean {
        return this.clean() == url.clean();
    }

    /**
     * Compares two clean URLs to each other
     *
     * @static
     * @param {_URL} a
     * @param {_URL} b
     * @returns {boolean}
     * @memberof _URL
     */
    static compare (a: _URL, b: _URL): boolean {
        return a.compare(b);
    }
}

export type LinkEvent = MouseEvent | TouchEvent | "ReplaceState";
export type Trigger = HTMLAnchorElement | "HistoryManager" | 'back' | 'forward';

export interface IStateCoords {
    x: number,
    y: number
}

export interface IStateData {
    scroll: IStateCoords,
    trigger: Trigger,
    event: LinkEvent
}

export interface IState {
    url: _URL,
    transition: string,
    data: IStateData
}

/**
 * A quick snapshot of the scroll positions in a State
 *
 * @export
 * @class StateCoords
 * @implements {IStateCoords}
 */
export class StateCoords implements IStateCoords {
    public x: number;
    public y: number;

    /**
     * Creates an instance of StateCoords.
     * @memberof StateCoords
     */
    constructor() {
        this.x = window.scrollX;
        this.y = window.scrollY;
    }
}

/**
 * Represents the current status of the page consisting of properties like: url, transition, data
 *
 * @export
 * @class State
 */
export class State {
    /**
     * The current state data
     *
     * @private
     * @type {IState}
     * @memberof State
     */
    private state: IState;

    /**
     * Creates an instance of State.
     * @param {IState} {
     *         url = new _URL(),
     *         transition = "none",
     *         data = {
     *             scroll: new StateCoords(),
     *             trigger: "HistoryManager",
     *             event: "ReplaceState"
     *         }
     *     }
     * @memberof State
     */
    constructor({
        url = new _URL(),
        transition = "none",
        data = {
            scroll: new StateCoords(),
            trigger: "HistoryManager",
            event: "ReplaceState"
        }
    }: IState) {
        this.state = { url, transition, data };
    }

    /**
     * Get state URL
     *
     * @returns {_URL}
     * @memberof State
     */
    public getURL(): _URL {
        return this.state.url;
    }

    /**
     * Get state transition
     *
     * @returns {string}
     * @memberof State
     */
    public getTransition(): string {
        return this.state.transition;
    }

    /**
     * Get state data
     *
     * @returns {IStateData}
     * @memberof State
     */
    public getData(): IStateData {
        return this.state.data;
    }

    /**
     * Returns the State as an Object
     *
     * @returns {IState}
     * @memberof State
     */
    public toJSON (): IState {
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
export class HistoryManager extends AdvancedStorage<State> {
    /**
     * Creates an instance of the HistoryManager class, which inherits properties and methods from the Storage class.
     *
     * @param {App} app
     * @memberof HistoryManager
     * @constructor
     */
    constructor (app: App) {
        super(app);
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
     * Stores the App class's EventEmitter
     *
     * @protected
     * @type {EventEmitter}
     * @memberof Service
     */
    protected emitter: EventEmitter;

    /**
     * Method is run once when Service is installed on a ServiceManager
     *
     * @param {EventEmitter} emitter
     * @memberof Service
     */
    public install (emitter: EventEmitter): void {
        this.emitter = emitter;
    }

    // Called on start of Service
    public boot (): void {}

    // Initialize events
   public initEvents (): void {}

    // Stop events
    public stopEvents (): void {}

    // Stop services
    public stop (): void {
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
     * Stores the elements the Component is going to act on
     *
     * @type {NodeListOf<Element>}
     * @memberof Component
     */
    public el: NodeListOf<Element>;

    /**
     * Stores the query to find the Elements the Component is going to act on
     *
     * @type {String}
     * @memberof Component
     */
    public query: string;

    /**
     * Creates an instance of Component.
     *
     * @param {string} query
     * @memberof Component
     */
    constructor (query: string) {
        super();
        this.query = query;
        this.el = document.querySelectorAll(this.query);
    }
}

/**
 * A service that interacts with the DOM
 *
 * @abstract
 * @extends {Component}
 */
export class AnchorLink extends Component {
    linkHash: any;
    /**
     * Creates an instance of the Component AnchorLink
     *
     * @memberof AnchorLink
     * @constructor
     */
    constructor() {
        super(Config.anchorLink);
    }

    /**
     * Callback called from click event.
     *
     * @private
     * @param {MouseEvent} evt
     */
    onClick (evt: MouseEvent) {
        /**
         * @type {HTMLElement|Node|EventTarget}
         */
        let el: HTMLElement | Node | EventTarget = evt.target;

        // Go up in the node list until we  find something with an href
        while (el && !this.getHref(el)) {
          el = el.parentNode;
        }

        if (this.preventCheck(evt, el)) {
          evt.preventDefault();
          this.linkHash = el.hash.split('#')[1];
          const href = this.getHref(el);
          const transitionName = this.getTransitionName(el);
          const cursorPosition = {
            x: evt.clientX,
            y: evt.clientY
          };
          this.goTo(href, transitionName, el, cursorPosition);
          this.emitter.emit("anchor:click", [evt, this]);
        }
    }
    getHref(el: HTMLElement | Node | EventTarget) {
        throw new Error("Method not implemented.");
    }
    preventCheck(evt: MouseEvent, el: HTMLElement | Node | EventTarget) {
        throw new Error("Method not implemented.");
    }
    getTransitionName(el: HTMLElement | Node | EventTarget) {
        throw new Error("Method not implemented.");
    }
    goTo(href: any, transitionName: any, el: HTMLElement | Node | EventTarget, cursorPosition: { x: number; y: number; }) {
        throw new Error("Method not implemented.");
    }

    /**
     * Callback called from click event.
     *
     */
    // Initialize events
    initEvents () {
        // If the browser starts
        document.addEventListener("click", this.onClick.bind(this));
    }

    // Stop events
    stopEvents () {}
}

export type ListenerCallback = (...args: any) => {} | object;
export interface IListener {
    callback: ListenerCallback,
    scope: object,
    name: string
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
     * @type {IListener}
     * @memberof Listener
     */
    private listener: IListener;

    /**
     * Creates a new instance of a Listener
     *
     * @param    {Object}
     *    - callback = [Function]
     *    - scope = [Object*]
     *    - name = [String]
     * @memberof Listener
     * @constructor
     */
    constructor({ callback = () => { }, scope = null, name = "event" }: IListener) {
        this.listener = { callback, scope, name };
    }

    /**
     * Returns the callback Function of the Listener
     *
     * @returns {ListenerCallback}
     * @memberof Listener
     */
    public getCallback (): ListenerCallback {
        return this.listener.callback;
    }

    /**
     * Returns the scope as an Object, from the Listener
     *
     * @returns {object}
     * @memberof Listener
     */
    public getScope (): object {
        return this.listener.scope;
    }

    /**
     * Returns the event as a String, from the Listener
     *
     * @returns {string}
     * @memberof Listener
     */
    public getEventName (): string {
        return this.listener.name;
    }

    /**
     * Returns the listener as an Object
     *
     * @returns {IListener}
     * @memberof Listener
     */
    public toJSON (): IListener {
        return this.listener;
    }
}

/**
 * Represents a new event listener consisting of properties like: callback, scope, name
 *
 * @abstract
 * @extends {Class}
 */
export class Event extends Storage<Listener> {
    /**
     * The name of the event
     *
     * @private
     * @type {string}
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
 * @abstract
 * @extends {Manager}
 */
export class EventEmitter extends Manager<Event> {
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
     * @public
     * @param {String} name
     * @return {Event}
     */
    // Get event, ensure event is valid
    public getEvent (name: string): Event {
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
     * @returns {Event}
     * @memberof EventEmitter
     */
    public newListener (name: string, callback: ListenerCallback, scope: object): Event {
        let event = this.getEvent(name);
        event.add(new Listener({ name, callback, scope }));
        return event;
    }

    /**
     * Adds a listener for a given event
     *
     * @param {(string | object)} events
     * @param {ListenerCallback} callback
     * @param {object} scope
     * @returns
     * @memberof EventEmitter
     */
    public on (events: string | object, callback: ListenerCallback, scope: object): EventEmitter {
        // If there is no event break
        if (typeof events == "undefined") return this;

         // Create a new event every space
        if (typeof events == "string") events = events.split(/\s/g);

        let _name: string;
        let _callback: ListenerCallback;
        let _scope: object;

        // Loop through the list of events
        Object.keys(events).forEach(key => {
            // Select the name of the event from the list
            // Remember events can be {String | Object}

            // Check If events is an Object (JSON like Object, and not an Array)
            if (typeof events == "object" && !Array.isArray(events)) {
                _name = key; _callback = events[key]; _scope = callback;
            } else {
                _name = events[key]; _callback = callback; _scope = scope;
            }

            this.newListener(_name, _callback, _scope);
        }, this);
        return this;
    }

    /**
     * Removes an event listener from an event
     *
     * @public
     * @param {String} name
     * @param {Function} callback
     * @param {Object*} scope
     * @return {Array}
     */
    // Remove an event listener
    public removeListener (name: string, callback: Function, scope): Array<any> {
        let event = this.getEvent(name);

        if (callback) {
            let i = 0, len = event.length, value;
            let listener = new Listener({ name, callback, scope });
            for (; i < len; i ++) {
                value = event[i];
                if (value.callback === listener.callback &&
                    value.scope === listener.scope)
                    break;
            }

            event.splice(i, 1);
        } else this.remove(name);
        return event;
    }

    /**
     * Removes a listener for a given event
     *
     * @param {String|Object|Array} events
     * @param {Function*} callback
     * @param {Object*} scope
     */
    off (events: string | object | Array<any>, callback, scope) {
        // If there is no event break
        if (typeof events == "undefined") return this;

         // Create a new event every space
        if (typeof events == "string") events = events.split(/\s/g);

        let event;
        // Loop through the list of events
        Object.keys(events).forEach(key => {
            // Select the name of the event from the list
            // Remember events can be {String | Object | Array}
            event = events[key];

            // Check If events is an Object (JSON like Object, and not an Array)
            if (typeof events == "object" && !Array.isArray(events)) {
                this.removeListener(key, event, callback);
            } else {
                this.removeListener(event, callback, scope);
            }
        }, this);
        return this;
    }

    /**
     * Adds a one time event listener for an event
     *
     * @param {String|Object|Array} events
     * @param {Function*} callback
     * @param {Object*} scope
     */
    once (events: string | object | Array<any>, callback, scope) {
        // If there is no event break
        if (typeof events == "undefined") return this;

         // Create a new event every space
        if (typeof events == "string") events = events.split(/\s/g);

        let onceFn = (...args) => {
            this.off(events, onceFn, scope);
            callback.apply(scope, args);
        };

        this.on(events, onceFn, scope);
        return this;
    }

    /**
     * Call all listener within an event
     *
     * @param {String|Array} events
     * @param {Array} [args = []]
     */
    emit (events: string | Array<any>, args: Array<any> = []) {
        // If there is no event break
        if (typeof events == "undefined") return this;

         // Create a new event every space
        if (typeof events == "string") events = events.split(/\s/g);

        // Loop through the list of events
        events.forEach(event => {
            let listeners = this.getEvent(event);
            listeners.forEach(listener => {
                let { callback, scope } = listener.toJSON();
                callback.apply(scope, args);
            });
        }, this);
        return this;
    }
}

/**
 * The Service Manager controls the lifecycle of all services of a website
 *
 * @abstract
 * @extends {Storage<Service>}
 */
export class ServiceManager extends Storage<Service> {
    #type = Service;

    /**
     * Creates an instance of a ServiceManager
     *
     * @param {App} app
     * @memberof ServiceManager
     * @constructor
     */
    constructor (app: App) {
        super(app);
    }

    _callForEach (fn, args = []) {
        return this.each(service => {
            service[fn](...args);
        });
    }

    install () {
        return this._callForEach("install");
    }

    boot () {
        return this._callForEach("boot");
    }

    initEvents (emitter) {
        return this._callForEach("initEvents", emitter);
    }

    stopEvents (emitter) {
        return this._callForEach("stopEvents", emitter);
    }
}

/**
 * A page represents the DOM elements that create each page
 *
 * @abstract
 * @extends {Class}
 */
export class Page {
    #class = "Page";
    mata: any[];
    dom: any;
    container: any;
    title: string;
    head: any;
    body: any;
    meta: any;
    /**
     * Creates a new page from response text, or a Document Object
     *
     * @param {_URL} url
     * @param {String | Document} dom
     * @memberof ServiceManager
     * @constructor
     */
    constructor (dom: string | Document) {
        /**
         * The meta tags of each page
         *
         * @type {NodeList}
         */
        this.mata = [];

        /**
         * The DOM of the current page
         *
         * @type {Document}
         */
        this.dom = null;

        /**
         * The container to replace between pages
         *
         * @type {HTMLElement}
         */
        this.container = null;

        /**
         * The url of the current page
         *
         * @type {String}
         */
        this.title = "";

        /**
         * The head element of the current page
         *
         * @type {HTMLElement}
         */
        this.head = null;

        /**
         * The body element of the current page
         *
         * @type {HTMLElement}
         */
        this.body = null;

        this.parse(dom);
    }

    parse (dom) {
        if (typeof dom == "string") {
            const parser = new DOMParser();
            this.dom = parser.parseFromString(dom, 'text/html');
        } else {
            this.dom = dom || document;
        }

        this.title = Page.getTitle(this.dom);
        this.meta = Page.getMeta(this.dom);
        this.head = Page.getHead(this.dom);
        this.body = Page.getBody(this.dom);
        this.container = Page.getContainer(this.dom);
        return this;
    }

    static getTitle (dom) { return dom.title; }
    static getHead (dom) { return dom.head; }
    static getBody (dom) { return dom.body; }

    static getMeta (dom) {
        return Page.getHead(dom).querySelectorAll("meta");
    }

    static getContainer (dom) {
        return Page.getBody(dom).querySelector(Config.container);
    }

    getTitle () { return this.title; }
    getMeta () { return this.meta; }
    getContainer () { return this.container; }
    getDOM () { return this.dom; }
}

/**
 * Controls the animation between pages
 *
 * @abstract
 * @extends {Class}
 */
export class Transition {
    #class = "Transition";
    /**
     * Transition name
     *
     * @type {String}
     */
    name: string = "Transition";

    // Based off the highwayjs Transition class
    out ({ from, trigger, done })
        { return done(); }

    in ({ from, to, trigger, done })
        { return done(); }
}

/**
 * Controls which animation between pages to use
 *
 * @abstract
 * @extends {Manager}
 */
export class TransitionManager extends Manager {
    #class = "TransitionManager";
    #type = Transition;

    /**
     * Creates an instance of the TransitionManager
     *
     * @param {App} $app
     * @memberof TransitionManager
     * @constructor
     */
    constructor ($app: App) {
        super($app);
    }

    show (name, oldPage, newPage) {
        let transition = this.get(name);
        return new Promise(resolve => {
            transition.in({ from: oldPage, to: newPage, done: resolve });
        });
    }

    hide (name, oldPage) {
        let transition = this.get(name);
        return new Promise(resolve => {
            transition.out({ from: oldPage, done: resolve });
        });
    }
}

/**
 * Controls which page to be loaded
 *
 * @abstract
 * @extends {Manager}
 */
// Also know as the page cache
export class PageManager extends Manager {
    #class = "PageManager";

    /**
     * Creates an instance of the PageManager
     *
     * @param {App} app
     * @memberof PageManager
     * @constructor
     */
    constructor (app: App) {
        super(app);

        this.set(new _URL(), new Page());
    }

    load (url) {
        return new Promise(resolve => {
            if (this.has(url)) {
                let _page = this.get(url);
                resolve(_page);
                return;
            }

            this.request(url)
                .then(response => {
                    let _url = new _URL(url);
                    let _page = new Page(response);
                    this.set(_url, _page);

                    return resolve(_page);
                });
        });
    }

    request (url) {
        return new Promise((resolve, reject) => {
            const headers = new Headers([
                ["X-Partial", "true"]
            ]);

            const timeout = window.setTimeout(() => {
                window.clearTimeout(timeout);
                reject("Request Timed Out!");
            }, Config.timeout);

            fetch(url, {
                method: 'GET',
                headers: headers,
                cache: 'default',
                credentials: 'same-origin'
            }).then(response => {
                window.clearTimeout(timeout);

                if (response.status >= 200 && response.status < 300) {
                    return resolve(res.text());
                }

                const err = new Error(res.statusText || res.status);
                return reject(err);
            }).catch(err => {
                window.clearTimeout(timeout);
                reject(err);
            });
        });
    }
}

export class App {
    #class = "App";
    history: HistoryManager;
    transitions: TransitionManager;
    services: ServiceManager;
    emitter: EventEmitter;
    pages: PageManager;
    constructor () {
        this.history = new HistoryManager(this);
        this.transitions = new TransitionManager(this);
        this.services = new ServiceManager(this);
        this.emitter = new EventEmitter(this);
        this.pages = new PageManager(this);
    }

    addService (service) {
        this.services.add(service);
        return this;
    }

    addTransition (service) {
        this.services.add(service);
        return this;
    }

    add (type, value) {
        switch (type) {
            case "service":
                this.addService(value);
                break;
            case "transition":
                this.addTransition(value);
                break;
        }
    }

    on (events, callback) {
        this.emitter.on(events, callback, this);
        return this;
    }

    off (events, callback) {
        this.emitter.off(events, callback, this);
        return this;
    }

    once (events, callback) {
        this.emitter.once(events, callback, this);
        return this;
    }

    emit (events, args) {
        this.emitter.emit(events, args);
        return this;
    }
}