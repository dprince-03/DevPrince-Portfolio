"use client";

import { useRouter } from "next/navigation";
import { projectsApi } from "@/lib/api";
import AdminSection from "@/components/admin/AdminSection";
import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  const router = useRouter();

  async function handleSubmit(data) {
    const project = await projectsApi.create(data);
    router.push(`/admin/dashboard/projects/${project.id}`);
  }

  return (
    <div className="space-y-6">
      <p className="text-xs uppercase tracking-widest text-term-silver-dim">$ touch projects/new.json</p>
      <AdminSection title="new-project.json">
        <ProjectForm onSubmit={handleSubmit} submitLabel="create" />
      </AdminSection>
    </div>
  );
}
