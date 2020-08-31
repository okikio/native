import { Manager } from "@okikio/manager";

export type ListenerCallback = ((...args: any) => void);
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
// export class Listener {
// 	/**
// 	 * The current listener data
// 	 *
// 	 * @private
// 	 * @type IListener
// 	 * @memberof Listener
// 	 */
//     private listener: IListener;

// 	/**
// 	 * Creates an instance of Listener.
// 	 *
// 	 * @param {IListener} { callback = () => { }, scope = null, name = "event" }
// 	 * @memberof Listener
// 	 */
//     constructor({
//         callback = () => { },
//         scope = null,
//         name = "event",
//     }: IListener) {
//         this.listener = { callback, scope, name };
//     }

// 	/**
// 	 * Returns the callback Function of the Listener
// 	 *
// 	 * @returns ListenerCallback
// 	 * @memberof Listener
// 	 */
//     public getCallback(): ListenerCallback {
//         return this.listener.callback;
//     }

// 	/**
// 	 * Returns the scope as an Object, from the Listener
// 	 *
// 	 * @returns object
// 	 * @memberof Listener
// 	 */
//     public getScope(): object {
//         return this.listener.scope;
//     }

// 	/**
// 	 * Returns the event as a String, from the Listener
// 	 *
// 	 * @returns string
// 	 * @memberof Listener
// 	 */
//     public getEventName(): string {
//         return this.listener.name;
//     }

// 	/**
// 	 * Returns the listener as an Object
// 	 *
// 	 * @returns IListener
// 	 * @memberof Listener
// 	 */
//     public toJSON(): IListener {
//         return this.listener;
//     }
// }

/**
 * Represents a new event listener consisting of properties like: callback, scope, name
 *
 * @export
 */
export const newListener = ({
    callback = () => { },
    scope = null,
    name = "event",
}: IListener): IListener => ({ callback, scope, name });

/**
 * Represents a new event listener consisting of properties like: callback, scope, name
 *
 * @export
 * @class Event
 * @extends {Manager<number, Listener>}
 */
export class Event extends Manager<number, IListener> {
	/**
	 * The name of the event
	 *
	 * @private
	 * @type string
	 * @memberof Event
	 */
    private name: string;

	/**
	 * Creates an instance of Event.
	 *
	 * @param {string} [name="event"]
	 * @memberof Event
	 */
    constructor(name: string = "event") {
        super();
        this.name = name;
    }
}

export type EventInput = string | object | Array<string>;

/**
 * An event emitter
 *
 * @export
 * @class EventEmitter
 * @extends {Manager<string, Event>}
 */
export class EventEmitter extends Manager<string, Event> {
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
    public getEvent(name: string): Event {
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
    public newListener(
        name: string,
        callback: ListenerCallback,
        scope: object
    ): Event {
        let event = this.getEvent(name);
        event.add(newListener({ name, callback, scope }));
        return event;
    }

	/**
	 * Adds a listener for a given event
	 *
	 * @param {EventInput} events
	 * @param {ListenerCallback | object} callback
	 * @param {object} scope
	 * @returns EventEmitter
	 * @memberof EventEmitter
	 */
    public on(
        events: EventInput,
        callback?: ListenerCallback | object,
        scope?: object
    ): EventEmitter {
        // If there is no event break
        if (typeof events == "undefined") return this;

        // Create a new event every space
        if (typeof events == "string") events = events.trim().split(/\s/g);

        let _name: string;
        let _callback: ListenerCallback;
        let isObject = typeof events == "object" && !Array.isArray(events);

        let _scope: object = isObject ? callback : scope;
        if (!isObject) _callback = (callback as ListenerCallback);

        // Loop through the list of events
        Object.keys(events).forEach(key => {
            // Select the name of the event from the list
            // Remember events can be {String | Object | Array<string>}

            // Check If events is an Object (JSON like Object, and not an Array)
            if (isObject) {
                _name = key;
                _callback = events[key];
            } else {
                _name = events[key];
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
    public removeListener(
        name: string,
        callback: ListenerCallback,
        scope: object
    ): Event {
        let event: Event = this.get(name);
        if (event instanceof Event && callback) {
            let listener = newListener({ name, callback, scope });

            event.forEach((value: IListener, i: number) => {
                if (
                    value.callback === listener.callback &&
                    value.scope === listener.scope
                ) {
                    return event.delete(i);
                }
            });
        }

        return event;
    }

	/**
	 * Removes a listener from a given event, or it just completely removes an event
	 *
	 * @param {EventInput} events
	 * @param {ListenerCallback | object} [callback]
	 * @param {object} [scope]
	 * @returns EventEmitter
	 * @memberof EventEmitter
	 */
    public off(
        events: EventInput,
        callback?: ListenerCallback | object,
        scope?: object
    ): EventEmitter {
        // If there is no event break
        if (typeof events == "undefined") return this;

        // Create a new event every space
        if (typeof events == "string") events = events.trim().split(/\s/g);

        let _name: string;
        let _callback: ListenerCallback;
        let isObject = typeof events == "object" && !Array.isArray(events);

        let _scope: object = isObject ? callback : scope;
        if (!isObject) _callback = (callback as ListenerCallback);

        // Loop through the list of events
        Object.keys(events).forEach(key => {
            // Select the name of the event from the list
            // Remember events can be {String | Object | Array<any>}

            // Check If events is an Object (JSON like Object, and not an Array)
            if (isObject) {
                _name = key;
                _callback = events[key];
            } else {
                _name = events[key];
            }

            if (typeof _callback === "function") {
                this.removeListener(_name, _callback, _scope);
            } else this.delete(_name);
        }, this);
        return this;
    }

    // /**
    //  * Adds a one time event listener for an event,
    //  * do note, you can't use .off to remove events listeners for the kind of event,
    //  * however, you can still remove the entire event
    //  *
    //  * @param {EventInput} events
    //  * @param {ListenerCallback | object} [callback]
    //  * @param {object} [scope]
    //  * @returns EventEmitter
    //  * @memberof EventEmitter
    //  */
    // public once(
    //     events: EventInput,
    //     callback?: ListenerCallback | object,
    //     scope?: object
    // ): EventEmitter {
    //     // If there is no event break
    //     if (typeof events == "undefined") return this;

    //     // Create a new event every space
    //     if (typeof events == "string") events = events.trim().split(/\s/g);

    //     let _name: string;
    //     let _callback: ListenerCallback;
    //     let isObject = typeof events === "object" && !Array.isArray(events);

    //     let _scope: object = isObject ? callback : scope;
    //     if (!isObject) _callback = (callback as ListenerCallback);

    //     // Loop through the list of events
    //     Object.keys(events).forEach(key => {
    //         // Select the name of the event from the list
    //         // Remember events can be {String | Object | Array<string>}

    //         // Check If events is an Object (JSON like Object, and not an Array)
    //         if (isObject) {
    //             _name = key;
    //             _callback = events[key];
    //         } else {
    //             _name = events[key];
    //         }

    //         let onceFn: ListenerCallback = (...args) => {
    //             if (isObject) {
    //                 _name = key;
    //                 _callback = events[key];
    //             } else {
    //                 _name = events[key];
    //             }

    //             this.off(_name, onceFn, _scope);
    //             _callback.apply(_scope, args);
    //         };

    //         this.on(_name, onceFn, _scope);
    //     }, this);
    //     return this;
    // }

	/**
	 * Call all listeners within an event
	 *
	 * @param {(string | Array<any>)} events
     * @param {...any} args
	 * @returns EventEmitter
	 * @memberof EventEmitter
	 */
    public emit(
        events: string | Array<any>,
        ...args: any
    ): EventEmitter {
        // If there is no event break
        if (typeof events == "undefined") return this;

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
}

export default EventEmitter;
