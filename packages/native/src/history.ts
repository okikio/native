import { Manager } from "./manager";
import { _URL } from "./url";

export type Trigger = HTMLAnchorElement | "HistoryManager" | "popstate" | "back" | "forward";

export interface ICoords {
	readonly x: number;
	readonly y: number;
}

export interface IStateData {
	scroll: ICoords;
	[key: string]: any;
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
	 * @type IState
	 * @memberof State
	 */
	private state: IState;

	/**
	 * Creates an instance of State.
	 * @param {IState} {
     *         url = new _URL(),
	 *         index = 0,
	 *         transition = "default",
	 *         data = {
	 *             scroll: new StateCoords(),
	 *             trigger: "HistoryManager"
	 *         }
	 *     }
	 * @memberof State
	 */
	constructor(state: IState = {
		url: new _URL(),
		index: 0,
		transition: "default",
		data: {
			scroll: new Coords(),
			trigger: "HistoryManager"
		}
	}) {
		this.state = state;
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
	 * Get state URL as a string
	 *
	 * @returns string
	 * @memberof State
	 */
	public getURLPathname(): string {
		return this.state.url.getPathname();
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
	 * @returns object
	 * @memberof State
	 */
	public toJSON(): object {
		const { url, index, transition, data }: IState = this.state;
		return {
			url: url.getFullPath(), index, transition, data
		};
	}
}

/**
 * History of the site, stores only the State class
 *
 * @export
 * @class HistoryManager
 * @extends {Manager<number, State>}
 */
export class HistoryManager extends Manager<number, State> {
	/**
	 * Creates an instance of the HistoryManager class, which inherits properties and methods from the Storage class.
	 *
	 * @memberof HistoryManager
	 * @constructor
	 */
	constructor() {
		super();
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
		let index = this.size;
		super.add(state);
		state.setIndex(index);
		return this;
	}

	/**
	 * Quick way to add a State to the HistoryManager
	 *
	 * @param {IState} value
	 * @returns HistoryManager
	 * @memberof HistoryManager
	 */
	public addState(value: IState | State): HistoryManager {
		let state = value instanceof State ? value : new State(value);
		this.add(state);
		return this;
	}
}
