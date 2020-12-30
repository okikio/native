export interface ICONFIG {
    prefix?: string;
    wrapperAttr?: string;
    noAjaxLinkAttr?: string;
    noPrefetchAttr?: "no-prefetch";
    headers?: string[][];
    preventSelfAttr?: string;
    preventAllAttr?: string;
    transitionAttr?: string;
    blockAttr?: string;
    timeout?: number;
}
export declare const CONFIG_DEFAULTS: ICONFIG;
export declare type ConfigKeys = keyof ICONFIG;
/**
 * The Config class
 *
 * @export
 * @class CONFIG
 */
export declare class CONFIG {
    /**
     * The current Configuration
     *
     * @public
     * @type ICONFIG
     * @memberof CONFIG
     */
    config: ICONFIG;
    /**
     * Creates an instance of CONFIG.
     *
     * @param {ICONFIG} config
     * @memberof CONFIG
     */
    constructor(config: ICONFIG);
    /**
     * Converts string into data attributes
     *
     * @param {string} value
     * @param {boolean} brackets [brackets=true]
     * @returns string
     * @memberof CONFIG
     */
    toAttr(value: string, brackets?: boolean): string;
    /**
     * Selects config vars, and formats them for use, or simply returns the current configurations for the framework
     *
     * @param {ConfigKeys} value
     * @param {boolean} [brackets=true]
     * @returns any
     * @memberof CONFIG
     */
    getConfig(value?: ConfigKeys, brackets?: boolean): any;
}
