"use client";

import { useEffect, useState } from "react";
import { skillsApi } from "@/lib/api";
import AdminSection from "@/components/admin/AdminSection";
import { TextField, SelectField } from "@/components/admin/fields";
import Button from "@/components/admin/Button";
import { SkeletonTerminalCard } from "@/components/ui/Skeleton";

const CATEGORIES = ["LANGUAGE", "FRAMEWORK", "TOOL", "PLATFORM"];

export default function SkillsPage() {
  const [skills, setSkills] = useState(null);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("LANGUAGE");

  function load() {
    skillsApi.list().then(setSkills).catch((err) => setError(err.message));
  }

  useEffect(load, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await skillsApi.create({ name: name.trim(), category });
      setName("");
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(skill) {
    try {
      await skillsApi.remove(skill.id);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  const grouped = CATEGORIES.map((cat) => ({
    category: cat,
    items: (skills || []).filter((s) => s.category === cat),
  }));

  return (
    <div className="space-y-6">
      <p className="text-xs uppercase tracking-widest text-term-silver-dim">$ cat skills.json --admin</p>

      <AdminSection title="add-skill.json">
        <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-3">
          <TextField id="skillName" label="name" value={name} onChange={(e) => setName(e.target.value)} />
          <SelectField id="skillCategory" label="category" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </SelectField>
          <Button type="submit" variant="ghost">
            + add
          </Button>
        </form>
      </AdminSection>

      {error && <p className="text-sm text-term-red">error: {error}</p>}
      {!skills && !error && <SkeletonTerminalCard title="skills.json" />}

      {skills &&
        grouped.map(({ category: cat, items }) => (
          <AdminSection key={cat} title={`skills.json — ${cat}`}>
            {items.length === 0 ? (
              <p className="text-sm text-term-silver-dim">None yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {items.map((skill) => (
                  <span
                    key={skill.id}
                    className="flex items-center gap-2 rounded-md border border-term-border px-3 py-1.5 text-xs text-term-silver"
                  >
                    {skill.name}
                    <button type="button" onClick={() => handleDelete(skill)} className="text-term-red hover:underline">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </AdminSection>
        ))}
    </div>
  );
}
