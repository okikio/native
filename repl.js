let counter = 0;
export const addCSSUnit = (unit = "") => {
    return (value) => {
        counter++;
        return typeof value == "string" ? value : `${value}${unit}`
    };
};

export const UnitLess = addCSSUnit();
export const UnitPX = addCSSUnit("px");
export const UnitDEG = addCSSUnit("deg");
export const toArr = (input) => {
    if (Array.isArray(input) || typeof input == "string") {
        if (typeof input == "string") input = input.split(",");
        return input;
    }

    return [input];
};

export const CSSValue = (unit) => {
    return (input) => {
        return isValid(input) ? toArr(input).map(val => {
            if (typeof val != "number" && typeof val != "string")
                return val;

            // Basically if you can convert it to a number try to,
            // otherwise just return whatever you can
            let num = Number(val);
            let value = Number.isNaN(num) ? (typeof val == "string" ? val.trim() : val) : num;
            return unit(value); // Add the default units
        }) : [];
    };
}

export const isValid = (value) => {
    return Boolean(Array.isArray(value) || typeof value == "string" ? value.length : value != null && value != undefined);
}

export const transpose = (...arrays) => {
    let largestArrLen = 0;
    arrays = arrays.map((arr, i) => {
        // Convert all values in arrays to an array
        // This ensures that `arrays` is an array of arrays
        let result = toArr(arr);

        // Finds the largest array
        let len = result.length;
        if (len > largestArrLen) largestArrLen = len;
        return result;
    });

    // Flip the rows and columns of arrays
    let result = [];
    let len = arrays.length;
    for (let col = 0; col < largestArrLen; col++) {
        result[col] = [];

        for (let row = 0; row < len; row++) {
            let val = arrays[row][col];
            if (isValid(val)) result[col][row] = val;
        }
    }

    return result;
}

export const CSSArrValue = (arr, unit) => {
    // This is for the full varients of the transform function as well as the 3d varients
    // zipping the `CSSValue` means if a user enters a string, it will treat each value in that
    // string as a seperate transition state
    return toArr(arr).map(CSSValue(unit));
}


/**
 * Creates the transform property text
 */
export const createTransformProperty = (arr) => {
    let result = "";
    let len = TransformFunctionNames.length;
    for (let i = 0; i < len; i++) {
        let name = TransformFunctionNames[i];
        let value = arr[i];
        if (isValid(value))
            result += `${name}(${Array.isArray(value) ? value.join(", ") : value}) `;
    }

    return result.trim();
}

export const TransformFunctionNames = [
    "translate",
    "translate3d",
    "translateX",
    "translateY",
    "translateZ",
    "rotate",
    "rotate3d",
    "rotateX",
    "rotateY",
    "rotateZ",
    "scale",
    "scale3d",
    "scaleX",
    "scaleY",
    "scaleZ",
    "skew",
    "skewX",
    "skewY",
    "perspective"
];

export const UnitLessCSSValue = CSSValue(UnitLess);
export const UnitPXCSSValue = CSSValue(UnitPX);
export const UnitDEGCSSValue = CSSValue(UnitDEG);


/** Convert a dash-separated string into camelCase strings */
export const camelCase = (str) => {
    if (str.includes("--")) return str;
    let result = `${str}`.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    return result;
}
/**
 * Acts like array.map(...) but for functions
 */
export const mapObject = (obj, fn) => {
    let keys = Object.keys(obj);
    let key, value, result = {};
    for (let i = 0, len = keys.length; i < len; i++) {
        key = keys[i];
        value = obj[key];
        result[key] = fn(value, key, obj);
    }

    return result;
};

/**
 * Remove dashs from CSS properties & maps the values to camelCase keys
 */
export const ParseCSSProperties = (obj) => {
    let keys = Object.keys(obj);
    let key, value, result = {};
    for (let i = 0, len = keys.length; i < len; i++) {
        key = camelCase(keys[i]);
        value = obj[keys[i]];
        result[key] = value;
    }

    return result;
}

/** Common CSS Property names with the units "px" as an acceptable value */
export const CSSPXDataType = ["margin", "padding", "size", "width", "height", "left", "right", "top", "bottom", "radius", "gap", "basis", "inset", "outline-offset", "perspective", "thickness", "position", "distance", "spacing"].join("|");

/** Convert the {@link CSSPXDataType} array, to a Regular Expression */
export const RegExpCSSPXDataType = new RegExp(CSSPXDataType, "gi");

/** Converts values to strings */
export const toStr = (input) => `` + input;
export const ParseTransformableCSSProperties = (properties) => {
    let {
        perspective,
        rotate,
        rotate3d,
        rotateX,
        rotateY,
        rotateZ,
        translate,
        translate3d,
        translateX,
        translateY,
        translateZ,
        scale,
        scale3d,
        scaleX,
        scaleY,
        scaleZ,
        skew,
        skewX,
        skewY,
        ...rest

        // Convert dash seperated strings to camelCase strings
    } = ParseCSSProperties(properties);

    translate = CSSArrValue(translate, UnitPX);
    translate3d = CSSArrValue(translate3d, UnitPX);
    translateX = UnitPXCSSValue(translateX);
    translateY = UnitPXCSSValue(translateY);
    translateZ = UnitPXCSSValue(translateZ);

    rotate = CSSArrValue(rotate, UnitDEG);
    rotate3d = CSSArrValue(rotate3d, UnitLess);
    rotateX = UnitDEGCSSValue(rotateX);
    rotateY = UnitDEGCSSValue(rotateY);
    rotateZ = UnitDEGCSSValue(rotateZ);

    scale = CSSArrValue(scale, UnitLess);
    scale3d = CSSArrValue(scale3d, UnitLess);
    scaleX = UnitLessCSSValue(scaleX);
    scaleY = UnitLessCSSValue(scaleY);
    scaleZ = UnitLessCSSValue(scaleZ);

    skew = CSSArrValue(skew, UnitDEG);
    skewX = UnitDEGCSSValue(skewX);
    skewY = UnitDEGCSSValue(skewY);

    perspective = UnitPXCSSValue(perspective);

    let transform = transpose(
        translate, translate3d, translateX, translateY, translateZ,
        rotate, rotate3d, rotateX, rotateY, rotateZ,
        scale, scale3d, scaleX, scaleY, scaleZ,
        skew, skewX, skewY,
        perspective
    ).filter(isValid).map(createTransformProperty);

    // Wrap non array CSS property values in an array
    rest = mapObject(rest, (value, key) => {
        let unit;

        // If key doesn't have the word color in it, try to add the default "px" or "deg" to it
        if (!/color/gi.test(key)) {
            let isAngle = /rotate/gi.test(key);
            let isLength = new RegExp(CSSPXDataType, "gi").test(key);

            // There is an intresting bug that occurs if you test a string againt the same instance of a Regular Expression
            // where the answer will be different every test
            // so, to avoid this bug, I create a new instance every time
            if (isAngle || isLength) {
                // If the key has rotate in it's name use "deg" as a default unit
                if (isAngle) unit = UnitDEGCSSValue;

                // If it has a common CSS Property name with the units "px" as an acceptable value
                // try to add "px" as the default unit
                else if (isLength) unit = UnitPXCSSValue;

                return unit(value).map(str => unit(str.trim().split(" ")).join(" "));
            }
        }

        return [].concat(value).map(toStr);
    });

    return Object.assign({},
        isValid(transform) ? { transform } : null,
        rest);
}

let x = ParseTransformableCSSProperties({
    // It will automatically add the "px" units for you, or you can write a string with the units you want
    translate3d: ["0, 5", 0],
    translate: "25, 35, 60%",
    // translateX: -1,
    translateY: ["20, 90", "100", 5], // Note: this will actually result in an error, make sure to pay attention to where you are putting strings and commas
    // translateZ: 0,
    // perspective: 0,
    // opacity: 0,
    // color: 0,
    // scale: [
    //     [1, "2"],
    //     ["2", 1]
    // ],
    rotateC: "5,6",
    // "offset-size": 5,
    inset: "5px",
    "offset-rotate": "10, 20",
    margin: "5 5"
    // rotate3d: [
    //     [1, 2, 5, "3deg"], // The last value in the array must be a string with units for rotate3d
    //     [2, "4", 6, "45turn"],
    //     ["2", "4", "6", "-1rad"]
    // ]
})
// console.log(x) // x,

// console.log(ParseTransformableCSSProperties({
//     // It will automatically add the "px" units for you, or you can write a string with the units you want
//     translate3d: [
//         "25, 35, 60%",
//         [50, "60px", 70],
//         ["70", 50]
//     ],
//     translate: "25, 35, 60%",
//     translateX: [50, "60px", "70"],
//     translateY: ["50, 60", "60"], // Note: this will actually result in an error, make sure to pay attention to where you are putting strings and commas
//     translateZ: 0,
//     perspective: 0,
//     opacity: "0, 5",
//     scale: [
//         [1, "2"],
//         ["2", 1]
//     ],
//     // rotate3d: [
//     //     [1, 2, 5, "3deg"], // The last value in the array must be a string with units for rotate3d
//     //     [2, "4", 6, "45turn"],
//     //     ["2", "4", "6", "-1rad"]
//     // ]
// }))
// console.log(CSSArrValue(["6", 5, 5], UnitPX))
// console.log(CSSValue(UnitPX)(["70px", 50]));


export const ParseTransformableCSSKeyframes = (keyframes) => {
    return keyframes.map(properties => {
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

            easing,
            iterations,
            offset,
            ...rest

            // Convert dash seperated strings to camelCase strings
        } = ParseCSSProperties(properties);

        translate = UnitPXCSSValue(translate);
        translate3d = UnitPXCSSValue(translate3d);
        translateX = UnitPXCSSValue(translateX)[0];
        translateY = UnitPXCSSValue(translateY)[0];
        translateZ = UnitPXCSSValue(translateZ)[0];

        rotate = UnitDEGCSSValue(rotate);
        rotate3d = UnitLessCSSValue(rotate3d);
        rotateX = UnitDEGCSSValue(rotateX)[0];
        rotateY = UnitDEGCSSValue(rotateY)[0];
        rotateZ = UnitDEGCSSValue(rotateZ)[0];

        scale = UnitLessCSSValue(scale);
        scale3d = UnitLessCSSValue(scale3d);
        scaleX = UnitLessCSSValue(scaleX)[0];
        scaleY = UnitLessCSSValue(scaleY)[0];
        scaleZ = UnitLessCSSValue(scaleZ)[0];

        skew = UnitDEGCSSValue(skew);
        skewX = UnitDEGCSSValue(skewX)[0];
        skewY = UnitDEGCSSValue(skewY)[0];

        perspective = UnitPXCSSValue(perspective)[0];

        return [
            rest,
            translate, translate3d, translateX, translateY, translateZ,
            rotate, rotate3d, rotateX, rotateY, rotateZ,
            scale, scale3d, scaleX, scaleY, scaleZ,
            skew, skewX, skewY,
            perspective
        ];
    }).map(([rest, ...transformFunctions]) => {
        let transform = createTransformProperty(transformFunctions);
        let unit;

        // Wrap non array CSS property values in an array
        rest = mapObject(rest, (value, key) => {
            // If key doesn't have the word color in it, try to add the default "px" or "deg" to it
            if (!/color/gi.test(key)) {
                let isAngle = /rotate/gi.test(key);
                let isLength = new RegExp(CSSPXDataType, "gi").test(key);

                // There is an intresting bug that occurs if you test a string againt the same instance of a Regular Expression
                // where the answer will be different every test
                // so, to avoid this bug, I create a new instance every time
                if (isAngle || isLength) {
                    // If the key has rotate in it's name use "deg" as a default unit
                    if (isAngle) unit = UnitDEGCSSValue;

                    // If it has a common CSS Property name with the units "px" as an acceptable value
                    // try to add "px" as the default unit
                    else if (isLength) unit = UnitPXCSSValue;

                    // To support multi-value CSS properties like "margin", "padding", and "inset"
                    // split the value into an array using spaces as the seperator
                    // then apply the valid default units and join them back with spaces
                    // seperating them
                    let arr = toStr(value).trim().split(" ");
                    return unit(arr).join(" ");
                }
            }

            return toStr(value);
        });

        return Object.assign({},
            isValid(transform) ? { transform } : null,
            rest);
    });
}
console.log(ParseTransformableCSSKeyframes([
    {
        // It will automatically add the "px" units for you, or you can write a string with the units you want
        translate3d: "25, 35, 60%",
        translate: "25, 35, 60%",
        translateX: 10,
        translateY: ["50, 60", "60"], // Note: this will actually result in an error, make sure to pay attention to where you are putting strings and commas
        translateZ: 0,
        perspective: 0,
        opacity: "0, 5",
        scale: [1, "2"],
        // rotate3d: [
        //     [1, 2, 5, "3deg"], // The last value in the array must be a string with units for rotate3d
        //     [2, "4", 6, "45turn"],
        //     ["2", "4", "6", "-1rad"]
        // ]
    },
    {
        // It will automatically add the "px" units for you, or you can write a string with the units you want
        // translate3d: "55, 15, 20%",
        // translate: "20, 5, 6%",
        // translateX: [0, "60px", "70"],
        translateX: "5deg",
        // translateY: ["0, 0", "0"], // Note: this will actually result in an error, make sure to pay attention to where you are putting strings and commas
        // translateZ: 6,
        // perspective: 500,
        opacity: "5",
        margin: "25 65"
        // scale: "2",
        // rotate3d: [
        //     [1, 2, 5, "3deg"], // The last value in the array must be a string with units for rotate3d
        //     [2, "4", 6, "45turn"],
        //     ["2", "4", "6", "-1rad"]
        // ]
    },
]))
// console.log(CSSArrValue(["6", 5, 5], UnitPX))
// console.log(CSSValue(UnitPX)(["70px", 50]));

// let arr = [5, 6, 7, 8, 9, 10, ...Array(1000).fill("")];

// console.time("Test");
// const mySet = new Set([1,2,3,4]);
// [...mySet].reduce()
// console.timeEnd("Test");





// console.log(camelCase("-a-stroke"))