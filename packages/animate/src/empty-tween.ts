
import { ApplyCustomEasing, ComplexEasingSyntax, EasingFunctionKeys, GetEasingFunction, interpolateComplex } from "./custom-easing";
import { Animate, parseOptions, ALL_TIMING_KEYS, EasingKeys, GetEase, getTargets } from "./animate";
import { pick, omit, mapObject, isValid } from "./utils";

import Manager from "@okikio/manager";

import type { IAnimationOptions } from "./types";
import type { TypeCustomEasingOptions, TypeEasingFunction } from "./custom-easing";
import type { TypeListenerCallback } from "@okikio/emitter";

/** Keeps track of how many empty tween elements are in use */
export let UIDCount = 0;

/** For better performance push empty elements into `EmptyTweenElContainer` */
export const EmptyTweenElContainer: HTMLElement = document.createElement("div");

/** Creates a new empty tween element */
export const createEmptyEl = () => {
    if (!isValid(EmptyTweenElContainer.id)) {
        EmptyTweenElContainer.id = "empty-tween-el-container";
        EmptyTweenElContainer.style.setProperty("display", "none");
        EmptyTweenElContainer.style.setProperty("contain", "paint layout size");
        document.body.appendChild(EmptyTweenElContainer);
    }

    let el = document.createElement("div");
    el.id = `empty-animate-el-${UIDCount++}`;
    el.style.setProperty("display", "none");

    EmptyTweenElContainer.appendChild(el);
    return el;
}

/** Extends {@link Animate} stop method, so, it automatically removes the target elements from the dom */
export class DestroyableAnimate extends Animate {
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
 * - You can then use the "update" event to watch for changes in opacity and use the opacity as a progress bar of values between 0 to 1
*/
export const createTweenOptions = (options: IAnimationOptions & TypeCustomEasingOptions = {}): IAnimationOptions => {
    let { easing, decimal, numPoints, opacity, ...optionsObj } = parseOptions(options) as IAnimationOptions & TypeCustomEasingOptions;
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

    return {
        ...opacityObj,
        ...AnimationOptions
    };
};

/**  
 * Uses the change in opacity of empty elements (created by {@link createTweenOptions}) to interpolate the attributes of other elements   
 * 
 * e.g.
 * ```ts
 * import { AnimateAttributes } from "@okikio/animate";
 * import { interpolate } from "polymorph-js";
 * 
 * let startPath = "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";
 * let endPath = "M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z";
 * 
 * // This is an svg path interpolate function
 * // If used in tandem with `AnimateAttributes`, you can create morphing animations
 * let morph = interpolate([startPath, endPath], {
 *      addPoints: 0,
 *      origin: { x: 0, y: 0 },
 *      optimize: "fill",
 *      precision: 3
 * });
 * 
 * // `AnimateAttributes` supports all Animation Options with some restrictions and things to note.
 * // 1. Callbacks - the first argument in Animation Options callbacks are set to the progress of the animation beteen 0 and 1, while the other arguments are moved 1 right
 *
 * // So, animation options can look like this 
 * // `(progress: number, i: number, len: number, el: HTMLElement) => {
 * //   return progress;
 * // }
 * 
 * // 2. Custom easing by default - `easing`, `decimal`, `numPoints`, etc... from `CustomEasing` are supported, meaning you can use any easing function you want, including `spring`, etc... without calling `CustomEasing` on the property you want to apply custom easing to
 * // 3. You can use `.updateOptions(...)` to update the animation options of tweens
 * 
 * new AnimateAttributes({
 *      target: "svg path",
 *      d: progress => morph(progress)
 * });
 * ```
 * 
 * You can use {@link tweenAttr} as a fast way to create new instances of `AnimateAttributes`
 */
export class AnimateAttributes extends DestroyableAnimate {
    /** 
     * Stores all updateListeners for the corresponding tweens, to avoid leaving unused listeners
    */
    public updateListeners = new Manager<number, TypeListenerCallback>();
    
    public updateOptions(options: IAnimationOptions & TypeCustomEasingOptions = {}) {
        let optionsObj = parseOptions(options) as IAnimationOptions & TypeCustomEasingOptions;

        let el = this.targets.size > 1 ? null : { target: createEmptyEl() };
        let opts = Object.assign({}, createTweenOptions(omit(["target", "targets"], optionsObj)), el);
        super.updateOptions(opts);

        let Properties = omit(ALL_TIMING_KEYS, optionsObj);

        try {
            this.updateListeners = this.updateListeners ?? new Manager<number, TypeListenerCallback>()
            this.updateListeners.forEach((listener, index) => {
                this.off("update", listener);
                this.updateListeners.remove(index);
            }, this);

            let { target, targets } = optionsObj;
            let targetArr = [...new Set([...getTargets(targets), ...getTargets(target)])];

            let len = targetArr.length;
            let emptyEl = this.targets.get(0) as HTMLElement;
            let emptyElstyle = window.getComputedStyle(emptyEl);

            targetArr.forEach((el: HTMLElement, i) => {
                mapObject(Properties, (tweenPts, name) => {
                    let initialValue = el.getAttribute(name);
                    let updateCallback: TypeListenerCallback;
                    this.on("update", updateCallback = () => {
                        let progress = Number(emptyElstyle.getPropertyValue("opacity"));
                        let value: any;

                        if (typeof tweenPts == "function")
                            value = tweenPts(progress, i, len, el);
                        else
                            value = interpolateComplex(progress, Array.isArray(tweenPts) ? tweenPts : [initialValue, tweenPts], optionsObj.decimal);

                        (el as HTMLElement).setAttribute(name, `` + value);
                    });

                    this.updateListeners.add(updateCallback);
                });
            }, this);
        } catch (e) {
            this?.stopLoop();
            this?.emit?.("error", e);
        }

        return this;
    }
}

/**  
 * Creates new instances of {@link AnimateAttributes}
 */
export const tweenAttr = (options: IAnimationOptions & TypeCustomEasingOptions = {}) => {
    return new AnimateAttributes(options);
};