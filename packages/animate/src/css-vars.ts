import { UnitPXCSSValue, UnitDEGCSSValue } from "./unit-conversion";
import { isValid, transpose } from "./utils";

export const transformCSSVars = {
    translate3d: ["--translate3d0", "--translate3d1", "--translate3d2"],
    translate: ["--translate0", "--translate1"],
    translateX: "--translateX",
    translateY: "--translateY",
    translateZ: "--translateZ",

    rotate3d: ["--rotate3d0", "--rotate3d1", "--rotate3d2", "--rotate3d3"],
    rotate: "--rotate",
    rotateX: "--rotateX",
    rotateY: "--rotateY",
    rotateZ: "--rotateZ",

    scale3d: ["--scale3d0", "--scale3d1", "--scale3d2"],
    scale: ["--scale0", "--scale1"],
    scaleX: "--scaleX",
    scaleY: "--scaleY",
    scaleZ: "--scaleZ",

    // You can choose to use transform functions or matrix's, but not both
    // matrix3d: "--matrix3d",
    // matrix: "--matrix",

    skew: ["--skew0", "--skew1"],
    skewX: "--skewX",
    skewY: "--skewY",

    perspective: "--perspective"
};

export const CSSVarSupport = "registerProperty" in CSS;
export const transformProperyNames = Object.keys(transformCSSVars);

export const createTransformValue = (opts = {}) => {
    return Object.keys(opts)
        .filter(key => transformProperyNames.includes(key))
        .map(property => {
            if (!CSSVarSupport) return "";

            // Wrap all (non array) values from the properties object in an Array
            let value = [].concat(transformCSSVars[property]);

            // Create a new CSS property from the values in the properties object
            value.forEach((name) => {
                // This is a workaround for a bug in `CSS.registerProperty` where a CSS variable can't be re-registed and the browser doesn't store a recored of which CSS variables have been registered
                if (globalThis.RegisteredCSSVars?.[name]) return;

                let opts = {
                    name,
                    inherits: false
                };

                if (/translate|perspective/i.test(name)) {
                    // @ts-ignore
                    CSS.registerProperty({
                        ...opts,
                        syntax: "<length-percentage>",
                        initialValue: "0px"
                    });
                } else if (/rotate3d3|skew/i.test(name)) {
                    // @ts-ignore
                    CSS.registerProperty({
                        ...opts,
                        syntax: "<angle>",
                        initialValue: "0deg"
                    });
                } else if (/scale|rotate3d/i.test(name)) {
                    // @ts-ignore
                    CSS.registerProperty({
                        ...opts,
                        syntax: "<number>",
                        initialValue: /rotate3d/i.test(name) ? 0 : 1
                    });
                } else if (/rotate/i.test(name)) {
                    // @ts-ignore
                    CSS.registerProperty({
                        ...opts,
                        syntax: "<angle>",
                        initialValue: "0deg"
                    });
                }
                
                // Store a record of which CSS variables have been registered
                globalThis.RegisteredCSSVars ??= {};
                globalThis.RegisteredCSSVars[name] = true;
            });

            // Return the string representing a CSS transform property
            return `${property}(${value.map((v) => `var(${v})`)})`;
        })
        .join(" ");
};

/**
  * Convert transform function properties to CSS variables to create the desired animation
  * e.g.
    ```js
    toCSSVars({
        translate: ["0px 60px", "100px 100px"],
        translateX: ["60px", "500px"],
        translateY: ["60px", "500px"],
    });
    
    // {
    //     "--translate0": [
    //         "0px",
    //         "100px"
    //     ],
    //     "--translate1": [
    //         "60px",
    //         "100px"
    //     ],
    //     "--translateX": [
    //         "60px",
    //         "500px"
    //     ],
    //     "--translateY": [
    //         "60px",
    //         "500px"
    //     ]
    // }
    ```
*/
export const toCSSVars = (opts = {}) => {
    let result = {};
    transformProperyNames.forEach((property) => {
        // To avoid empty CSS variables, exclude transform properties that aren't present in opts
        if (!(property in opts)) {
            return;
        }

        // Wrap all (non array) values from the opts object in an Array
        let input = []
            .concat(opts[property])

            // Exclude empty Arrays, empty strings, null, undefined, and NaN
            .filter((value) => isValid(value))

            // for tranlate create an Array of [x, y] values split by the space
            // e.g. translate: ["0px 0px", "200px 200px"] ==> [["0px", "0px"], ["200px", "200px"]]
            .map((value) =>
                typeof value == "string" && /\s/.test(value.trim())
                    ? value.split(/\s+/)
                    : value
            );

        // Exclude empty Arrays
        if (input.length == 0) {
            return;
        }

        let CSSVars = [].concat(transformCSSVars[property]);
        let is2dArray = input.every((value) => Array.isArray(value));
        let ScaleBothAxis = input.length == 1 && property == "scale";
        CSSVars.forEach((CSSvariable, i) => {
            // The first value in scale states both the x and y scales, but only if there is only one value given
            let index = ScaleBothAxis ? 0 : i;
            let value = is2dArray
                ? // flip a 2d array over it's diagonal axis,
                // this ensures the correct CSS axis variable for translate, scale, rotate, and their 3d varitants
                // (search up "transpose matrix" on Google for more info.)
                transpose(...input)[index]
                : input;

            if (isValid(value)) {
                let name = CSSvariable;

                if (/translate|perspective/i.test(name))
                    value = UnitPXCSSValue(value);
                else if (/rotate3d3|skew/i.test(name)) 
                    value = UnitDEGCSSValue(value);
                else if (/scale|rotate3d/i.test(name)) { }
                else if (/rotate/i.test(name)) 
                    value = UnitDEGCSSValue(value);

                result[CSSvariable] = value;
            }
        });
    });

    return result;
};