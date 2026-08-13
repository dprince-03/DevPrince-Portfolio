"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { projectsApi } from "@/lib/api";
import AdminSection from "@/components/admin/AdminSection";
import Button from "@/components/admin/Button";
import StatusBadge from "@/components/projects/StatusBadge";
import { SkeletonTerminalCard } from "@/components/ui/Skeleton";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState(null);
  const [error, setError] = useState("");

  function load() {
    projectsApi.list().then(setProjects).catch((err) => setError(err.message));
  }

  useEffect(load, []);

  async function handleDelete(project) {
    if (!confirm(`Delete "${project.title}"? This also deletes its docs.`)) return;
    try {
      await projectsApi.remove(project.id);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-widest text-term-silver-dim">$ ls ~/projects --admin</p>
        <Link href="/admin/dashboard/projects/new">
          <Button variant="primary">+ new project</Button>
        </Link>
      </div>

      {error && <p className="text-sm text-term-red">error: {error}</p>}

      {!projects && !error && <SkeletonTerminalCard title="projects.json" />}

      {projects && (
        <AdminSection title="projects.json">
          <div className="divide-y divide-term-border">
            {projects.length === 0 && <p className="py-4 text-sm text-term-silver-dim">No projects yet.</p>}
            {projects.map((project) => (
              <div key={project.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm text-term-white">{project.title}</span>
                    <StatusBadge status={project.status} />
                  </div>
                  <p className="truncate text-xs text-term-silver-dim">/{project.slug}</p>
                </div>
                <div className="flex shrink-0 gap-3 text-xs">
                  <Link href={`/admin/dashboard/projects/${project.id}`} className="text-term-blue hover:underline">
                    edit
                  </Link>
                  <button type="button" onClick={() => handleDelete(project)} className="text-term-red hover:underline">
                    delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </AdminSection>
      )}
    </div>
  );
}
