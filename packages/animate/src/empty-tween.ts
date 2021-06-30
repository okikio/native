
import { ApplyCustomEasing, ComplexEasingSyntax, EasingFunctionKeys, GetEasingFunction, interpolateComplex, TypeCustomEasingOptions, TypeEasingFunction } from "./custom-easing";
import { Animate, parseOptions, ALL_TIMING_KEYS, EasingKeys, GetEase, getTargets } from "./animate";
import { pick, omit, mapObject } from "./utils";

import type { IAnimationOptions } from "./types";

/** Keeps track of all the empty tween elements */
export let UIDCount = 0;

/** Creates a new empty tween element */
export const createEmptyEl = () => {
    let el = document.createElement("div");
    el.id = `empty-animate-el-${UIDCount++}`;
    el.style.setProperty("display", "none");
    document.body.appendChild(el);
    return el;
}

/** Extends {@link Animate} stop method, so, it automatically removes the target elements from the dom */
export class DestroyableAnimate extends Animate {
    constructor(options: IAnimationOptions = {}) {
        super(options);
    }

    public stop() {
        /** Detach element from DOM */
        this.targets.forEach((target: HTMLElement) => target?.remove?.());
        super.stop();
    }
}

/** 
 * - create a empty new element,
 * - attach it to the DOM, 
 * - animate the opacity of said element
 * - You can then use the "update" event to watch for changes in opacity and 
 * use the opacity as a progress bar of values between 0 to 1
*/
export const tween = (options: IAnimationOptions & TypeCustomEasingOptions = {}) => {
    let el = createEmptyEl();
    let { target, easing, decimal, numPoints, ...optionsObj } = parseOptions(options) as IAnimationOptions & TypeCustomEasingOptions;
    let AnimationOptions = pick(ALL_TIMING_KEYS, optionsObj) as IAnimationOptions;
    let EasingFunction = easing as (string | string[] | TypeEasingFunction);

    if (typeof easing == "string") {
        let ease = ComplexEasingSyntax(easing);

        if (EasingKeys.includes(ease) || ["linear", "steps", "step-start", "step-end"].includes(ease))
            EasingFunction = GetEase(easing);
        else if (EasingFunctionKeys.includes(ease))
            EasingFunction = GetEasingFunction(easing);
        else
            EasingFunction = easing;
    }

    let opacityObj = typeof EasingFunction == "function" ? ApplyCustomEasing({
        opacity: [0, 1],
        easing: easing as (string | TypeEasingFunction),
        decimal: decimal as number,
        numPoints: numPoints as number
    }) : { opacity: [0, 1], easing };

    let animation = new DestroyableAnimate({
        target: el,
        ...opacityObj,
        ...AnimationOptions
    });

    return animation;
}

/**  
 * Uses the change in opacity (from the {@link tween} function) to interpolate the value of other elements   
 * 
 * e.g.
 * ```ts
 * import { tweenAttr } from "@okikio/animate";
 * import { interpolate } from "polymorph-js";
 * 
 * let startPath = usingPolymorphPathEl.getAttribute("d");
 * let endPath = "M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z";
 * 
 * // This is an svg path interpolate function
 * // If used in tandem with `tweenAttr`, you can create morphing animations
 * let morph = interpolate([startPath, endPath], {
 *      addPoints: 0,
 *      origin: { x: 0, y: 0 },
 *      optimize: "fill",
 *      precision: 3
 * });
 * 
 * // `tweenAttr` supports all Animation Options.
 * // The first argument in Animation Options callbacks are set to the progress of the animation beteen 0 and 1, while the other arguments are moved 1 right
 * 
 * // So, animation options can look like this 
 * // `(progress: number, i: number, len: number, el: HTMLElement) => {
 * //   return progress;
 * // }`
 * 
 * tweenAttr({
 *      target: "svg path",
 *      d: progress => morph(progress)
 * });
 * 
 * // `tweenAttr` can automatically choose between custom easing functions and or normal easings
 * tweenAttr({
 *      target: ".div",
 *      targets: ".el",
 *      width: 250,
 *      height: ["500px", 600],
 *      easing: "spring"
 * 
 * // If you want to update styles instead of attributes, 
 * // you can change this to "style"
 * }, "style");
 * ```
 * 
 * Read more about {@link tween}
 */
export const tweenAttr = (options: IAnimationOptions & TypeCustomEasingOptions = {}, type = "attribute") => {
    let optionsObj = parseOptions(options) as IAnimationOptions & TypeCustomEasingOptions;
    let Properties = omit([...ALL_TIMING_KEYS, "opacity", "decimal", "numPoints"], optionsObj);
    let animation = tween(optionsObj);

    let { target, targets } = optionsObj;
    let targetArr = [...new Set([...getTargets(targets), ...getTargets(target)])];

    try {
        let len = targetArr.length;
        let emptyEl = animation.targets.get(0) as HTMLElement;
        let emptyElstyle = getComputedStyle(emptyEl);

        targetArr.forEach((el: HTMLElement, i) => {
            let styleObj = /style/i.test(type) ? getComputedStyle(el) : null;

            mapObject(Properties, (tweenPts, name) => {
                let intialValue = /style/i.test(type) ? styleObj?.getPropertyValue(name) : el.getAttribute(name);

                animation.on("update", () => {
                    let progress = Number(emptyElstyle.getPropertyValue("opacity"));
                    let value: any;

                    if (typeof tweenPts == "function")
                        value = tweenPts(progress, i, len, el);
                    else
                        value = interpolateComplex(progress, Array.isArray(tweenPts) ? tweenPts : [intialValue, tweenPts], options.decimal);


                    if (/style/i.test(type))
                        (el as HTMLElement).style.setProperty(name, `` + value);
                    else
                        (el as HTMLElement).setAttribute(name, `` + value);
                });
            });
        });
    } catch (e) {
        animation?.stopLoop();
        console.error(e);
    }

    return animation;
};