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

export const CONFIG_DEFAULTS: ICONFIG = {
    wrapperAttr: "wrapper",
    noAjaxLinkAttr: "no-ajax-link",
    noPrefetchAttr: "no-prefetch",
    headers: [
        ["x-partial", "true"]
    ],
    preventSelfAttr: `prevent="self"`,
    preventAllAttr: `prevent="all"`,
    transitionAttr: "transition",
    blockAttr: `block`,
    timeout: 30000,
    maxPages: 5,
    resizeDelay: 100
};

export type ConfigKeys = keyof typeof CONFIG_DEFAULTS | string;
export const newConfig = (config: ICONFIG): ICONFIG => {
    return Object.assign({ ...CONFIG_DEFAULTS }, config);
};

/** Converts string into properly formatted data attributes */
export const toAttr = (config: ICONFIG, value: string, brackets: boolean = true): string => {
    let { prefix } = config;
    let attr = `data${prefix ? "-" + prefix : ""}-${value}`;
    return brackets ? `[${attr}]` : attr;
};

/** Selects config vars, and formats them for use, or simply returns the current configurations for the framework */
export const getConfig = (config: ICONFIG, value?: ConfigKeys, brackets: boolean = true): any => {
    if (typeof value !== "string")
        return config;

    let prop = config[value];
    if (typeof prop === "string")
        return toAttr(config, prop, brackets);
    return prop;
};
