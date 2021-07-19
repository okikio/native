import { Manager, methodCall } from "@okikio/manager";

/**
 * Represents a listener callback function
 */
export type TypeListenerCallback = ((...args: any) => void);

/** Represents a new event listener consisting of properties like: callback, scope, name */
export interface IListener {
    readonly callback: TypeListenerCallback;
    readonly scope: object;
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

/** Determines whether value is an pure object (not array, not function, etc...) */
export const isObject = (obj: any) => typeof obj == "object" && !Array.isArray(obj) && typeof obj != "function";

/**
 * The types of values `EventEmitter.prototype.on(...), EventEmitter.prototype.once(...), and EventEmitter.prototype.off(...)` accept
 */
export type TypeEventInput = string | object | Array<string>;

/**
 * An Event Emitter
 * */
export class EventEmitter extends Manager<string, Event> {
    constructor() {
        super();
    }

    /** Gets event, if event doesn't exist create a new one */
    public getEvent(name: string): Event {
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
        scope: object
    ): Event {
        let event = this.getEvent(name);
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
            events == undefined ||
            events == null
        ) return this;

        // Create a new event every space
        if (typeof events == "string") events = events.trim().split(/\s/g);

        let _name: string;
        let _callback: TypeListenerCallback;
        let isObj = isObject(events);

        let _scope: object = isObj ? callback : scope;
        if (!isObj) _callback = (callback as TypeListenerCallback);

        // Loop through the list of events
        Object.keys(events).forEach(key => {
            // Select the name of the event from the list
            // Remember events can be {String | Object | Array<string>}

            // Check If events is an Object (JSON like Object, and not an Array)
            _name = isObj ? key : events[key];
            if (isObj) _callback = events[key];

            this.newListener(_name, _callback, _scope);
        }, this);
        return this;
    }

    /** Removes a listener from an event */
    public removeListener(
        name: string,
        callback: TypeListenerCallback,
        scope: object
    ): Event {
        let event: Event = this.get(name);
        if (event instanceof Event && callback) {
            let listener = newListener({ name, callback, scope });
            event.forEach((value: IListener, i: number) => {
                if (
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
            events == undefined ||
            events == null
        ) return this;

        // Create a new event every space
        if (typeof events == "string") events = events.trim().split(/\s/g);

        let _name: string;
        let _callback: TypeListenerCallback;
        let isObj = isObject(events);

        let _scope: object = isObj ? callback : scope;
        if (!isObj) _callback = (callback as TypeListenerCallback);

        // Loop through the list of events
        Object.keys(events).forEach(key => {
            // Select the name of the event from the list
            // Remember events can be {String | Object | Array<any>}

            // Check If events is an Object (JSON like Object, and not an Array)
            _name = isObj ? key : events[key];
            if (isObj) _callback = events[key];

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
            events == undefined ||
            events == null
        ) return this;

        // Create a new event every space
        if (typeof events == "string") events = events.trim().split(/\s/g);

        let isObj = isObject(events);

        // Loop through the list of events
        Object.keys(events).forEach(key => {
            // Select the name of the event from the list
            // Remember events can be {String | Object | Array<string>}
            // Check If events is an Object (JSON like Object, and not an Array)
            let _name: string = isObj ? key : events[key];
            let _callback: TypeListenerCallback = isObj ? events[key] : (callback as TypeListenerCallback);
            let _scope: object = isObj ? callback : scope;
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
            events == undefined ||
            events == null
        ) return this;

        // Create a new event every space
        if (typeof events == "string") events = events.trim().split(/\s/g);

        // Loop through the list of events
        events.forEach((event: string) => {
            let _event: Event = this.get(event);
            if (_event instanceof Event) {
                _event.forEach((listener: IListener) => {
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

export default EventEmitter;
