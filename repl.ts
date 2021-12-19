import { ParseTransformableCSSProperties, arrFill } from "@okikio/animate";

console.log(ParseTransformableCSSProperties({
    // It will automatically add the "px" units for you, or you can write a string with the units you want
    translate3d: [
        "25 35 60%",
        [50, "60px", 70],
        ["70", 50]
    ],
    translate: "25 35 60%",
    translateX: [50, "60px", "70"],
    translateY: ["50, 60", "60"], // Note: this will actually result in an error, make sure to pay attention to where you are putting strings and commas
    translateZ: 0,
    perspective: 0,
    opacity: "0 5",
    scale: [
        [1, "2"],
        ["2", 1]
    ],
    rotate3d: [
        [1, 2, 5, "3deg"], // The last value in the array must be a string with units for rotate3d
        [2, "4", 6, "45turn"],
        ["2", "4", "6", "-1rad"]
    ],
    // Units are required for non transform CSS properties
    // String won't be split into array, they will be wrappeed in an Array
    // It will transform border-left to camelCase "borderLeft"
    "border-left": 50,
    "offset-rotate": "10 20",
    margin: "5 6",
    // When writing in this formation you must specify the units
    padding: ["5px 6px 7px", "5px 6px 8px"]
}))

/*
import { fileURLToPath } from "url";
import glob from "fast-glob";
import fs from "fs/promises";
import path from "path";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

let files = await glob("src/pages/ ** / *.md");
let prependData = `\
---
layout: ../../layouts/PagesLayout.astro
---
`;
for (let file of files) {
    console.log(file);
    let temp = await fs.readFile(path.join(__dirname, file), 'utf-8');
    await fs.writeFile(file, prependData + temp);
}
*/
// console.log(transpose(...transpose(
//     [50, 60, 70],
//     [80, 90, 100]
// )))

// let x = arrFill([
//     [50, 60, 80, 90],
//     [0.5, 2]
// ]);
// console.log(x)
