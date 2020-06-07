/*import fetch from 'cross-fetch';
let request = async (url) => {
    const timeout = setTimeout(() => {
        clearTimeout(timeout);
        throw "Request Timed Out!";
    }, 100000);

    try {
        let response = await fetch(url, {
            method: "GET",
            cache: "default",
            credentials: "cors",
        });

        clearTimeout(timeout);
        if (response.status >= 200 && response.status < 300) {
            return await response.text();
        }

        const err = new Error(response.statusText || "" + response.status);
        throw err;
    } catch (err) {
        clearTimeout(timeout);
        throw err;
    }
};

let counter = 0;
const cache = new Map();
let toStr = url => `//${url.host}${url.pathname}`.replace(/#.* /, "");
let load = async (_url) => {
    let url = _url instanceof URL ? _url : new URL(_url);
    let urlStr = toStr(url);

    if (cache.has(urlStr)) {
        let page = cache.get(urlStr);
        return Promise.resolve(page)
    }

    try {
        let response = await request(urlStr);
        let page = { url, page: response.substring(0, 10) };
        cache.set(urlStr, page);
        ++counter;
        return page;
    } catch (err) {
        console.error(err);
    }
};

try {
    let url = new URL("http://josephojo.com");
    let response = await load(url);
    response
    let another = await load(new URL("https://app-web.netlify.com/about"));
    another
    let again = await load(new URL("https://app-web.netlify.com/about"));
    again
    counter
} catch (err) {
    console.log(err);
}
*/

// const newURL = new URL("https://josephojo.com");
// const URLString = toStr(newURL);
// cache.set(URLString, { url: newURL, page: "document.documentElement.innerHTML" });
// try {
//     let response = await request("//josephojo.com");
//     response //=
// } catch (err) {
//     console.log(err);
// }

let hex2rgba = (hex, alpha = 1) => {
    const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
    return `rgba(${r},${g},${b},${alpha})`;
};
hex2rgba = (hex) => `rgb(${hex.substr(1).match(/../g).map(x => +`0x${x}`)})`;
hex2rgba = (hex) => {
    let color = +`0x${hex.replace("#", "")}`;
    let [r, g, b] = [color >> 16 & 0xFF, color >> 8 & 0xFF, color & 0xFF];
    return `rgb(${r},${g},${b})`;
};
hex2rgba = (color) => {
    if (/^rgb/.test(color)) return color;
    let hex = color.replace("#", "");
    let [r, g, b] = color.match(/\w/g).map(x => parseInt(hex.length == 3 ? x + x : x, 16));
    return `rgb(${r},${g},${b})`;
};
// let result = hex2rgba("ff00");
// result

class Block {
    name = "Cool";
    getName() {
        return this.name;
    }
}
// console.log(Array.from(Array(11), (x, i) => i / 10))

// Convert all hex color to rgb
export const parseColor = (value) => {
    let strValue = String(value);
    if (!strValue.startsWith("#")) return strValue;
    let hex = strValue.slice(1);
    let [r, g, b, a = 255] = hex.length < 5 ?
        hex.match(/\w/g).map(x => parseInt(x + x, 16)) :
        hex.match(/\w\w/g).map(x => parseInt(x, 16));
    return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
};

// const extractRegExp = /-?\d*\.?\d+/g;
// const extractStrings = (value) =>
//     value.split(extractRegExp);
// const extractNumbers = (value) =>
//     value.match(extractRegExp).map(Number);
// const sanitize = (values) => values.map(parseColor);

// const propertyKeyframes = (property, values) => {
//     const animatable = sanitize(values);
//     const strings = extractStrings(animatable[0]);
//     const numbers = animatable.map(extractNumbers);
//     const round = strings[0].startsWith("rgb");
//     return { property, strings, numbers, round };
// };

const first = ([item]) => item;
export const computeValue = (value, input) =>
    typeof value == "function" ? value(input) : value;
// const createAnimationKeyframes = (keyframes, index) =>
//     Object.entries(keyframes)
//         .map(([property, values]) => {
//             return propertyKeyframes(property, computeValue(values, index))
//         });

const extractRegExp = /-?\d*\.?\d+/g;

const extractStrings = value =>
    value.split(extractRegExp);

const extractNumbers = value =>
    value.match(extractRegExp).map(Number);

const hexPairs = color => {
    const split = color.split("");
    const pairs = color.length < 5
        ? split.map(string => string + string)
        : split.reduce((array, string, index) => {
            if (index % 2)
                array.push(split[index - 1] + string);
            return array;
        }, []);
    if (pairs.length < 4)
        pairs.push("ff");
    return pairs;
};

const convert = color =>
    hexPairs(color).map(string => parseInt(string, 16));

const rgba = hex => {
    const color = hex.slice(1);
    const [r, g, b, a] = convert(color);
    return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
};

const sanitize = values =>
    values.map(parseColor);

const addPropertyKeyframes = (property, values) => {
    const animatable = sanitize(values);
    const strings = extractStrings(first(animatable));
    const numbers = animatable.map(extractNumbers);
    const round = first(strings).startsWith("rgb");
    return { property, strings, numbers, round };
};

const createAnimationKeyframes = (keyframes, index) =>
    Object.entries(keyframes).map(([property, values]) =>
        addPropertyKeyframes(property, computeValue(values, index)));

const getCurrentValue = (from, to, easing) =>
    from + (to - from) * easing;

const recomposeValue = ([from, to], strings, round, easing) =>
    strings.reduce((style, string, index) => {
        const previous = index - 1;
        const value = getCurrentValue(from[previous], to[previous], easing);
        return style + (round && index < 4 ? Math.round(value) : value) + string;
    });

const createStyles = (keyframes, easing) =>
    keyframes.reduce((styles, { property, numbers, strings, round }) => {
        styles[property] = recomposeValue(numbers, strings, round, easing);
        return styles;
    }, {});
let animProp = createAnimationKeyframes({
    opacity: ["#0000", "#fff"]
}, 1);
let { property, numbers, strings, round } = animProp[0];

console.log(
    recomposeValue(numbers, strings, round, 0.2)

);

console.log(parseInt("ff", 16))

/*
    Find: @(returns|type) \{([\w_-]+)\}
    Replace: @$1 $2
*/