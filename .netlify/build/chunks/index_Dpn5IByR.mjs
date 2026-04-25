import { c as createComponent } from './consts_C-PJemSY.mjs';
import 'piccolore';
import { h as renderComponent, r as renderTemplate, m as maybeRenderHead, f as addAttribute, s as spreadAttributes, i as renderSlot } from './ssr-function_BUYKajD-.mjs';
import { $ as $$Icon$1, a as $$BaseLayout, r as renderScript } from './BaseLayout_DcMDntEQ.mjs';
import 'clsx';

const playbackIcons = {
  play: "fluent:play-20-filled",
  pause: "fluent:pause-20-filled",
  replay: "fluent:arrow-counterclockwise-20-filled"
};

const $$Icon = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Icon;
  const { name = "pause" } = Astro2.props;
  const iconName = playbackIcons[name];
  return renderTemplate`${renderComponent($$result, "AstroIcon", $$Icon$1, { "class": `icon ${name}`, "name": iconName, "data-astro-cid-patnjmll": true })}`;
}, "/home/runner/work/native/native/src/components/Icon.astro", void 0);

const $$PlaybackBlock = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$PlaybackBlock;
  const { class: className, ...rest } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(`playback-block ${className}`, "class")} native-scrollbar${spreadAttributes(rest)} data-astro-cid-gtadkiul> <div class="playback-canvas" data-astro-cid-gtadkiul> ${renderSlot($$result, $$slots["default"])} </div> <section class="playback" data-state="pause" data-astro-cid-gtadkiul> <button class="control-btn" data-astro-cid-gtadkiul> ${renderComponent($$result, "Icon", $$Icon, { "name": "play", "data-astro-cid-gtadkiul": true })} ${renderComponent($$result, "Icon", $$Icon, { "name": "pause", "data-astro-cid-gtadkiul": true })} ${renderComponent($$result, "Icon", $$Icon, { "name": "replay", "data-astro-cid-gtadkiul": true })} </button> <input class="progress-bar" type="range" value="0" min="0" max="100" step="0.001" data-astro-cid-gtadkiul> <div class="progress-output" data-astro-cid-gtadkiul>Loading...</div> </section> </div>`;
}, "/home/runner/work/native/native/src/components/PlaybackBlock.astro", void 0);

const $$AnimatedBox = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$AnimatedBox;
  const props = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="animated-box"${spreadAttributes(props)} data-astro-cid-trlrkjjt> ${renderSlot($$result, $$slots["default"])} </div>`;
}, "/home/runner/work/native/native/src/components/AnimatedBox.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Demo · native", "description": "Interactive demo for the native initiative packages." }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="page-shell"> <nav aria-label="Breadcrumb" class="breadcrumbs"> <a href="/">Home</a> <span aria-hidden="true">/</span> <a href="/demo/">Demo</a> </nav> <article main-content> <h1>Demo</h1> <p>Interactive playback example for the docs site.</p> ${renderComponent($$result2, "PlaybackBlock", $$PlaybackBlock, { "id": "simple-demo" }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "AnimatedBox", $$AnimatedBox, {}, { "default": ($$result4) => renderTemplate`1` })} ${renderComponent($$result3, "AnimatedBox", $$AnimatedBox, { "id": "box-2" }, { "default": ($$result4) => renderTemplate`2` })} ` })} </article> </div> ${renderScript($$result2, "/home/runner/work/native/native/src/pages/demo/index.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/home/runner/work/native/native/src/pages/demo/index.astro", void 0);

const $$file = "/home/runner/work/native/native/src/pages/demo/index.astro";
const $$url = "/demo";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
