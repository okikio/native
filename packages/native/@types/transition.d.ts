import { Manager } from "./manager";
import { ICoords, TypeTrigger } from "./history";
import { IPage } from "./page";
import { Service } from "./service";
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
    init?: (data: InitialTransitionData) => void;
    in?: (data: ITransitionData) => any;
    out?: (data: ITransitionData) => any;
    [key: string]: any;
}
export interface InitialTransitionData {
    trigger?: TypeTrigger;
    scroll?: ICoords;
    oldPage: IPage;
    newPage: IPage;
    ignoreHashAction: boolean;
}
export interface ITransitionData extends InitialTransitionData {
    from?: IPage;
    to?: IPage;
    done: TypeAsyncFn;
}
/** Auto scrolls to an elements position if the element has an hash */
export declare const hashAction: (coords?: ICoords, hash?: string) => ICoords;
export declare const Replace: ITransition;
/** Controls which Transition between pages to use */
export declare class TransitionManager extends Service {
    transitions: Manager<string, ITransition>;
    private _arg;
    constructor(transitions?: Array<[string, ITransition]>);
    /** On Service install set Config */
    install(): void;
    get(key: string): ITransition;
    set(key: string, value: ITransition): this;
    add(value: ITransition): this;
    has(key: string): boolean;
    /** Starts a transition */
    start(name: string, data: InitialTransitionData): Promise<InitialTransitionData>;
}
export interface ITransitionManager extends TransitionManager {
}
