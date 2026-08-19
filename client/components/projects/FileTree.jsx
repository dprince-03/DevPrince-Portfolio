"use client";

import { useMemo, useState } from "react";
import TerminalWindow from "@/components/terminal/TerminalWindow";

function buildTree(flatDocs) {
  const byId = new Map(flatDocs.map((doc) => [doc.id, { ...doc, children: [] }]));
  const roots = [];
  for (const doc of byId.values()) {
    if (doc.parentId && byId.has(doc.parentId)) {
      byId.get(doc.parentId).children.push(doc);
    } else {
      roots.push(doc);
    }
  }
  return roots;
}

function findFirstFile(nodes) {
  for (const node of nodes) {
    if (node.type === "FILE") return node;
    const found = findFirstFile(node.children);
    if (found) return found;
  }
  return null;
}

function TreeNode({ node, depth, selectedId, onSelect }) {
  const [open, setOpen] = useState(true);
  const isFolder = node.type === "FOLDER";
  const isSelected = selectedId === node.id;

  return (
    <div>
      <button
        type="button"
        onClick={() => (isFolder ? setOpen((o) => !o) : onSelect(node))}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        className={`flex w-full items-center gap-2 rounded px-2 py-1 text-left text-sm transition-colors hover:bg-term-border/40 ${
          isSelected ? "bg-term-border/60 text-term-gold" : "text-term-silver"
        }`}
      >
        <span className={isFolder ? "text-term-blue" : "text-term-silver-dim"}>
          {isFolder ? (open ? "▾" : "▸") : "·"}
        </span>
        <span>{isFolder ? "📁" : "📄"}</span>
        {node.name}
      </button>
      {isFolder &&
        open &&
        node.children.map((child) => (
          <TreeNode key={child.id} node={child} depth={depth + 1} selectedId={selectedId} onSelect={onSelect} />
        ))}
    </div>
  );
}

export default function FileTree({ docs }) {
  const tree = useMemo(() => buildTree(docs), [docs]);
  const [selected, setSelected] = useState(() => findFirstFile(tree));

  if (docs.length === 0) {
    return <p className="text-sm text-term-silver-dim">No docs yet for this project.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-[240px_1fr]">
      <div className="rounded-xl border border-term-border bg-term-panel/80 p-3 backdrop-blur-md">
        {tree.map((node) => (
          <TreeNode key={node.id} node={node} depth={0} selectedId={selected?.id} onSelect={setSelected} />
        ))}
      </div>
      <TerminalWindow title={selected?.name ?? "select a file"} animate={false}>
        <pre className="whitespace-pre-wrap font-mono text-sm text-term-silver">
          {selected?.content || "// select a file from the tree"}
        </pre>
      </TerminalWindow>
    </div>
  );
}
