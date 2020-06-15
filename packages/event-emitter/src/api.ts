import { Manager } from "managerjs";

export type ListenerCallback = (...args: any) => void;
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
export class Listener {
	/**
	 * The current listener data
	 *
	 * @private
	 * @type IListener
	 * @memberof Listener
	 */
    private listener: IListener;

	/**
	 * Creates an instance of Listener.
	 *
	 * @param {IListener} { callback = () => { }, scope = null, name = "event" }
	 * @memberof Listener
	 */
    constructor({
        callback = () => { },
        scope = null,
        name = "event",
    }: IListener) {
        this.listener = { callback, scope, name };
    }

	/**
	 * Returns the callback Function of the Listener
	 *
	 * @returns ListenerCallback
	 * @memberof Listener
	 */
    public getCallback(): ListenerCallback {
        return this.listener.callback;
    }

	/**
	 * Returns the scope as an Object, from the Listener
	 *
	 * @returns object
	 * @memberof Listener
	 */
    public getScope(): object {
        return this.listener.scope;
    }

	/**
	 * Returns the event as a String, from the Listener
	 *
	 * @returns string
	 * @memberof Listener
	 */
    public getEventName(): string {
        return this.listener.name;
    }

	/**
	 * Returns the listener as an Object
	 *
	 * @returns IListener
	 * @memberof Listener
	 */
    public toJSON(): IListener {
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
export class Event extends Manager<number, Listener> {
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
    public on(
        events: EventInput,
        callback?: ListenerCallback,
        scope?: object
    ): EventEmitter {
        // If there is no event break
        if (typeof events == "undefined") return this;

        // Create a new event every space
        if (typeof events == "string") events = events.split(/\s/g);

        let _name: string;
        let _callback: ListenerCallback;
        let _scope: object;

        // Loop through the list of events
        Object.keys(events).forEach(key => {
            // Select the name of the event from the list
            // Remember events can be {String | Object | Array<string>}

            // Check If events is an Object (JSON like Object, and not an Array)
            if (typeof events == "object" && !Array.isArray(events)) {
                _name = key;
                _callback = events[key];
                _scope = callback;
            } else {
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
    public removeListener(
        name: string,
        callback: ListenerCallback,
        scope: object
    ): Event {
        let event: Event = this.getEvent(name);

        if (callback) {
            let i = 0,
                len: number = event.size,
                value: Listener;
            let listener = new Listener({ name, callback, scope });
            for (; i < len; i++) {
                value = event.get(i);
                console.log(value);
                if (
                    value.getCallback() === listener.getCallback() &&
                    value.getScope() === listener.getScope()
                )
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
    public off(
        events: EventInput,
        callback?: ListenerCallback,
        scope?: object
    ): EventEmitter {
        // If there is no event break
        if (typeof events == "undefined") return this;

        // Create a new event every space
        if (typeof events == "string") events = events.split(/\s/g);

        let _name: string;
        let _callback: ListenerCallback;
        let _scope: object;

        // Loop through the list of events
        Object.keys(events).forEach((key) => {
            // Select the name of the event from the list
            // Remember events can be {String | Object | Array<any>}

            // Check If events is an Object (JSON like Object, and not an Array)
            if (typeof events == "object" && !Array.isArray(events)) {
                _name = key;
                _callback = events[key];
                _scope = callback;
            } else {
                _name = events[key];
                _callback = callback;
                _scope = scope;
            }

            if (_callback) {
                this.removeListener(_name, _callback, _scope);
            } else this.delete(_name);
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
    public once(
        events: EventInput,
        callback: ListenerCallback,
        scope: object
    ): EventEmitter {
        // If there is no event break
        if (typeof events == "undefined") return this;

        // Create a new event every space
        if (typeof events == "string") events = events.split(/\s/g);

        let onceFn: ListenerCallback = (...args) => {
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
    public emit(
        events: string | Array<any>,
        ...args: any
    ): EventEmitter {
        // If there is no event break
        if (typeof events == "undefined") return this;

        // Create a new event every space
        if (typeof events == "string") events = events.split(/\s/g);

        // Loop through the list of events
        events.forEach((event: string) => {
            let listeners: Event = this.getEvent(event);

            const customEvent: CustomEvent<any> = new CustomEvent(event, { detail: args })
            window.dispatchEvent(customEvent);

            listeners.forEach((listener: Listener) => {
                let { callback, scope }: IListener = listener.toJSON();
                callback.apply(scope, args);
            });
        }, this);
        return this;
    }
}

export default EventEmitter;