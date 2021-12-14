export declare const hsl: {
    name: string;
    min: number[];
    max: number[];
    channel: string[];
    alias: string[];
    rgb: (hsl: any) => any;
};
/**
 * Parse color from the string passed
 *
 * @return {Object} A space indicator `space`, an array `values` and `alpha`
 */
export declare const parse: (cstr: any) => {
    space: any;
    values: any[];
    alpha: number;
};
export declare const rgba: (color: any) => any;
export default rgba;
