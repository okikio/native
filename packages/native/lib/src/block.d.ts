import { ManagerItem, AdvancedManager, Manager } from "./manager";
import { Service } from "./service";
import { App } from "./app";
export interface IBlockInit {
    name?: string;
    rootElement?: HTMLElement;
    selector?: string;
    index?: number;
    length?: number;
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
     * @public
     * @type string
     * @memberof Block
     */
    public name: string;
    /**
     * Query selector string
     *
     * @public
     * @type string
     * @memberof Block
     */
    public selector: string;
    /**
     * Index of Block in a BlockManager
     *
     * @public
     * @type number
     * @memberof Block
     */
    public index: number;
    /**
     * The id of an instance of a Block
     *
     * @public
     * @type {string}
     * @memberof Block
     */
    public id: string;
    /**
     * The Root Element of a Block
     *
     * @public
     * @type HTMLElement
     * @memberof Block
     */
    public rootElement: HTMLElement;
    /**
     * Total number of Blocks in a BlockManager
     *
     * @public
     * @type number
     * @memberof Block
     */
    public length: number;
    /**
     * It initializes the Block
     *
     * @param {IBlockInit} [{ name, rootElement, selector, index }]
     * @memberof Block
     */
    init({ name, rootElement, selector, index, length }: IBlockInit): void;
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
     * Returns the total number of a Blocks instantiated
     *
     * @returns {number}
     * @memberof Block
     */
    getLength(): number;
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
     * @public
     * @type string
     * @memberof BlockIntent
     */
    public name: string;
    /**
     * The Block Class
     *
     * @public
     * @type {typeof Block}
     * @memberof BlockIntent
    */
    public block: typeof Block;
    /**
     * Creates an instance of BlockIntent.
     *
     * @param {{ name: string; block: typeof Block; }} { name, block }
     * @memberof BlockIntent
     */
    constructor({ name, block }: {
        name: string;
        block: typeof Block;
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
     * @public
     * @type {Manager<string, AdvancedManager<string, Block>>}
     * @memberof BlockManager
     */
    public activeBlocks: Manager<string, AdvancedManager<number, Block>>;
    /**
     * An Array of ID's
     *
     * @public
     * @type {Manager<string, string>}
     * @memberof BlockManager
     */
    public activeIDs: Manager<string, string[]>;
    /**
     * Observes any changes to the page, and updates blocks based on this information
     *
     * @public
     * @type {MutationObserver}
     * @memberof BlockManager
     */
    public domObserver: MutationObserver;
    /**
     * Creates an instance of BlockManager.
     *
     * @param {App} app
     * @memberof BlockManager
     */
    constructor(app: App);
    /**
     * Build all Blocks
     *
     * @param {boolean} [full]
     * @memberof BlockManager
     */
    build(full?: boolean): void;
    /**
     * Initialize all Blocks
     *
     * @memberof BlockManager
     */
    init(): BlockManager;
    /**
     * Call the initEvents method for all Blocks
     *
     * @returns BlockManager
     * @memberof BlockManager
     */
    initEvents(): BlockManager;
    /**
     * Refreshes the active blocks list
     *
     * @returns {BlockManager}
     * @memberof BlockManager
     */
    flush(): BlockManager;
    /**
     * Reloads active blocks, it's set to do this on Page changes
     *
     * @memberof BlockManager
     */
    /**
     *
     *
     * @returns BlockManager
     * @memberof BlockManager
     */
    reload(): BlockManager;
    /**
     * Observe any changes to elements and update based on that
     *
     * @param {HTMLElement} rootElement
     * @memberof BlockManager
     */
    observe(rootElement: HTMLElement): void;
    /**
     * Boot Blocks
     *
     * @returns BlockManager
     * @memberof BlockManager
     */
    bootBlocks(): BlockManager;
    /**
     * Call the boot method for all Blocks
     *
     * @returns BlockManager
     * @memberof BlockManager
     */
    boot(): BlockManager;
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
    /**
     * Getter for activeBlocks in BlockManager
     *
     * @returns {Manager<string, AdvancedManager<number, Block>>}
     * @memberof BlockManager
     */
    getActiveBlocks(): Manager<string, AdvancedManager<number, Block>>;
}
