"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { projectsApi } from "@/lib/api";
import AdminSection from "@/components/admin/AdminSection";
import ProjectForm from "@/components/admin/ProjectForm";
import DocsEditor from "@/components/admin/DocsEditor";
import Button from "@/components/admin/Button";

export default function EditProjectPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    projectsApi
      .list()
      .then((projects) => {
        const found = projects.find((p) => p.id === id);
        if (!found) throw new Error("Project not found");
        setProject(found);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  async function handleSubmit(data) {
    const updated = await projectsApi.update(id, data);
    setProject(updated);
  }

  async function handleDelete() {
    if (!confirm(`Delete "${project.title}"? This also deletes its docs.`)) return;
    await projectsApi.remove(id);
    router.push("/admin/dashboard/projects");
  }

  if (error) return <p className="text-sm text-term-red">error: {error}</p>;
  if (!project) return <p className="text-sm text-term-silver-dim">loading…</p>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-widest text-term-silver-dim">
          $ vim projects/{project.slug}.json
        </p>
        <Button variant="danger" onClick={handleDelete}>
          delete project
        </Button>
      </div>

      <AdminSection title={`${project.slug}.json`}>
        <ProjectForm project={project} onSubmit={handleSubmit} submitLabel="save changes" />
      </AdminSection>

      <AdminSection title={`${project.slug}/docs`}>
        <DocsEditor projectId={id} />
      </AdminSection>
    </div>
  );
}
