const source = "src/api.ts";
const globalName = "manager";
const mode = process.argv.includes("--watch") ? "watch" : "build";

import build from "../../build.js";
build(source, globalName, mode);