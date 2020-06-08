export const getElements = (selector) => {
    return typeof selector === "string" ? [...document.querySelectorAll(selector)] : [selector];
};
export const getTargets = (targets) => {
    if (Array.isArray(targets))
        return targets;
    if (typeof targets == "string" || targets instanceof Node)
        return getElements(targets);
    if (targets instanceof NodeList)
        return [...targets];
    return null;
};
const accelerate = ({ style }, keyframes) => style.willChange = keyframes
    ? keyframes.map(({ property }) => property).join()
    : "auto";
// Compute Value
export const computeValue = (value, input) => typeof value == "function" ? value(input) : value;
// Convert all hex color to rgba
export const parseColor = (value) => {
    let strValue = String(value);
    if (!strValue.startsWith("#"))
        return strValue;
    let hex = strValue.slice(1);
    let [r, g, b, a = 255] = hex.length < 5 ?
        hex.match(/\w/g).map(x => parseInt(x + x, 16)) :
        hex.match(/\w\w/g).map(x => parseInt(x, 16));
    return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
};
// Easing Equations 
const pi2 = Math.PI * 2;
const getOffset = (strength, period) => period / pi2 * Math.asin(1 / strength);
export const easings = {
    "linear": progress => progress,
    "in-cubic": progress => progress ** 3,
    "in-quartic": progress => progress ** 4,
    "in-quintic": progress => progress ** 5,
    "in-exponential": progress => 1024 ** (progress - 1),
    "in-circular": progress => 1 - Math.sqrt(1 - progress ** 2),
    "in-elastic": (progress, amplitude, period) => {
        const strength = Math.max(amplitude, 1);
        const offset = getOffset(strength, period);
        return -(strength * 2 ** (10 * (progress -= 1)) * Math.sin((progress - offset) * pi2 / period));
    },
    "out-cubic": progress => --progress ** 3 + 1,
    "out-quartic": progress => 1 - --progress ** 4,
    "out-quintic": progress => --progress ** 5 + 1,
    "out-exponential": progress => 1 - 2 ** (-10 * progress),
    "out-circular": progress => Math.sqrt(1 - --progress ** 2),
    "out-elastic": (progress, amplitude, period) => {
        const strength = Math.max(amplitude, 1);
        const offset = getOffset(strength, period);
        return strength * 2 ** (-10 * progress) * Math.sin((progress - offset) * pi2 / period) + 1;
    },
    "in-out-cubic": progress => (progress *= 2) < 1
        ? .5 * progress ** 3
        : .5 * ((progress -= 2) * progress ** 2 + 2),
    "in-out-quartic": progress => (progress *= 2) < 1
        ? .5 * progress ** 4
        : -.5 * ((progress -= 2) * progress ** 3 - 2),
    "in-out-quintic": progress => (progress *= 2) < 1
        ? .5 * progress ** 5
        : .5 * ((progress -= 2) * progress ** 4 + 2),
    "in-out-exponential": progress => (progress *= 2) < 1
        ? .5 * 1024 ** (progress - 1)
        : .5 * (-(2 ** (-10 * (progress - 1))) + 2),
    "in-out-circular": progress => (progress *= 2) < 1
        ? -.5 * (Math.sqrt(1 - progress ** 2) - 1)
        : .5 * (Math.sqrt(1 - (progress -= 2) * progress) + 1),
    "in-out-elastic": (progress, amplitude, period) => {
        const strength = Math.max(amplitude, 1);
        const offset = getOffset(strength, period);
        return (progress *= 2) < 1
            ? -.5 * (strength * 2 ** (10 * (progress -= 1)) * Math.sin((progress - offset) * pi2 / period))
            : strength * 2 ** (-10 * (progress -= 1)) * Math.sin((progress - offset) * pi2 / period) * .5 + 1;
    }
};
const decomposeEasing = (value) => {
    const [easing, amplitude = 1, period = .4] = value.trim().split(" ");
    return { easing, amplitude, period };
};
const ease = ({ easing, amplitude, period }, progress) => easings[easing](progress, amplitude, period);
;
export const DefaultAnimationOptions = {
    animation: {},
    keyframes: [],
    loop: 1,
    delay: 0,
    easing: "ease",
    endDelay: 0,
    duration: 1000,
    direction: "normal",
    fill: "forwards",
};
export class Animation extends Promise {
    /**
     * Creates an instance of Animation.
     * @param {object} options
     * @memberof Animation
     */
    constructor(
    /**
     * Stores the options for the current animation
     *
     * @protected
     * @type AnimationOptions
     * @memberof Animation
     */
    options = DefaultAnimationOptions) {
        super(resolve => {
            resolve();
        });
        this.options = options;
        let { animation = {}, ...rest } = options;
        this.options = { ...DefaultAnimationOptions, ...options, ...animation };
        // const { 
        // }
        // this.animationProperties = 
    }
}
export const animate = (targets, properties, options) => { };
export default animate;

//# sourceMappingURL=animate.js.map
