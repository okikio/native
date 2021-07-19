import { Manager } from "@okikio/manager";
/**
 * Represents a listener callback function
 */
export declare type TypeListenerCallback = ((...args: any) => void);
/** Represents a new event listener consisting of properties like: callback, scope, name */
export interface IListener {
    readonly callback: TypeListenerCallback;
    readonly scope: object;
    readonly name: string;
}
/**
 * Creates a new listener based on {@link IListener | IListener}
 */
export declare const newListener: ({ callback, scope, name, }: IListener) => IListener;
/** Represents a new event  */
export declare class Event extends Manager<number, IListener> {
    /** The name of the event */
    name: string;
    constructor(name?: string);
}
/** Determines whether value is an pure object (not array, not function, etc...) */
export declare const isObject: (obj: any) => boolean;
/**
 * The types of values `EventEmitter.prototype.on(...), EventEmitter.prototype.once(...), and EventEmitter.prototype.off(...)` accept
 */
export declare type TypeEventInput = string | object | Array<string>;
/**
 * An Event Emitter
 * */
export declare class EventEmitter extends Manager<string, Event> {
    constructor();
    /** Gets event, if event doesn't exist create a new one */
    getEvent(name: string): Event;
    /** Creates a listener and adds it to an event */
    newListener(name: string, callback: TypeListenerCallback, scope: object): Event;
    /** Adds a listener to a given event */
    on(events: TypeEventInput, callback?: TypeListenerCallback | object, scope?: object): EventEmitter;
    /** Removes a listener from an event */
    removeListener(name: string, callback: TypeListenerCallback, scope: object): Event;
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
export default EventEmitter;
