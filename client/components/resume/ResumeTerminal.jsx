"use client";

import { useEffect, useState } from "react";
import TerminalWindow from "@/components/terminal/TerminalWindow";
import { Cm, Kw, Ty, Str, Pu, Section, List } from "@/components/code/tokens";
import { settingsApi, skillsApi, resumeApi, API_URL } from "@/lib/api";

const SKILL_LABELS = {
  LANGUAGE: "languages",
  FRAMEWORK: "frameworks",
  DATABASE: "databases",
  TOOL: "tools",
  PLATFORM: "platforms",
};

function slugify(text) {
  return text
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("")
    .replace(/[^a-zA-Z0-9]/g, "");
}

export default function ResumeTerminal({ className = "" }) {
  const [settings, setSettings] = useState(null);
  const [skills, setSkills] = useState(null);
  const [experience, setExperience] = useState(null);
  const [education, setEducation] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([settingsApi.list(), skillsApi.list(), resumeApi.listExperience(), resumeApi.listEducation()])
      .then(([s, sk, exp, edu]) => {
        if (cancelled) return;
        setSettings(s);
        setSkills(sk);
        setExperience(exp);
        setEducation(edu);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const s = settings || {};
  const resumeUrl = s.resume_url || null;
  const competencies = s.resume_competencies
    ? s.resume_competencies.split(",").map((c) => c.trim()).filter(Boolean)
    : [];

  const skillsByCategory = (skills || []).reduce((acc, skill) => {
    (acc[skill.category] ||= []).push(skill.name);
    return acc;
  }, {});

  return (
    <TerminalWindow title="resume.go" className={className}>
      <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
        <Cm>{"// resume.go"}</Cm>
        {"\n"}
        <Kw>package</Kw> devprince

        <Section heading="profile">
          <Kw>func</Kw> <Ty>Profile</Ty>
          <Pu>{"() Info {"}</Pu>
          {"\n"}
          {"    "}
          <Kw>return</Kw> <Ty>Info</Ty>
          <Pu>{"{"}</Pu>
          {"\n"}
          {"        "}Name:     <Str>&quot;{s.profile_name || "Your Name"}&quot;</Str>,{"\n"}
          {"        "}Title:    <Str>&quot;{s.resume_title || s.tagline || "Your Title"}&quot;</Str>,{"\n"}
          {"        "}Location: <Str>&quot;{s.location || "Your Location"}&quot;</Str>,{"\n"}
          {s.phone && (
            <>
              {"        "}Phone:    <Str>&quot;{s.phone}&quot;</Str>,{"\n"}
            </>
          )}
          {s.social_email && (
            <>
              {"        "}Email:    <Str>&quot;{s.social_email}&quot;</Str>,{"\n"}
            </>
          )}
          {"    "}
          <Pu>{"}"}</Pu>
          {"\n"}
          <Pu>{"}"}</Pu>
        </Section>

        {Object.keys(skillsByCategory).length > 0 && (
          <Section heading="skills">
            <Kw>func</Kw> <Ty>Skills</Ty>
            <Pu>{"() map[string][]string {"}</Pu>
            {"\n"}
            {"    "}
            <Kw>return</Kw> <Ty>map[string][]string</Ty>
            <Pu>{"{"}</Pu>
            {"\n"}
            {Object.entries(skillsByCategory).map(([cat, names]) => (
              <span key={cat}>
                {"        "}
                <Str>&quot;{SKILL_LABELS[cat] || cat.toLowerCase()}&quot;</Str>: <List items={names} />,{"\n"}
              </span>
            ))}
            {"    "}
            <Pu>{"}"}</Pu>
            {"\n"}
            <Pu>{"}"}</Pu>
          </Section>
        )}

        {experience?.length > 0 && (
          <Section heading="experience">
            {experience.map((exp, i) => (
              <span key={exp.id}>
                {i > 0 && "\n\n"}
                <Kw>func</Kw> <Ty>{slugify(exp.company)}</Ty>
                <Pu>{"() Experience {"}</Pu>
                {"\n"}
                {"    "}
                <Kw>return</Kw> <Ty>Experience</Ty>
                <Pu>{"{"}</Pu>
                {"\n"}
                {"        "}Company: <Str>&quot;{exp.company}&quot;</Str>,{"\n"}
                {"        "}Role:    <Str>&quot;{exp.role}&quot;</Str>,{"\n"}
                {"        "}Period:  <Str>&quot;{exp.period}&quot;</Str>,{"\n"}
                {"    "}
                <Pu>{"}"}</Pu>
                {"\n"}
                <Pu>{"}"}</Pu>
              </span>
            ))}
          </Section>
        )}
      </pre>

      {experience?.some((exp) => exp.bullets?.length > 0) && (
        <div className="mt-2 space-y-5">
          {experience
            .filter((exp) => exp.bullets?.length > 0)
            .map((exp) => (
              <div key={exp.id}>
                <p className="text-xs font-semibold text-term-gold">
                  {exp.role} &middot; {exp.company}
                </p>
                <ul className="mt-1.5 list-disc space-y-1 pl-5 text-xs text-term-silver">
                  {exp.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      )}

      {education?.length > 0 && (
        <div className="mt-6 border-t border-term-border pt-5">
          <p className="text-xs uppercase tracking-widest text-term-silver-dim">{"// education"}</p>
          <div className="mt-3 space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="flex items-baseline justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-term-white">{edu.degree}</p>
                  <p className="text-xs text-term-silver-dim">
                    {edu.school}
                    {edu.location && ` — ${edu.location}`}
                  </p>
                </div>
                {edu.period && <span className="shrink-0 text-xs text-term-silver-dim">{edu.period}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {competencies.length > 0 && (
        <div className="mt-6 border-t border-term-border pt-5">
          <p className="text-xs uppercase tracking-widest text-term-silver-dim">{"// core competencies"}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {competencies.map((c) => (
              <span
                key={c}
                className="rounded-full border border-term-border bg-term-bg px-3 py-1 text-xs font-semibold text-term-white"
              >
                {c}
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
