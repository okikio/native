import { Manager, methodCall } from "@okikio/manager/src/index.ts";

/**
 * Represents a listener callback function
 */
export type TypeListenerCallback = ((...args: any) => void);

/** Represents a new event listener consisting of properties like: callback, scope, name */
export interface IListener {
    readonly callback: TypeListenerCallback;
    readonly scope?: object | null;
    readonly name: string;
}

/**
 * Creates a new listener based on {@link IListener | IListener}
 */
export const newListener = ({
    callback = () => { },
    scope = null,
    name = "event",
}: IListener): IListener => ({ callback, scope, name });

/** Represents a new event  */
export class Event extends Manager<number, IListener> {
    /** The name of the event */
    public name: string;
    constructor(name: string = "event") {
        super();
        this.name = name;
    }
}

/**
 * Helper function to check if a value is an object.
 * Determines whether the value is a pure object (not array, not function, etc.)
 * 
 * @param value - The value to check.
 * @returns True if the value is an object, false otherwise.
 * 
 * @example
 * // Check if a value is an object
 * const isObj = isObject({ key: 'value' }); // true
 * 
 * @example
 * // Check if a value is not an object
 * const isNotObj = isObject('string'); // false
 */
export function isObject(value: any): boolean {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * The types of values `EventEmitter.prototype.on(...), EventEmitter.prototype.once(...), and EventEmitter.prototype.off(...)` accept
 */
export type TypeEventInput = (string & {}) | object | Array<(string & {})>;

/**
 * An Event Emitter
 * */
export class EventEmitter extends Manager<string, Event> {
    constructor() {
        super();
    }

    /** Gets event, if event doesn't exist create a new one */
    public getEvent(name: string): Event | undefined {
        let event = this.get(name);
        if (!(event instanceof Event)) {
            this.set(name, new Event(name));
            return this.get(name);
        }

        return event;
    }

    /** Creates a listener and adds it to an event */
    public newListener(
        name: string,
        callback: TypeListenerCallback,
        scope?: object | null
    ): Event {
        const event = this.getEvent(name);
        if (!event) throw new Error(`Can't add listener to event "${name}", as event "${name}" does not exist.`);
        
        event.add(newListener({ name, callback, scope }));
        return event;
    }

    /** Adds a listener to a given event */
    public on(
        events: TypeEventInput,
        callback?: TypeListenerCallback | object,
        scope?: object
    ): EventEmitter {
        // If there is no event break
        if (
            events === undefined ||
            events === null
        ) return this;

        // Create a new event every space
        if (typeof events === "string") events = events.trim().split(/\s+/);

        let _name: string;
        let _callback: TypeListenerCallback;
        let isObj = isObject(events);

        let _scope: object | undefined = isObj ? callback : scope;
        if (!isObj) _callback = (callback as TypeListenerCallback);

        // Loop through the list of events
        Object.keys(events).forEach(key => {
            // Select the name of the event from the list
            // Remember events can be {String | Object | Array<string>}

            // Check If events is an Object (JSON like Object, and not an Array)
            const evts = events as Record<PropertyKey, string | TypeListenerCallback>;
            _name = isObj ? key : evts[key] as string;
            if (isObj) _callback = evts[key] as TypeListenerCallback;

            this.newListener(_name, _callback, _scope);
        }, this);
        return this;
    }

    /** Removes a listener from an event */
    public removeListener(
        name: string,
        callback?: TypeListenerCallback,
        scope?: object | null
    ): Event {
        let event = this.get(name);
        if (!callback) throw new Error("Callback is required to remove a listener");
        if (!event) throw new Error(`Can't remove listener from event "${name}", as event "${name}" does not exist.`);
        if (event instanceof Event) {
            let listener = newListener({ name, callback, scope });
            event.forEach((value?: IListener, i?: number) => {
                if (
                    value && typeof i === "number" &&
                    value.callback === listener.callback &&
                    value.scope === listener.scope
                ) return event.remove(i);
            });
        }

        return event;
    }

    /** Remove a listener from a given event, or just completely remove an event */
    public off(
        events: TypeEventInput,
        callback?: TypeListenerCallback | object,
        scope?: object
    ): EventEmitter {
        // If there is no event break
        if (
            events === undefined ||
            events === null
        ) return this;

        // Create a new event every space
        if (typeof events === "string") events = events.trim().split(/\s+/);

        let _name: string;
        let _callback: TypeListenerCallback;
        let isObj = isObject(events);

        let _scope: object | undefined = isObj ? (callback as object) : scope;
        if (!isObj) _callback = (callback as TypeListenerCallback);

        // Loop through the list of events
        Object.keys(events).forEach(key => {
            // Select the name of the event from the list
            // Remember events can be {String | Object | Array<any>}

            // Check If events is an Object (JSON like Object, and not an Array)
            const evts = events as Record<PropertyKey, string | TypeListenerCallback>;
            _name = isObj ? key : evts[key] as string;
            if (isObj) _callback = evts[key] as TypeListenerCallback;

            if (typeof _callback === "function") {
                this.removeListener(_name, _callback, _scope);
            } else this.remove(_name);
        }, this);
        return this;
    }

    /**
     * Adds a one time event listener for an event
     */
    public once(
        events: TypeEventInput,
        callback?: TypeListenerCallback | object,
        scope?: object
    ): EventEmitter {
        // If there is no event break
        if (
            events === undefined ||
            events === null
        ) return this;

        // Create a new event every space
        if (typeof events == "string") events = events.trim().split(/\s+/);

        let isObj = isObject(events);

        // Loop through the list of events
        Object.keys(events).forEach(key => {
            // Select the name of the event from the list
            // Remember events can be {String | Object | Array<string>}
            // Check If events is an Object (JSON like Object, and not an Array)
            const evts = events as Record<PropertyKey, string | TypeListenerCallback>;
            let _name: string = isObj ? key : (evts[key] as string);
            let _callback: TypeListenerCallback = isObj ? (evts[key] as TypeListenerCallback) : (callback as TypeListenerCallback);
            let _scope: object | undefined = isObj ? callback : scope;
            let onceFn: TypeListenerCallback = (...args) => {
                _callback.apply(_scope, args);
                this.removeListener(_name, onceFn, _scope);
            };

            this.newListener(_name, onceFn, _scope);
        }, this);
        return this;
    }

    /** Call all listeners within an event */
    public emit(
        events: string | Array<any>,
        ...args: any
    ): EventEmitter {
        // If there is no event break
        if (
            events === undefined ||
            events === null
        ) return this;

        // Create a new event every space
        if (typeof events == "string") events = events.trim().split(/\s+/);

        // Loop through the list of events
        events.forEach((event: string) => {
            let _event: Event | undefined = this.get(event);
            if (_event instanceof Event) {
                _event.forEach((listener?: IListener) => {
                    if (!listener) return;
                    let { callback, scope } = listener;
                    callback.apply(scope, args);
                });
            }
        }, this);
        return this;
    }

    /** Clears events and event listeners */
    public clear() {
        methodCall(this, "clear");
        super.clear();
        return this;
    }
}

/**
 * Adds event listeners to an EventTarget.
 * 
 * @param {EventTarget} target - The target to attach event listeners to.
 * @param {(string | Array<string> | Record<PropertyKey, string | EventListenerOrEventListenerObject | null>)} events - The events to listen for. Can be a string, an array of strings, or an object with event names as keys.
 * @param {EventListenerOrEventListenerObject | null | boolean | AddEventListenerOptions} [callback] - The callback function or options for the event listener.
 * @param {boolean | AddEventListenerOptions} [opts] - Additional options for the event listener.
 * @returns {EventTarget | null} The target if successful, or null if there was an error.
 * 
 * @example
 * // Single event with a callback
 * on(document.body, 'click', (e) => console.log('Body clicked!', e));
 * 
 * @example
 * // Multiple events with a single callback
 * on(document.body, ['click', 'mouseover'], (e) => console.log('Event triggered!', e));
 * 
 * @example
 * // Event object with different callbacks
 * on(document.body, {
 *   click: (e) => console.log('Body clicked!', e),
 *   mouseover: (e) => console.log('Mouse over body!', e)
 * });
 * 
 * @example
 * // Event handler object with a handle method
 * on(document.body, 'click', { handle: (e) => console.log('Handled click event!', e) });
 * 
 * @example
 * // Event with options (once: true)
 * on(document.body, 'click', (e) => console.log('Body clicked once!', e), { once: true });
 * 
 * @example
 * // Event with options (capture: true)
 * on(document.body, 'click', (e) => console.log('Body clicked with capture!', e), { capture: true });
 * 
 * @example
 * // Event with options (passive: true)
 * on(document.body, 'click', (e) => console.log('Body clicked with passive option!', e), { passive: true });
 */
export function on(
    target: EventTarget,
    events: (string & {}) | Array<(string & {})> | Record<PropertyKey, string | EventListenerOrEventListenerObject | null>,
    callback?: EventListenerOrEventListenerObject | null | boolean | AddEventListenerOptions,
    opts?: boolean | AddEventListenerOptions
): EventTarget | null {
    // If there is no event or target, break
    if (target === undefined || target === null) return null;
    if (events === undefined || events === null) return target;

    // Create a new event every space
    if (typeof events === "string") events = events.trim().split(/\s+/);

    let _name: string;
    let _callback: EventListenerOrEventListenerObject;
    let isObj = isObject(events);

    let _opts = isObj ? (callback as boolean | AddEventListenerOptions) : opts;
    if (!isObj) _callback = (callback as EventListenerOrEventListenerObject);

    // Loop through the list of events
    Object.keys(events).forEach(key => {
        // Select the name of the event from the list
        // Remember events can be {String | Object | Array<string>}
        const evts = events as Record<PropertyKey, string | EventListenerOrEventListenerObject>;
        _name = isObj ? key : evts[key] as string;
        if (isObj) _callback = evts[key] as EventListenerOrEventListenerObject;

        target.addEventListener(_name, _callback, _opts);
    }, target);
    return target;
}

/**
 * Removes event listeners from an EventTarget.
 * 
 * @param {EventTarget} target - The target to remove event listeners from.
 * @param {(string | Array<string> | Record<PropertyKey, string | EventListenerOrEventListenerObject | null>)} events - The events to stop listening for. Can be a string, an array of strings, or an object with event names as keys.
 * @param {EventListenerOrEventListenerObject | null | boolean | EventListenerOptions} [callback] - The callback function or options for the event listener.
 * @param {boolean | EventListenerOptions} [opts] - Additional options for the event listener.
 * @returns {EventTarget | null} The target if successful, or null if there was an error.
 * 
 * @example
 * // Single event with a callback
 * off(document.body, 'click', handleClick);
 * 
 * @example
 * // Multiple events with a single callback
 * off(document.body, ['click', 'mouseover'], handleEvent);
 * 
 * @example
 * // Event object with different callbacks
 * off(document.body, {
 *   click: handleClick,
 *   mouseover: handleMouseOver
 * });
 * 
 * @example
 * // Event with options (once: true)
 * off(document.body, 'click', handleClick, { once: true });
 */
export function off(
    target: EventTarget,
    events: (string & {}) | Array<(string & {})> | Record<PropertyKey, string | EventListenerOrEventListenerObject | null>,
    callback?: EventListenerOrEventListenerObject | null | boolean | EventListenerOptions,
    opts?: boolean | EventListenerOptions
): EventTarget | null {
    // If there is no event or target, break
    if (target === undefined || target === null) return null;
    if (events === undefined || events === null) return target;

    // Create a new event every space
    if (typeof events === "string") events = events.trim().split(/\s+/);

    let _name: string;
    let _callback: EventListenerOrEventListenerObject;
    let isObj = isObject(events);

    let _opts = isObj ? (callback as boolean | EventListenerOptions) : opts;
    if (!isObj) _callback = (callback as EventListenerOrEventListenerObject);

    // Loop through the list of events
    Object.keys(events).forEach(key => {
        // Select the name of the event from the list
        // Remember events can be {String | Object | Array<string>}
        const evts = events as Record<PropertyKey, string | EventListenerOrEventListenerObject>;
        _name = isObj ? key : evts[key] as string;
        if (isObj) _callback = evts[key] as EventListenerOrEventListenerObject;

        target.removeEventListener(_name, _callback, _opts);
    }, target);
    return target;
}

/**
 * Dispatches events on an EventTarget.
 * 
 * @param {EventTarget} target - The target to dispatch events on.
 * @param {(globalThis.Event | string | Array<(globalThis.Event | string) & {})>} events - The events to dispatch. Can be an Event object, a string, or an array of strings or Event objects.
 * @returns {EventTarget | null} The target if successful, or null if there was an error.
 * 
 * @example
 * // Single event as string
 * emit(document.body, 'customEvent');
 * 
 * @example
 * // Single event as Event object
 * const event = new Event('customEvent');
 * emit(document.body, event);
 * 
 * @example
 * // Multiple events as strings
 * emit(document.body, ['customEvent1', 'customEvent2']);
 * 
 * @example
 * // Multiple events as Event objects
 * const event1 = new Event('customEvent1');
 * const event2 = new Event('customEvent2');
 * emit(document.body, [event1, event2]);
 */
export function emit(
    target: EventTarget,
    events: globalThis.Event | (string & {}) | Array<(globalThis.Event | string & {})>
): EventTarget | null {
    // If there is no event or target, break
    if (target === undefined || target === null) return null;
    if (events === undefined || events === null) return target;

    // Create a new event every space
    if (typeof events === "string") events = events.trim().split(/\s+/);
    if (events instanceof globalThis.Event) events = [events];

    // Loop through the list of events
    events.forEach(event => {
        // Select the name of the event from the list
        // Remember events can be {String | Array<string>}
        const _event = event instanceof globalThis.Event ? event : new globalThis.Event(event);
        target.dispatchEvent(_event);
    }, target);
    return target;
}

/**
 * Converts a list of event names to CustomEvent objects.
 * 
 * @param {(string | Array<string>)} events - The events to convert. Can be a string or an array of strings.
 * @param {T} detail - The detail to include in the CustomEvent.
 * @returns {Array<CustomEvent<T>>} An array of CustomEvent objects.
 * 
 * @example
 * // Single event with detail
 * const customEvents = toCustomEvents('customEvent', { key: 'value' });
 * customEvents.forEach(event => document.body.dispatchEvent(event));
 * 
 * @example
 * // Multiple events with detail
 * const customEvents = toCustomEvents(['customEvent1', 'customEvent2'], { key: 'value' });
 * customEvents.forEach(event => document.body.dispatchEvent(event));
 */
export function toCustomEvents<T = any>(events: (string & {}) | Array<(string & {})>, detail: T) {
    // Create a new event every space
    if (typeof events === "string") events = events.trim().split(/\s+/);

    return events.map((evt) => {
        return new CustomEvent(evt, { detail });
    });
}

export default EventEmitter;
