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
 */
export declare const newListener: ({ callback, scope, name, }: IListener) => IListener;
/**
 * Represents a new event listener consisting of properties like: callback, scope, name
 *
 * @export
 * @class Event
 * @extends {Manager<number, Listener>}
 */
export declare class Event extends Manager<number, IListener> {
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
     * @returns EventEmitter
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
     * Call all listeners within an event
     *
     * @param {(string | Array<any>)} events
     * @param {...any} args
     * @returns EventEmitter
     * @memberof EventEmitter
     */
    emit(events: string | Array<any>, ...args: any): EventEmitter;
}
export default EventEmitter;
