import Link from "next/link";
import FolderTile from "./FolderTile";

export default function ProjectFolderCard({ project }) {
  return (
    <Link href={`/projects/${project.slug}`} className="group flex flex-col items-center gap-3.5 text-center">
      <FolderTile status={project.status} />
      <div>
        <h3 className="text-sm font-bold text-term-white">{project.title}</h3>
        <p className="mt-1 max-w-[180px] text-xs text-term-silver-dim">{project.summary}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-1.5">
        {project.techStack.slice(0, 4).map((tech) => (
          <span key={tech} className="rounded border border-term-border px-1.5 py-0.5 text-[10px] text-term-silver-dim">
            {tech}
          </span>
        ))}
      </div>
    </Link>
  );
}
