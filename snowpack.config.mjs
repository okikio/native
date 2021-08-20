// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  mount: {
    docs: "/docs",
    packages: "/packages"
    /* ... */
  },
  alias: {
    components: './src/components',
    layouts: './src/layouts',
    '~': './src',
  },
  workspaceRoot: '../..',
  
  plugins: [
    /* ... */
  ],
  packageOptions: {
    /* ... */
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
};
