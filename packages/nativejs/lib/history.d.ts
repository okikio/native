import { Manager } from "./manager";
import { _URL } from "./url";
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
export declare class Coords implements ICoords {
    x: number;
    y: number;
    /**
     * Creates an instance of Coords.
     *
     * @param {number} [x=window.scrollX]
     * @param {number} [y=window.scrollY]
     * @memberof Coords
     */
    constructor(x?: number, y?: number);
}
/**
 * Represents the current status of the page consisting of properties like: url, transition, and data
 *
 * @export
 * @class State
 */
export declare class State {
    /**
     * The current state data
     *
     * @private
     * @type IState
     * @memberof State
     */
    private state;
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
    constructor(state?: IState);
    /**
     * Get state index
     *
     * @returns number
     * @memberof State
     */
    getIndex(): number;
    /**
     * Set state index
     *
     * @param {number} index
     * @returns State
     * @memberof State
     */
    setIndex(index: number): State;
    /**
     * Get state URL
     *
     * @returns _URL
     * @memberof State
     */
    getURL(): _URL;
    /**
     * Get state URL as a string
     *
     * @returns string
     * @memberof State
     */
    getURLPathname(): string;
    /**
     * Get state transition
     *
     * @returns string
     * @memberof State
     */
    getTransition(): string;
    /**
     * Get state data
     *
     * @returns IStateData
     * @memberof State
     */
    getData(): IStateData;
    /**
     * Returns the State as an Object
     *
     * @returns object
     * @memberof State
     */
    toJSON(): object;
}
/**
 * History of the site, stores only the State class
 *
 * @export
 * @class HistoryManager
 * @extends {Manager<number, State>}
 */
export declare class HistoryManager extends Manager<number, State> {
    /**
     * Creates an instance of the HistoryManager class, which inherits properties and methods from the Storage class.
     *
     * @memberof HistoryManager
     * @constructor
     */
    constructor();
    /**
     * Sets the index of the state before adding to HistoryManager
     *
     * @param {State} value
     * @returns HistoryManager
     * @memberof HistoryManager
     */
    add(value: State): HistoryManager;
    /**
     * Quick way to add a State to the HistoryManager
     *
     * @param {IState} value
     * @returns HistoryManager
     * @memberof HistoryManager
     */
    addState(value: IState | State): HistoryManager;
}
