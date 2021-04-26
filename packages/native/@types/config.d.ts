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
    maxPages?: number;
    resizeDelay?: number;
    [key: string]: any;
}
export declare const CONFIG_DEFAULTS: ICONFIG;
export declare type ConfigKeys = keyof typeof CONFIG_DEFAULTS | string;
export declare const newConfig: (config: ICONFIG) => ICONFIG;
/** Converts string into properly formatted data attributes */
export declare const toAttr: (config: ICONFIG, value: string, brackets?: boolean) => string;
/** Selects config vars, and formats them for use, or simply returns the current configurations for the framework */
export declare const getConfig: (config: ICONFIG, value?: ConfigKeys, brackets?: boolean) => any;
