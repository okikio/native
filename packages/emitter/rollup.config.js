import { nodeResolve } from "@rollup/plugin-node-resolve";
import esbuild from "rollup-plugin-esbuild";
import ts from "rollup-plugin-typescript2";

import pkg, { output, source } from "./package.json";
const name = pkg["umd:name"];
let watch = process.argv.includes("--watch");
export default [
    {
        input: source,
        treeshake: true,
        plugins: [
            watch ? nodeResolve() : ts(),
            esbuild({
                watch: watch,
                minify: true,
                target: "es2020", // default, or 'es20XX', 'esnext'
            }),
        ],
        output: output.map((v) => ({
            sourcemap: true,
            name,
            ...v,
        })),
    },
];
