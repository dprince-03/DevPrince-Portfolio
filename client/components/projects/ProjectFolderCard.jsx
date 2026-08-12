import Link from "next/link";
import FolderIcon from "./FolderIcon";
import { statusConfig } from "./status";

export default function ProjectFolderCard({ project }) {
  const cfg = statusConfig(project.status);

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col gap-3 rounded-xl border border-term-border bg-term-panel p-5 transition-colors hover:border-term-gold"
    >
      <FolderIcon className={cfg.text} />
      <div>
        <h3 className="text-sm font-semibold text-term-white group-hover:text-term-gold">
          {project.title}
        </h3>
        <p className="mt-1 text-xs text-term-silver">{project.summary}</p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {project.techStack.slice(0, 4).map((tech) => (
          <span key={tech} className="rounded border border-term-border px-1.5 py-0.5 text-[10px] text-term-silver-dim">
            {tech}
          </span>
        ))}
      </div>
    </Link>
  );
}
