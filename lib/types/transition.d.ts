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
    boot(): any;
    animate(name: string, data: any): Promise<ITransition>;
}
/**
 * Controls which animation between pages to use
 *
 * @export
 * @class TransitionManager
 * @extends {Manager<string, ITransition>}
 */
export declare class TransitionManager extends Service implements ITransitionManager {
    transitions: Manager<string, ITransition>;
    constructor(transitions?: any);
    get(key: string): ITransition;
    set(key: string, value: ITransition): this;
    add(value: ITransition): this;
    boot(): void;
    /**
     * Runs a transition
     *
     * @param {{ name: string, oldPage: Page, newPage: Page, trigger: Trigger }} data
     * @returns Promise<Transition>
     * @memberof TransitionManager
     */
    animate(name: string, data: any): Promise<ITransition>;
}
