import { ManagerItem, AdvancedManager, Manager } from "./manager";
import { Service } from "./service";
import { App } from "./app";

export interface IBlockInit {
    name?: string;
    rootElement?: HTMLElement;
    selector?: string;
    index?: number;
};

/**
 * Services that interact with specific Components to achieve certain actions
 *
 * @export
 * @class Block
 * @extends {Service}
 */
export class Block extends Service {
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
    public init({ name, rootElement, selector, index }: IBlockInit) {
        this.rootElement = rootElement;
        this.name = name;
        this.selector = selector;
        this.index = index;
    }

    /**
     * Get Root Element
     *
     * @returns HTMLElement
     * @memberof Block
     */
    public getRootElement(): HTMLElement {
        return this.rootElement;
    }

    /**
     * Get Selector
     *
     * @returns string
     * @memberof Block
     */
    public getSelector(): string {
        return this.selector;
    }

    /**
     * Get Index
     *
     * @returns number
     * @memberof Block
     */
    public getIndex(): number {
        return this.index;
    }

    /**
     * Get Block ID
     *
     * @returns string
     * @memberof Block
     */
    public getID(): string {
        return this.id;
    }

    /**
     * Set Block ID
     *
     * @returns string
     * @memberof Block
     */
    public setID(id: string): Block {
        this.id = id;
        return this;
    }

    /**
     * Get the name of the Block
     *
     * @returns string
     * @memberof Block
     */
    public getName(): string {
        return this.name;
    }
}

/**
 * Creates a new Block Intent Class
 *
 * @export
 * @class BlockIntent
 * @extends {ManagerItem}
 */
export class BlockIntent extends ManagerItem {
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
    constructor({ name, block }: { name: string; block: Promise<typeof Block> | typeof Block; }) {
        super();
        this.name = name;
        this.block = block instanceof Promise ? block : Promise.resolve(block);
    }

    /**
     * Getter for name of Block Intent
     *
     * @returns string
     * @memberof BlockIntent
     */
    public getName(): string {
        return this.name;
    }

    /**
     * Getter for the Block of the Block Intent
     *
     * @returns {Promise<typeof Block>}
     * @memberof BlockIntent
     */
    public getBlock(): Promise<typeof Block> {
        return this.block;
    }
}

/**
 * A Service Manager designed to handle only Block Services, it refreshes on Page Change
 *
 * @export
 * @class BlockManager
 * @extends {AdvancedManager<number, BlockIntent>}
 */
export class BlockManager extends AdvancedManager<number, BlockIntent> {
    /**
     * A list of Active Blocks
     *
     * @protected
     * @type {Manager<string, AdvancedManager<string, Block>>}
     * @memberof BlockManager
     */
    protected activeBlocks: Manager<string, AdvancedManager<number, Block>> = new Manager();

    /**
     * An Array of ID's
     *
     * @protected
     * @type {Manager<string, string>}
     * @memberof BlockManager
     */
    protected activeIDs: Manager<string, string[]> = new Manager();

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
    constructor(app: App) {
        super(app);
    }

    /**
     * Initialize all Blocks
     *
     * @memberof BlockManager
     */
    public async init() {
        let app = this.getApp();
        for (let [, intent] of this) {
            let name: string = intent.getName();
            let selector: string = `[${this.getConfig("blockAttr", false)}="${name}"]`;
            let rootElements: Node[] = [
                ...document.querySelectorAll(selector),
            ];

            let idList = [];
            let manager: AdvancedManager<number, Block> = new AdvancedManager(app);
            let block: typeof Block = await intent.getBlock();
            for (let i = 0, len = rootElements.length; i < len; i++) {
                let rootElement = rootElements[i] as HTMLElement;
                let id = rootElement.id;
                let newInstance: Block = new block();
                newInstance.init({ name, rootElement, selector, index: i });
                newInstance.setID(id);

                idList[i] = id;
                manager.set(i, newInstance);
            }

            this.activeIDs[name] = idList;
            this.activeBlocks.set(name, manager);
        }
    }

    /**
     * Refreshes DOM Elements
     *
     * @memberof BlockManager
     */
    public async update() {
        let app = this.getApp();
        for (let [, intent] of this) {
            let name: string = intent.getName();
            let selector: string = `[${this.getConfig("blockAttr", false)}="${name}"]`;
            let rootElements: Node[] = [
                ...document.querySelectorAll(selector),
            ];

            let idList = [];
            let manager: AdvancedManager<number, Block> = new AdvancedManager(app);
            let block: typeof Block = await intent.getBlock();
            for (let i = 0, len = rootElements.length; i < len; i++) {
                let rootElement = rootElements[i] as HTMLElement;
                let id = rootElement.id;
                if (this.activeIDs[name][i] !== id) {
                    let newInstance: Block = new block();
                    newInstance.init({ name, rootElement, selector, index: i });
                    newInstance.setID(id);
                    newInstance.boot();

                    idList[i] = id;
                    manager.set(i, newInstance);
                }
            }

            this.activeIDs[name] = idList;
            this.activeBlocks.set(name, manager);
        }
    }

    /**
     * Call the initEvents method for all Blocks
     *
     * @returns BlockManager
     * @memberof BlockManager
     */
    public initEvents(): BlockManager {
        for (let [, blockManager] of this.activeBlocks) {
            blockManager.methodCall("initEvents");
        }
        let app = this.getApp();
        let rootElement = app.getPages().last().getWrapper();

        this.update = this.update.bind(this);
        this.domObserver = new window.MutationObserver(this.update);
        this.observe(rootElement);

        const EventEmitter = app.getEmitter();
        EventEmitter.on("BEFORE_TRANSITION_IN", async () => {
            rootElement = app.getPages().last().getWrapper();
            this.domObserver.disconnect();
            this.refresh();

            await this.init();
            this.boot();
            this.observe(rootElement);
        });
        return this;
    }

    /**
     * Observe any changes to elements and update based on that
     *
     * @param {HTMLElement} rootElement
     * @memberof BlockManager
     */
    public observe(rootElement: HTMLElement) {
        this.domObserver.observe(rootElement, {
            childList: true,
            attributes: false,
            characterData: false,
            subtree: true,
        });
    }

    /**
     * Call the boot method for all Blocks
     *
     * @returns BlockManager
     * @memberof BlockManager
     */
    public boot(): BlockManager {
        for (let [, blockManager] of this.activeBlocks) {
            blockManager.methodCall("boot");
        }
        return this;
    }

    /**
     * Refreshes the active blocks list
     *
     * @returns {BlockManager}
     * @memberof BlockManager
     */
    public refresh(): BlockManager {
        for (let [, blockManager] of this.activeBlocks) {
            blockManager.methodCall("stop");
        }
        this.activeBlocks.clear();
        return this;
    }

    /**
     * Call the stop method for all Blocks
     *
     * @returns BlockManager
     * @memberof BlockManager
     */
    public stop(): BlockManager {
        this.refresh();
        this.stopEvents();
        return this;
    }

    /**
     * Call the stopEvents method for all Blocks
     *
     * @returns BlockManager
     * @memberof BlockManager
     */
    public stopEvents(): BlockManager {
        for (let [, blockManager] of this.activeBlocks) {
            blockManager.methodCall("stopEvents");
        }
        return this;
    }

    /**
     * Getter for activeBlocks in BlockManager
     *
     * @returns {Manager<string, AdvancedManager<number, Block>>}
     * @memberof BlockManager
     */
    public getActiveBlocks(): Manager<string, AdvancedManager<number, Block>> {
        return this.activeBlocks;
    }
}