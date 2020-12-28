import { Service } from "./service";
import { Manager } from "./manager";
export declare type RouteMethod = (...args: any) => any;
export declare type RouteStyle = string | RegExp | boolean;
export interface IRouteToFrom {
    to: RouteStyle;
    from: RouteStyle;
}
export declare type RoutePath = IRouteToFrom | RouteStyle;
export interface IRoute {
    path: RoutePath;
    method: RouteMethod;
}
/** Controls what happens when certain url paths match a set of criteria */
export declare class Router extends Service {
    /** List of routes */
    protected routes: Manager<IRouteToFrom, RouteMethod>;
    constructor(routes?: IRoute[]);
    /** Add a new route to watch for */
    add({ path, method }: IRoute): Router;
    /** Convert strings into path match functions */
    parsePath(path: RouteStyle): RegExp | boolean;
    /** Determines if a strings counts has a path */
    isPath(input: RouteStyle): boolean;
    /** Parse the multiple different formats for paths, into a { from, to } object */
    parse(input: RoutePath): IRouteToFrom;
    /** Test if route paths are true, if so run their methods */
    route(): void;
    /** Add listeners for PJAX Events */
    initEvents(): void;
    /** Remove listeners for PJAX Events */
    stopEvents(): void;
}
