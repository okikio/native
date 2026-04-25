import { getCollection, type CollectionEntry } from "astro:content";

export type DocsCollectionEntry = CollectionEntry<"docs">;

export interface DocEntry {
  entry: DocsCollectionEntry;
  id: string;
  prettySegments: string[];
  legacySegments: string[];
  href: string;
  legacyHref: string;
  label: string;
}

export interface DocTreeNode {
  kind: "group" | "page";
  key: string;
  label: string;
  href?: string;
  children?: DocTreeNode[];
}

interface TreeGroup {
  kind: "group";
  key: string;
  label: string;
  children: Map<string, TreeNode>;
}

interface TreePage {
  kind: "page";
  key: string;
  label: string;
  href: string;
}

type TreeNode = TreeGroup | TreePage;

function normalizeId(id: string) {
  return id.replaceAll("\\", "/");
}

function capitalize(segment: string) {
  return segment
    .replace(/-/g, " ")
    .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase())
    .replace(/\bapi\b/gi, "API")
    .replace(/\bcss\b/gi, "CSS");
}

function labelForSegment(segment: string, depth: number) {
  if (depth === 0 && ["animate", "emitter", "manager", "native"].includes(segment)) {
    return `@okikio/${segment}`;
  }

  return capitalize(segment);
}

function toPrettySegments(id: string) {
  return normalizeId(id).replace(/\.md$/, "").replace(/\/index$/, "").split("/").filter(Boolean);
}

function toLegacySegments(id: string) {
  return normalizeId(id).split("/").filter(Boolean);
}

function toHref(segments: string[], legacy = false) {
  if (!segments.length) {
    return "/docs/";
  }

  return `/docs/${segments.join("/")}${legacy ? "" : "/"}`;
}

async function getDocsCollection() {
  const entries = await getCollection("docs");
  return entries.sort((left, right) => left.id.localeCompare(right.id));
}

export async function getDocEntries(): Promise<DocEntry[]> {
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
      label: isOverview ? "Overview" : labelForSegment(labelSource, prettySegments.length - 1),
    };
  });
}

export async function getDocEntryById(id: string) {
  const entries = await getDocEntries();
  return entries.find((entry) => entry.id === normalizeId(id));
}

function sortNodes(nodes: DocTreeNode[]) {
  return nodes.sort((left, right) => {
    if (left.label === "Overview") return -1;
    if (right.label === "Overview") return 1;

    if (left.kind !== right.kind) {
      return left.kind === "group" ? -1 : 1;
    }

    return left.label.localeCompare(right.label);
  });
}

export async function getDocTree(): Promise<DocTreeNode[]> {
  const root: TreeGroup = {
    kind: "group",
    key: "root",
    label: "root",
    children: new Map(),
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
          href: entry.href,
        });
        continue;
      }

      if (isLast) {
        current.children.set(`page:${entry.id}`, {
          kind: "page",
          key: `page:${entry.id}`,
          label: labelForSegment(segment, index),
          href: entry.href,
        });
        continue;
      }

      const groupKey = `group:${relative.slice(0, index + 1).join("/")}`;
      const existing = current.children.get(groupKey);

      if (existing?.kind === "group") {
        current = existing;
        continue;
      }

      const created: TreeGroup = {
        kind: "group",
        key: groupKey,
        label: labelForSegment(segment, index),
        children: new Map(),
      };

      current.children.set(groupKey, created);
      current = created;
    }
  }

  const materialize = (group: TreeGroup): DocTreeNode[] =>
    sortNodes(
      Array.from(group.children.values()).map((child) => {
        if (child.kind === "group") {
          return {
            kind: "group",
            key: child.key,
            label: child.label,
            children: materialize(child),
          };
        }

        return {
          kind: "page",
          key: child.key,
          label: child.label,
          href: child.href,
        };
      })
    );

  return materialize(root);
}

export function getBreadcrumbs(entry: DocEntry) {
  return entry.prettySegments.map((segment, index) => ({
    label: labelForSegment(segment, index),
    href: toHref(entry.prettySegments.slice(0, index + 1)),
  }));
}
