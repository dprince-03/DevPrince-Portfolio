"use client";

import { useEffect, useState } from "react";
import { projectsApi } from "@/lib/api";
import ProjectFolderCard from "@/components/projects/ProjectFolderCard";
import SkeletonFolder from "@/components/projects/SkeletonFolder";
import GithubStats from "@/components/profile/GithubStats";
import GithubContributions from "@/components/profile/GithubContributions";
import GithubRepoStats from "@/components/profile/GithubRepoStats";
import GithubActivity from "@/components/profile/GithubActivity";

const LEGEND = [
  { status: "COMPLETE", label: "complete", color: "bg-term-green" },
  { status: "IN_PROGRESS", label: "in progress", color: "bg-term-blue" },
  { status: "NOT_STARTED", label: "not started", color: "bg-term-red" },
];

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
    <main className="mx-auto max-w-6xl px-6 pb-20 pt-4 sm:pb-24">
      <p className="text-sm text-term-green">
        you<span className="text-term-blue">@</span>portfolio
        <span className="text-term-silver-dim">:</span>
        <span className="text-term-blue">~/projects</span>
        <span className="text-term-silver-dim">$</span> ls -la
      </p>

      <div className="mt-6 flex flex-wrap gap-6 text-xs text-term-silver-dim">
        {LEGEND.map(({ status, label, color }) => (
          <span key={status} className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${color}`} /> {label}
          </span>
        ))}
      </div>

      {error && <p className="mt-6 text-sm text-term-red">error: {error}</p>}

      <div className="mt-12 grid grid-cols-1 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {!projects &&
          !error &&
          Array.from({ length: 6 }).map((_, i) => <SkeletonFolder key={i} />)}
        {projects?.map((project) => (
          <ProjectFolderCard key={project.id} project={project} />
        ))}
        {projects?.length === 0 && (
          <p className="text-sm text-term-silver-dim">No projects yet.</p>
        )}
      </div>

      <div className="mt-16 flex flex-col gap-6">
        <p className="text-xs uppercase tracking-widest text-term-silver-dim">$ cd ~/github</p>
        <div className="max-w-3xl">
          <GithubStats />
        </div>
        <div className="max-w-3xl">
          <GithubContributions />
        </div>
        <div className="max-w-3xl">
          <GithubRepoStats />
        </div>
        <div className="max-w-3xl">
          <GithubActivity />
        </div>
      </div>
    </main>
  );
}
