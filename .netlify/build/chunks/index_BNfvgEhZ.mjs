import { c as createComponent } from './consts_C-PJemSY.mjs';
import 'piccolore';
import { h as renderComponent, r as renderTemplate, m as maybeRenderHead, f as addAttribute } from './ssr-function_BUYKajD-.mjs';
import { g as getDocEntries, a as $$BaseLayout } from './BaseLayout_DcMDntEQ.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index;
  const overviewPages = (await getDocEntries()).filter((entry) => entry.label === "Overview" && entry.prettySegments.length === 1);
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "native · Astro v6 docs", "description": "Modernized documentation for the native initiative and its packages." }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="hero"> <p class="eyebrow">Astro v6 refactor</p> <h1>native</h1> <p>
Documentation, examples, and package guides for the <code>@okikio/native</code> initiative, rebuilt on the
      current Astro platform with Tailwind v4, modern icon tooling, and the new Astro fonts pipeline.
</p> <div class="hero-actions"> <a class="hero-link" href="/docs/native/">Read the native docs</a> <a class="hero-link secondary" href="/demo/">Open the demo</a> </div> </section> <section class="package-grid" aria-label="Package documentation"> ${overviewPages.map((entry) => renderTemplate`<a class="package-card"${addAttribute(entry.href, "href")}> <span class="package-label">${entry.prettySegments[0] === "native" ? "Framework" : "Package"}</span> <strong>${entry.prettySegments[0] === "native" ? "@okikio/native" : `@okikio/${entry.prettySegments[0]}`}</strong> <span>Open the overview, API guides, and supporting documentation.</span> </a>`)} </section> ` })}`;
}, "/home/runner/work/native/native/src/pages/index.astro", void 0);

const $$file = "/home/runner/work/native/native/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
