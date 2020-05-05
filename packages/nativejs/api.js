// Checks if an error has occurred and throws a detailed message for ease of debugging
const ErrorCheck = {
    /**
     * Throws a message using its parameters to create a detailed formatted message
     *
     * @param {String} _class
     * @param {String} method
     * @param {String} message
     */
    throw (_class, method, message) {
        throw `${_class}.${method}: ${message}.`;
    },

    /**
     * Checks to see if a value is of a certain type else throws an error message
     *
     * @param  {any*} value
     * @param  {Object}
     *    - context = [Object*]
     *    - message = [String]
     *    - method = [String]
     *    - type = [Object*]
     * @return {ErrorCheck}
     */
    type (value, { context, message, method, type }) {
        let _class = context.#class;
        if (typeof value != type)
            this.throw(_class, method, message);
        return this;
    },

    /**
     * Checks to see if a value is a Class of a certain type else throws an error message
     *
     * @param  {any*} value
     * @param  {Object}
     *    - context = [Object*]
     *    - message = [String]
     *    - method = [String]
     *    - type = [Object*]
     * @return {ErrorCheck}
     */
    class (value, { context, message, method, type }) {
        let _class = context.#class, _type;
        if (typeof type == "undefined")
            _type = context.#type;
        else if (typeof context.#type == "undefined") _type = type;
        else if (typeof context.#type == "null" || typeof type == "null") {
            return this;
        }

        if (!(value instanceof _type))
            this.throw(_class, method, message);
        return this;
    }
};

const Config = {
    "container": "data-container"
};

/**
 * The building block of all Classes in use
 *
 * @export
 */
export class Class {
    #class = "Class"; // For error checks
    #type = null; // The type of values a Class allows in use; null means {any*} value

    /**
     * Returns a string describing the nature of the class.
     *
     * @public
     * @return {String}
     */
    toString () {
        return `[object ${this.#class}]`;
    }
}

/**
 * Manages complex lists of named data, eg. A page can be stored in a list by of other pages with the url being how the page is stored in the list. Managers use Maps to store data.
 *
 * @export
 * @extends {Class}
 */
export class Manager extends Class {
    #class = "Manager"; // For error checks
    /**
     * Creates an instance of the Manager class.
     *
     * @param {App} app
     * @memberof Manager
     * @constructor
     */
    constructor (app) {
        /**
         * The instance of the App Class, the manager is instantiated
         *
         * @type {App}
         */
        this.app = app;

        /**
         * The complex list of named data, to which the Manager controls
         *
         * @type {Map}
         */
        this.list = new Map();
    }

    /**
     * Get the value stored in the Manager
     *
     * @public
     * @param  {any*} key
     * @return {any*}
     */
    get (key) {
        return this.list.get(key);
    }

    /**
     * Set a value stored in the Manager
     *
     * @public
     * @param  {any*} key
     * @param  {any*} value
     * @return {Manager}
     */
    set (key, value) {
        ErrorCheck
            .class(value, {
                method: "set", context: this,
                message: `value doesn't match type ${this.#type}`
            });

        this.list.set(key, value);
        return this;
    }

    /**
     * Returns the keys of all items stored in the Manager
     *
     * @public
     * @return {Array}
     */
    keys () {
        return this.list.keys();
    }

    /**
     * Returns the total number of items stored in the Manager
     *
     * @public
     * @return {Number}
     */
    size () {
        return this.list.size;
    }

    /**
     * Returns the last item in the Manager who's index is a certain distance from the last item in the Manager
     *
     * @public
     * @param {Number} [distance=0]
     * @return {any*}
     */
    last (distance = 0) {
        let size = this.size();
        let key = this.keys()[size - distance];
        return this.get(key);
    }

    /**
     * Returns the second last item in the Manager
     *
     * @public
     * @return {any*}
     */
    prev () {
        return this.last(1);
    }

    /**
     * Removes a value stored in the Manager, via the key
     *
     * @public
     * @param  {any*} key
     * @return {Manager}
     */
    remove (key) {
        this.list.delete(key);
        return this;
    }

    /**
     * Clear the Manager of all its contents
     *
     * @public
     * @return {Manager}
     */
    clear () {
        this.list.clear();
        return this;
    }

    /**
     * Checks if the Manager contains a certain key
     *
     * @public
     * @param {any*} key
     * @return {Boolean}
     */
    has (key) {
        return this.list.has(key);
    }

    /**
     * Iterates through the Managers contents, calling a function every iteration
     *
     * @public
     * @param {Function} fn
     * @param {Object* | Manager} [context=this]
     * @return {Manager}
     */
    each (fn, context = this) {
        this.list.forEach(fn, context);
        return this;
    }
}

/**
 * Controls lists of a certain type that follow chronological order, meant for the History class. Storage use Sets to store data.
 *
 * @export
 * @extends {Manager}
 */
export class Storage extends Manager {
    #class = "Storage";

    /**
     * Creates an instance of the Storage class, which inherits properties and methods from the Manager class.
     *
     * @param {App} app
     * @memberof Storage
     * @constructor
     */
    constructor (app) {
        super(app);
    }

    /**
     * Get a value stored in Storage, the key must be a number though.
     *
     * @public
     * @param  {Number} key
     * @return {any*}
     */
    get (key) {
        ErrorCheck
            .type(key, {
                type: "number",
                method: "get", context: this,
                message: "key must be a number"
            });

        return super.get(key);
    }

    /**
     * Sets a value that matches the type stated in the constructor stored in Storage
     *
     * @public
     * @param  {Number} key
     * @param  {<type>any} value
     * @return {Storage}
     */
    set (key, value) {
        ErrorCheck
            .type(key, {
                type: "number",
                method: "set", context: this,
                message: "key must be a number"
            });

        super.set(key, value);
        return this;
    }

    /**
     * Adds a value to Storage
     *
     * @public
     * @param  {any*} value
     * @return {Storage}
     */
    add (value) {
        ErrorCheck
            .class(value, {
                method: "set", context: this,
                message: `value doesn't match type ${this.#type}`
            });
        let size = this.size() + 1;
        this.set(size, value);
        return this;
    }

    /**
     * Lists all values stored in Storage.
     *
     * @public
     * @return {Array}
     */
    values () {
        return this.list.values();
    }
}

/**
 * Adds new methods to the native URL Object; it seemed cleaner than using a custom method or editing the prototype.
 *
 * This doesn't extend the Basic class because it's meants to be a small extention of the native URL class.
 *
 * @export
 * @extends {URL}
 */
export class _URL extends URL {
    // Read up on the native URL class [devdocs.io/dom/url]
    constructor (url = window.location) {
        super(url);
    }

    /**
     * Removes the hash from the URL for a clean URL string
     *
     * @public
     * @return {String}
     */
    clean () {
        return this.toString().replace(/#.*/, '');
    }

    /**
     * Compares two clean URLs to each other
     *
     * @public
     * @static
     * @param  {_URL} a
     * @param  {_URL} b
     * @return {Boolean}
     */
    static compare (a, b) {
        return a.clean() == b.clean();
    }

    /**
     * Compares this clean URL to another clean URL
     *
     * @public
     * @param  {_URL} url
     * @return {Boolean}
     */
    compare (url) {
        return _URL.compare(this, url);
    }
}

/**
 * Represents the current status of the page consisting of properties like: url, transition, data
 *
 * @export
 * @extends {Class}
 */
export class State extends Class {
    #class = "State";
    /**
     * Creates a new instance of a State
     *
     * @param    {Object}
     *    - url = [_URL]
     *    - transition = [String]
     *    - data = [Object]
     * @memberof State
     * @constructor
     */
    constructor ({ url = null, transition = null, data: {} }) {
        ErrorCheck
            .class(url, {
                context: this, type: _URL,
                method: "constructor",
                message: "the url is not a valid _URL class instance."
            })
            .type(transition, {
                context: this, type: "String",
                method: "constructor",
                message: "the transition name is not a valid String."
            });

        /**
         * The current state data
         *
         * @type {Object}
         */
        this.state = { url, transition, data };
    }

    /**
     * Returns the State as an Object
     *
     * @public
     * @return {Object}
     */
    toJSON () {
        return this.state;
    }
}

/**
 * History of the site, stores only the State class
 *
 * @export
 * @extends {Storage}
 */
export class HistoryManager extends Storage {
    #class = "HistoryManager";
    #type = State;

    /**
     * Creates an instance of the HistoryManager class, which inherits properties and methods from the Storage class.
     *
     * @param {App} app
     * @memberof HistoryManager
     * @constructor
     */
    constructor (app) {
        super(app);
    }
}

/**
 * Controls specific kinds of actions that require JS
 *
 * @export
 * @extends {Class}
 */
export class Service extends Class  {
    #class = "Service";
    constructor () {
        /**
         * Stores the App Classes EventEmitter
         *
         * @type {EventEmitter}
         */
        this.emitter = null;
    }

    // Method is run once when Plugin is installed on a PluginManager
    install () {}

    // On start of Plugin
    boot () {}

    // Initialize events
    initEvents (emitter) {}

    // Stop events
    stopEvents (emitter) {}

    // Stop services
    stop () {
        this.stopEvents();
    }
}

/**
 * A service that interacts with the DOM
 *
 * @export
 * @extends {Service}
 */
export class Component extends Service {
    /**
     * Creates an instance of a Component
     *
     * @param {String|Element} el
     * @memberof Component
     * @constructor
     */
    constructor (el) {
        /**
         * Stores the element the Component is going to act on
         *
         * @type {Array}
         */
        this.el = el instanceof Element ? [el] : [].slice.call(document.querySelectorAll(el));
    }
}

/**
 * A service that interacts with the DOM
 *
 * @export
 * @extends {Component}
 */
export class AnchorLink extends Component {
    /**
     * Creates an instance of the Component AnchorLink
     *
     * @memberof AnchorLink
     * @constructor
     */
    constructor () { super(); }

    /**
     * Callback called from click event.
     *
     * @private
     * @param {MouseEvent} evt
     */
    onClick (evt) {
        /**
         * @type {HTMLElement|Node|EventTarget}
         */
        let el = evt.target;

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

    /**
     * Callback called from click event.
     *
     * @private
     * @param {MouseEvent} evt
     */
    // Initialize events
    initEvents (emitter) {
        this.emitter = emitter;

        // If the browser starts
        document.addEventListener("click", this.onClick.bind(this));
    }

    // Stop events
    stopEvents (emitter) {}
}

/**
 * Represents a new event listener consisting of properties like: callback, scope, name
 *
 * @export
 * @extends {Class}
 */
export class Listener extends Class {
    #class = "Listener";
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
    constructor ({ callback = null, scope = null, name = null }) {
        ErrorCheck
            .type(callback, {
                context: this, type: "function",
                method: "constructor",
                message: "the listener callback is not a valid Method."
            })
            .type(name, {
                context: this, type: "string",
                method: "constructor",
                message: "the name of the event is not a valid."
            });

        /**
         * The current listener data
         *
         * @type {Object}
         */
        this.listener = { callback, scope, name };
    }

    /**
     * Returns the callback Function of the Listener
     *
     * @public
     * @return {Function}
     */
    getCallback () {
        return this.listener.callback;
    }

    /**
     * Returns the scope as an Object, from the Listener
     *
     * @public
     * @return {Function}
     */
    getScope () {
        return this.listener.scope;
    }

    /**
     * Returns the event as a String, from the Listener
     *
     * @public
     * @return {Function}
     */
    getEventName () {
        return this.listener.name;
    }

    /**
     * Returns the listener as an Object
     *
     * @public
     * @return {Object}
     */
    toJSON () {
        return this.listener;
    }
}

/**
 * An event emitter
 *
 * @export
 * @extends {Manager}
 */
// A small event emitter
export class EventEmitter extends Manager  {
    #class = "EventEmitter";

    /**
     * Creates an instance of an EventEmitter
     *
     * @param {String|Element} el
     * @memberof EventEmitter
     * @constructor
     */
    constructor(app) {
        super(app);
    }

    /**
     * Gets events, if event doesn't exist create a new Array for the event
     *
     * @public
     * @param {String} name
     * @return {Array}
     */
    // Get event, ensure event is valid
    getEvent (name) {
        let event = this.get(name);
        if (!Array.isArray(event)) {
            this.set(name, []);
            return this.get(name);
        }

        return event;
    }

    /**
     * Creates a new listener and adds it to the event
     *
     * @public
     * @param {String} name
     * @param {Function} callback
     * @param {Object*} scope
     * @return {Array}
     */
    // New event listener
    newListener (name, callback, scope) {
        let event = this.getEvent(name);
        event.push(new Listener({ name, callback, scope }));
        return event;
    }

    /**
     * Adds a listener for a given event
     *
     * @param {String|Object|Array} events
     * @param {Function*} callback
     * @param {Object*} scope
     */
    on (events, callback, scope) {
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
                this.newListener(key, event, callback);
            } else {
                this.newListener(event, callback, scope);
            }
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
    removeListener (name, callback, scope) {
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
    off (events, callback, scope) {
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
    once (events, callback, scope) {
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
    emit (events, args = []) {
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
 * @export
 * @extends {Storage}
 */
export class ServiceManager extends Storage {
    #class = "ServiceManager";
    #type = Service;

    /**
     * Creates an instance of a ServiceManager
     *
     * @param {App} app
     * @memberof ServiceManager
     * @constructor
     */
    constructor (app) {
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
 * @export
 * @extends {Class}
 */
export class Page extends Class {
    #class = "Page";
    /**
     * Creates a new page from response text, or a Document Object
     *
     * @param {_URL} url
     * @param {String | Document} dom
     * @memberof ServiceManager
     * @constructor
     */
    constructor (dom) {
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
 * @export
 * @extends {Class}
 */
export class Transition extends Class {
    #class = "Transition";
    /**
     * Transition name
     *
     * @type {String}
     */
    name = "Transition";

    // Based off the highwayjs Transition class
    out ({ from, trigger, done })
        { return done(); }

    in ({ from, to, trigger, done })
        { return done(); }
}

/**
 * Controls which animation between pages to use
 *
 * @export
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
    constructor ($app) {
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
 * @export
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
    constructor (app) {
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

export class App extends Class {
    #class = "App";
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