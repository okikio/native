/*!
 * @okikio/event-emitter v1.0.5
 * (c) 2020 Okiki Ojo
 * Released under the MIT license
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global['@okikio/event-emitter'] = {}));
}(this, (function (exports) { 'use strict';

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
    class Event extends Manager {
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
    class EventEmitter extends Manager {
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

    exports.Event = Event;
    exports.EventEmitter = EventEmitter;
    exports.Listener = Listener;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
