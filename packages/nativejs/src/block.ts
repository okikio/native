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
    public init(name?: string, rootElement?: HTMLElement, selector?: string, index?: number) {
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
    constructor(name: string, block: typeof Block) {
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
    constructor(app: App) {
        super(app);
        this.activeBlocks = new AdvancedManager(app);
    }

	/**
	 * Initialize all Blocks
	 *
	 * @memberof BlockManager
	 */
    public init() {
        this.forEach((intent: BlockIntent) => {
            let name: string = intent.getName();
            let block: typeof Block = intent.getBlock();
            let selector: string = `[${this.getConfig("blockAttr", false)}="${name}"]`;
            let rootElements: Node[] = [...document.querySelectorAll(selector)];

            for (let i = 0, len = rootElements.length; i < len; i++) {
                let newInstance: Block = new block();
                newInstance.init(name, rootElements[i] as HTMLElement, selector, i);
                this.activeBlocks.set(i, newInstance);
            }
        });
    }

    /**
     * Getter for activeBlocks in BlockManager
     *
     * @returns
     * @memberof BlockManager
     */
    public getActiveBlocks() {
        return this.activeBlocks;
    }

	/**
	 * Call the boot method for all Blocks
	 *
	 * @returns Promise<void>
	 * @memberof BlockManager
	 */
    public async boot(): Promise<void> {
        await this.activeBlocks.asyncMethodCall("boot");
    }

    /**
     * Refreshes DOM Elements
     *
     * @memberof BlockManager
     */
    public refresh() {
        const EventEmitter = this.getApp().getEmitter();
        EventEmitter.on("BEFORE_TRANSITION_OUT", () => {
            this.stop();
        });

        EventEmitter.on("AFTER_TRANSITION_IN", () => {
            this.init();
            this.boot();
            // this.activeBlocks.methodCall("initEvents");
        });
    }

	/**
	 * Call the initEvents method for all Blocks
	 *
	 * @returns BlockManager
	 * @memberof BlockManager
	 */
    public initEvents(): BlockManager {
        this.activeBlocks.methodCall("initEvents");
        this.refresh();
        return this;
    }

	/**
	 * Call the stopEvents method for all Blocks
	 *
	 * @returns BlockManager
	 * @memberof BlockManager
	 */
    public stopEvents(): BlockManager {
        this.activeBlocks.methodCall("stopEvents");
        return this;
    }

	/**
	 * Call the stop method for all Blocks
	 *
	 * @returns BlockManager
	 * @memberof BlockManager
	 */
    public stop(): BlockManager {
        this.activeBlocks.methodCall("stop");
        this.activeBlocks.clear();
        return this;
    }
}