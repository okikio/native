import { Manager } from "./manager";
import { Service } from "./service";
import type { ICoords, TypeTrigger } from "./history";
import type { IPage } from "./page";
/**
 * The async function type, allows for smooth transition between Promises
 */
export declare type TypeAsyncFn = (value?: any) => void;
export interface ITransition {
    oldPage?: IPage;
    newPage?: IPage;
    trigger?: TypeTrigger;
    scroll?: {
        x: number;
        y: number;
    };
    manualScroll?: boolean;
    init?: (data: IInitialTransitionData) => void;
    in?: (data: ITransitionData) => any;
    out?: (data: ITransitionData) => any;
    [key: string]: any;
}
export interface IInitialTransitionData {
    trigger?: TypeTrigger;
    scroll?: ICoords;
    oldPage: IPage;
    newPage: IPage;
    ignoreHashAction: boolean;
}
export interface ITransitionData extends IInitialTransitionData {
    from?: IPage;
    to?: IPage;
    done: TypeAsyncFn;
}
/** Auto scrolls to an elements position if the element has an hash */
export declare const hashAction: (coords?: ICoords, hash?: string) => ICoords;
/** The Default Transition, it replaces the container with the new page container */
export declare const TRANSITION_REPLACE: ITransition;
/** Controls which Transition between pages to use */
export declare class TransitionManager extends Service {
    transitions: Manager<string, ITransition>;
    _arg: Array<[string, ITransition]>;
    constructor(transitions?: Array<[string, ITransition]>);
    /** On Service install set Config */
    install(): void;
    get(key: string): ITransition;
    set(key: string, value: ITransition): this;
    add(value: ITransition): this;
    has(key: string): boolean;
    /** Starts a transition */
    start(name: string, data: IInitialTransitionData): Promise<IInitialTransitionData>;
}
export interface ITransitionManager extends TransitionManager {
}
