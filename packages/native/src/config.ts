// The config variables
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
    timeout?: number
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
    timeout: 30000
};

export type ConfigKeys = keyof ICONFIG;

/**
 * The Config class
 *
 * @export
 * @class CONFIG
 */
export class CONFIG {
    /**
     * The current Configuration
     *
     * @protected
     * @type ICONFIG
     * @memberof CONFIG
     */
    protected config: ICONFIG;

    /**
     * Creates an instance of CONFIG.
     *
     * @param {ICONFIG} config
     * @memberof CONFIG
     */
    constructor(config: ICONFIG) {
        this.config = Object.assign({ ...CONFIG_DEFAULTS }, config);
    }

    /**
     * Converts string into data attributes
     *
     * @param {string} value
     * @param {boolean} brackets [brackets=true]
     * @returns string
     * @memberof CONFIG
     */
    public toAttr(value: string, brackets: boolean = true): string {
        let { prefix } = this.config;
        let attr = `data${prefix ? "-" + prefix : ""}-${value}`;
        return brackets ? `[${attr}]` : attr;
    }

    /**
     * Selects config vars, and formats them for use, or simply returns the current configurations for the framework
     *
     * @param {ConfigKeys} value
     * @param {boolean} [brackets=true]
     * @returns any
     * @memberof CONFIG
     */
    public getConfig(value?: ConfigKeys, brackets: boolean = true): any {
        if (typeof value !== "string")
            return this.config;

        let config = this.config[value];
        if (typeof config === "string")
            return this.toAttr(config, brackets);
        return config;
    }
}