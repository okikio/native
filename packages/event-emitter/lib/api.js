/*!
 * @okikio/event-emitter v1.0.2
 * (c) 2020 Okiki Ojo
 * Released under the MIT license
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/*!
 * managerjs v1.0.2
 * (c) 2020 Okiki Ojo
 * Released under the MIT license
 */

/**
 * Manages complex lists of named data, eg. A page can be stored in a list by of other pages with the url being how the page is stored in the list.
 *
 * @export
 * @class Manager
 * @extends {Map<K, V>}
 * @template K
 * @template V
 */
class Manager extends Map {
    /**
     * Creates an instance of Manager.
     *
     * @param {...any} args
     * @memberof Manager
     */
    constructor(...args) {
        super(...args);
    }
    /**
     * Returns the keys of all items stored in the Manager as an Array
     *
     * @returns Array<K>
     * @memberof Manager
     */
    // @ts-expect-error
    keys() {
        return Array.from(super.keys.call(this));
    }
    /**
     * Returns the values of all items stored in the Manager as an Array
     *
     * @returns Array<V>
     * @memberof Manager
     */
    // @ts-expect-error
    values() {
        return Array.from(this.values());
    }
    /**
     * Returns the last item in the Manager who's index is a certain distance from the last item in the Manager
     *
     * @param {number} [distance=1]
     * @returns V
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
     * @returns V
     */
    prev() {
        return this.last(2);
    }
    /**
     * Adds a value to Manager, and uses the current size of the Manager as it's key, it works best when all the key in the Manager are numbers
     *
     * @public
     * @param  {V} value
     * @returns Manager<K, V>
     */
    add(value) {
        // @ts-expect-error
        this.set(this.size, value);
        return this;
    }
    /**
     * Calls a method for all items that are currently in it's list
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
     * Asynchronously calls a method for all items that are currently in it's list, similar to methodCall except the loop waits for the asynchronous method to run, before the loop continues on to the the next method
     *
     * @param {string} method
     * @param {Array<any>} [args=[]]
     * @returns Promise<Manager<K, V>>
     * @memberof Manager
     */
    async asyncMethodCall(method, ...args) {
        for await (let [, item] of this) {
            // @ts-ignore
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
exports.default = EventEmitter;
