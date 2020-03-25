// Checks if an error has occurred and throws a detailed message for ease of debugging
const ErrorCheck = {
    /**
     * Throws a message using its parameters to create a detailed formatted message
     *
     * @param {String} _class
     * @param {String} method
     * @param {String} message
     */
    _throw (_class, method, message) {
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
     * @return {ErrorCheck}
     */
    type (value, { context, message, method, type }) {
        let _class = context.#class;
        if (typeof value != type)
            this._throw(_class, method, message);
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
        let _class = context.#class;
        let _type = type || context.#type;
        if (_type != null && !(value instanceof _type))
            this._throw(_class, method, message);
        return this;
    }
};

/**
 * The building block of all Classes in use
 *
 * @export
 * @class BasicClass
 */
export class BasicClass {
    #class = "BasicClass"; // For error checks
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
 * @class Manager
 * @extends {BasicClass}
 */
export class Manager extends BasicClass {
    #class = "Manager"; // For error checks
    /**
     * Creates an instance of the Manager class.
     * @memberof Manager
     */
    constructor () {
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
 * @class Storage
 * @extends {Manager}
 */
export class Storage extends Manager {
    #class = "Storage";

    /**
     * Creates an instance of the Storage class, which inherits properties and methods from the Manager class.
     * @memberof Storage
     */
    constructor () {
        super();
    }

    /**
     * Get a value stored in Storage, the key must be a number though.
     *
     * @public
     * @param  {Number} key
     * @return {any*}
     */
    get (key) {
        ErrorCheck.type(key, {
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
            })
            .class(value, {
                method: "set", context: this,
                message: `value doesn't match type ${this.#type}`
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
 * @class _URL
 * @extends {URL}
 */
export class _URL extends URL {
    // Read up on the native URL class [devdocs.io/dom/url]
    constructor (...args) {
        super(...args);
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
 * Controls the animation between pages
 *
 * @export
 * @class Transition
 * @extends {BasicClass}
 */
export class Transition extends BasicClass {
    #class = "Transition";

    // Based off the highwayjs Transition class
    in ({ from, to, trigger, done })
        { return done(); }

    out ({ from, trigger, done })
        { return done(); }
}

/**
 * Represents the current status of the page consisting of properties like: url, transition, data
 *
 * @export
 * @class State
 * @extends {BasicClass}
 */
export class State extends BasicClass {
    #class = "State";
    /**
     * Creates a new instance of a State
     *
     * @param    {Object}
     *    - url = [_URL]
     *    - transition = [Transition]
     *    - data = [Object]
     * @memberof {State}
     */
    constructor ({ url = null, transition = null, data: {} }) {
        ErrorCheck
            .class(url, {
                context: this, type: _URL,
                method: "constructor",
                message: "the url is not a valid _URL class instance."
            })
            .class(transition, {
                context: this, type: Transition,
                method: "constructor",
                message: "the transition is not a valid Transition class instance."
            })
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
 * @class HistoryManager
 * @extends {Storage}
 */
export class HistoryManager extends Storage {
    #class = "HistoryManager";
    #type = State;

    /**
     * Creates an instance of the HistoryManager class, which inherits properties and methods from the Storage class.
     *
     * @memberof HistoryManager
     */
    constructor () {
        super();
    }
}

/**
 * Controls specific kinds of actions that require JS
 *
 * @export
 * @class Component
 * @extends {BasicClass}
 */
export class Component extends BasicClass  {
    #class = "Component";

    constructor (el) {
        this.el = el instanceof Element ? el : document.querySelectorAll(el);
    }

    install () {}

    // On start of Component
    boot () {}
}

class ComponentManager extends Manager {
    constructor () {
        super();
    }
}

class Page {
    constructor () {
        // HTMLELEMENT
        this.container = null;
    }
}


class TransitionManager extends Manager {
    constructor () {
        super();
    }
}

// Also know as the page cache
class PageManager extends Manager {
    constructor () {
        super();
    }
}

class App {
    constructor () {
        this.history = new HistoryManager();
        this.transitions = new TransitionManager();
    }
}