import { Service } from "./service.js";
import { ManagerItem, AdvancedManager } from "./manager.js";
/**
 * Services that interact with specific Components to achieve certain actions
 *
 * @export
 * @class Block
 * @extends {Service}
 */
export class Block extends Service {
    /**
     * It initializes the Block
     *
     * @param {string} [name]
     * @param {HTMLElement} [rootElement]
     * @param {string} [selector]
     * @param {number} [index]
     * @memberof Block
     */
    init(name, rootElement, selector, index) {
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
    getRootElement() {
        return this.rootElement;
    }
    /**
     * Get Selector
     *
     * @returns string
     * @memberof Block
     */
    getSelector() {
        return this.selector;
    }
    /**
     * Get Index
     *
     * @returns number
     * @memberof Block
     */
    getIndex() {
        return this.index;
    }
    /**
     * Get the name of the Block
     *
     * @returns string
     * @memberof Block
     */
    getName() {
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
     * Creates an instance of BlockIntent.
     *
     * @param {string} name
     * @param {typeof Block} block
     * @memberof BlockIntent
     */
    constructor(name, block) {
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
    getName() {
        return this.name;
    }
    /**
     * Getter for the Block of the Block Intent
     *
     * @returns {typeof Block}
     * @memberof BlockIntent
     */
    getBlock() {
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
export class BlockManager extends AdvancedManager {
    /**
     * Creates an instance of BlockManager.
     *
     * @param {App} app
     * @memberof BlockManager
     */
    constructor(app) {
        super(app);
        this.activeBlocks = new AdvancedManager(app);
    }
    /**
     * Initialize all Blocks
     *
     * @memberof BlockManager
     */
    init() {
        this.forEach((intent) => {
            let name = intent.getName();
            let block = intent.getBlock();
            let selector = `[${this.getConfig("blockAttr", false)}="${name}"]`;
            let rootElements = [...document.querySelectorAll(selector)];
            for (let i = 0, len = rootElements.length; i < len; i++) {
                let newInstance = new block();
                newInstance.init(name, rootElements[i], selector, i);
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
    getActiveBlocks() {
        return this.activeBlocks;
    }
    /**
     * Call the boot method for all Blocks
     *
     * @returns Promise<void>
     * @memberof BlockManager
     */
    async boot() {
        await this.activeBlocks.asyncMethodCall("boot");
    }
    /**
     * Refreshes DOM Elements
     *
     * @memberof BlockManager
     */
    refresh() {
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
    initEvents() {
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
    stopEvents() {
        this.activeBlocks.methodCall("stopEvents");
        return this;
    }
    /**
     * Call the stop method for all Blocks
     *
     * @returns BlockManager
     * @memberof BlockManager
     */
    stop() {
        this.activeBlocks.methodCall("stop");
        this.activeBlocks.clear();
        return this;
    }
}
//# sourceMappingURL=ts/block.js.map
