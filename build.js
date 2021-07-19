import chalk from "chalk";
import { build } from "esbuild";
import { file } from "gzip-size";
import prettyBytes from "pretty-bytes";

let arrPromises, promise, newTime, oldTime;
export default async (source = "src/api.ts", globalName, mode) => {
    const fileSize = async (inputFile = "lib/api.mjs") => `${prettyBytes(await file(inputFile))}`;
    const outputs = [
        {
            outfile: "lib/api.mjs",
            format: "esm",
            target: ["es2020"],
        },
        {
            outfile: "lib/api.js",
            format: "iife",
            target: ["es2020"],
        },
        {
            outfile: "lib/api.cjs",
            platform: "node",
            target: ["es2020"],
            format: "cjs",
        },
    ];

    let buildData = {
        entryPoints: [source],
        color: true,
        bundle: true,
        minify: true,
        sourcemap: false,
        globalName,
        tsconfig: "./tsconfig.json",
        logLevel: "info",
    };

    // Build code
    arrPromises = await Promise.all(
        outputs.map((output) => {
            return build({
                ...buildData,
                ...output,
                incremental: true,
            });
        })
    );

    newTime = Date.now();

    if (mode == "watch") {
        const { watch } = await import("chokidar");
        const watcher = watch(["src/**/*"]);
        console.log(chalk`Watching {gray ${globalName}/${source}} and surrounding files for changes... \n`);

        watcher.on("change", () => {
            oldTime = Date.now();
            (async () => {
                let timeStart = Date.now();
                for (let i = 0; i < arrPromises.length; i++) {
                    oldTime = Date.now();

                    let { outfile } = outputs[i];
                    promise = arrPromises[i];
                    arrPromises[i] = await promise.rebuild();

                    newTime = Date.now();
                    console.log(chalk`Built {red ${outfile}} in {yellow ${newTime - oldTime}ms}, file size {green ${await fileSize(outfile)}} Gzipped`);
                }

                let timeEnd = Date.now();
                console.log(chalk`Total build time is: {red ${timeEnd - timeStart}ms}\n`);
            })();
        });
    } else {
        let timeStart = Date.now();
        for (let i = 0; i < arrPromises.length; i++) {
            oldTime = Date.now();

            let { outfile } = outputs[i];
            promise = arrPromises[i];
            await promise.rebuild();
            promise.rebuild.dispose();

            newTime = Date.now();
            console.log(chalk`Built {red ${outfile}} in {yellow ${newTime - oldTime}ms}, file size {green ${await fileSize(outfile)}} Gzipped`);
        }

        let timeEnd = Date.now();
        console.log(chalk`Total build time is: {red ${timeEnd - timeStart}ms}`);
    }
};