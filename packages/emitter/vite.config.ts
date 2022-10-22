/// <reference types="vitest" />
// Configure Vitest (https://vitest.dev/config)
import { defineConfig } from "vitest/config";
import { umd as name } from "./package.json";

export default defineConfig({
  build: {
    outDir: "lib",
    lib: {
      entry: "src/index.ts",
      name,
      formats: ["es", "cjs", "umd"],
      fileName(format) {
        switch (format) {
          case "es":
            return "index.mjs";
          case "cjs":
            return "index.cjs";
          default:
            return "index.js";
        }
      }
    },
  },
  test: {
    /* for example, use global to avoid globals imports (describe, test, expect): */
    // globals: true,
  }
});
