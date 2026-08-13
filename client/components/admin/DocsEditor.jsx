"use client";

import { useEffect, useMemo, useState } from "react";
import { docsApi } from "@/lib/api";
import { TextField, SelectField, TextareaField } from "@/components/admin/fields";
import Button from "@/components/admin/Button";

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

function Node({ node, depth, onSelect, selectedId, onDelete }) {
  const [open, setOpen] = useState(true);
  const isFolder = node.type === "FOLDER";

  return (
    <div>
      <div
        style={{ paddingLeft: `${depth * 16}px` }}
        className={`flex items-center justify-between gap-2 rounded px-2 py-1 text-sm ${
          selectedId === node.id ? "bg-term-border/60 text-term-gold" : "text-term-silver"
        }`}
      >
        <button
          type="button"
          onClick={() => (isFolder ? setOpen((o) => !o) : onSelect(node))}
          className="flex min-w-0 flex-1 items-center gap-2 truncate text-left hover:text-term-white"
        >
          <span className={isFolder ? "text-term-blue" : "text-term-silver-dim"}>
            {isFolder ? (open ? "▾" : "▸") : "·"}
          </span>
          <span>{isFolder ? "📁" : "📄"}</span>
          <span className="truncate">{node.name}</span>
        </button>
        <button type="button" onClick={() => onDelete(node)} className="shrink-0 text-xs text-term-red hover:underline">
          delete
        </button>
      </div>
      {isFolder &&
        open &&
        node.children.map((child) => (
          <Node key={child.id} node={child} depth={depth + 1} onSelect={onSelect} selectedId={selectedId} onDelete={onDelete} />
        ))}
    </div>
  );
}

function flattenFolders(nodes, depth = 0) {
  let out = [];
  for (const node of nodes) {
    if (node.type === "FOLDER") {
      out.push({ id: node.id, name: node.name, depth });
      out = out.concat(flattenFolders(node.children, depth + 1));
    }
  }
  return out;
}

export default function DocsEditor({ projectId }) {
  const [docs, setDocs] = useState(null);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("FILE");
  const [newParent, setNewParent] = useState("");

  function load() {
    docsApi
      .list(projectId)
      .then(setDocs)
      .catch((err) => setError(err.message));
  }

  useEffect(load, [projectId]);

  const tree = useMemo(() => buildTree(docs || []), [docs]);
  const folders = useMemo(() => flattenFolders(tree), [tree]);

  function selectNode(node) {
    setSelected(node);
    setContent(node.content || "");
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      await docsApi.create(projectId, {
        name: newName.trim(),
        type: newType,
        parentId: newParent || null,
      });
      setNewName("");
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(node) {
    if (!confirm(`Delete "${node.name}"?`)) return;
    try {
      await docsApi.remove(projectId, node.id);
      if (selected?.id === node.id) setSelected(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSaveContent() {
    setSaving(true);
    try {
      await docsApi.update(projectId, selected.id, { content });
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (error) return <p className="text-sm text-term-red">error: {error}</p>;
  if (!docs) return <p className="text-sm text-term-silver-dim">loading docs…</p>;

  return (
    <div className="space-y-4">
      <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-3">
        <TextField id="newDocName" label="name" value={newName} onChange={(e) => setNewName(e.target.value)} />
        <SelectField id="newDocType" label="type" value={newType} onChange={(e) => setNewType(e.target.value)}>
          <option value="FILE">file</option>
          <option value="FOLDER">folder</option>
        </SelectField>
        <SelectField id="newDocParent" label="parent" value={newParent} onChange={(e) => setNewParent(e.target.value)}>
          <option value="">/ (root)</option>
          {folders.map((f) => (
            <option key={f.id} value={f.id}>
              {"— ".repeat(f.depth)}
              {f.name}/
            </option>
          ))}
        </SelectField>
        <Button type="submit" variant="ghost">
          + add
        </Button>
      </form>

      <div className="grid gap-4 md:grid-cols-[240px_1fr]">
        <div className="rounded-xl border border-term-border bg-term-panel p-3">
          {tree.length === 0 && <p className="text-sm text-term-silver-dim">No docs yet.</p>}
          {tree.map((node) => (
            <Node key={node.id} node={node} depth={0} onSelect={selectNode} selectedId={selected?.id} onDelete={handleDelete} />
          ))}
        </div>

        <div className="rounded-xl border border-term-border bg-term-panel p-4">
          {!selected ? (
            <p className="text-sm text-term-silver-dim">Select a file to edit its content.</p>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-term-white">{selected.name}</p>
              <TextareaField
                id="docContent"
                label="content"
                rows={12}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="font-mono"
              />
              <Button type="button" onClick={handleSaveContent} disabled={saving}>
                {saving ? "saving..." : "save content"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
