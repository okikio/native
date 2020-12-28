import { Manager } from "@okikio/manager";
export declare type ListenerCallback = ((...args: any) => void);
export interface IListener {
    readonly callback: ListenerCallback;
    readonly scope: object;
    readonly name: string;
}
/** Represents a new event listener consisting of properties like: callback, scope, name */
export declare const newListener: ({ callback, scope, name, }: IListener) => IListener;
/** Represents a new event  */
export declare class Event extends Manager<number, IListener> {
    /** The name of the event */
    name: string;
    constructor(name?: string);
}
export declare type EventInput = string | object | Array<string>;
/**
 * An Event Emitter
 * */
export declare class EventEmitter extends Manager<string, Event> {
    constructor();
    /** Gets event, if event doesn't exist create a new one */
    getEvent(name: string): Event;
    /** Creates a listener and adds it to an event */
    newListener(name: string, callback: ListenerCallback, scope: object): Event;
    /** Adds a listener to a given event */
    on(events: EventInput, callback?: ListenerCallback | object, scope?: object): EventEmitter;
    /** Removes a listener from an event */
    removeListener(name: string, callback: ListenerCallback, scope: object): Event;
    /** Remove a listener from a given event, or just completely remove an event */
    off(events: EventInput, callback?: ListenerCallback | object, scope?: object): EventEmitter;
    /** Call all listeners within an event */
    emit(events: string | Array<any>, ...args: any): EventEmitter;
    /** Clears events and event listeners */
    clear(): this;
}
export default EventEmitter;
