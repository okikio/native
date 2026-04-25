import { c as createComponent, b as VALID_INPUT_FORMATS } from './consts_C-PJemSY.mjs';
import 'piccolore';
import { k as createRenderInstruction, m as maybeRenderHead, s as spreadAttributes, f as addAttribute, r as renderTemplate, h as renderComponent, j as Fragment, u as unescapeHTML, l as generateCspDigest, A as AstroError, n as UnknownContentCollectionError, o as renderHead, i as renderSlot } from './ssr-function_BUYKajD-.mjs';
import { getIconData, iconToSVG } from '@iconify/utils';
import 'clsx';
import 'html-escaper';
import { Traverse } from 'neotraverse/modern';
import * as z from 'zod/v4';
import { removeBase, isRemotePath } from '@astrojs/internal-helpers/path';
import * as devalue from 'devalue';

async function renderScript(result, id) {
  const inlined = result.inlinedScripts.get(id);
  let content = "";
  if (inlined != null) {
    if (inlined) {
      content = `<script type="module">${inlined}</script>`;
    }
  } else {
    const resolved = await result.resolve(id);
    content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"></script>`;
  }
  return createRenderInstruction({ type: "script", id, content });
}

const icons = {"fluent":{"prefix":"fluent","icons":{"arrow-counterclockwise-20-filled":{"body":"<path fill=\"currentColor\" d=\"M16 10a6 6 0 0 0-9.969-4.5H7.25a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75v-3a.75.75 0 0 1 1.5 0v1.16a7.5 7.5 0 1 1-2.495 5.313a.75.75 0 1 1 1.5.054A6 6 0 1 0 16 10\"/>"},"chevron-right-20-filled":{"body":"<path fill=\"currentColor\" d=\"M7.733 4.207a.75.75 0 0 1 1.06.026l5.001 5.25a.75.75 0 0 1 0 1.035l-5 5.25a.75.75 0 1 1-1.087-1.034L12.216 10l-4.51-4.734a.75.75 0 0 1 .027-1.06\"/>"},"pause-20-filled":{"body":"<path fill=\"currentColor\" d=\"M5 2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm8 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z\"/>"},"play-20-filled":{"body":"<path fill=\"currentColor\" d=\"M17.222 8.685a1.5 1.5 0 0 1 0 2.628l-10 5.498A1.5 1.5 0 0 1 5 15.496V4.502a1.5 1.5 0 0 1 2.223-1.314z\"/>"}},"lastModified":1776056152,"width":20,"height":20},"hugeicons":{"prefix":"hugeicons","icons":{"menu-01":{"body":"<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\" d=\"M4 5h16M4 12h16M4 19h16\"/>"}},"lastModified":1776313212,"width":24,"height":24}};

const cache = /* @__PURE__ */ new WeakMap();

const $$Icon = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Icon;
  class AstroIconError extends Error {
    constructor(message) {
      super(message);
      this.hint = "";
    }
  }
  const req = Astro2.request;
  const { name = "", title, desc, "is:inline": inline = false, ...props } = Astro2.props;
  const map = cache.get(req) ?? /* @__PURE__ */ new Map();
  const i = map.get(name) ?? 0;
  map.set(name, i + 1);
  cache.set(req, map);
  const includeSymbol = !inline && i === 0;
  let [setName, iconName] = name.split(":");
  if (!setName && iconName) {
    const err = new AstroIconError(`Invalid "name" provided!`);
    throw err;
  }
  if (!iconName) {
    iconName = setName;
    setName = "local";
    if (!icons[setName]) {
      const err = new AstroIconError('Unable to load the "local" icon set!');
      throw err;
    }
    if (!(iconName in icons[setName].icons)) {
      const err = new AstroIconError(`Unable to locate "${name}" icon!`);
      throw err;
    }
  }
  const collection = icons[setName];
  if (!collection) {
    const err = new AstroIconError(`Unable to locate the "${setName}" icon set!`);
    throw err;
  }
  const iconData = getIconData(collection, iconName ?? setName);
  if (!iconData) {
    const err = new AstroIconError(`Unable to locate "${name}" icon!`);
    throw err;
  }
  const id = `ai:${collection.prefix}:${iconName ?? setName}`;
  if (props.size) {
    props.width = props.size;
    props.height = props.size;
    delete props.size;
  }
  const renderData = iconToSVG(iconData);
  const normalizedProps = { ...renderData.attributes, ...props };
  const normalizedBody = renderData.body;
  const { viewBox } = normalizedProps;
  if (includeSymbol) {
    delete normalizedProps.viewBox;
  }
  return renderTemplate`${maybeRenderHead()}<svg${spreadAttributes(normalizedProps)}${addAttribute(name, "data-icon")}> ${title && renderTemplate`<title>${title}</title>`} ${desc && renderTemplate`<desc>${desc}</desc>`} ${inline ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "id": id }, { "default": ($$result2) => renderTemplate`${unescapeHTML(normalizedBody)}` })}` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${includeSymbol && renderTemplate`<symbol${addAttribute(id, "id")}${addAttribute(viewBox, "viewBox")}>${unescapeHTML(normalizedBody)}</symbol>`}<use${addAttribute(`#${id}`, "href")}></use> ` })}`} </svg>`;
}, "/home/runner/work/native/native/node_modules/.pnpm/astro-icon@1.1.5/node_modules/astro-icon/components/Icon.astro", void 0);

const $$Logo = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="logo block" data-astro-cid-tvrurpns> <img src="/assets/favicon.svg" alt="Logo of the native project." width="56" height="56" data-astro-cid-tvrurpns> </div>`;
}, "/home/runner/work/native/native/src/components/Logo.astro", void 0);

const $$ChevronRight20Filled = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$ChevronRight20Filled;
  const props = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<svg${spreadAttributes(props)} viewBox="0 0 20 20" width="1.2em" height="1.2em"><path fill="currentColor" d="M7.733 4.207a.75.75 0 0 1 1.06.026l5.001 5.25a.75.75 0 0 1 0 1.035l-5 5.25a.75.75 0 1 1-1.087-1.034L12.216 10l-4.51-4.734a.75.75 0 0 1 .027-1.06"></path></svg>`;
}, "~icons/fluent/chevron-right-20-filled.astro", void 0);

const $$SidebarSection = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$SidebarSection;
  const { node } = Astro2.props;
  return renderTemplate`${node.kind === "group" ? renderTemplate`${maybeRenderHead()}<details><summary>${renderComponent($$result, "ChevronRight", $$ChevronRight20Filled, { "class": "summary-icon", "aria-hidden": "true" })}<span>${node.label}</span></summary><div class="content">${node.children?.map((child) => renderTemplate`${renderComponent($$result, "Astro.self", Astro2.self, { "node": child })}`)}</div></details>` : renderTemplate`<a${addAttribute(node.href, "href")}>${node.label}</a>`}`;
}, "/home/runner/work/native/native/src/components/SidebarSection.astro", void 0);

function createSvgComponent({ meta, attributes, children, styles }) {
  const hasStyles = styles.length > 0;
  const Component = createComponent({
    async factory(result, props) {
      const normalizedProps = normalizeProps(attributes, props);
      if (hasStyles && result.cspDestination) {
        for (const style of styles) {
          const hash = await generateCspDigest(style, result.cspAlgorithm);
          result._metadata.extraStyleHashes.push(hash);
        }
      }
      return renderTemplate`<svg${spreadAttributes(normalizedProps)}>${unescapeHTML(children)}</svg>`;
    },
    propagation: hasStyles ? "self" : "none"
  });
  Object.defineProperty(Component, "toJSON", {
    value: () => meta,
    enumerable: false
  });
  return Object.assign(Component, meta);
}
const ATTRS_TO_DROP = ["xmlns", "xmlns:xlink", "version"];
const DEFAULT_ATTRS = {};
function dropAttributes(attributes) {
  for (const attr of ATTRS_TO_DROP) {
    delete attributes[attr];
  }
  return attributes;
}
function normalizeProps(attributes, props) {
  return dropAttributes({ ...DEFAULT_ATTRS, ...attributes, ...props });
}

const CONTENT_IMAGE_FLAG = "astroContentImageFlag";
const IMAGE_IMPORT_PREFIX = "__ASTRO_IMAGE_";

function imageSrcToImportId(imageSrc, filePath) {
  imageSrc = removeBase(imageSrc, IMAGE_IMPORT_PREFIX);
  if (isRemotePath(imageSrc)) {
    return;
  }
  const ext = imageSrc.split(".").at(-1)?.toLowerCase();
  if (!ext || !VALID_INPUT_FORMATS.includes(ext)) {
    return;
  }
  const params = new URLSearchParams(CONTENT_IMAGE_FLAG);
  if (filePath) {
    params.set("importer", filePath);
  }
  return `${imageSrc}?${params.toString()}`;
}

class ImmutableDataStore {
  _collections = /* @__PURE__ */ new Map();
  constructor() {
    this._collections = /* @__PURE__ */ new Map();
  }
  get(collectionName, key) {
    return this._collections.get(collectionName)?.get(String(key));
  }
  entries(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.entries()];
  }
  values(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.values()];
  }
  keys(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.keys()];
  }
  has(collectionName, key) {
    const collection = this._collections.get(collectionName);
    if (collection) {
      return collection.has(String(key));
    }
    return false;
  }
  hasCollection(collectionName) {
    return this._collections.has(collectionName);
  }
  collections() {
    return this._collections;
  }
  /**
   * Attempts to load a DataStore from the virtual module.
   * This only works in Vite.
   */
  static async fromModule() {
    try {
      const data = await import('./_astro_data-layer-content_Vq3c-ESd.mjs');
      if (data.default instanceof Map) {
        return ImmutableDataStore.fromMap(data.default);
      }
      const map = devalue.unflatten(data.default);
      return ImmutableDataStore.fromMap(map);
    } catch {
    }
    return new ImmutableDataStore();
  }
  static async fromMap(data) {
    const store = new ImmutableDataStore();
    store._collections = data;
    return store;
  }
}
function dataStoreSingleton() {
  let instance = void 0;
  return {
    get: async () => {
      if (!instance) {
        instance = ImmutableDataStore.fromModule();
      }
      return instance;
    },
    set: (store) => {
      instance = store;
    }
  };
}
const globalDataStore = dataStoreSingleton();

z.object({
  tags: z.array(z.string()).optional(),
  lastModified: z.date().optional()
});
function createGetCollection({
  liveCollections
}) {
  return async function getCollection(collection, filter) {
    if (collection in liveCollections) {
      throw new AstroError({
        ...UnknownContentCollectionError,
        message: `Collection "${collection}" is a live collection. Use getLiveCollection() instead of getCollection().`
      });
    }
    const hasFilter = typeof filter === "function";
    const store = await globalDataStore.get();
    if (store.hasCollection(collection)) {
      const { default: imageAssetMap } = await import('./content-assets_DloNRoa4.mjs');
      const result = [];
      for (const rawEntry of store.values(collection)) {
        const data = updateImageReferencesInData(rawEntry.data, rawEntry.filePath, imageAssetMap);
        let entry = {
          ...rawEntry,
          data,
          collection
        };
        if (hasFilter && !filter(entry)) {
          continue;
        }
        result.push(entry);
      }
      return result;
    } else {
      console.warn(
        `The collection ${JSON.stringify(
          collection
        )} does not exist or is empty. Please check your content config file for errors.`
      );
      return [];
    }
  };
}
function updateImageReferencesInData(data, fileName, imageAssetMap) {
  return new Traverse(data).map(function(ctx, val) {
    if (typeof val === "string" && val.startsWith(IMAGE_IMPORT_PREFIX)) {
      const src = val.replace(IMAGE_IMPORT_PREFIX, "");
      const id = imageSrcToImportId(src, fileName);
      if (!id) {
        ctx.update(src);
        return;
      }
      const imported = imageAssetMap?.get(id);
      if (imported) {
        if (imported.__svgData) {
          const { __svgData: svgData, ...meta } = imported;
          ctx.update(createSvgComponent({ meta, ...svgData }));
        } else {
          ctx.update(imported);
        }
      } else {
        ctx.update(src);
      }
    }
  });
}

// astro-head-inject

const liveCollections = {};

const getCollection = createGetCollection({
	liveCollections,
});

function normalizeId(id) {
  return id.replaceAll("\\", "/");
}
function capitalize(segment) {
  return segment.replace(/-/g, " ").replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()).replace(/\bapi\b/gi, "API").replace(/\bcss\b/gi, "CSS");
}
function labelForSegment(segment, depth) {
  if (depth === 0 && ["animate", "emitter", "manager", "native"].includes(segment)) {
    return `@okikio/${segment}`;
  }
  return capitalize(segment);
}
function toPrettySegments(id) {
  return normalizeId(id).replace(/\.md$/, "").replace(/\/index$/, "").split("/").filter(Boolean);
}
function toLegacySegments(id) {
  return normalizeId(id).split("/").filter(Boolean);
}
function toHref(segments, legacy = false) {
  if (!segments.length) {
    return "/docs/";
  }
  return `/docs/${segments.join("/")}${legacy ? "" : "/"}`;
}
async function getDocsCollection() {
  const entries = await getCollection("docs");
  return entries.sort((left, right) => left.id.localeCompare(right.id));
}
async function getDocEntries() {
  const entries = await getDocsCollection();
  return entries.map((entry) => {
    const id = normalizeId(entry.id);
    const prettySegments = toPrettySegments(id);
    const legacySegments = toLegacySegments(id);
    const isOverview = /\/index\.md$/.test(id);
    const legacyLeaf = legacySegments.at(-1)?.replace(/\.md$/, "");
    const labelSource = prettySegments.at(-1) ?? legacyLeaf ?? "Overview";
    return {
      entry,
      id,
      prettySegments,
      legacySegments,
      href: toHref(prettySegments),
      legacyHref: toHref(legacySegments, true),
      label: isOverview ? "Overview" : labelForSegment(labelSource, prettySegments.length - 1)
    };
  });
}
function sortNodes(nodes) {
  return nodes.sort((left, right) => {
    if (left.label === "Overview") return -1;
    if (right.label === "Overview") return 1;
    if (left.kind !== right.kind) {
      return left.kind === "group" ? -1 : 1;
    }
    return left.label.localeCompare(right.label);
  });
}
async function getDocTree() {
  const root = {
    children: /* @__PURE__ */ new Map()
  };
  for (const entry of await getDocEntries()) {
    const relative = entry.id.replace(/\.md$/, "").split("/").filter(Boolean);
    let current = root;
    for (const [index, segment] of relative.entries()) {
      const isLast = index === relative.length - 1;
      const isOverview = isLast && segment === "index";
      if (isOverview) {
        current.children.set(`overview:${entry.id}`, {
          kind: "page",
          key: `overview:${entry.id}`,
          label: "Overview",
          href: entry.href
        });
        continue;
      }
      if (isLast) {
        current.children.set(`page:${entry.id}`, {
          kind: "page",
          key: `page:${entry.id}`,
          label: labelForSegment(segment, index),
          href: entry.href
        });
        continue;
      }
      const groupKey = `group:${relative.slice(0, index + 1).join("/")}`;
      const existing = current.children.get(groupKey);
      if (existing?.kind === "group") {
        current = existing;
        continue;
      }
      const created = {
        kind: "group",
        key: groupKey,
        label: labelForSegment(segment, index),
        children: /* @__PURE__ */ new Map()
      };
      current.children.set(groupKey, created);
      current = created;
    }
  }
  const materialize = (group) => sortNodes(
    Array.from(group.children.values()).map((child) => {
      if (child.kind === "group") {
        return {
          kind: "group",
          key: child.key,
          label: child.label,
          children: materialize(child)
        };
      }
      return {
        kind: "page",
        key: child.key,
        label: child.label,
        href: child.href
      };
    })
  );
  return materialize(root);
}

const $$Sidebar = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Sidebar;
  const tree = await getDocTree();
  return renderTemplate`${maybeRenderHead()}<button class="sidebar-backdrop" type="button" data-sidebar-overlay data-open="false" aria-label="Close documentation navigation" data-astro-cid-ssfzsv2f></button> <aside id="docs-sidebar" data-sidebar data-open="false" data-astro-cid-ssfzsv2f> ${renderComponent($$result, "Logo", $$Logo, { "data-astro-cid-ssfzsv2f": true })} <div class="sticky" data-astro-cid-ssfzsv2f> <div class="scroll-shadow-top" data-astro-cid-ssfzsv2f></div> <div class="scroll" data-astro-cid-ssfzsv2f> ${tree.map((node) => renderTemplate`${renderComponent($$result, "SidebarSection", $$SidebarSection, { "node": node, "data-astro-cid-ssfzsv2f": true })}`)} </div> <div class="scroll-shadow-bottom" data-astro-cid-ssfzsv2f></div> </div> </aside> <button class="mobile-menu-button" type="button" data-sidebar-toggle aria-controls="docs-sidebar" aria-expanded="false" aria-label="Open documentation navigation" data-astro-cid-ssfzsv2f> ${renderComponent($$result, "AstroIcon", $$Icon, { "name": "hugeicons:menu-01", "data-astro-cid-ssfzsv2f": true })} <span class="mobile-menu-label" data-astro-cid-ssfzsv2f>Menu</span> </button> ${renderScript($$result, "/home/runner/work/native/native/src/components/Sidebar.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/runner/work/native/native/src/components/Sidebar.astro", void 0);

const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$BaseLayout;
  const { title = "native", description = "Documentation and demos for the native initiative." } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="generator"${addAttribute(Astro2.generator, "content")}><meta name="description"${addAttribute(description, "content")}><title>${title}</title><link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">${renderHead()}</head> <body> <div class="layout"> ${renderComponent($$result, "Sidebar", $$Sidebar, {})} <main data-wrapper> ${renderSlot($$result, $$slots["default"])} </main> </div> </body></html>`;
}, "/home/runner/work/native/native/src/layouts/BaseLayout.astro", void 0);

export { $$Icon as $, $$BaseLayout as a, getDocEntries as g, renderScript as r };
