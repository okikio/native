export declare type Trigger = HTMLAnchorElement | "HistoryManager" | "popstate" | "back" | "forward";
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
export declare const newCoords: (x?: number, y?: number) => ICoords;
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
export declare const newState: (state?: IState) => IState;
/**
 * History of the site, stores only the State class
 *
 * @export
 * @class HistoryManager
 * @extends {Manager<number, IState>}
 */
export declare class HistoryManager {
    states: IState[];
    pointer: number;
    /**
     * Creates an instance of the HistoryManager class, which inherits properties and methods from the Storage class.
     *
     * @memberof HistoryManager
     * @constructor
     */
    constructor();
    get(index: number): IState;
    /**
     * Sets the index of the state before adding to HistoryManager
     *
     * @param {IState} value
     * @returns HistoryManager
     */
    add(value?: IState, historyAction?: "replace" | "push"): HistoryManager;
    remove(index?: number): this;
    replace(newStates: IState[]): this;
    /**
     * Set state by index.
     */
    set(i: number, state: IState): IState;
    /**
     * Get the current state.
     */
    get current(): IState;
    /**
     * Get the last state (top of the history stack).
     */
    get last(): IState;
    /**
     * Get the previous state.
     */
    get previous(): IState | null;
    get length(): number;
}
/**
 * Either push or replace history state
 *
 * @param {("push" | "replace")} action
 * @param {IState} state
 * @param {_URL} url
 * @memberof PJAX
 */
export declare const changeState: (action: "push" | "replace", state: IState, item: object) => void;
