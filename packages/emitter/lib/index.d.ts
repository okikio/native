import { Manager } from '@okikio/manager/src/index.ts';

/**
 * Represents a listener callback function
 */
type TypeListenerCallback = ((...args: any) => void);
/** Represents a new event listener consisting of properties like: callback, scope, name */
interface IListener {
    readonly callback: TypeListenerCallback;
    readonly scope?: object | null;
    readonly name: string;
}
/**
 * Creates a new listener based on {@link IListener | IListener}
 */
declare const newListener: ({ callback, scope, name, }: IListener) => IListener;
/** Represents a new event  */
declare class Event extends Manager<number, IListener> {
    /** The name of the event */
    name: string;
    constructor(name?: string);
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
declare function isObject(value: any): boolean;
/**
 * The types of values `EventEmitter.prototype.on(...), EventEmitter.prototype.once(...), and EventEmitter.prototype.off(...)` accept
 */
type TypeEventInput = (string & {}) | object | Array<(string & {})>;
/**
 * An Event Emitter
 * */
declare class EventEmitter extends Manager<string, Event> {
    constructor();
    /** Gets event, if event doesn't exist create a new one */
    getEvent(name: string): Event | undefined;
    /** Creates a listener and adds it to an event */
    newListener(name: string, callback: TypeListenerCallback, scope?: object | null): Event;
    /** Adds a listener to a given event */
    on(events: TypeEventInput, callback?: TypeListenerCallback | object, scope?: object): EventEmitter;
    /** Removes a listener from an event */
    removeListener(name: string, callback?: TypeListenerCallback, scope?: object | null): Event;
    /** Remove a listener from a given event, or just completely remove an event */
    off(events: TypeEventInput, callback?: TypeListenerCallback | object, scope?: object): EventEmitter;
    /**
     * Adds a one time event listener for an event
     */
    once(events: TypeEventInput, callback?: TypeListenerCallback | object, scope?: object): EventEmitter;
    /** Call all listeners within an event */
    emit(events: string | Array<any>, ...args: any): EventEmitter;
    /** Clears events and event listeners */
    clear(): this;
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
declare function on(target: EventTarget, events: (string & {}) | Array<(string & {})> | Record<PropertyKey, string | EventListenerOrEventListenerObject | null>, callback?: EventListenerOrEventListenerObject | null | boolean | AddEventListenerOptions, opts?: boolean | AddEventListenerOptions): EventTarget | null;
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
declare function off(target: EventTarget, events: (string & {}) | Array<(string & {})> | Record<PropertyKey, string | EventListenerOrEventListenerObject | null>, callback?: EventListenerOrEventListenerObject | null | boolean | EventListenerOptions, opts?: boolean | EventListenerOptions): EventTarget | null;
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
declare function emit(target: EventTarget, events: globalThis.Event | (string & {}) | Array<(globalThis.Event | string & {})>): EventTarget | null;
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
declare function toCustomEvents<T = any>(events: (string & {}) | Array<(string & {})>, detail: T): CustomEvent<T>[];

export { Event, EventEmitter, type IListener, type TypeEventInput, type TypeListenerCallback, EventEmitter as default, emit, isObject, newListener, off, on, toCustomEvents };
