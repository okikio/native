import { defineConfig } from "astro/config";
import { adapter, output, getEnv, AUTO_ASTRO_ADAPTER_ENV_VAR, getAutoAdapterType } from "astro-auto-adapter";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import Icons from "unplugin-icons/vite";
import { fluentIcons } from "./src/lib/icons";

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
  integrations: [
    icon({
      include: {
        fluent: [...fluentIcons],
        hugeicons: ["menu-01"],
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
