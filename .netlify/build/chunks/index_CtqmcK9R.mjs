import { c as createComponent } from './consts_C-PJemSY.mjs';
import 'piccolore';
import { h as renderComponent, r as renderTemplate, m as maybeRenderHead, j as Fragment, f as addAttribute, i as renderSlot } from './ssr-function_BUYKajD-.mjs';
import { a as $$BaseLayout, g as getDocEntries } from './BaseLayout_DcMDntEQ.mjs';

const $$PagesLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$PagesLayout;
  const { title, description, breadcrumbs = [] } = Astro2.props;
  const pageTitle = `${title} · native`;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": pageTitle, "description": description }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="page-shell"> <nav aria-label="Breadcrumb" class="breadcrumbs"> <a href="/">Home</a> ${breadcrumbs.map((breadcrumb) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate` <span aria-hidden="true">/</span> <a${addAttribute(breadcrumb.href, "href")}>${breadcrumb.label}</a> ` })}`)} </nav> <article main-content> ${renderSlot($$result2, $$slots["default"])} </article> </div> ` })}`;
}, "/home/runner/work/native/native/src/layouts/PagesLayout.astro", void 0);

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const overviewPages = (await getDocEntries()).filter((entry) => entry.label === "Overview" && entry.prettySegments.length === 1);
  return renderTemplate`${renderComponent($$result, "PagesLayout", $$PagesLayout, { "title": "Docs", "description": "Overview pages for the native initiative packages.", "breadcrumbs": [{ label: "Docs", href: "/docs/" }] }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<h1>Documentation</h1> <p>Browse the package overviews, API guides, and supporting docs for the native initiative.</p> <section class="package-grid" aria-label="Documentation landing"> ${overviewPages.map((entry) => renderTemplate`<a class="package-card"${addAttribute(entry.href, "href")}> <span class="package-label">${entry.prettySegments[0] === "native" ? "Framework" : "Package"}</span> <strong>${entry.prettySegments[0] === "native" ? "@okikio/native" : `@okikio/${entry.prettySegments[0]}`}</strong> <span>Open the overview and continue into the nested documentation tree.</span> </a>`)} </section> ` })}`;
}, "/home/runner/work/native/native/src/pages/docs/index.astro", void 0);

const $$file = "/home/runner/work/native/native/src/pages/docs/index.astro";
const $$url = "/docs";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
