export declare const transformCSSVars: {
    translate3d: string[];
    translate: string[];
    translateX: string;
    translateY: string;
    translateZ: string;
    rotate3d: string[];
    rotate: string;
    rotateX: string;
    rotateY: string;
    rotateZ: string;
    scale3d: string[];
    scale: string[];
    scaleX: string;
    scaleY: string;
    scaleZ: string;
    skew: string[];
    skewX: string;
    skewY: string;
    perspective: string;
};
export declare const CSSVarSupport: boolean;
export declare const transformProperyNames: string[];
export declare const createTransformValue: (opts?: {}) => string;
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
export declare const toCSSVars: (opts?: {}) => {};
