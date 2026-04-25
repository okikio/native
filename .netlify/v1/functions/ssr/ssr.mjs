
			import { createHandler } from './.netlify/build/entry.mjs';

			export default createHandler({});

			// The config must be inlined here instead of imported because Netlify
			// parses this file statically to read the config.
			export const config = {
				includedFiles: ['**/*'],
				name: 'Astro SSR',
				nodeBundler: 'none',
				generator: '@astrojs/netlify@7.0.8',
				path: '/*',
				preferStatic: true,
			};
		