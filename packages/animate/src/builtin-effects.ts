/**
 * Convert the words "from", and "to" as well as percentage or numbers to offset value between 0 and 1
 */
export const parseOffset = (input: string | number): number => {
    if (typeof input == "string") {
        if (input.includes("%"))
            return parseFloat(input) / 100;
        else if (input == "from")
            return 0;
        else if (input == "to")
            return 1;
        else
            return parseFloat(input);
    }

    return input;
};

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
export const KeyframeParse = (input: object): Keyframe[] => {
    // Set removes duplicate Keyframes for the same offset
    let results = new Set<Keyframe>();
    let keys = Object.keys(input);
    let len = keys.length;
    for (let i = 0; i < len; i++) {
        let key = "" + keys[i];
        let value = input[key];
        let offsets = key.split(",");
        let offsetLen = offsets.length;

        for (let j = 0; j < offsetLen; j++) {
            let offset = parseOffset(offsets[j]);
            results.add({ ...value, offset });
        }
    }

    return [...results].sort((a, b) => {
        return a.offset - b.offset;
    });
};

/**
 * I don't really want to put in the effort to create a complete list, so instead just look through the `animate.css` github and copy and paste the effects you need, into using a CSS Keyframe style JSON object, make sure to read the documentation for {@link KeyframeParse}
 *
 * or
 *
 * if you just need some quick effects go to [github.com/wellyshen/use-web-animations/](https://github.com/wellyshen/use-web-animations/tree/master/src/animations) and copy the `keyframes` array for the effect you want, remember to say thank you to @wellyshen for all his hardwork, 😂
 *
 * @internal
*/
export const EFFECTS = {};
