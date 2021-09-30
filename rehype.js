import { h } from "hastscript";
import { unified } from 'unified';
import { globby } from 'globby';

import fs from "fs/promises";
import path from "path";

import rehypeParse from "rehype-parse";
import rehypeStringify from 'rehype-stringify';

import { redirectDocsURL } from "./src/markdown-plugins.js";

async function importPlugin(p) {
    if (typeof p === "string") {
        return await import(p);
    }

    return await p;
}

export function loadPlugins(items) {
    return items.map((p) => {
        return new Promise((resolve, reject) => {
            if (Array.isArray(p)) {
                const [plugin, opts] = p;
                return importPlugin(plugin)
                    .then((m) => resolve([m.default, opts]))
                    .catch((e) => reject(e));
            }

            return importPlugin(p)
                .then((m) => resolve([m.default]))
                .catch((e) => reject(e));
        });
    });
}

const __dirname = path.resolve(path.dirname(""));
(async () => {
    const plugins = [
        ["rehype-slug"],
        // [
        //     "rehype-autolink-headings",
        //     {
        //         behavior: "append",
        //         content: [h("i.icon.icon-link")],
        //     },
        // ],
        ["rehype-urls", redirectDocsURL],
        ["rehype-highlight"],
        ["rehype-external-links", { target: "_blank", rel: ["noopener"] }],
        // ['rehype-sanitize']
    ];
    let parser = unified()
    .use(rehypeParse);
    parser.use(rehypeStringify);
    const loadedRehypePlugins = await Promise.all(loadPlugins(plugins));
    loadedRehypePlugins.forEach(([plugin, opts]) => {
      parser.use(plugin, opts);
    });
  
	const paths = await globby('public/api', {
		expandDirectories: {
			// files: ['cat', 'unicorn', '*.jpg'],
			extensions: ['html']
		}
    });
    
    // console.log(paths)

    let result;
    try {
        paths.forEach((p) => {
            (async () => {
                const currentPath = path.join(__dirname, p);
                const content = await fs.readFile(currentPath);
                const vfile = await parser
                    .process(content.toString());
                result = vfile.toString();
                await fs.writeFile(currentPath, result, "utf-8")
            })();
        });
    } catch (err) {
      throw err;
    }
})();
