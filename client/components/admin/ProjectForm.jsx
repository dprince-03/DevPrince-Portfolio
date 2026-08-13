"use client";

import { useState } from "react";
import { TextField, TextareaField, SelectField, CheckboxField } from "@/components/admin/fields";
import Button from "@/components/admin/Button";

const STATUS_OPTIONS = ["NOT_STARTED", "IN_PROGRESS", "COMPLETE"];

function toFormState(project) {
  return {
    title: project?.title ?? "",
    slug: project?.slug ?? "",
    summary: project?.summary ?? "",
    description: project?.description ?? "",
    techStack: (project?.techStack ?? []).join(", "),
    repoUrl: project?.repoUrl ?? "",
    liveUrl: project?.liveUrl ?? "",
    status: project?.status ?? "NOT_STARTED",
    featured: project?.featured ?? false,
    order: project?.order ?? 0,
  };
}

export default function ProjectForm({ project, onSubmit, submitLabel = "save" }) {
  const [form, setForm] = useState(() => toFormState(project));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set(field) {
    return (e) => {
      const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
      setForm((f) => ({ ...f, [field]: value }));
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSubmit({
        ...form,
        techStack: form.techStack
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        order: Number(form.order) || 0,
        repoUrl: form.repoUrl || null,
        liveUrl: form.liveUrl || null,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField id="title" label="title" required value={form.title} onChange={set("title")} />
        <TextField id="slug" label="slug (lowercase-hyphenated)" required value={form.slug} onChange={set("slug")} />
      </div>
      <TextField id="summary" label="summary" required value={form.summary} onChange={set("summary")} />
      <TextareaField id="description" label="description" rows={4} value={form.description} onChange={set("description")} />
      <TextField
        id="techStack"
        label="tech stack (comma-separated)"
        value={form.techStack}
        onChange={set("techStack")}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField id="repoUrl" label="repo URL" type="url" value={form.repoUrl} onChange={set("repoUrl")} />
        <TextField id="liveUrl" label="live URL" type="url" value={form.liveUrl} onChange={set("liveUrl")} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField id="status" label="status" value={form.status} onChange={set("status")}>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </SelectField>
        <TextField id="order" label="order" type="number" value={form.order} onChange={set("order")} />
      </div>
      <CheckboxField id="featured" label="featured" checked={form.featured} onChange={set("featured")} />

      {error && <p className="text-sm text-term-red">error: {error}</p>}
      <Button type="submit" disabled={saving}>
        {saving ? "saving..." : submitLabel}
      </Button>
    </form>
  );
}
