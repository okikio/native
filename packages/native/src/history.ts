import { Service } from "./service";
import { getHashedPath, newURL } from "./url";

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
	url: string;
	index?: number;
	transition: string;
	data: IStateData;
}

export interface IHistoryItem {
	index: number;
	states: IState[];
}

/**
 * A quick snapshot of page coordinates, e.g. scroll positions
 *
 * @export
 * @param {number} [x=window.scrollX]
 * @param {number} [y=window.scrollY]
 */
export const newCoords = (x: number = window.scrollX, y: number = window.scrollY): ICoords => ({ x, y });

/**
 * Represents the current status of the page consisting of properties like: url, transition, and data
 *
 * @export
 * @param {IState} {
 *         url = getHashedPath(newURL()),
 *         index = 0,
 *         transition = "default",
 *         data = {
 *             scroll: newCoords(),
 *             trigger: "HistoryManager"
 *         }
 *     }
 * @memberof State
*/
export const newState = (state: IState = {
	url: getHashedPath(newURL()),
	index: 0,
	transition: "default",
	data: {
		scroll: newCoords(),
		trigger: "HistoryManager"
	}
}): IState => (state);

export interface IHistoryManager extends Service {
	states: IState[],
	pointer: number,

	init(): any,
	get(index: number): IState,
	add(value?: IState, historyAction?: "replace" | "push"): HistoryManager,
	remove(index?: number): HistoryManager,
	replace(newStates: IState[]): HistoryManager,
	set(i: number, state: IState): IState,
	current: IState,
	last: IState,
	previous: IState | null,
	length: number,

}

/**
 * History of the site, stores only the State class
 *
 * @export
 * @class HistoryManager
 * @extends {Manager<number, IState>}
 */
export class HistoryManager extends Service implements IHistoryManager {
	public states: IState[];
	public pointer = -1;

	/**
	 * Creates an instance of the HistoryManager class, which inherits properties and methods from the Storage class.
	 *
	 * @memberof HistoryManager
	 * @constructor
	 */
	init() {
		this.states = [];

		let state = newState();
		this.add(state, "replace");
	}

	public get(index: number) {
		return this.states[index];
	}

	/**
	 * Sets the index of the state before adding to HistoryManager
	 *
	 * @param {IState} value
	 * @returns HistoryManager
	 */
	public add(value?: IState, historyAction: "replace" | "push" = "push"): HistoryManager {
		let state = newState(value);
		let len = this.length;
		this.states.push({ ...state });
		this.pointer = len;

		let item: IHistoryItem = {
			index: this.pointer,
			states: [...this.states]
		};
		changeState(historyAction, state, item);
		return this;
	}

	public remove(index?: number) {
		if (index) {
			this.states.splice(index, 1);
		} else {
			this.states.pop();
		}

		this.pointer--;
		return this;
	}

	public replace(newStates: IState[]) {
		this.states = newStates;
		return this;
	}

	/**
	 * Set state by index.
	 */
	public set(i: number, state: IState) {
		return (this.states[i] = state);
	}

	/**
	 * Get the current state.
	 */
	get current(): IState {
		return this.get(this.pointer);
	}

	/**
	 * Get the last state (top of the history stack).
	 */
	get last(): IState {
		return this.get(this.length - 1);
	}

	/**
	 * Get the previous state.
	 */
	get previous(): IState | null {
		return this.pointer < 1 ? null : this.get(this.pointer - 1);
	}

	get length() {
		return this.states.length;
	}

}

/**
 * Either push or replace history state
 *
 * @param {("push" | "replace")} action
 * @param {IState} state
 * @param {_URL} url
 */
export const changeState = (action: "push" | "replace", state: IState, item: object) => {
	let href = getHashedPath(newURL(state.url));
	let args = [item, "", href];
	if (window.history) {
		switch (action) {
			case "push":
				window.history.pushState.apply(window.history, args);
				break;
			case "replace":
				window.history.replaceState.apply(window.history, args);
				break;
		}
	}
};
