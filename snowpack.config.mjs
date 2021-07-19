// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  workspaceRoot: "/",
  optimize: {
    bundle: true,
    minify: true,
    sourcemap: true,
    format: "esm",
    platform: "browser",
    target: "es2019",
  },
  
  mount: {
    /* ... */
  },
  plugins: [
    /* ... */
  ],
  packageOptions: {
    knownEntrypoints: ["@okikio/animate", "@okikio/emitter", "@okikio/manager", "@okikio/native", "path-to-regexp"]
    /* ... */
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
};
