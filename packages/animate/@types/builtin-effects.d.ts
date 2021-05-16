/**
 * Convert the words "from", and "to" as well as percentage or numbers to offset value between 0 and 1
 */
export declare const parseOffset: (input: string | number) => number;
/**
 * Allows you to quickly convert CSS like JSON into keyframes
 *
 * @param input - CSS style JSON; check the example to understand what I mean
 *
 * @example
 * ```typescript
 * let keyframes = KeyframeParse({
 *     "from, 50%, to": {
 *         opacity: 1
 *     },
 *
 *     "25%, 0.7": {
 *         opacity: 0
 *     }
 * });
 *
 * console.log(keyframes);
 * //= [
 * //=   { opacity: 1, offset: 0 },
 * //=   { opacity: 0, offset: 0.25 },
 * //=   { opacity: 1, offset: 0.5 },
 * //=   { opacity: 0, offset: 0.7 },
 * //=   { opacity: 1, offset: 1 }
 * //= ]
 * ```
 */
export declare const KeyframeParse: (input: object) => Keyframe[];
/**
 * I don't really want to put in the effort to create a complete list, so instead just look through the `animate.css` github and copy and paste the effects you need, into using a CSS Keyframe style JSON object, make sure to read the documentation for {@link KeyframeParse}
 *
 * or
 *
 * if you just need some quick effects go to [github.com/wellyshen/use-web-animations/](https://github.com/wellyshen/use-web-animations/tree/master/src/animations) and copy the `keyframes` array for the effect you want, remember to say thank you to @wellyshen for all his hardwork, 😂
 *
 * @internal
*/
export declare const EFFECTS: {};
