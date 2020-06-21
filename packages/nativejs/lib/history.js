import { Manager } from "./manager.js";
import { _URL } from "./url.js";
/**
 * A quick snapshot of page coordinates, e.g. scroll positions
 *
 * @export
 * @class Coords
 * @implements {ICoords}
 */
export class Coords {
    /**
     * Creates an instance of Coords.
     *
     * @param {number} [x=window.scrollX]
     * @param {number} [y=window.scrollY]
     * @memberof Coords
     */
    constructor(x = window.scrollX, y = window.scrollY) {
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
    constructor(state = {
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
    getIndex() {
        return this.state.index;
    }
    /**
     * Set state index
     *
     * @param {number} index
     * @returns State
     * @memberof State
     */
    setIndex(index) {
        this.state.index = index;
        return this;
    }
    /**
     * Get state URL
     *
     * @returns _URL
     * @memberof State
     */
    getURL() {
        return this.state.url;
    }
    /**
     * Get state URL as a string
     *
     * @returns string
     * @memberof State
     */
    getURLPathname() {
        return this.state.url.getPathname();
    }
    /**
     * Get state transition
     *
     * @returns string
     * @memberof State
     */
    getTransition() {
        return this.state.transition;
    }
    /**
     * Get state data
     *
     * @returns IStateData
     * @memberof State
     */
    getData() {
        return this.state.data;
    }
    /**
     * Returns the State as an Object
     *
     * @returns object
     * @memberof State
     */
    toJSON() {
        const { url, index, transition, data } = this.state;
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
export class HistoryManager extends Manager {
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
    add(value) {
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
    addState(value) {
        let state = value instanceof State ? value : new State(value);
        this.add(state);
        return this;
    }
}
//# sourceMappingURL=ts/history.js.map
