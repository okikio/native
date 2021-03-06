import { Service } from "./service";
import { getHashedPath, newURL } from "./url";

export type TypeTrigger = HTMLAnchorElement | "HistoryManager" | "popstate" | "back" | "forward";
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

/** A quick snapshot of page scroll coordinates */
export const newCoords = (x: number = window.scrollX, y: number = window.scrollY): ICoords => ({ x, y });

/** Creates a state; a state represents the current status of the page consisting of properties like: url, transition, and data */
export const newState = (state: IState = {
	url: getHashedPath(newURL()),
	index: 0,
	transition: "default",
	data: {
		scroll: newCoords(),
		trigger: "HistoryManager"
	}
}): IState => (state);

/** Keeps a record of the history of the App; it stores only the states of Pages */
export class HistoryManager extends Service {
	public states: IState[];
	public pointer = -1;

	/** Initializes the states array, and replace the history pushState data with the states array */
	init() {
		this.states = [];

		let state = newState();
		this.add(state, "replace");
	}

	/** Get a state based on it's index */
	public get(index: number) {
		return this.states[index];
	}

	/** Add a state to HistoryManager and change the history pushState data based on the historyAction specified */
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

	/** Replaces the states array with another states array, this is later used when going back and forward in page history */
	public replace(newStates: IState[]) {
		this.states = newStates;
		return this;
	}

	/** Set state by index. */
	public set(i: number, state: IState) {
		return (this.states[i] = state);
	}

	/** Get the current state */
	get current(): IState {
		return this.get(this.pointer);
	}

	/** Get the last state (top of the history stack). */
	get last(): IState {
		return this.get(this.length - 1);
	}

	/** Get the previous state. */
	get previous(): IState | null {
		return this.pointer < 1 ? null : this.get(this.pointer - 1);
	}

	get length() {
		return this.states.length;
	}
}

export interface IHistoryManager extends HistoryManager { }

/** Either push or replace history state */
export const changeState = (action: "push" | "replace", state: IState, item: object) => {
	let href = getHashedPath(state.url);
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
