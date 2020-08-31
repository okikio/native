import { ManagerItem, AdvancedManager, Manager, methodCall } from "./manager";
import { Service } from "./service";
import { App } from "./app";

export interface IBlockInit {
    name?: string;
    rootElement?: HTMLElement;
    selector?: string;
    index?: number;
    length?: number;
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
    public init({ name, rootElement, selector, index, length }: IBlockInit) {
        this.rootElement = rootElement;
        this.name = name;
        this.selector = selector;
        this.index = index;
        this.length = length;
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
     * Returns the total number of a Blocks instantiated
     *
     * @returns {number}
     * @memberof Block
     */
    public getLength(): number {
        return this.length;
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
    constructor({ name, block }: { name: string; block: typeof Block }) {
        super();
        this.name = name;
        this.block = block;
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
     * @returns {typeof Block}
     * @memberof BlockIntent
     */
    public getBlock(): typeof Block {
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
     * @public
     * @type {Manager<string, AdvancedManager<string, Block>>}
     * @memberof BlockManager
     */
    public activeBlocks: Manager<string, AdvancedManager<number, Block>> = new Manager();

    /**
     * An Array of ID's
     *
     * @public
     * @type {Manager<string, string>}
     * @memberof BlockManager
     */
    public activeIDs: Manager<string, string[]> = new Manager();

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
    constructor(app: App) {
        super(app);
    }

    /**
     * Build all Blocks
     *
     * @param {boolean} [full]
     * @memberof BlockManager
     */
    public build(full?: boolean) {
        let app = this.getApp();
        for (let [, intent] of this) {
            let name: string = intent.getName();
            let selector: string = `[${this.getConfig("blockAttr", false)}="${name}"]`;
            let rootElements: Node[] = [
                ...document.querySelectorAll(selector),
            ];

            if (!Array.isArray(this.activeIDs[name]))
                this.activeIDs[name] = [];

            let manager: AdvancedManager<number, Block> = new AdvancedManager(app);
            let block: typeof Block = intent.getBlock();
            for (let i = 0, len = rootElements.length; i < len; i++) {
                let rootElement = rootElements[i] as HTMLElement;
                let id = rootElement.id;

                let activeID = this.activeIDs[name][i];
                if ((activeID !== "" && activeID !== id) || full) {
                    let newInstance: Block = new block();
                    newInstance.init({ name, rootElement, selector, index: i, length: len });
                    newInstance.setID(id);

                    this.activeIDs[name][i] = id;
                    manager.set(i, newInstance);
                }
            }

            this.activeBlocks.set(name, manager);
        }
    }

    /**
     * Initialize all Blocks
     *
     * @memberof BlockManager
     */
    public init(): BlockManager {
        this.build(true);
        return this;
    }

    /**
     * Call the initEvents method for all Blocks
     *
     * @returns BlockManager
     * @memberof BlockManager
     */
    public initEvents(): BlockManager {
        let app = this.getApp();
        // let rootElement = app.getPages().last().getWrapper();
        // this.domObserver = new window.MutationObserver(() => {
        //     this.build(false);
        // });

        // this.observe(rootElement);
        const EventEmitter = app.getEmitter();
        EventEmitter.on("CONTENT_REPLACED", this.reload, this);
        return this;
    }

    /**
     * Refreshes the active blocks list
     *
     * @returns {BlockManager}
     * @memberof BlockManager
     */
    public flush(): BlockManager {
        this.activeBlocks.forEach((blockManager: AdvancedManager<number, Block>) => {
            methodCall(blockManager, "stop");
        });

        this.activeBlocks.clear();
        return this;
    }

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
    public reload(): BlockManager {
        // let app = this.getApp();
        // let rootElement = app.getPages().last().getWrapper();
        // this.domObserver.disconnect();
        this.flush();

        this.init();
        this.bootBlocks();
        // this.observe(rootElement);
        return this;
    }

    /**
     * Observe any changes to elements and update based on that
     *
     * @param {HTMLElement} rootElement
     * @memberof BlockManager
     */
    public observe(rootElement: HTMLElement) {
        // this.domObserver.observe(rootElement, {
        //     childList: true,
        //     attributes: false,
        //     characterData: false,
        //     subtree: true,
        // });
    }

    /**
     * Boot Blocks
     *
     * @returns BlockManager
     * @memberof BlockManager
     */
    public bootBlocks(): BlockManager {
        this.activeBlocks.forEach((blockManager: AdvancedManager<number, Block>) => {
            methodCall(blockManager, "boot");
        });

        return this;
    }

    /**
     * Call the boot method for all Blocks
     *
     * @returns BlockManager
     * @memberof BlockManager
     */
    public boot(): BlockManager {
        this.initEvents();
        this.bootBlocks();
        return this;
    }

    /**
     * Call the stopEvents method for all Blocks
     *
     * @returns BlockManager
     * @memberof BlockManager
     */
    public stopEvents(): BlockManager {
        this.activeBlocks.forEach((blockManager: AdvancedManager<number, Block>) => {
            methodCall(blockManager, "stopEvents");
        });

        let app = this.getApp();
        // this.domObserver.disconnect();

        const EventEmitter = app.getEmitter();
        EventEmitter.off("BEFORE_TRANSITION_IN", this.reload, this);
        return this;
    }

    /**
     * Call the stop method for all Blocks
     *
     * @returns BlockManager
     * @memberof BlockManager
     */
    public stop(): BlockManager {
        this.flush();
        this.stopEvents();
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
