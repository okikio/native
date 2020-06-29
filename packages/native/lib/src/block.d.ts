import { ManagerItem, AdvancedManager, Manager } from "./manager";
import { Service } from "./service";
import { App } from "./app";
export interface IBlockInit {
    name?: string;
    rootElement?: HTMLElement;
    selector?: string;
    index?: number;
}
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
     * The id of an instance of a Block
     *
     * @protected
     * @type {string}
     * @memberof Block
     */
    protected id: string;
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
     * @param {IBlockInit} [{ name, rootElement, selector, index }]
     * @memberof Block
     */
    init({ name, rootElement, selector, index }: IBlockInit): void;
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
     * Get Block ID
     *
     * @returns string
     * @memberof Block
     */
    getID(): string;
    /**
     * Set Block ID
     *
     * @returns string
     * @memberof Block
     */
    setID(id: string): Block;
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
     * @type {Promise<typeof Block>}
     * @memberof BlockIntent
    */
    protected block: Promise<typeof Block>;
    /**
     * Creates an instance of BlockIntent.
     *
     * @param {{ name: string; block: typeof Block; }} { name, block }
     * @memberof BlockIntent
     */
    constructor({ name, block }: {
        name: string;
        block: Promise<typeof Block> | typeof Block;
    });
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
     * @returns {Promise<typeof Block>}
     * @memberof BlockIntent
     */
    getBlock(): Promise<typeof Block>;
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
     * @type {Manager<string, AdvancedManager<string, Block>>}
     * @memberof BlockManager
     */
    protected activeBlocks: Manager<string, AdvancedManager<number, Block>>;
    /**
     * An Array of ID's
     *
     * @protected
     * @type {Manager<string, string>}
     * @memberof BlockManager
     */
    protected activeIDs: Manager<string, string[]>;
    /**
     * Observes any changes to the page, and updates blocks based on this information
     *
     * @protected
     * @type {MutationObserver}
     * @memberof BlockManager
     */
    protected domObserver: MutationObserver;
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
    init(): Promise<void>;
    /**
     * Refreshes DOM Elements
     *
     * @memberof BlockManager
     */
    update(): Promise<void>;
    /**
     * Call the initEvents method for all Blocks
     *
     * @returns BlockManager
     * @memberof BlockManager
     */
    initEvents(): BlockManager;
    /**
     * Observe any changes to elements and update based on that
     *
     * @param {HTMLElement} rootElement
     * @memberof BlockManager
     */
    observe(rootElement: HTMLElement): void;
    /**
     * Call the boot method for all Blocks
     *
     * @returns BlockManager
     * @memberof BlockManager
     */
    boot(): BlockManager;
    /**
     * Refreshes the active blocks list
     *
     * @returns {BlockManager}
     * @memberof BlockManager
     */
    refresh(): BlockManager;
    /**
     * Call the stop method for all Blocks
     *
     * @returns BlockManager
     * @memberof BlockManager
     */
    stop(): BlockManager;
    /**
     * Call the stopEvents method for all Blocks
     *
     * @returns BlockManager
     * @memberof BlockManager
     */
    stopEvents(): BlockManager;
    /**
     * Getter for activeBlocks in BlockManager
     *
     * @returns {Manager<string, AdvancedManager<number, Block>>}
     * @memberof BlockManager
     */
    getActiveBlocks(): Manager<string, AdvancedManager<number, Block>>;
}
