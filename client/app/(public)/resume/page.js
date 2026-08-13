import ResumeTerminal from "@/components/resume/ResumeTerminal";

export default function ResumePage() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16 sm:py-20">
      <p className="text-xs uppercase tracking-widest text-term-silver-dim">
        $ cat resume.go
      </p>
      {/* Narrower than the page shell on purpose — same reasoning as contact/privacy */}
      <div className="max-w-3xl">
        <ResumeTerminal />
      </div>
    </main>
  );
}
