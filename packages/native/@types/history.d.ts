import { Service } from "./service";
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
export interface IHistoryManager extends Service {
    states: IState[];
    pointer: number;
    init(): any;
    get(index: number): IState;
    add(value?: IState, historyAction?: "replace" | "push"): HistoryManager;
    remove(index?: number): HistoryManager;
    replace(newStates: IState[]): HistoryManager;
    set(i: number, state: IState): IState;
    current: IState;
    last: IState;
    previous: IState | null;
    length: number;
}
/** A quick snapshot of page scroll coordinates */
export declare const newCoords: (x?: number, y?: number) => ICoords;
/** Creates a state; a state represents the current status of the page consisting of properties like: url, transition, and data */
export declare const newState: (state?: IState) => IState;
/** Keeps a record of the history of the App; it stores only the states of Pages */
export declare class HistoryManager extends Service implements IHistoryManager {
    states: IState[];
    pointer: number;
    /** Initializes the states array, and replace the history pushState data with the states array */
    init(): void;
    /** Get a state based on it's index */
    get(index: number): IState;
    /** Add a state to HistoryManager and change the history pushState data based on the historyAction specified */
    add(value?: IState, historyAction?: "replace" | "push"): HistoryManager;
    remove(index?: number): this;
    /** Replaces the states array with another states array, this is later used when going back and forward in page history */
    replace(newStates: IState[]): this;
    /** Set state by index. */
    set(i: number, state: IState): IState;
    /** Get the current state */
    get current(): IState;
    /** Get the last state (top of the history stack). */
    get last(): IState;
    /** Get the previous state. */
    get previous(): IState | null;
    get length(): number;
}
/** Either push or replace history state */
export declare const changeState: (action: "push" | "replace", state: IState, item: object) => void;
