import { h } from "hastscript";
import fs from "fs";
import path from "path";
export default {
    remarkPlugins: [
        "remark-code-titles",
        "remark-gfm",
        "remark-footnotes",
        "@silvenon/remark-smartypants",
    ],
    rehypePlugins: [
        ["rehype-slug"],
        ["rehype-wrap", { wrapper: "div.markdown-body" }],
        [
            "rehype-toc",
            {
                headings: ["h2", "h3"],
                position: "beforeend",
                customizeTOC(toc) {
                    let div = h("div.toc-sticky", [
                        h("h4.toc-title", "Table of Contents"),
                        ...toc.children,
                    ]);
                    toc.children = [div];
                    return toc;
                },
            },
        ],
        [
            "rehype-autolink-headings",
            {
                behavior: "append",
                content: [h("span.icon", "link")],
            },
        ],
        ["rehype-add-classes", { "h1,h2,h3": "title" }],
        ["rehype-urls", redirectDocsURL],
        ["rehype-highlight"],
        ["rehype-external-links", { target: "_blank", rel: ["noopener"] }],
        // ['rehype-sanitize']
    ],
};

const __dirname = path.resolve(path.dirname(""));
// console.log(fs.existsSync(path.join(__dirname, `/docs/animate`)));
function redirectDocsURL(url) {
    if (/^\/docs/.test(url.path)) {
        if (/^\/docs\/demo/.test(url.path)) return `https://github.com/okikio/native/tree/master` + url.path.replace(/^\/docs\//, "/");
       // if (fs.existsSync(path.join(__dirname, url.path))) {
           return url.path.replace(/^\/docs\//, "/").replace(/\.md$/, "");
        // } else {
         //   return `https://github.com/okikio/native/tree/beta` + url.path;
        // }
    } else if (/\.md$/.test(url.path)) {
        return url.path.replace(/\.md$/, "");
    } else if (/^\/packages/.test(url.path)) {
        if (/LICENSE$/i.test(url.path)) {
            return "https://github.com/okikio/native/tree/beta/LICENSE";
        } else if (!/\.(jpg|svg|png|webp)$/.test(url.path)) {
            return url.path.replace(
                /^\/packages/,
                "https://github.com/okikio/native/tree/beta/packages"
            );
        }
    } else if (/LICENSE$/i.test(url.path)) {
        return "https://github.com/okikio/native/tree/beta/LICENSE";
    }
}
