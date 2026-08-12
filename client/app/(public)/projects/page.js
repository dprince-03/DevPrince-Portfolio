"use client";

import { useEffect, useState } from "react";
import { projectsApi } from "@/lib/api";
import ProjectFolderCard from "@/components/projects/ProjectFolderCard";
import SkeletonFolder from "@/components/projects/SkeletonFolder";

export default function ProjectsPage() {
  const [projects, setProjects] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    projectsApi
      .list()
      .then((data) => !cancelled && setProjects(data))
      .catch((err) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
      <p className="text-xs uppercase tracking-widest text-term-silver-dim">$ ls ~/projects</p>
      <h1 className="mt-2 text-2xl font-semibold text-term-white sm:text-3xl">projects/</h1>

      {error && <p className="mt-6 text-sm text-term-red">error: {error}</p>}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {!projects &&
          !error &&
          Array.from({ length: 4 }).map((_, i) => <SkeletonFolder key={i} />)}
        {projects?.map((project) => (
          <ProjectFolderCard key={project.id} project={project} />
        ))}
        {projects?.length === 0 && (
          <p className="text-sm text-term-silver-dim">No projects yet.</p>
        )}
      </div>
    </main>
  );
}
