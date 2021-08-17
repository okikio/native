import { Service } from "./service";
import { Manager } from "./manager";
export declare type TypeRouteMethod = (...args: any) => any;
export declare type TypeRouteStyle = string | RegExp | boolean | TypeRouteStyle[];
export interface IRouteToFrom {
    to?: TypeRouteStyle;
    from?: TypeRouteStyle;
}
export declare type TypeRoutePath = IRouteToFrom & ({
    to: TypeRouteStyle;
} | {
    from: TypeRouteStyle;
}) | TypeRouteStyle;
export interface IRoute {
    path: TypeRoutePath;
    method: TypeRouteMethod;
}
/** Controls what happens when certain url paths match a set of criteria */
export declare class Router extends Service {
    /** List of routes */
    protected routes: Manager<IRouteToFrom, TypeRouteMethod>;
    constructor(routes?: IRoute[]);
    /** Add a new route to watch for */
    add({ path, method }: IRoute): Router;
    /** Convert strings into path match functions */
    parsePath(path: TypeRouteStyle): RegExp | boolean;
    /** Determines if a strings counts has a path */
    isPath(input: TypeRouteStyle): boolean;
    /** Parse the multiple different formats for paths, into a { from, to } object */
    parse(input: TypeRoutePath): IRouteToFrom;
    /** Test if route paths are true, if so run their methods */
    route(): void;
    /** Add listeners for PJAX Events */
    initEvents(): void;
    /** Remove listeners for PJAX Events */
    stopEvents(): void;
}
