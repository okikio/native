const { source } = require("./package.json");

const globalName = "Manager";
const { startService } = require("esbuild");
const { watch } = require("chokidar");

const mode = process.argv.includes("--watch") ? "watch" : "build";
const outputs = [
    {
        outfile: "lib/api.modern.js",
        format: "esm",
        target: ["es2020"],
    },
    {
        outfile: "lib/api.node.js",
        platform: "node",
        format: "cjs",
    },
    {
        outfile: "lib/api.js",
        format: "iife",
        target: ["es2020"],
    },
];

// Start build service
let service,
    logs = "",
    promises;

let buildData = {
    entryPoints: [source],
    color: true,
    bundle: true,
    minify: true,
    sourcemap: true,
    globalName,
    tsconfig: "./tsconfig.json",
    logLevel: "info",
};

const printProgress = (timerStart, logs, timerEnd = Date.now()) => {
    console.log(
        `-------------\n\n${logs}Built in ${timerEnd - timerStart}ms.\n`
    );
};

if (mode == "watch") {
    const watcher = watch(["src/**/*"]);
    console.log("Watching files... \n");
    (async () => {
        service = await startService();
        try {
            // Get time before build starts
            let timerStart = Date.now();

            // Build code
            promises = await Promise.all(
                outputs.map((output) => {
                    logs += `Build ${output.outfile}\n`;
                    return service.build({
                        ...buildData,
                        incremental: true,
                        ...output,
                    });
                })
            );

            printProgress(timerStart, logs);
        } catch (e) {
            // OOPS! ERROR!
            console.error("Opps, something went wrong!", e);
        }
    })();

    watcher.on("change", () => {
        (async () => {
            try {
                let i = 0,
                    promise;

                logs = "";
                timerStart = Date.now();
                for (; i < promises.length; i++) {
                    logs += `Build ${outputs[i].outfile}\n`;
                    promise = promises[i];
                    promises[i] = await promise.rebuild();
                }
                printProgress(timerStart, logs);
            } catch (e) {
                console.error("Opps, something went wrong!", e);
            }
        })();
    });
} else {
    (async () => {
        service = await startService();
        try {
            // Get time before build starts
            const timerStart = Date.now();

            // Build code
            for (let output of outputs) {
                logs += `Build ${output.outfile}\n`;
                await service.build({
                    ...buildData,
                    ...output,
                });
            }

            // Get time after build ends
            printProgress(timerStart, logs);
        } catch (e) {
            // OOPS! ERROR!
            console.error("Opps, something went wrong!", e);
        } finally {
            // We command you to stop. Will start again if files change.
            service.stop();
        }
    })();
}
