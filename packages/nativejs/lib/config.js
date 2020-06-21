export const CONFIG_DEFAULTS = {
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
/**
 * The Config class
 *
 * @export
 * @class CONFIG
 */
export class CONFIG {
    /**
     * Creates an instance of CONFIG.
     *
     * @param {ICONFIG} config
     * @memberof CONFIG
     */
    constructor(config) {
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
    toAttr(value, brackets = true) {
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
    getConfig(value, brackets = true) {
        if (typeof value !== "string")
            return this.config;
        let config = this.config[value];
        if (typeof config === "string")
            return this.toAttr(config, brackets);
        return config;
    }
}
//# sourceMappingURL=ts/config.js.map
