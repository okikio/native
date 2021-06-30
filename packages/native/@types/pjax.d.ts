import { Service } from "./service";
import type { TypeTrigger } from "./history";
export declare type TypeLinkEvent = MouseEvent | TouchEvent;
export declare type TypeStateEvent = TypeLinkEvent | PopStateEvent;
export declare type TypeIgnoreURLsList = Array<RegExp | string>;
/**
 * Creates a barbajs based PJAX Service, for the native framework
 * Based on barbajs and StartingBlocks
 */
export declare class PJAX extends Service {
    /** URLs to disable PJAX for */
    preventURLs: boolean | TypeIgnoreURLsList;
    /** URLs to ignore when prefetching / Whether or not to disable prefetching */
    prefetchIgnore: boolean | TypeIgnoreURLsList;
    /** Current state of transitions */
    isTransitioning: boolean;
    /** Ignore extra clicks of an anchor element if a transition has already started */
    onTransitionPreventClick: boolean;
    /** On page change (excluding popstate events) keep current scroll position */
    stickyScroll: boolean;
    /** Force load a page if an error occurs */
    forceOnError: boolean;
    /** Ignore hash action if set to true */
    ignoreHashAction: boolean;
    install(): void;
    /** Sets the transition state to either true or false */
    transitionStart(): void;
    transitionStop(): void;
    init(): void;
    /** Starts the PJAX Service */
    boot(): void;
    /** Gets the transition to use for a certain anchor */
    getTransitionName(el: HTMLAnchorElement): string | null;
    /** Checks to see if the anchor is valid */
    validLink(el: HTMLAnchorElement, event: TypeLinkEvent | KeyboardEvent, href: string): boolean;
    /** Returns the href of an Anchor element */
    getHref(el: HTMLAnchorElement): string | null;
    /** Check if event target is a valid anchor with an href, if so, return the anchor */
    getLink(event: TypeLinkEvent): HTMLAnchorElement;
    /** When an element is clicked, get valid anchor element, go for a transition */
    onClick(event: TypeLinkEvent): void;
    /** Returns the direction of the State change as a String, either the Back button or the Forward button */
    getDirection(value: number): TypeTrigger;
    /** Force a page to go to a certain URL */
    force(href: string): void;
    /**
     * If transition is running force load page.
     * Stop if currentURL is the same as new url.
     * On state change, change the current state history, to reflect the direction of said state change
     * Load page and page transition.
     */
    go({ href, trigger, event }: {
        href: string;
        trigger?: TypeTrigger;
        event?: TypeStateEvent;
    }): Promise<void>;
    /** Load the new Page as well as a Transition; starts the Transition */
    load({ oldHref, href, trigger, transitionName, scroll, }: {
        oldHref: string;
        href: string;
        trigger?: TypeTrigger;
        transitionName?: string;
        scroll?: {
            x: number;
            y: number;
        };
    }): Promise<any>;
    /** When you hover over an anchor, prefetch the event target's href */
    onHover(event: TypeLinkEvent): Promise<void>;
    /** When History state changes, get url from State, go for a Transition. */
    onStateChange(event: PopStateEvent): void;
    /** Initialize DOM Events */
    initEvents(): void;
    /** Stop DOM Events */
    stopEvents(): void;
}
