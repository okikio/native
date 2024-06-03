import { multiValueCssSet, pxUnitSet, degUnitSet, noUnitSet, unitPx, unitDeg, unitNone } from "./unit-conversion.ts";
import { kebabCaseToCamelCase, camelCaseToKebabCase, isEmpty, isValid, mapObject, omit, toStr, transpose, trim } from "./utils.ts";
import { CSSVarSupport, toCSSVars, transformProperyNames } from "./css-vars.ts";
import { interpolateString } from "./custom-easing.ts";
import { getCSS } from "./browser-objects.ts";

import type { OneOrMany, TypeCSSGenericPropertyKeyframes, IIndividualTransformProperties, IComputableCSSProperties, TypeCommonCSSGenerics } from "./types.ts";

export interface ITransformFunctions {
  [key: string]: (value: OneOrMany<TypeCSSGenericPropertyKeyframes>) => string[] | string[][];
}

/**
 * Details how to compute each transform function
 */
export const TransformFunctions: ITransformFunctions = {
  "translate": (value) => multiValueCssSet(value as TypeCSSGenericPropertyKeyframes[], unitPx),
  "translate3d": (value) => multiValueCssSet(value as TypeCSSGenericPropertyKeyframes[], unitPx),
  "translateX": (value) => pxUnitSet(value),
  "translateY": (value) => pxUnitSet(value),
  "translateZ": (value) => pxUnitSet(value),

  "rotate": (value) => multiValueCssSet(value as TypeCSSGenericPropertyKeyframes[], unitDeg),
  "rotate3d": (value) => multiValueCssSet(value as TypeCSSGenericPropertyKeyframes[], unitNone),
  "rotateX": (value) => degUnitSet(value),
  "rotateY": (value) => degUnitSet(value),
  "rotateZ": (value) => degUnitSet(value),

  "scale": (value) => multiValueCssSet(value as TypeCSSGenericPropertyKeyframes[], unitNone),
  "scale3d": (value) => multiValueCssSet(value as TypeCSSGenericPropertyKeyframes[], unitNone),
  "scaleX": (value) => noUnitSet(value),
  "scaleY": (value) => noUnitSet(value),
  "scaleZ": (value) => noUnitSet(value),

  "skew": (value) => multiValueCssSet(value as TypeCSSGenericPropertyKeyframes[], unitDeg),
  "skewX": (value) => degUnitSet(value),
  "skewY": (value) => degUnitSet(value),

  "perspective": (value) => pxUnitSet(value),

  // "matrix": value => CSSArrValue(value, unitNone),
  // "matrix3d": value => CSSArrValue(value, unitNone),
};

/**
 * Store all the supported transform functions as an Array
 */
export const TransformFunctionNames = Object.keys(TransformFunctions);

/**
 * Converts CSS properties from kebab-case to camelCase.
 *
 * @param obj - An object with CSS properties in kebab-case.
 * @returns An object with CSS properties in camelCase.
 *
 * @example
 * const camelCaseObj = CSSCamelCase({ 'border-left': '1px', 'background-color': 'red' });
 * // { borderLeft: '1px', backgroundColor: 'red' }
 *
 * @example
 * const camelCaseObj = CSSCamelCase({ 'margin-top': '10px', 'padding-bottom': '20px' });
 * // { marginTop: '10px', paddingBottom: '20px' }
 *
 * @example
 * const camelCaseObj = CSSCamelCase({});
 * // {}
 */
export function CSSCamelCase(obj: object): Record<string, any> {
  const keys = Object.keys(obj);
  const result: Record<string, any> = {};

  for (const key of keys) {
    const camelCaseKey = kebabCaseToCamelCase(key);
    result[camelCaseKey] = obj[key];
  }

  return result;
}

/**
 * Creates the transform property text.
 *
 * @param transformFnNames - An array of transform function names.
 * @param arr - An array of values for the transform functions.
 * @returns A string representing the transform property.
 *
 * @example
 * const transformText = createTransformProperty(['translateX', 'scale'], [[50, '100px'], [1, 2]]);
 * // 'translateX(50px) scale(1, 2)'
 *
 * @example
 * const transformText = createTransformProperty(['rotate'], [[45, '90deg']]);
 * // 'rotate(45deg, 90deg)'
 *
 * @example
 * const transformText = createTransformProperty(['skewX', 'skewY'], [['20deg'], ['10deg']]);
 * // 'skewX(20deg) skewY(10deg)'
 */
export function createTransformProperty(transformFnNames: string[], arr: any[]): string {
  let result = "";
  const len = transformFnNames.length;

  for (let i = 0; i < len; i++) {
    const name = transformFnNames[i];
    const value = arr[i];
    if (isValid(value)) {
      result += `${name}(${Array.isArray(value) ? value.join(", ") : value}) `;
    }
  }

  return result.trim();
}

/**
 * Common CSS Property names with the units "px" as an acceptable value.
 */
export const CSSPXDataType = ["margin", "padding", "size", "width", "height", "left", "right", "top", "bottom", "radius", "gap", "basis", "inset", "outline-offset", "translate", "perspective", "thickness", "position", "distance", "spacing"].map(x => kebabCaseToCamelCase(x)).join("|");


/**
 * Ensures that all transform function arrays are the same length.
 *
 * @param arr - An array of transform function values.
 * @param maxLen - The maximum length of the arrays (optional).
 * @returns An array of transformed function values.
 *
 * It fills in the gap between different size transform functions, so, for example,
 * ```ts
 * {
 *   translateX: [50, 60, 80, 90],
 *   scale: [0.5, 2]
 * }
 * ```
 *
 * There are more values of `translateX`, so the `transform` property created will look like this,
 * ```ts
 * {
 *   transform: [
 *     "translateX(50px) scale(0.5)",
 *     "translateX(60px) scale(2)",
 *     "translateX(80px)",
 *     "translateX(90px)"
 *   ]
 * }
 * ```
 *
 * `arrFill` interpolates between all missing portions of transform functions, and helps create a uniform size transform property,
 * e.g.
 * ```ts
 * {
 *   transform: [
 *     "translateX(50px) scale(0.5)",
 *     "translateX(60px) scale(1)",
 *     "translateX(80px) scale(1.5)",
 *     "translateX(90px) scale(2)"
 *   ]
 * }
 * ```
 * 
 * @example
 * const filledArray = arrFill([
 *   [1, 2], 
 *   [3, 4, 5]
 * ]);
 * // [[1, 2, 2], [3, 4, 5]]
 *
 * @example
 * const filledArray = arrFill([
 *   [10], 
 *   [20, 30]
 * ], 3);
 * // [[10, 10, 10], [20, 30, 30]]
 *
 * @example
 * const filledArray = arrFill([
 *   ['10%', '20%'], 
 *   ['30%']
 * ]);
 * // [['10%', '20%', '20%'], ['30%', '30%']]
 */
export function arrFill(arr: any[] | any[][], maxLen?: number): any[] | any[][] {
  // Ensure all transform function Arrays are the same length to create smooth motion
  maxLen = maxLen ?? Math.max(...arr.map((value: any[]) => value.length));
  return arr.map((value: any[]) => {
    const len = value.length;
    const is2dArray = value.every(v => Array.isArray(v));

    // If value is a one dimensional Array
    if (!is2dArray) {
      if (len !== maxLen) {
        return Array.from({ length: maxLen }, (_, i) => {
          // `interpolateString` requires a minimum of 2 elements in an array to interploate between,
          // repeat the first value twice if there are not enough values to satisfy `interpolateString`
          const values = len === 1 ? Array(2).fill(value[0]) : value;
          return interpolateString(i / (maxLen - 1), values);
        });
      } else return value;
    } 

    // * transpose 2d Array (because of what the array row and col's represent, to ensure we are calling arrFill on the proper axes),
    // * run arrFill to ensure a set size,
    // * transpose once more to return to it's original form but with all Arrays in the 2d array having the same size
    else {
      return transpose(arrFill(transpose(value), maxLen));
    }
  });
}


/**
 * Parses transformable CSS properties.
 * 
 * Removes the need for the full transform statement in order to use translate, rotate, scale, skew, or perspective including their X, Y, Z, and 3d varients
 * Also, adds the ability to use single string or number values for transform functions
 *
 * _**Note**: the `transform` animation option will override all transform function properties_
 * _**Note**: the order of where/when you define transform function matters, for example, depending on the order you define `translate`, and `rotate`, you can create change the radius of the rotation_
 *
 * @param properties - The CSS properties to transform.
 * @param USE_CSS_VARS - Flag to use CSS variables (optional).
 * @returns An object with formatted CSS properties. 
 * 
 * @example
 * ```ts
 * ParseTransformableCSSProperties({
 *   // It will automatically add the "px" units for you, or you can write a string with the units you want
 *   translate3d: [
 *     "25 35 60%",
 *     [50, "60px", 70],
 *     ["70", 50]
 *   ],
 *   translate: "25 35 60%",
 *   translateX: [50, "60px", "70"],
 *   translateY: ["50, 60", "60"], // Note: this will actually result in an error, make sure to pay attention to where you are putting commas
 *   translateZ: 0,
 *   perspective: 0,
 *   opacity: "0, 5",
 *   scale: [
 *     [1, "2"],
 *     ["2", 1]
 *   ],
 *   rotate3d: [
 *     [1, 2, 5, "3deg"], // The last value in the array must be a string with units for rotate3d
 *     [2, "4", 6, "45turn"],
 *     ["2", "4", "6", "-1rad"]
 *   ],
 *
 *   // Units are required for non transform CSS properties
 *   // String won't be split into array, they will be wrappeed in an Array
 *   // It will transform border-left to camelCase "borderLeft"
 *   "border-left": 50,
 *   "offset-rotate": "10 20",
 *   margin: 5,
 *
 *   // When writing in this formation you must specify the units
 *   padding: "5px 6px 7px"
 * })
 * 
 * // On Chromium based browsers, e.g. Chrome, Edge, Brave, Opera, etc... or browsers that support `CSS.registerProperty` this will be the result
 * //= {
 * //=   "--translate3d0": [ "25px", "50px", "70px" ],
 * //=   "--translate3d1": [ "35px", "60px", "50px" ],
 * //=   "--translate3d2": [ "60%", "70px" ],
 * //=   "--translate0": [ "25px" ],
 * //=   "--translate1": [ "35px" ],
 * //=   "--translateX": [ "50px", "60px", "70px" ],
 * //=   "--translateY": [ "50,,60", "60px" ],
 * //=   "--translateZ": [ "0px" ],
 * //=   "--rotate3d0": [ "1deg", "2deg", "2deg" ],
 * //=   "--rotate3d1": [ "2deg", "4deg", "4deg" ],
 * //=   "--rotate3d2": [ "5deg", "6deg", "6deg" ],
 * //=   "--rotate3d3": [ "3deg", "45turn", "-1rad" ],
 * //=   "--scale0": [ "1", "2" ],
 * //=   "--scale1": [ "2", "1" ],
 * //=   "--perspective": [ "0px" ],
 * //=   "opacity": [ "0, 5" ],
 * //=   "borderLeft": [ "50px" ],
 * //=   "offsetRotate": [ "10deg", "20deg" ],
 * //=   "margin": [ "5px" ],
 * //=   "padding": [ "5px", "6px", "7px" ]
 * //= }
 * 
 * // Browsers that don't support `CSS.registerProperty` will result in the following, namely Firefox and Safari
 * //= {
 * //=   transform: [
 * //=     // `translateY(50, 60)` will actually result in an error
 * //=     'translate(25px) translate3d(25px, 35px, 60%) translateX(50px) translateY(50, 60) translateZ(0px) rotate3d(1, 2, 5, 3deg) scale(1, 2) perspective(0px)',
 * //=     'translate(35px) translate3d(50px, 60px, 70px) translateX(60px) translateY(60px) rotate3d(2, 4, 6, 45turn) scale(2, 1)',
 * //=     'translate(60%) translate3d(70px, 50px) translateX(70px) rotate3d(2, 4, 6, -1rad)'
 * //=   ],
 * //=   opacity: [ '0', '5' ],
 * //=   borderLeft: ["50px"],
 * //=
 * //=   // Notice the "deg"
 * //=   offsetRotate: ["10deg", "20deg"],
 * //=   margin: ["5px"],
 * //=   padding: ["5px 6px 7px"]
 * //= }
 * 
 * // The key difference between the two is that the former will allow other animations to be used to 
 * // manipulate multiple different transforms at the same time, 
 * // while the latter will not, and must continously update the transform property,
 * // meaning that new animations will always override the previous ones on the same element,
 * // on browsers that *don't* support `CSS.registerProperty`
 * ```
 *
 * @example
 * const parsedProps = ParseTransformableCSSProperties({ translateX: [50, '100px'], scale: [1, 2] });
 * // { transform: ['translateX(50px) scale(1, 2)'] }
 *
 * @example
 * const parsedProps = ParseTransformableCSSProperties({ rotate: ['45deg', '90deg'], skewX: ['20deg'] });
 * // { transform: ['rotate(45deg, 90deg) skewX(20deg)'] }
 *
 * @example
 * const parsedProps = ParseTransformableCSSProperties({ 'border-left': '1px', 'background-color': 'red' });
 * // { borderLeft: ['1px'], backgroundColor: ['red'] }
 */
export function ParseTransformableCSSProperties(properties: IComputableCSSProperties, USE_CSS_VARS = false): IComputableCSSProperties {
  // Convert dash seperated strings to camelCase strings
  const AllCSSProperties = CSSCamelCase(properties) as IComputableCSSProperties;
  let rest: IComputableCSSProperties;
  let transform: string[];

  if (CSSVarSupport && USE_CSS_VARS) {
    rest = Object.assign({}, omit(transformProperyNames, AllCSSProperties), toCSSVars(AllCSSProperties));
  } else {
    // Adds support for ordered transforms 
    const transformFunctionNames = Object.keys(AllCSSProperties)
      .filter(key => TransformFunctionNames.includes(key));

    let transformFunctionValues = transformFunctionNames
      .map((key) => TransformFunctions[key](AllCSSProperties[key]));

    // Create the transform string
    transformFunctionValues = arrFill(transformFunctionValues);
    transform = transpose(transformFunctionValues)
      .filter(x => isValid(x))
      .map(arr => createTransformProperty(transformFunctionNames, arr));

    rest = omit(TransformFunctionNames, AllCSSProperties);
  }

  // Wrap non array CSS property values in an array
  rest = mapObject(rest, (value, key) => {
    let unit: typeof degUnitSet | typeof pxUnitSet;

    // If the property key doesn't have the word color in it, try to add the default "px" or "deg" to it
    if (!/color|shadow/i.test(key)) {
      const isAngle = /rotate/i.test(key);
      const isLength = new RegExp(CSSPXDataType, "i").test(key) || 
        (!isEmpty(getCSS()) && getCSS()?.supports?.(camelCaseToKebabCase(key), "1px"));

      // There is an intresting bug that occurs if you test a string againt the same instance of a Regular Expression
      // where the answer will be different every test
      // so, to avoid this bug, I create a new instance every time
      if (isAngle || isLength) {
        // If the key has rotate in it's name use "deg" as a default unit
        // If the key is for a common CSS Property name which has the units "px" as an acceptable value
        // try to add "px" as the default unit
        unit = isAngle ? degUnitSet : pxUnitSet;

        // Note: we first apply units, to make sure if it's a simple number, then units are added
        // but otherwise, if it's "margin", "padding", "inset", etc.. with values like "55 60 70 5em"
        // it can easily include the units required
        return unit(value).map(str => {
          // To support multi-value CSS properties like "margin", "padding", and "inset"
          // split the value into an array using spaces as the seperator
          // then apply the valid default units and join them back with spaces
          // seperating them
          const arr = trim(str).split(/\s+/);
          return unit(arr).join(" ");
        });
      }
    }

    return [].concat(value).map(x => toStr(x));
  });

  return Object.assign({}, isValid(transform) ? { transform } : null, rest);
}

/**
 * Similar to {@link ParseTransformableCSSProperties} except it transforms the CSS properties in each Keyframe
 * @param keyframes - an array of keyframes with transformable CSS properties
 * @returns
 * an array of keyframes, with transformed CSS properties
 */
export const ParseTransformableCSSKeyframes = (keyframes: (IIndividualTransformProperties & Keyframe)[], USE_CSS_VARS = false) => {
  return keyframes.map(properties => {
    // Convert dash seperated strings to camelCase strings
    let AllCSSProperties = CSSCamelCase(properties) as IIndividualTransformProperties & Keyframe;
    if (CSSVarSupport && USE_CSS_VARS) {
      return {
        rest: Object.assign({}, toCSSVars(AllCSSProperties), omit(transformProperyNames, AllCSSProperties)),
        transformFunctions: null
      };
    }

    let {
      translate,
      translate3d,
      translateX,
      translateY,
      translateZ,
      rotate,
      rotate3d,
      rotateX,
      rotateY,
      rotateZ,
      scale,
      scale3d,
      scaleX,
      scaleY,
      scaleZ,
      skew,
      skewX,
      skewY,
      perspective,
      // matrix,
      // matrix3d,

      // easing,
      // iterations,
      // offset,
      ...rest
    } = AllCSSProperties;

    translate = pxUnitSet(translate as TypeCSSGenericPropertyKeyframes);
    translate3d = pxUnitSet(translate3d as TypeCSSGenericPropertyKeyframes);
    translateX = pxUnitSet(translateX)[0];
    translateY = pxUnitSet(translateY)[0];
    translateZ = pxUnitSet(translateZ)[0];

    rotate = degUnitSet(rotate as TypeCSSGenericPropertyKeyframes);
    rotate3d = noUnitSet(rotate3d as TypeCSSGenericPropertyKeyframes);
    rotateX = degUnitSet(rotateX)[0];
    rotateY = degUnitSet(rotateY)[0];
    rotateZ = degUnitSet(rotateZ)[0];

    scale = noUnitSet(scale as TypeCSSGenericPropertyKeyframes);
    scale3d = noUnitSet(scale3d as TypeCSSGenericPropertyKeyframes);
    scaleX = noUnitSet(scaleX)[0];
    scaleY = noUnitSet(scaleY)[0];
    scaleZ = noUnitSet(scaleZ)[0];

    skew = degUnitSet(skew as TypeCSSGenericPropertyKeyframes);
    skewX = degUnitSet(skewX)[0];
    skewY = degUnitSet(skewY)[0];

    perspective = pxUnitSet(perspective)[0];

    // matrix = noUnitSet(matrix as TypeCSSGenericPropertyKeyframes);
    // matrix3d = noUnitSet(matrix3d as TypeCSSGenericPropertyKeyframes);

    return {
      rest,
      transformFunctions: [translate3d, translate, translateX, translateY, translateZ,
        rotate3d, rotate, rotateX, rotateY, rotateZ,
        scale3d, scale, scaleX, scaleY, scaleZ,
        skew, skewX, skewY,
        perspective] //, matrix, matrix3d
    };
  }).map(({ rest, transformFunctions }) => {
    let transform = CSSVarSupport ? null : createTransformProperty(TransformFunctionNames, transformFunctions);
    rest = mapObject(rest as object, (value, key) => {
      let unit: typeof degUnitSet | typeof pxUnitSet;
      value = toStr(value);

      // If key doesn't have the word color in it, try to add the default "px" or "deg" to it
      if (!/color|shadow/i.test(key)) {
        let isAngle = /rotate/i.test(key);
        let isLength = new RegExp(CSSPXDataType, "i").test(key);

        // There is an intresting bug that occurs if you test a string againt the same instance of a Regular Expression
        // where the answer will be different every test
        // so, to avoid this bug, I create a new instance every time
        if (isAngle || isLength) {
          // If the key has rotate in it's name use "deg" as a default unit
          if (isAngle) unit = degUnitSet;

          // If the key is for a common CSS Property name which has the units "px" as an acceptable value
          // try to add "px" as the default unit
          else if (isLength) unit = pxUnitSet;

          // To support multi-value CSS properties like "margin", "padding", and "inset"
          // with values like "55 60 70 5em", split the value into an array using spaces as the seperator
          // then apply the valid default units and join them back with spaces
          // seperating them
          return unit(value).join(" ");
        }
      }

      return value;
    });

    return Object.assign({},
      isValid(transform) ? { transform } : null,
      rest);
  });
}

/**
 * Parses transformable CSS keyframes.
 *
 * @param keyframes - An array of keyframes with transformable CSS properties.
 * @param USE_CSS_VARS - Flag to use CSS variables (optional).
 * @returns An array of keyframes with transformed CSS properties.
 *
 * @example
 * const parsedKeyframes = ParseTransformableCSSKeyframes([{ translateX: [50, '100px'], scale: [1, 2] }]);
 * // [{ transform: ['translateX(50px) scale(1, 2)'] }]
 *
 * @example
 * const parsedKeyframes = ParseTransformableCSSKeyframes([{ rotate: ['45deg', '90deg'], skewX: ['20deg'] }]);
 * // [{ transform: ['rotate(45deg, 90deg) skewX(20deg)'] }]
 *
 * @example
 * const parsedKeyframes = ParseTransformableCSSKeyframes([{ 'border-left': '1px', 'background-color': 'red' }]);
 * // [{ borderLeft: ['1px'], backgroundColor: ['red'] }]
 */
export function ParseTransformableCSSKeyframes(keyframes: (IIndividualTransformProperties & Keyframe)[], USE_CSS_VARS = false) {
  return keyframes.map(properties => {
    const AllCSSProperties = CSSCamelCase(properties) as IIndividualTransformProperties & Keyframe;

    if (CSSVarSupport && USE_CSS_VARS) {
      return {
        rest: Object.assign({}, toCSSVars(AllCSSProperties), omit(transformProperyNames, AllCSSProperties)),
        transformFunctions: null
      };
    }

    let {
      translate,
      translate3d,
      translateX,
      translateY,
      translateZ,
      rotate,
      rotate3d,
      rotateX,
      rotateY,
      rotateZ,
      scale,
      scale3d,
      scaleX,
      scaleY,
      scaleZ,
      skew,
      skewX,
      skewY,
      perspective,
      ...rest
    } = AllCSSProperties;

    translate = pxUnitSet(translate as TypeCSSGenericPropertyKeyframes);
    translate3d = pxUnitSet(translate3d as TypeCSSGenericPropertyKeyframes);
    translateX = pxUnitSet(translateX)[0];
    translateY = pxUnitSet(translateY)[0];
    translateZ = pxUnitSet(translateZ)[0];

    rotate = degUnitSet(rotate as TypeCSSGenericPropertyKeyframes);
    rotate3d = noUnitSet(rotate3d as TypeCSSGenericPropertyKeyframes);
    rotateX = degUnitSet(rotateX)[0];
    rotateY = degUnitSet(rotateY)[0];
    rotateZ = degUnitSet(rotateZ)[0];

    scale = noUnitSet(scale as TypeCSSGenericPropertyKeyframes);
    scale3d = noUnitSet(scale3d as TypeCSSGenericPropertyKeyframes);
    scaleX = noUnitSet(scaleX)[0];
    scaleY = noUnitSet(scaleY)[0];
    scaleZ = noUnitSet(scaleZ)[0];

    skew = degUnitSet(skew as TypeCSSGenericPropertyKeyframes);
    skewX = degUnitSet(skewX)[0];
    skewY = degUnitSet(skewY)[0];

    perspective = pxUnitSet(perspective)[0];

    return {
      rest,
      transformFunctions: [translate3d, translate, translateX, translateY, translateZ,
        rotate3d, rotate, rotateX, rotateY, rotateZ,
        scale3d, scale, scaleX, scaleY, scaleZ,
        skew, skewX, skewY,
        perspective]
    };
  }).map(({ rest, transformFunctions }) => {
    const transform = CSSVarSupport ? null : createTransformProperty(TransformFunctionNames, transformFunctions);
    rest = mapObject(rest as object, (value, key) => {
      value = toStr(value);

      if (!/color|shadow/i.test(key)) {
        const isAngle = /rotate/i.test(key);
        const isLength = new RegExp(CSSPXDataType, "i").test(key);

        if (isAngle || isLength) {
          const unit = isAngle ? degUnitSet : pxUnitSet;
          return unit(value).join(" ");
        }
      }

      return value;
    });

    return Object.assign({}, isValid(transform) ? { transform } : null, rest);
  });
}