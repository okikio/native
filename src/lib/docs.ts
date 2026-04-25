const docModules = import.meta.glob("/src/content/**/*.md");

export interface DocEntry {
  file: string;
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

function toRelativePath(file: string) {
  return file.replace(/^\/src\/content\//, "");
}

function toPathWithoutExtension(file: string) {
  return toRelativePath(file).replace(/\.md$/, "");
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

function toPrettySegments(file: string) {
  return toPathWithoutExtension(file)
    .replace(/\/index$/, "")
    .split("/")
    .filter(Boolean);
}

function toLegacySegments(file: string) {
  return toRelativePath(file).split("/").filter(Boolean);
}

function toHref(segments: string[], legacy = false) {
  if (!segments.length) {
    return "/docs/";
  }

  return `/docs/${segments.join("/")}${legacy ? "" : "/"}`;
}

export function getDocEntries(): DocEntry[] {
  return Object.keys(docModules)
    .sort()
    .map((file) => {
      const prettySegments = toPrettySegments(file);
      const legacySegments = toLegacySegments(file);
      const isOverview = /\/index\.md$/.test(file);
      const legacyLeaf = legacySegments.at(-1)?.replace(/\.md$/, "");
      const labelSource = prettySegments.at(-1) ?? legacyLeaf ?? "Overview";

      return {
        file,
        prettySegments,
        legacySegments,
        href: toHref(prettySegments),
        legacyHref: toHref(legacySegments, true),
        label: isOverview ? "Overview" : labelForSegment(labelSource, prettySegments.length - 1),
      };
    });
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

export function getDocTree(): DocTreeNode[] {
  const root: TreeGroup = {
    kind: "group",
    key: "root",
    label: "root",
    children: new Map(),
  };

  for (const entry of getDocEntries()) {
    const relative = toPathWithoutExtension(entry.file).split("/").filter(Boolean);
    let current = root;

    relative.forEach((segment, index) => {
      const isLast = index === relative.length - 1;
      const isOverview = isLast && segment === "index";

      if (isOverview) {
        current.children.set(`overview:${entry.file}`, {
          kind: "page",
          key: `overview:${entry.file}`,
          label: "Overview",
          href: entry.href,
        });
        return;
      }

      if (isLast) {
        current.children.set(`page:${entry.file}`, {
          kind: "page",
          key: `page:${entry.file}`,
          label: labelForSegment(segment, index),
          href: entry.href,
        });
        return;
      }

      const groupKey = `group:${relative.slice(0, index + 1).join("/")}`;
      const existing = current.children.get(groupKey);

      if (existing?.kind === "group") {
        current = existing;
        return;
      }

      const created: TreeGroup = {
        kind: "group",
        key: groupKey,
        label: labelForSegment(segment, index),
        children: new Map(),
      };

      current.children.set(groupKey, created);
      current = created;
    });
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

export async function getDocModule(file: string) {
  const loader = docModules[file];

  if (!loader) {
    throw new Error(`Unknown documentation file: ${file}`);
  }

  return loader();
}

export function getBreadcrumbs(entry: DocEntry) {
  return entry.prettySegments.map((segment, index) => ({
    label: labelForSegment(segment, index),
    href: toHref(entry.prettySegments.slice(0, index + 1)),
  }));
}
