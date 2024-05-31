/**
 * Parses a string offset to a number. 
 * Converts the words "from", and "to" as well as percentages or numbers to offset value between 0 and 1
 *
 * @param offset - The string offset, e.g., "from", "to", "50%", "0.7"
 * @returns The numerical offset
 *
 * @example
 * ```typescript
 * parseOffset("from"); // 0
 * parseOffset("50%");  // 0.5
 * parseOffset("0.7");  // 0.7
 * parseOffset("to");   // 1
 * ```
 */
export function parseOffset(offset: string | number): number {
    if (typeof offset === "number") return offset;
    offset = offset.trim();

    switch (offset) {
        case "from":
            return 0;
        case "to":
            return 1;
        default:
            // Assumes offset is a percentage or a decimal
            if (/%$/.test(offset)) {
                return parseFloat(offset) / 100;
            }
            return parseFloat(offset);
    }
}

/**
 * Allows you to quickly convert CSS-like JSON into keyframes
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
export function KeyframeParse<T extends Record<string, any>>(input: T): Keyframe[] {
    // Using a Map to maintain order and remove duplicates
    const results = new Map<number, Keyframe>();
    const keys = Object.keys(input);

    for (const key of keys) {
        const value = input[key];
        const offsets = key.split(",");

        // Iterate over all offsets and add to results
        for (const _offset of offsets) {
            let offset = parseOffset(_offset);
            results.set(offset, { ...value, offset });
        }
    }

    // Convert Map to array and sort by offset
    return Array.from(results.values()).sort((a, b) => a.offset! - b.offset!);
}

/**
 * I don't really want to put in the effort to create a complete list, so instead just look through the `animate.css` github and copy and paste the effects you need, into using a CSS Keyframe style JSON object, make sure to read the documentation for {@link KeyframeParse}
 *
 * I suggest [@shoelace-style/animations](https://www.npmjs.com/package/@shoelace-style/animations) for all your animate.css needs.
 * 
 * or
 * 
 * if you just need some quick effects go to [github.com/wellyshen/use-web-animations/](https://github.com/wellyshen/use-web-animations/tree/master/src/animations) and copy the `keyframes` array for the effect you want, remember to say thank you to @wellyshen for all his hardwork, 😂.
 *
 * @internal
*/
export const EFFECTS = {};
