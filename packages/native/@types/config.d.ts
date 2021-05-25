import { IgnoreURLsList } from "./pjax";
import { ITransition } from "./transition";
export interface ICONFIG {
    /**
     * The Prefix attached to data attributes
     */
    prefix?: string;
    /**
     * The attribute used to identify wrappers
     * @default `wrapper` as in `data-wrapper`
    */
    wrapperAttr?: string;
    /**
     * Headers to attach to fetch requests done by the PageManager
     * e.g. if you only want to load a partial output containing only the wrapper
     *
     * @default `[]`
     * @example
     * ```ts
     * headers: [
     *      ["partial-output", "true"]
     * ]
     * ```
     */
    headers?: string[][];
    /**
     * Attribute used to identify anchors that don't want PJAX enabled
     * @default `prevent="self"` as in `data-prevent="self"`
     */
    preventSelfAttr?: string;
    /**
     * Attribute used to identify elements that don't want PJAX enabled for themeselves and their child elements
     * @default `prevent="all"` as in `data-prevent="all"`
     */
    preventAllAttr?: string;
    /**
     * Attribute used to identify transition an anchor wants to use, the value you set will select the transition used by name
     * _**Note**: transition names are case sensitive_
     * @default `transition` as in `data-transition`
     */
    transitionAttr?: string;
    /**
     * The amount of time in milliseconds to wait before counting the PageManagers fetch requests as timed out
     * @default `2000`
     */
    timeout?: number;
    /**
     * The maximum amount of pages to have in the cache at any moment in time;
     * PageManager removes pages from the cache to ensure content doesn't become stale;
     * and memory usage isn't too high
     * @default `5`
     */
    maxPages?: number;
    /**
     * The resize event is debounced by this amount of time (in miliseconds)
     * @default `100`
     */
    resizeDelay?: number;
    /**
     * Ignore extra clicks of an anchor element if a transition has already started
     * by default PJAX will reload the page on multiple clicks but this allows you to stop extra clicks
     * from affecting the current transition
     * @default `true`
     */
    onTransitionPreventClick?: boolean;
    /**
     * Specifies which urls to always fetch from the web
     * It also accepts boolean values:
     * - `true` means always fetch from the web for all urls
     * - `false` means always try to fetch from the cache
     * @default `false`
     */
    cacheIgnore?: boolean | IgnoreURLsList;
    /**
     * Specifies which urls to not prefetch
     * It also accepts boolean values:
     * - `true` means don't prefetch any anchor
     * - `false` means always prefetch all anchors
     * @default `false`
     */
    prefetchIgnore?: boolean | IgnoreURLsList;
    /**
     * Specifies which urls to not use PJAX for
     * @default `[]`
     */
    preventURLs?: boolean | IgnoreURLsList;
    /**
     * On page change (excluding popstate events, and hashes) keep current scroll position
     * @default `false`
     */
    stickyScroll?: boolean;
    /**
     * Force load a page if an error occurs
     * @default `true`
     */
    forceOnError?: boolean;
    /**
     * Don't do anything if the url has a hash
     * @default `false`
     */
    ignoreHashAction?: boolean;
    /**
     * TransitionManagers regestered transitions
     * @default `[]`
     */
    transitions?: Array<[string, ITransition]>;
    [key: string]: any;
}
export declare const CONFIG_DEFAULTS: ICONFIG;
export declare type ConfigKeys = keyof typeof CONFIG_DEFAULTS | string;
export declare const newConfig: (config: ICONFIG) => ICONFIG;
/** Converts config properties into properly formatted data attributes */
export declare const toAttr: (config: ICONFIG, value?: ConfigKeys, brackets?: boolean) => any;
