import { defineConfig, fontProviders } from "astro/config";
import { adapter, output, getEnv, AUTO_ASTRO_ADAPTER_ENV_VAR, getAutoAdapterType } from "astro-auto-adapter";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import Icons from "unplugin-icons/vite";

const ADAPTER_TYPES = getAutoAdapterType();
const ASTRO_ADAPTER_MODE =
  process.env[AUTO_ASTRO_ADAPTER_ENV_VAR] ||
  getEnv(AUTO_ASTRO_ADAPTER_ENV_VAR) ||
  ADAPTER_TYPES;

export default defineConfig({
  site: "https://native.okikio.dev",
  output: output(undefined, "server"),
  adapter: await adapter(ASTRO_ADAPTER_MODE, {
    node: {
      mode: "standalone",
    },
  }),
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Lexend",
      cssVariable: "--font-lexend",
      weights: ["300 700"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Geist Mono",
      cssVariable: "--font-geist-mono",
      weights: ["400 700"],
    },
  ],
  integrations: [
    icon({
      include: {
        fluent: [
          "arrow-counterclockwise-20-filled",
          "pause-20-filled",
          "play-20-filled",
        ],
      },
    }),
  ],
  vite: {
    plugins: [
      Icons({
        autoInstall: true,
        compiler: "astro",
      }),
      tailwindcss(),
    ],
  },
  devToolbar: {
    enabled: false,
  },
});
