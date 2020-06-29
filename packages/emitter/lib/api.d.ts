import { Manager } from "@okikio/manager";
export declare type ListenerCallback = ((...args: any) => void);
export interface IListener {
    readonly callback: ListenerCallback;
    readonly scope: object;
    readonly name: string;
}
/**
 * Represents a new event listener consisting of properties like: callback, scope, name
 *
 * @export
 * @class Listener
 */
export declare class Listener {
    /**
     * The current listener data
     *
     * @private
     * @type IListener
     * @memberof Listener
     */
    private listener;
    /**
     * Creates an instance of Listener.
     *
     * @param {IListener} { callback = () => { }, scope = null, name = "event" }
     * @memberof Listener
     */
    constructor({ callback, scope, name, }: IListener);
    /**
     * Returns the callback Function of the Listener
     *
     * @returns ListenerCallback
     * @memberof Listener
     */
    getCallback(): ListenerCallback;
    /**
     * Returns the scope as an Object, from the Listener
     *
     * @returns object
     * @memberof Listener
     */
    getScope(): object;
    /**
     * Returns the event as a String, from the Listener
     *
     * @returns string
     * @memberof Listener
     */
    getEventName(): string;
    /**
     * Returns the listener as an Object
     *
     * @returns IListener
     * @memberof Listener
     */
    toJSON(): IListener;
}
/**
 * Represents a new event listener consisting of properties like: callback, scope, name
 *
 * @export
 * @class Event
 * @extends {Manager<number, Listener>}
 */
export declare class Event extends Manager<number, Listener> {
    /**
     * The name of the event
     *
     * @private
     * @type string
     * @memberof Event
     */
    private name;
    /**
     * Creates an instance of Event.
     *
     * @param {string} [name="event"]
     * @memberof Event
     */
    constructor(name?: string);
}
export declare type EventInput = string | object | Array<string>;
/**
 * An event emitter
 *
 * @export
 * @class EventEmitter
 * @extends {Manager<string, Event>}
 */
export declare class EventEmitter extends Manager<string, Event> {
    /**
     * Creates an instance of EventEmitter.
     *
     * @memberof EventEmitter
     */
    constructor();
    /**
     * Gets events, if event doesn't exist create a new Event
     *
     * @param {string} name
     * @returns Event
     * @memberof EventEmitter
     */
    getEvent(name: string): Event;
    /**
     * Creates a new listener and adds it to the event
     *
     * @param {string} name
     * @param {ListenerCallback} callback
     * @param {object} scope
     * @returns Event
     * @memberof EventEmitter
     */
    newListener(name: string, callback: ListenerCallback, scope: object): Event;
    /**
     * Adds a listener for a given event
     *
     * @param {EventInput} events
     * @param {ListenerCallback | object} callback
     * @param {object} scope
     * @returns
     * @memberof EventEmitter
     */
    on(events: EventInput, callback?: ListenerCallback | object, scope?: object): EventEmitter;
    /**
     * Removes a listener from an event
     *
     * @param {string} name
     * @param {ListenerCallback} [callback]
     * @param {object} [scope]
     * @returns Event
     * @memberof EventEmitter
     */
    removeListener(name: string, callback: ListenerCallback, scope: object): Event;
    /**
     * Removes a listener from a given event, or it just completely removes an event
     *
     * @param {EventInput} events
     * @param {ListenerCallback | object} [callback]
     * @param {object} [scope]
     * @returns EventEmitter
     * @memberof EventEmitter
     */
    off(events: EventInput, callback?: ListenerCallback | object, scope?: object): EventEmitter;
    /**
     * Adds a one time event listener for an event,
     * do note, you can't use .off to remove events listeners for the kind of event,
     * however, you can still remove the entire event
     *
     * @param {EventInput} events
     * @param {ListenerCallback | object} [callback]
     * @param {object} [scope]
     * @returns EventEmitter
     * @memberof EventEmitter
     */
    once(events: EventInput, callback?: ListenerCallback | object, scope?: object): EventEmitter;
    /**
     * Call all listeners within an event
     *
     * @param {(string | Array<any>)} events
     * @param {...any} args
     * @returns EventEmitter
     * @memberof EventEmitter
     */
    emit(events: string | Array<any>, ...args: any): EventEmitter;
}
