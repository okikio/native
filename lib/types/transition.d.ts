import { Manager } from "./manager";
import { ICoords, Trigger } from "./history";
import { IPage } from "./page";
import { Service } from "./service";
/**
 * The async function type, allows for smooth transition between Promises
 */
export declare type asyncFn = (err?: any, value?: any) => void;
export interface ITransition {
    oldPage?: IPage;
    newPage?: IPage;
    trigger?: Trigger;
    scroll?: {
        x: number;
        y: number;
    };
    scrollable?: boolean;
    in: (data: ITransitionData) => any;
    out: (data: ITransitionData) => any;
    [key: string]: any;
}
export interface ITransitionData {
    from?: IPage;
    to?: IPage;
    trigger?: Trigger;
    scroll?: ICoords;
    done: asyncFn;
}
export interface ITransitionManager extends Service {
    transitions: Manager<string, ITransition>;
    get(key: string): ITransition;
    set(key: string, value: ITransition): TransitionManager;
    add(value: ITransition): TransitionManager;
    has(key: string): boolean;
    boot(): any;
    animate(name: string, data: any): Promise<ITransition>;
}
/** Auto scrolls to an elements position if the element has an hash */
export declare const hashAction: (coords?: ICoords, hash?: string) => ICoords;
/** Controls which Transition between pages to use */
export declare class TransitionManager extends Service implements ITransitionManager {
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
    animate(name: string, data: any): Promise<ITransition>;
}
