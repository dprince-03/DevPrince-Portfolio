"use client";

import { useEffect, useState } from "react";
import TerminalWindow from "@/components/terminal/TerminalWindow";
import { Cm, Kw, Ty, Str, Pu, Section } from "@/components/code/tokens";
import { settingsApi, skillsApi, API_URL } from "@/lib/api";

// Placeholder — swap for real history (later: editable from the admin dashboard).
const FORMATIONS = [
  { func: "University", school: "Your School", degree: "Your Degree", period: "20XX – 20XX" },
];

const EXPERIENCES = [
  {
    func: "CurrentRole",
    company: "Company Name",
    role: "Your Role",
    period: "Mon 20XX – Present",
    note: "One-line summary of what you did there.",
  },
];

export default function ResumeTerminal({ className = "" }) {
  const [resumeUrl, setResumeUrl] = useState(null);
  const [skills, setSkills] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([settingsApi.list(), skillsApi.list()])
      .then(([settings, skillsData]) => {
        if (cancelled) return;
        setResumeUrl(settings.resume_url || null);
        setSkills(skillsData);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <TerminalWindow title="resume.go" className={className}>
      <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
        <Cm>{"// resume.go"}</Cm>
        {"\n"}
        <Kw>package</Kw> devprince

        <Section heading="formations">
          {FORMATIONS.map(({ func, school, degree, period }, i) => (
            <span key={func}>
              {i > 0 && "\n\n"}
              <Kw>func</Kw> <Ty>{func}</Ty>
              <Pu>{"() Formation {"}</Pu>
              {"\n"}
              {"    "}
              <Kw>return</Kw> <Ty>Formation</Ty>
              <Pu>{"{"}</Pu>
              {"\n"}
              {"        "}School: <Str>&quot;{school}&quot;</Str>,{"\n"}
              {"        "}Degree: <Str>&quot;{degree}&quot;</Str>,{"\n"}
              {"        "}Period: <Str>&quot;{period}&quot;</Str>,{"\n"}
              {"    "}
              <Pu>{"}"}</Pu>
              {"\n"}
              <Pu>{"}"}</Pu>
            </span>
          ))}
        </Section>

        <Section heading="experience">
          {EXPERIENCES.map(({ func, company, role, period, note }, i) => (
            <span key={func}>
              {i > 0 && "\n\n"}
              <Cm>{`    // ${note}`}</Cm>
              {"\n"}
              <Kw>func</Kw> <Ty>{func}</Ty>
              <Pu>{"() Experience {"}</Pu>
              {"\n"}
              {"    "}
              <Kw>return</Kw> <Ty>Experience</Ty>
              <Pu>{"{"}</Pu>
              {"\n"}
              {"        "}Company: <Str>&quot;{company}&quot;</Str>,{"\n"}
              {"        "}Role:    <Str>&quot;{role}&quot;</Str>,{"\n"}
              {"        "}Period:  <Str>&quot;{period}&quot;</Str>,{"\n"}
              {"    "}
              <Pu>{"}"}</Pu>
              {"\n"}
              <Pu>{"}"}</Pu>
            </span>
          ))}
        </Section>

        {"\n\n"}
        <Cm>{"// see also: me.go — information, platforms, languages, tools"}</Cm>
      </pre>

      {skills?.length > 0 && (
        <div className="mt-6 border-t border-term-border pt-5">
          <p className="text-xs uppercase tracking-widest text-term-silver-dim">{"// skills"}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="rounded-full border border-term-border bg-term-bg px-3 py-1 text-xs font-semibold text-term-white"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 border-t border-term-border pt-4">
        <p className="text-xs uppercase tracking-widest text-term-silver-dim">{"// download"}</p>
        {resumeUrl ? (
          <a
            href={`${API_URL}${resumeUrl}`}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block rounded-md bg-term-blue/90 px-4 py-2 text-sm font-semibold text-term-bg transition hover:bg-term-blue"
          >
            $ open resume.pdf
          </a>
        ) : (
          <p className="mt-3 text-sm text-term-silver-dim">No resume uploaded yet.</p>
        )}
      </div>
    </TerminalWindow>
  );
}
