import { Manager, ManagerItem, AdvancedManager } from "./manager";
import { Service } from "./service";
import type { TypeIgnoreURLsList } from "./pjax";
/**
 * Parses strings to DOM
 */
export declare const PARSER: DOMParser;
/** A page represents the DOM elements that create each page */
export declare class Page extends ManagerItem {
    /** Holds the DOM of the current page */
    dom: Document;
    /** Holds the wrapper element to be swapped out of each Page */
    wrapper: HTMLElement;
    /** Holds the title of each page */
    title: string;
    /** Holds the head element of each page */
    head: Element;
    /** Holds the body element of each page */
    body: Element;
    /** The URL of the current page */
    url: URL;
    /** The payload of a page request */
    data: string;
    /** Attr that identifies the wrapper */
    wrapperAttr: string;
    constructor(url?: string | URL, dom?: string | Document);
    /** Builds the page's dom, and sets the title, head, body, and wrapper properties of the Page class */
    build(): Promise<void>;
    install(): void;
    uninstall(): void;
}
export interface IPage extends Page {
}
/** Controls which page to load */
export declare class PageManager extends Service {
    /** Stores all fetch requests that are currently loading */
    loading: Manager<string, Promise<string>>;
    pages: AdvancedManager<string, Page>;
    /** URLs to ignore caching */
    cacheIgnore: TypeIgnoreURLsList | boolean;
    constructor();
    /** Instantiate pages, and add the current page to pages */
    install(): void;
    get(key: string): Page;
    add(value: IPage): this;
    set(key: string, value: IPage): this;
    remove(key: string): this;
    has(key: string): boolean;
    clear(): this;
    get size(): number;
    keys(): string[];
    /** Load from cache or by requesting URL via a fetch request, avoid requesting for the same thing twice by storing the fetch request in "this.loading" */
    load(_url?: URL | string): Promise<Page>;
    /** Starts a fetch request */
    request(url: string): Promise<string>;
}
/** Check if url is supposed to be ignored */
export declare const ignoreURLs: (urlString: string, ignoreList: boolean | TypeIgnoreURLsList) => boolean;
export interface IPageManager extends PageManager {
}
