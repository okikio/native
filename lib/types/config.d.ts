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
/**
 * Creates an instance of CONFIG.
 *
 * @param {ICONFIG} config
 * @memberof CONFIG
 */
export declare const newConfig: (config: ICONFIG) => ICONFIG;
/**
 * Converts string into data attributes
 *
 * @param {ICONFIG} config
 * @param {string} value
 * @param {boolean} brackets [brackets=true]
 * @returns string
 * @memberof CONFIG
 */
export declare const toAttr: (config: ICONFIG, value: string, brackets?: boolean) => string;
/**
 * Selects config vars, and formats them for use, or simply returns the current configurations for the framework
 *
 * @param {ICONFIG} config
 * @param {ConfigKeys} value
 * @param {boolean} [brackets=true]
 * @returns any
 * @memberof CONFIG
 */
export declare const getConfig: (config: ICONFIG, value?: ConfigKeys, brackets?: boolean) => any;
