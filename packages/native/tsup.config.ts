import type { Options } from 'tsup';
import { defineConfig } from 'tsup';
import { umdWrapper } from 'esbuild-plugin-umd-wrapper';

import { umd } from "./package.json";

const GLOBAL_NAME = umd;
const baseConfig: Options = {
  target: ["es2022", "node21", "chrome105"],
  entry: ['src/index.ts'],
  format: ["esm", "cjs"],
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
  outDir: "lib",
  platform: 'browser',
  globalName: GLOBAL_NAME,

  outExtension({ format, options }) {
    const ext = ({
      "esm": "js",
      "cjs": "cjs",
      "umd": "umd.js"
    } as unknown as Record<typeof format, string>)[format]
    const outputExtension = options.minify ? `min.${ext}` : `${ext}`
    return {
      js: `.${outputExtension}`,
    }
  },
}

export default defineConfig([
  { ...baseConfig },
  {
    ...baseConfig,
    target: 'es5',
    // @ts-ignore
    format: ['umd'],
    esbuildPlugins: [
      // @ts-ignore UMD Wrapper Library
      umdWrapper({ libraryName: GLOBAL_NAME, external: 'inherit' })
    ],
  },
])