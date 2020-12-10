import { Trigger } from "./history";
import { Service } from "./service";
export declare type LinkEvent = MouseEvent | TouchEvent;
export declare type StateEvent = LinkEvent | PopStateEvent;
export declare type IgnoreURLsList = Array<RegExp | string>;
/**
 * Creates a Barba JS like PJAX Service, for the Framework
 *
 * @export
 * @class PJAX
 * @extends {Service}
 */
export declare class PJAX extends Service {
    /**
     * URLs to ignore when prefetching
     *
     * @private
     * @type boolean
     * @memberof PJAX
     */
    protected ignoreURLs: IgnoreURLsList;
    /**
     * Whether or not to disable prefetching
     *
     * @private
     *
     * @memberof PJAX
     */
    protected prefetchIgnore: boolean;
    /**
     * Current state or transitions
     *
     * @public
     * @type boolean
     * @memberof PJAX
     */
    isTransitioning: boolean;
    /**
     * Ignore extra clicks of an anchor element if a transition has already started
     *
     * @private
     * @type boolean
     * @memberof PJAX
     */
    protected stopOnTransitioning: boolean;
    /**
     * On page change (excluding popstate event) keep current scroll position
     *
     * @private
     * @type boolean
     * @memberof PJAX
     */
    protected stickyScroll: boolean;
    /**
     * Force load a page if an error occurs
     *
     * @private
     * @type boolean
     * @memberof PJAX
     */
    protected forceOnError: boolean;
    /**
     * Dictates whether to auto scroll if an hash is present in the window URL
     *
     * @protected
     * @type boolean
     * @memberof PJAX
     */
    protected autoScrollOnHash: boolean;
    /**
     * Disables all extra scroll effects of PJAX
     *
     * @private
     * @type boolean
     * @memberof PJAX
     */
    protected dontScroll: boolean;
    /**
     * Sets the transition state, sets isTransitioning to true
     *
     * @private
     * @memberof PJAX
     */
    private transitionStart;
    /**
     * Sets the transition state, sets isTransitioning to false
     *
     * @private
     * @memberof PJAX
     */
    private transitionStop;
    init(): void;
    /**
     * Starts the PJAX Service
     *
     * @memberof PJAX
     */
    boot(): void;
    /**
     * Gets the transition to use for a certain anchor
     *
     * @param {HTMLAnchorElement} el
     * @returns {(string | null)}
     * @memberof PJAX
     */
    getTransitionName(el: HTMLAnchorElement): string | null;
    /**
     * Checks to see if the anchor is valid
     *
     * @param {HTMLAnchorElement} el
     * @param {(LinkEvent | KeyboardEvent)} event
     * @param {string} href
     *
     * @memberof PJAX
     */
    validLink(el: HTMLAnchorElement, event: LinkEvent | KeyboardEvent, href: string): boolean;
    /**
     * Returns the href or an Anchor element
     *
     * @param {HTMLAnchorElement} el
     * @returns {(string | null)}
     * @memberof PJAX
     */
    getHref(el: HTMLAnchorElement): string | null;
    /**
     * Check if event target is a valid anchor with an href, if so, return the link
     *
     * @param {LinkEvent} event
     *
     * @memberof PJAX
     */
    getLink(event: LinkEvent): HTMLAnchorElement;
    /**
     * When an element is clicked.
     *
     * Get valid anchor element.
     * Go for a transition.
     *
     * @param {LinkEvent} event
     * @returns
     * @memberof PJAX
     */
    onClick(event: LinkEvent): void;
    /**
     * Returns the direction of the State change as a String, either the Back button or the Forward button
     *
     * @param {number} value
     *
     * @memberof PJAX
     */
    getDirection(value: number): Trigger;
    /**
     * Force a page to go to a certain URL
     *
     * @param {string} href
     * @memberof PJAX
     */
    force(href: string): void;
    /**
     * If transition is running force load page.
     * Stop if currentURL is the same as new url.
     * On state change, change the current state history,
     * to reflect the direction of said state change
     * Load page and page transition.
     *
     * @param {string} href
     * @param {Trigger} [trigger='HistoryManager']
     * @param {StateEvent} [event]
     * @memberof PJAX
     */
    go({ href, trigger, event, }: {
        href: string;
        trigger?: Trigger;
        event?: StateEvent;
    }): Promise<void>;
    /**
     * Load the new Page as well as a Transition; run the Transition
     *
     * @param {string} oldHref
     * @param {string} href
     * @param {Trigger} trigger
     * @param {string} [transitionName="default"]
     *
     * @memberof PJAX
     */
    load({ oldHref, href, trigger, transitionName, scroll, }: {
        oldHref: string;
        href: string;
        trigger: Trigger;
        transitionName?: string;
        scroll: {
            x: number;
            y: number;
        };
    }): Promise<any>;
    /**
     * Check to see if the URL is to be ignored, uses either RegExp of Strings to check
     *
     * @param {URL} { pathname }
     *
     * @memberof PJAX
     */
    ignoredURL({ pathname }: URL): boolean;
    /**
     * When you hover over an anchor, prefetch the event target's href
     *
     * @param {LinkEvent} event
     * @memberof PJAX
     */
    onHover(event: LinkEvent): Promise<void>;
    /**
     * When History state changes.
     *
     * Get url from State
     * Go for a Barba transition.
     *
     * @param {PopStateEvent} event
     * @memberof PJAX
     */
    onStateChange(event: PopStateEvent): void;
    /**
     * Initialize DOM Events
     *
     * @memberof PJAX
     */
    initEvents(): void;
    /**
     * Stop DOM Events
     *
     * @memberof PJAX
     */
    stopEvents(): void;
}
/**
 * Auto scrolls to an elements position if the element has an hash
 *
 * @param {string} [hash=window.location.hash]
 * @memberof PJAX
 */
export declare const hashAction: (hash?: string) => import("./history").ICoords;
