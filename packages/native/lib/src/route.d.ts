import { Service } from "./service";
import { Manager } from "./manager";
export declare type RouteMethod = (...args: any) => any;
export declare type RouteStyle = string | RegExp;
export interface IRouteToFrom {
    to: RouteStyle;
    from: RouteStyle;
}
export declare type RoutePath = IRouteToFrom | RouteStyle;
export interface IRoute {
    path: RoutePath;
    method: RouteMethod;
}
/**
 * Controls what happens when certain url paths match a set of criteria
 *
 * @export
 * @class Router
 * @extends {Service}
 */
export declare class Router extends Service {
    /**
     * List of routes inputted
     *
     * @public
     * @type {Manager<IRouteToFrom, RouteMethod>}
     * @memberof Router
     */
    public routes: Manager<IRouteToFrom, RouteMethod>;
    /**
     * Creates an instance of Router.
     *
     * @param {Array<IRoute>} [routes=[]]
     * @memberof Router
     */
    constructor(routes?: IRoute[]);
    /**
     * Add a new route to watch for
     *
     * @param {IRoute} { path, method }
     * @returns {Router}
     * @memberof Router
     */
    add({ path, method }: IRoute): Router;
    /**
     * Convert strings into path match functions
     *
     * @param {RouteStyle} path
     * @returns {RegExp}
     * @memberof Router
     */
    parsePath(path: RouteStyle): RegExp;
    /**
     * Determines if a strings counts has a path
     *
     * @param {RouteStyle} input
     * @returns boolean
     * @memberof Router
     */
    isPath(input: RouteStyle): boolean;
    /**
     * Parse the multiple different formats for paths, into a { from, to } object
     *
     * @param {RouteStyle} input
     * @returns {IRouteToFrom}
     * @memberof Router
     */
    parse(input: RoutePath): IRouteToFrom;
    /**
     * Test if route paths are true, if so run their methods
     *
     * @memberof Router
     */
    route(): void;
    /**
     * Add listeners for PJAX Events
     *
     * @memberof Router
     */
    initEvents(): void;
    /**
     * Remove listeners for PJAX Events
     *
     * @memberof Router
     */
    stopEvents(): void;
}
