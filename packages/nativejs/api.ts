// The config variables
export const CONFIG = {
	wrapperAttr: "wrapper",
    noAjaxLinkAttr: "no-ajax-link",
	noPrefetchAttr: "no-prefetch",
	headers: [
		["x-partial", "true"]
	],
	timeout: 30000
};

/**
 * Converts string into data attributes
 *
 * @param {string} value
 */
export const toAttr = (value: string): string => `[data-${value}]`;

/**
 * Manages complex lists of named data, eg. A page can be stored in a list by of other pages with the url being how the page is stored in the list. Managers use Maps to store data.
 *
 * @export
 * @class Manager
 * @template T
 */
export class Manager<T> {
	/**
	 * The complex list of named data, to which the Manager controls
	 *
	 * @protected
	 * @type {Map<any, T>}
	 * @memberof Manager
	 */
	protected list: Map<any, T>;

	/**
	 * Creates an instance of the Manager class.
	 *
	 * @memberof Manager
	 * @constructor
	 */
	constructor() {
		this.list = new Map();
	}

	/**
	 * Returns the Manager class's list
	 *
	 * @returns {Map<any, T>}
	 * @memberof Manager
	 */
	public getList(): Map<any, T> {
		return this.list;
	}

	/**
	 * Get a value stored in the Manager
	 *
	 * @public
	 * @param  {*} key - The key to find in the Manager's list
	 * @returns T
	 */
	public get(key: any): T {
		return this.list.get(key);
	}

	/**
	 * Set a value stored in the Manager
	 *
	 * @public
	 * @param  {*} key - The key where the value will be stored
	 * @param  {T} value - The value to store
	 * @returns Manager<T>
	 */
	public set(key: any, value: T): Manager<T> {
		this.list.set(key, value);
		return this;
	}

	/**
	 * Returns the keys of all items stored in the Manager
	 *
	 * @public
	 * @returns IterableIterator<any>
	 */
	public keys(): IterableIterator<any> {
		return this.list.keys();
	}

	/**
	 * Returns the total number of items stored in the Manager
	 *
	 * @public
	 * @returns Number
	 */
	public size(): number {
		return this.list.size;
	}

	/**
	 * Returns the last item in the Manager who's index is a certain distance from the last item in the Manager
	 *
	 * @public
	 * @param {Number} [distance=0] - Distance from the last item in the Manager
	 * @returns T
	 */
	public last(distance: number = 0): T {
		let size = this.size();
		let key = this.keys()[size - distance];
		return this.get(key);
	}

	/**
	 * Returns the second last item in the Manager
	 *
	 * @public
	 * @returns T
	 */
	public prev(): T {
		return this.last(1);
	}

	/**
	 * Removes a value stored in the Manager, via the key
	 *
	 * @public
	 * @param  {*} key - The key for the key value pair to be removed
	 * @returns Manager<T>
	 */
	public remove(key: any): Manager<T> {
		this.list.delete(key);
		return this;
	}

	/**
	 * Clear the Manager of all its contents
	 *
	 * @public
	 * @returns Manager<T>
	 */
	public clear(): Manager<T> {
		this.list.clear();
		return this;
	}

	/**
	 * Checks if the Manager contains a certain key
	 *
	 * @public
	 * @param {*} key
	 * @returns Boolean
	 */
	public has(key: any): boolean {
		return this.list.has(key);
	}

	/**
	 * Iterates through the Managers contents, calling a callback function every iteration
	 *
	 * @param {*} [callback=(...args: any): void => { }]
	 * @param {object} context
	 * @returns Manager<T>
	 * @memberof Manager
	 */
	public forEach(
		callback: any = (...args: any): void => { },
		context?: object
	): Manager<T> {
		this.list.forEach(callback, context);
		return this;
	}
}

/**
 * A tweak to the Manager class that makes it self aware of the App class it's instantiated in
 *
 * @export
 * @class AdvancedManager
 * @extends {Manager<T>}
 * @template T
 */
export class AdvancedManager<T> extends Manager<T> {
	/**
	 * The instance of the App class, the Manager is instantiated in
	 *
	 * @private
	 * @type {App}
	 * @memberof AdvancedManager
	 */
	private app: App;

	/**
	 * Creates an instance of AdvancedManager.
	 *
	 * @param {App} app - The instance of the App class, the Manager is instantiated in
	 * @memberof AdvancedManager
	 */
	constructor(app: App) {
		super();
		this.app = app;
	}

	/**
	 * Returns the instance the App class
	 *
	 * @returns App
	 * @memberof AdvancedManager
	 */
	public getApp(): App {
		return this.app;
	}
}

/**
 * Controls lists of a certain type that follow chronological order, meant for the History class. Storage use Sets to store data.
 *
 * @export
 * @class Storage
 * @extends {Manager<T>}
 * @template T
 */
export class Storage<T> extends Manager<T> {
	/**
	 * Creates an instance of Storage.
	 *
	 * @memberof Storage
	 */
	constructor() {
		super();
	}

	/**
	 * Get a value stored in Storage, the key must be a number though.
	 *
	 * @param {number} key
	 * @returns T
	 * @memberof Storage
	 */
	public get(key: number): T {
		return super.get(key);
	}

	/**
	 * Sets a value in the **Storage** class
	 *
	 * @param {number} key
	 * @param {T} value
	 * @returns Storage<T>
	 * @memberof Storage
	 */
	public set(key: number, value: T): Storage<T> {
		super.set(key, value);
		return this;
	}

	/**
	 * Adds a value to Storage
	 *
	 * @public
	 * @param  {T} value
	 * @returns Storage<T>
	 */
	public add(value: T): Storage<T> {
		let size = this.size() + 1;
		this.set(size, value);
		return this;
	}

	/**
	 * Lists all values stored in Storage.
	 *
	 * @returns IterableIterator<T>
	 * @memberof Storage
	 */
	public values(): IterableIterator<T> {
		return this.list.values();
	}
}

/**
 * A tweak to the Storage class that makes it self aware of the App class it's instantiated in
 *
 * @export
 * @class AdvancedStorage
 * @extends {Storage<T>}
 * @template T
 */
export class AdvancedStorage<T> extends Storage<T> {
	/**
	 * The instance of the App class, the Manager is instantiated in
	 *
	 * @private
	 * @type {App}
	 * @memberof AdvancedStorage
	 */
	private app: App;

	/**
	 * Creates an instance of AdvancedStorage.
	 *
	 * @param {App} app - The instance of the App class, the Manager is instantiated in
	 * @memberof AdvancedStorage
	 */
	constructor(app: App) {
		super();
		this.app = app;
	}

	/**
	 * Returns the instance the App class
	 *
	 * @returns App
	 * @memberof AdvancedStorage
	 */
	public getApp(): App {
		return this.app;
	}
}

/**
 * Adds new methods to the native URL Object; it seemed cleaner than using a custom method or editing the prototype.
 *
 * This doesn't extend the **Class** object because it's meants to be a small extention of the native URL class.
 *
 * @export
 * @class _URL
 * @extends {URL}
 */
export class _URL extends URL {
	// Read up on the native URL class [devdocs.io/dom/url]
	/**
	 * Creates an instance of _URL.
	 *
	 * @param {string} [url=window.location.toString()]
	 * @memberof _URL
	 */
	constructor(url: string = window.location.toString()) {
		super(url);
	}

	/**
	 * Removes the hash from the URL for a clean URL string
	 *
	 * @returns string
	 * @memberof _URL
	 */
	public clean(): string {
		return this.toString().replace(/#.*/, "");
	}

	/**
	 * Compares this clean **_URL** to another clean **_URL**
	 *
	 * @param {_URL} url
	 * @returns boolean
	 * @memberof _URL
	 */
	public compare(url: _URL): boolean {
		return this.clean() == url.clean();
	}

	/**
	 * Compares two clean URLs to each other
	 *
	 * @static
	 * @param {_URL} a
	 * @param {_URL} b
	 * @returns boolean
	 * @memberof _URL
	 */
	static compare(a: _URL, b: _URL): boolean {
		return a.compare(b);
	}
}

/**
 * This is the default starting URL, to avoid needless instances of the same class that produce the same value, I defined the default value
 */
export const newURL = new _URL();

export type LinkEvent = MouseEvent | TouchEvent;
export type StateEvent = LinkEvent | "ReplaceState";
export type Trigger = HTMLAnchorElement | "HistoryManager" | "popstate" | "back" | "forward";

export interface ICoords {
	readonly x: number;
	readonly y: number;
}

export interface IStateData {
	scroll: ICoords;
	trigger: Trigger;
	event?: StateEvent;
}

export interface IState {
	url: _URL;
	index?: number;
	transition: string;
	data: IStateData;
}

/**
 * A quick snapshot of page coordinates, e.g. scroll positions
 *
 * @export
 * @class Coords
 * @implements {ICoords}
 */
export class Coords implements ICoords {
	public x: number;
	public y: number;

	/**
	 * Creates an instance of Coords.
	 *
	 * @param {number} [x=window.scrollX]
	 * @param {number} [y=window.scrollY]
	 * @memberof Coords
	 */
	constructor(x: number = window.scrollX, y: number = window.scrollY) {
		this.x = x;
		this.y = y;
	}
}

/**
 * Represents the current status of the page consisting of properties like: url, transition, and data
 *
 * @export
 * @class State
 */
export class State {
	/**
	 * The current state data
	 *
	 * @private
	 * @type {IState}
	 * @memberof State
	 */
	private state: IState;

	/**
	 * Creates an instance of State.
	 * @param {IState} {
	 *         url = newURL,
	 *         index = 0,
	 *         transition = "none",
	 *         data = {
	 *             scroll: new StateCoords(),
	 *             trigger: "HistoryManager",
	 *             event: "ReplaceState"
	 *         }
	 *     }
	 * @memberof State
	 */
	constructor({
		url = newURL,
		index = 0,
		transition = "none",
		data = {
			scroll: new Coords(),
			trigger: "HistoryManager",
			event: "ReplaceState",
		},
	}: IState) {
		this.state = { index, url, transition, data };
	}

	/**
	 * Get state index
	 *
	 * @returns number
	 * @memberof State
	 */
	public getIndex(): number {
		return this.state.index;
	}

	/**
	 * Set state index
	 *
	 * @param {number} index
	 * @returns State
	 * @memberof State
	 */
	public setIndex(index: number): State {
		this.state.index = index;
		return this;
	}

	/**
	 * Get state URL
	 *
	 * @returns _URL
	 * @memberof State
	 */
	public getURL(): _URL {
		return this.state.url;
	}

	/**
	 * Get state transition
	 *
	 * @returns string
	 * @memberof State
	 */
	public getTransition(): string {
		return this.state.transition;
	}

	/**
	 * Get state data
	 *
	 * @returns IStateData
	 * @memberof State
	 */
	public getData(): IStateData {
		return this.state.data;
	}

	/**
	 * Returns the State as an Object
	 *
	 * @returns IState
	 * @memberof State
	 */
	public toJSON(): IState {
		return this.state;
	}
}

/**
 * History of the site, stores only the State class
 *
 * @export
 * @class HistoryManager
 * @extends {AdvancedStorage<State>}
 */
export class HistoryManager extends AdvancedStorage<State> {
	/**
	 * Creates an instance of the HistoryManager class, which inherits properties and methods from the Storage class.
	 *
	 * @param {App} app
	 * @memberof HistoryManager
	 * @constructor
	 */
	constructor(app: App) {
		super(app);
	}

	/**
	 * Sets the index of the state before adding to HistoryManager
	 *
	 * @param {State} value
	 * @returns HistoryManager
	 * @memberof HistoryManager
	 */
	public add(value: State): HistoryManager {
		let state = value;
		let index = this.size();
		state.setIndex(index);
		super.add(state);
		return this;
	}

	/**
	 * Quick way to add a State to the HistoryManager
	 *
	 * @param {IState} value
	 * @returns HistoryManager
	 * @memberof HistoryManager
	 */
	public addItem(value: IState): HistoryManager {
		let state = new State(value);
		this.add(state);
		return this;
	}
}

interface IService {
	PageManager: PageManager;
	EventEmitter: EventEmitter;
	HistoryManager: HistoryManager;
	ServiceManager: ServiceManager;
	TransitionManager: TransitionManager;
}

/**
 * Controls specific kinds of actions that require JS
 *
 * @export
 * @class Service
 */
export class Service {
	/**
	 * Stores access to the App class's EventEmitter
	 *
	 * @protected
	 * @type {EventEmitter}
	 * @memberof Service
	 */
	protected EventEmitter: EventEmitter;

	/**
	 * Stores access to the App class's PageManager
	 *
	 * @protected
	 * @type {PageManager}
	 * @memberof Service
	 */
	protected PageManager: PageManager;

	/**
	 * Stores access to the App class's HistoryManager
	 *
	 * @protected
	 * @type {HistoryManager}
	 * @memberof Service
	 */
	protected HistoryManager: HistoryManager;

	/**
	 * Stores the ServiceManager the service is install on
	 *
	 * @protected
	 * @type {ServiceManager}
	 * @memberof Service
	 */
	protected ServiceManager: ServiceManager;

	/**
	 * Stores access to the App's TransitionManager
	 *
	 * @protected
	 * @type {TransitionManager}
	 * @memberof Service
	 */
	protected TransitionManager: TransitionManager;

	/**
	 * Method is run once when Service is installed on a ServiceManager
	 *
	 * @param {IService} {
	 *         PageManager,
	 *         EventEmitter,
	 *         HistoryManager,
	 *         ServiceManager,
	 *         TransitionManager
	 *     }
	 * @memberof Service
	 */
	public install({
		PageManager,
		EventEmitter,
		HistoryManager,
		ServiceManager,
		TransitionManager,
	}: IService): void {
		this.PageManager = PageManager;
		this.EventEmitter = EventEmitter;
		this.HistoryManager = HistoryManager;
		this.ServiceManager = ServiceManager;
		this.TransitionManager = TransitionManager;
	}

	// Called on start of Service
	public boot(): void { }

	// Initialize events
	public initEvents(): void { }

	// Stop events
	public stopEvents(): void { }

	// Stop services
	public stop(): void {
		this.stopEvents();
	}
}

/**
 * A service that interacts with the DOM
 *
 * @abstract
 * @extends {Service}
 */
export class Component extends Service {
	/**
	 * Stores the elements the Component is going to act on
	 *
	 * @type {NodeListOf<Element>}
	 * @memberof Component
	 */
	public el: NodeListOf<Element>;

	/**
	 * Stores the query to find the Elements the Component is going to act on
	 *
	 * @type {String}
	 * @memberof Component
	 */
	public query: string;

	/**
	 * Creates an instance of Component.
	 *
	 * @param {string} query
	 * @memberof Component
	 */
	constructor(query: string) {
		super();
		this.query = query;
		this.el = document.querySelectorAll(this.query);
	}
}

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
	 * @type {IListener}
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
 * @extends {Storage<Listener>}
 */
export class Event extends Storage<Listener> {
	/**
	 * The name of the event
	 *
	 * @private
	 * @type {string}
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

/**
 * An event emitter
 *
 * @export
 * @class EventEmitter
 * @extends {AdvancedManager<Event>}
 */
export class EventEmitter extends AdvancedManager<Event> {
	/**
	 * Creates an instance of EventEmitter.
	 *
	 * @param {App} app
	 * @memberof EventEmitter
	 */
	constructor(app: App) {
		super(app);
	}

	/**
	 * Gets events, if event doesn't exist create a new Event
	 *
	 * @public
	 * @param {String} name
	 * @returns Event
	 */
	// Get event, ensure event is valid
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
	 * @param {(string | object | Array<any>)} events
	 * @param {ListenerCallback} callback
	 * @param {object} scope
	 * @returns
	 * @memberof EventEmitter
	 */
	public on(
		events: string | object | Array<any>,
		callback: ListenerCallback,
		scope: object
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

			this.newListener(_name, _callback, _scope);
		}, this);
		return this;
	}

	/**
	 * Removes a listener from an event
	 *
	 * @param {string} name
	 * @param {ListenerCallback} callback
	 * @param {object} scope
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
				len: number = event.size(),
				value: Listener;
			let listener = new Listener({ name, callback, scope });
			for (; i < len; i++) {
				value = event.get(i);
				if (
					value.getCallback() === listener.getCallback() &&
					value.getScope() === listener.getScope()
				)
					break;
			}

			event.remove(i);
		}
		return event;
	}

	/**
	 * Removes a listener from a given event, or it just completely removes an event
	 *
	 * @param {(string | object | Array<any>)} events
	 * @param {ListenerCallback} callback
	 * @param {object} scope
	 * @returns EventEmitter
	 * @memberof EventEmitter
	 */
	public off(
		events: string | object | Array<any>,
		callback: ListenerCallback,
		scope: object
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
			} else this.remove(_name);
		}, this);
		return this;
	}

	/**
	 * Adds a one time event listener for an event
	 *
	 * @param {(string | object | Array<any>)} events
	 * @param {ListenerCallback} callback
	 * @param {object} scope
	 * @returns EventEmitter
	 * @memberof EventEmitter
	 */
	public once(
		events: string | object | Array<any>,
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
	 * @param {Array<any>} [args=[]]
	 * @returns EventEmitter
	 * @memberof EventEmitter
	 */
	public emit(
		events: string | Array<any>,
		args: Array<any> = []
	): EventEmitter {
		// If there is no event break
		if (typeof events == "undefined") return this;

		// Create a new event every space
		if (typeof events == "string") events = events.split(/\s/g);

		// Loop through the list of events
		events.forEach((event: string) => {
			let listeners: Event = this.getEvent(event);
			listeners.forEach((listener: Listener) => {
				let { callback, scope }: IListener = listener.toJSON();
				callback.apply(scope, args);
			});
		}, this);
		return this;
	}
}

/**
 * The Service Manager controls the lifecycle of all services in an App
 *
 * @export
 * @class ServiceManager
 * @extends {AdvancedStorage<Service>}
 */
export class ServiceManager extends AdvancedStorage<Service> {
	/**
	 * Creates an instance of a ServiceManager
	 *
	 * @param {App} app
	 * @memberof ServiceManager
	 * @constructor
	 */
	constructor(app: App) {
		super(app);
	}

	/**
	 * Calls the method of the same method name for all service that are currently installed
	 *
	 * @param {string} method
	 * @param {Array<any>} [args=[]]
	 * @returns
	 * @memberof ServiceManager
	 */
	public methodCall(method: string, ...args: any): ServiceManager {
		this.forEach((service: Service) => {
			service[method].call(this, ...args);
		});
		return this;
	}

	/**
	 * Call the install method for all Services
	 *
	 * @returns ServiceManager
	 * @memberof ServiceManager
	 */
	public install(): ServiceManager {
		const {
			getPages,
			getEmitter,
			getHistory,
			getServices,
			getTransitions,
		}: App = this.getApp();
		return this.methodCall("install", {
			PageManager: getPages(),
			EventEmitter: getEmitter(),
			HistoryManager: getHistory(),
			ServiceManager: getServices(),
			TransitionManager: getTransitions(),
		});
	}

	/**
	 * Call the install boot for all Services
	 *
	 * @returns ServiceManager
	 * @memberof ServiceManager
	 */
	public boot(): ServiceManager {
		return this.methodCall("boot");
	}

	/**
	 * Call the install initEvents for all Services
	 *
	 * @returns ServiceManager
	 * @memberof ServiceManager
	 */
	public initEvents(): ServiceManager {
		return this.methodCall("initEvents");
	}

	/**
	 * Call the install stopEvents for all Services
	 *
	 * @returns ServiceManager
	 * @memberof ServiceManager
	 */
	public stopEvents(): ServiceManager {
		return this.methodCall("stopEvents");
	}

	/**
	 * Call the install stop for all Services
	 *
	 * @returns ServiceManager
	 * @memberof ServiceManager
	 */
	public stop(): ServiceManager {
		return this.methodCall("stop");
	}
}

/**
 * Parses strings to DOM
 */
export const PARSER: DOMParser = new DOMParser();

/**
 * A page represents the DOM elements that create each page
 *
 * @export
 * @class Page
 */
export class Page {
	/**
	 * Holds the DOM of the current page
	 *
	 * @private
	 * @type {Document}
	 * @memberof Page
	 */
	private dom: Document;

	/**
	 * Holds the wrapper element to be swapped out of each Page
	 *
	 * @private
	 * @type {Element}
	 * @memberof Page
	 */
	private wrapper: Element;

	/**
	 * Holds the title of each page
	 *
	 * @private
	 * @type {string}
	 * @memberof Page
	 */
	private title: string;
	/**
	 * Holds the head element of each page
	 *
	 * @private
	 * @type {Element}
	 * @memberof Page
	 */
	private head: Element;

	/**
	 * Holds the body element of each page
	 *
	 * @private
	 * @type {Element}
	 * @memberof Page
	 */
	private body: Element;

	/**
	 * The URL of the current page
	 *
	 * @private
	 * @type {_URL}
	 * @memberof Page
	 */
	private url: _URL;

	/**
	 * Creates an instance of Page, it also creates a new page from response text, or a Document Object
	 *
	 * @param {_URL} [url=newURL]
	 * @param {(string | Document)} [dom=document]
	 * @memberof Page
	 */
	constructor(url: _URL = newURL, dom: string | Document = document) {
		this.url = url;
		if (typeof dom == "string") {
			this.dom = PARSER.parseFromString(dom, "text/html");
		} else this.dom = dom || document;

		const { title, head, body } = this.dom;

		this.title = title;
		this.head = head;
		this.body = body;
		this.wrapper = this.body.querySelector(toAttr(CONFIG.wrapperAttr));
	}

	/**
	 * Returns the current page's URL
	 *
	 * @returns {_URL}
	 * @memberof Page
	 */
	public getURL(): _URL {
		return this.url;
	}

	/**
	 * The page title
	 *
	 * @returns {string}
	 * @memberof Page
	 */
	public getTitle(): string {
		return this.title;
	}

	/**
	 * The page's head element
	 *
	 * @returns {Element}
	 * @memberof Page
	 */
	public getHead(): Element {
		return this.head;
	}

	/**
	 * The page's body element
	 *
	 * @returns {Element}
	 * @memberof Page
	 */
	public getBody(): Element {
		return this.body;
	}

	/**
	 * The page's wrapper element
	 *
	 * @returns {Element}
	 * @memberof Page
	 */
	public getWrapper(): Element {
		return this.wrapper;
	}

	/**
	 * The page's document
	 *
	 * @returns {Document}
	 * @memberof Page
	 */
	public getDOM(): Document {
		return this.dom;
	}
}

/**
 * The async function type, allows for smooth transition between Promises
 */
export type asyncFn = (err?: any, value?: any) => void;
export interface ITransition {
	oldPage: Page,
	newPage: Page,
	trigger: Trigger
}
export interface ITransitionData {
	from: Page,
	to?: Page,
	trigger: Trigger,
	done: asyncFn
}

/**
 * Controls the animation between pages
 *
 * @export
 * @class Transition
 */
export class Transition {
	/**
	 * Transition name
	 *
	 * @protected
	 * @type {string}
	 * @memberof Transition
	 */
	protected name: string = "Transition";
	/**
	 * The page to transtion from
	 *
	 * @protected
	 * @type {Page}
	 * @memberof Transition
	 */
	protected oldPage: Page;

	/**
	 * Page to transition to
	 *
	 * @protected
	 * @type {Page}
	 * @memberof Transition
	 */
	protected newPage: Page;

	/**
	 * What triggered the transition to occur
	 *
	 * @protected
	 * @type {Trigger}
	 * @memberof Transition
	 */
	protected trigger: Trigger;

	/**
	 * Initialize the transition
	 *
	 * @param {ITransition} {
	 * 		oldPage,
	 * 		newPage,
	 * 		trigger
	 * 	}
	 * @memberof Transition
	 */
	public init({
		oldPage,
		newPage,
		trigger
	}: ITransition): void {
		this.oldPage = oldPage;
		this.newPage = newPage;
		this.trigger = trigger;
	}

	/**
	 * Returns the Transition's name
	 *
	 * @returns string
	 * @memberof Transition
	 */
	public getName(): string {
		return this.name;
	}

	/**
	 * Returns the Transition's old page
	 *
	 * @returns {Page}
	 * @memberof Transition
	 */
	public getOldPage(): Page {
		return this.oldPage;
	}

	/**
	 * Returns the Transition's new page
	 *
	 * @returns {Page}
	 * @memberof Transition
	 */
	public getNewPage(): Page {
		return this.newPage;
	}

	/**
	 * Returns the Transition's trigger
	 *
	 * @returns {Trigger}
	 * @memberof Transition
	 */
	public getTrigger(): Trigger {
		return this.trigger;
	}

	// Based off the highwayjs Transition class
	/**
	 * Transition from current page
	 *
	 * @param {ITransitionData} { from, to, trigger, done }
	 * @memberof Transition
	 */
	public out({ from, to, trigger, done }: ITransitionData) {
		return done();
	}

	/**
	 * Transition into the next page
	 *
	 * @param {ITransitionData} { from, trigger, done }
	 * @memberof Transition
	 */
	public in({ from, trigger, done }: ITransitionData) {
		return done();
	}
}

/**
 * Controls which animation between pages to use
 *
 * @export
 * @class TransitionManager
 * @extends {AdvancedManager<Transition>}
 */
export class TransitionManager extends AdvancedManager<Transition> {
	/**
	 * Creates an instance of the TransitionManager
	 *
	 * @param {App} app
	 * @memberof TransitionManager
	 * @constructor
	 */
	constructor(app: App) {
		super(app);
	}
}

/**
 * Controls which page to be loaded
 *
 * @abstract
 * @extends {Manager}
 */
// Also know as the page cache
export class PageManager extends AdvancedManager<Page> {
	/**
	 * Creates an instance of the PageManager
	 *
	 * @param {App} app
	 * @memberof PageManager
	 * @constructor
	 */
	/**
	 * Creates an instance of the PageManager
	 *
	 * @param {App} app
	 * @memberof PageManager
	 */
	constructor(app: App) {
		super(app);

		this.set(newURL, new Page());
	}

	load(url: _URL) {
		return new Promise((resolve, reject) => {
			if (this.has(url)) {
				let _page = this.get(url);
				resolve(_page);
				return;
			}

			this.request(url).then((response) => {
				let _url = new _URL(url);
				let _page = new Page(response);
				this.set(_url, _page);

				return resolve(_page);
			});
		});
	}

	request(url: _URL) {
		return new Promise((resolve, reject) => {
			const headers = new Headers(CONFIG.headers);

			const timeout = window.setTimeout(() => {
				window.clearTimeout(timeout);
				reject("Request Timed Out!");
			}, CONFIG.timeout);

			fetch(url.toString(), {
				method: "GET",
				headers: headers,
				cache: "default",
				credentials: "same-origin",
			})
				.then((response) => {
					window.clearTimeout(timeout);

					if (response.status >= 200 && response.status < 300) {
						return resolve(response.text());
					}

					const err = new Error(response.statusText || "" + response.status);
					return reject(err);
				})
				.catch((err) => {
					window.clearTimeout(timeout);
					reject(err);
				});
		});
    }


	public async _request(url: _URL) {
        const headers = new Headers(CONFIG.headers);
        const timeout = window.setTimeout(() => {
            window.clearTimeout(timeout);
            throw "Request Timed Out!";
        }, CONFIG.timeout);

        try {
            let response = await fetch(url.toString(), {
                method: "GET",
                headers: headers,
                cache: "default",
                credentials: "same-origin",
            });

            window.clearTimeout(timeout);
            if (response.status >= 200 && response.status < 300) {
                return await response.text();
            }

            const err = new Error(response.statusText || "" + response.status);
            throw err;
        } catch (err) {
            window.clearTimeout(timeout);
            throw err;
        }
	}
}

export class App {
	history: HistoryManager;
	transitions: TransitionManager;
	services: ServiceManager;
	emitter: EventEmitter;
	pages: PageManager;
	constructor() {
		this.history = new HistoryManager(this);
		this.transitions = new TransitionManager(this);
		this.services = new ServiceManager(this);
		this.emitter = new EventEmitter(this);
		this.pages = new PageManager(this);
	}

	public getEmitter(): EventEmitter {
		return this.emitter;
	}

	public getServices(): ServiceManager {
		return this.services;
	}

	public getPages(): PageManager {
		return this.pages;
	}

	public getTransitions(): TransitionManager {
		return this.transitions;
	}

	public getHistory(): HistoryManager {
		return this.history;
	}

	addService(service) {
		this.services.add(service);
		return this;
	}

	addTransition(service) {
		this.services.add(service);
		return this;
	}

	add(type, value) {
		switch (type) {
			case "service":
				this.addService(value);
				break;
			case "transition":
				this.addTransition(value);
				break;
		}
	}

	on(events, callback) {
		this.emitter.on(events, callback, this);
		return this;
	}

	off(events, callback) {
		this.emitter.off(events, callback, this);
		return this;
	}

	once(events, callback) {
		this.emitter.once(events, callback, this);
		return this;
	}

	emit(events, args) {
		this.emitter.emit(events, args);
		return this;
	}
}
