import { ManagerItem, AdvancedManager } from "./manager";
import { Service } from "./service";
import { App } from "./app";
/**
 * Services that interact with specific Components to achieve certain actions
 *
 * @export
 * @class Block
 * @extends {Service}
 */
export declare class Block extends Service {
    /**
     * The name of the Block
     *
     * @protected
     * @type string
     * @memberof Block
     */
    protected name: string;
    /**
     * Query selector string
     *
     * @protected
     * @type string
     * @memberof Block
     */
    protected selector: string;
    /**
     * Index of Block in a BlockManager
     *
     * @protected
     * @type number
     * @memberof Block
     */
    protected index: number;
    /**
     * The Root Element of a Block
     *
     * @protected
     * @type HTMLElement
     * @memberof Block
     */
    protected rootElement: HTMLElement;
    /**
     * It initializes the Block
     *
     * @param {string} [name]
     * @param {HTMLElement} [rootElement]
     * @param {string} [selector]
     * @param {number} [index]
     * @memberof Block
     */
    init(name?: string, rootElement?: HTMLElement, selector?: string, index?: number): void;
    /**
     * Get Root Element
     *
     * @returns HTMLElement
     * @memberof Block
     */
    getRootElement(): HTMLElement;
    /**
     * Get Selector
     *
     * @returns string
     * @memberof Block
     */
    getSelector(): string;
    /**
     * Get Index
     *
     * @returns number
     * @memberof Block
     */
    getIndex(): number;
    /**
     * Get the name of the Block
     *
     * @returns string
     * @memberof Block
     */
    getName(): string;
}
/**
 * Creates a new Block Intent Class
 *
 * @export
 * @class BlockIntent
 * @extends {ManagerItem}
 */
export declare class BlockIntent extends ManagerItem {
    /**
     * The name of the Block
     *
     * @protected
     * @type string
     * @memberof BlockIntent
     */
    protected name: string;
    /**
     * The Block Class
     *
     * @protected
     * @type {typeof Block}
     * @memberof BlockIntent
     */
    protected block: typeof Block;
    /**
     * Creates an instance of BlockIntent.
     *
     * @param {string} name
     * @param {typeof Block} block
     * @memberof BlockIntent
     */
    constructor(name: string, block: typeof Block);
    /**
     * Getter for name of Block Intent
     *
     * @returns string
     * @memberof BlockIntent
     */
    getName(): string;
    /**
     * Getter for the Block of the Block Intent
     *
     * @returns {typeof Block}
     * @memberof BlockIntent
     */
    getBlock(): typeof Block;
}
/**
 * A Service Manager designed to handle only Block Services, it refreshes on Page Change
 *
 * @export
 * @class BlockManager
 * @extends {AdvancedManager<number, BlockIntent>}
 */
export declare class BlockManager extends AdvancedManager<number, BlockIntent> {
    /**
     * A list of Active Blocks
     *
     * @protected
     * @type {AdvancedManager<number, Block>}
     * @memberof BlockManager
     */
    protected activeBlocks: AdvancedManager<number, Block>;
    /**
     * Creates an instance of BlockManager.
     *
     * @param {App} app
     * @memberof BlockManager
     */
    constructor(app: App);
    /**
     * Initialize all Blocks
     *
     * @memberof BlockManager
     */
    init(): void;
    /**
     * Getter for activeBlocks in BlockManager
     *
     * @returns
     * @memberof BlockManager
     */
    getActiveBlocks(): AdvancedManager<number, Block>;
    /**
     * Call the boot method for all Blocks
     *
     * @returns Promise<void>
     * @memberof BlockManager
     */
    boot(): Promise<void>;
    /**
     * Refreshes DOM Elements
     *
     * @memberof BlockManager
     */
    refresh(): void;
    /**
     * Call the initEvents method for all Blocks
     *
     * @returns BlockManager
     * @memberof BlockManager
     */
    initEvents(): BlockManager;
    /**
     * Call the stopEvents method for all Blocks
     *
     * @returns BlockManager
     * @memberof BlockManager
     */
    stopEvents(): BlockManager;
    /**
     * Call the stop method for all Blocks
     *
     * @returns BlockManager
     * @memberof BlockManager
     */
    stop(): BlockManager;
}
