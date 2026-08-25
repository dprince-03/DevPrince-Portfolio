import ProfileCard from "@/components/profile/ProfileCard";
import ResumeTerminal from "@/components/resume/ResumeTerminal";

export default function ResumePage() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16 sm:py-20">
      <p className="text-xs uppercase tracking-widest text-term-silver-dim">
        $ cat resume.go
      </p>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <ProfileCard className="lg:w-[300px] lg:flex-shrink-0" />
        <ResumeTerminal className="flex-1" />
      </div>
    </main>
  );
}
