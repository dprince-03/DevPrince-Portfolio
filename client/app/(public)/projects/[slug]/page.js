import { notFound } from "next/navigation";
import FileTree from "@/components/projects/FileTree";
import StatusBadge from "@/components/projects/StatusBadge";

// Two different URLs on purpose: this fetch runs server-side (inside the
// Next.js server/container), which can't reach the API via its browser-facing
// address in Docker ("localhost:5000" means the client container itself
// there, not the server container) — same reasoning as dashboard/layout.js.
const INTERNAL_API_URL =
  process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
// The "view raw" link below is opened by the visitor's actual browser, so it
// must use the public-facing URL instead.
const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

async function getProject(slug) {
  const res = await fetch(`${INTERNAL_API_URL}/api/projects/${slug}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load project");
  return res.json();
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
      <p className="text-xs uppercase tracking-widest text-term-silver-dim">
        $ cd ~/projects/{project.slug}
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold text-term-white sm:text-3xl">{project.title}</h1>
        <StatusBadge status={project.status} />
      </div>

      <p className="mt-3 max-w-2xl text-sm text-term-silver">{project.summary}</p>

      {project.techStack.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span key={tech} className="rounded-md border border-term-border px-2 py-1 text-xs text-term-silver">
              {tech}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        {project.repoUrl && (
          <a href={project.repoUrl} target="_blank" rel="noreferrer" className="text-term-blue hover:underline">
            repo →
          </a>
        )}
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-term-blue hover:underline">
            live →
          </a>
        )}
        <a
          href={`${PUBLIC_API_URL}/api/projects/${project.slug}`}
          target="_blank"
          rel="noreferrer"
          className="text-term-silver-dim hover:text-term-gold"
        >
          view raw →
        </a>
      </div>

      <div className="mt-10">
        <FileTree docs={project.docs} />
      </div>
    </main>
  );
}
