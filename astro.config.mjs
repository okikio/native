import plugins from "./src/markdown-plugins.js";

// Full Astro Configuration API Documentation:
// https://docs.astro.build/reference/configuration-reference

// @type-check enabled!
// VSCode and other TypeScript-enabled text editors will provide auto-completion,
// helpful tooltips, and warnings if your exported object is invalid.
// You can disable this by removing "@ts-check" and `@type` comments below.

// @ts-check
// export default /** @type {import('astro').AstroUserConfig} */ ({
//   projectRoot: '.',     // Where to resolve all URLs relative to. Useful if you have a monorepo project.
//   // pages: './src/pages', // Path to Astro components, pages, and data
//   // dist: './dist',       // When running `astro build`, path to final static output
//   // public: './public',   // A folder of static files Astro will copy to the root. Useful for favicons, images, and other files that don’t need processing.
  
// });

/** @type {import('astro').AstroUserConfig} */
export default {
  projectRoot: ".",
  buildOptions: {
    site: 'https://native.okikio.dev/',  // Your public domain, e.g.: https://my-site.dev/. Used to generate sitemaps and canonical URLs.
    sitemap: true,      // Generate sitemap (set to "false" to disable)
  },
  markdownOptions: {
    render: [
      "@astrojs/markdown-remark",
      plugins
    ],
  },
  // /** Options for the development server run with `astro dev`. */
  devOptions: {
    tailwindConfig: './tailwind.config.cjs', // Path to tailwind.config.js if used, e.g. './tailwind.config.js'
  //   /** The port to run the dev server on. */
  //   port: 3000,
  //   /**
  //    * Configure The trailing slash behavior of URL route matching:
  //    *   'always' - Only match URLs that include a trailing slash (ex: "/foo/")
  //    *   'never' - Never match URLs that include a trailing slash (ex: "/foo")
  //    *   'ignore' - Match URLs regardless of whether a trailing "/" exists
  //    * Default: 'always'
  //    */
  //   // trailingSlash?: 'always' | 'never' | 'ignore';
  },
  // // Enable the Solidjs renderer to support Solid JSX components.
  renderers: ['@astrojs/renderer-solid']
};