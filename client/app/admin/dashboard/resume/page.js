"use client";

import { useEffect, useState } from "react";
import { resumeApi, settingsApi } from "@/lib/api";
import AdminSection from "@/components/admin/AdminSection";
import { TextField, TextareaField } from "@/components/admin/fields";
import Button from "@/components/admin/Button";
import { SkeletonTerminalCard } from "@/components/ui/Skeleton";

const EMPTY_EXPERIENCE = { company: "", role: "", location: "", period: "", bullets: "" };
const EMPTY_EDUCATION = { school: "", degree: "", location: "", period: "" };
const RESUME_SETTINGS_FIELDS = [
  { key: "resume_title", label: "resume title (e.g. \"Backend Engineer\")" },
  { key: "resume_competencies", label: "core competencies (comma-separated)" },
];

export default function ResumeAdminPage() {
  const [experience, setExperience] = useState(null);
  const [education, setEducation] = useState(null);
  const [error, setError] = useState("");
  const [expForm, setExpForm] = useState(EMPTY_EXPERIENCE);
  const [eduForm, setEduForm] = useState(EMPTY_EDUCATION);
  const [settingsForm, setSettingsForm] = useState(null);
  const [savingSettings, setSavingSettings] = useState(false);

  function load() {
    resumeApi.listExperience().then(setExperience).catch((err) => setError(err.message));
    resumeApi.listEducation().then(setEducation).catch((err) => setError(err.message));
    settingsApi.list().then(setSettingsForm).catch((err) => setError(err.message));
  }

  useEffect(load, []);

  async function handleSaveSettings(e) {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const updated = await settingsApi.update(settingsForm);
      setSettingsForm(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingSettings(false);
    }
  }

  async function handleAddExperience(e) {
    e.preventDefault();
    if (!expForm.company.trim() || !expForm.role.trim() || !expForm.period.trim()) return;
    try {
      await resumeApi.createExperience({
        ...expForm,
        bullets: expForm.bullets.split("\n").map((b) => b.trim()).filter(Boolean),
        order: experience?.length || 0,
      });
      setExpForm(EMPTY_EXPERIENCE);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleAddEducation(e) {
    e.preventDefault();
    if (!eduForm.school.trim() || !eduForm.degree.trim()) return;
    try {
      await resumeApi.createEducation({ ...eduForm, order: education?.length || 0 });
      setEduForm(EMPTY_EDUCATION);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteExperience(row) {
    try {
      await resumeApi.removeExperience(row.id);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteEducation(row) {
    try {
      await resumeApi.removeEducation(row.id);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-xs uppercase tracking-widest text-term-silver-dim">$ vim resume.json --admin</p>

      {error && <p className="text-sm text-term-red">error: {error}</p>}

      {settingsForm && (
        <AdminSection title="resume-settings.json">
          <form onSubmit={handleSaveSettings} className="space-y-4">
            {RESUME_SETTINGS_FIELDS.map(({ key, label }) => (
              <TextField
                key={key}
                id={key}
                label={label}
                value={settingsForm[key] || ""}
                onChange={(e) => setSettingsForm((f) => ({ ...f, [key]: e.target.value }))}
              />
            ))}
            <Button type="submit" disabled={savingSettings}>
              {savingSettings ? "saving..." : "save"}
            </Button>
          </form>
        </AdminSection>
      )}

      <AdminSection title="add-experience.json">
        <form onSubmit={handleAddExperience} className="grid gap-3 sm:grid-cols-2">
          <TextField
            id="expCompany"
            label="company"
            value={expForm.company}
            onChange={(e) => setExpForm((f) => ({ ...f, company: e.target.value }))}
          />
          <TextField
            id="expRole"
            label="role"
            value={expForm.role}
            onChange={(e) => setExpForm((f) => ({ ...f, role: e.target.value }))}
          />
          <TextField
            id="expLocation"
            label="location"
            value={expForm.location}
            onChange={(e) => setExpForm((f) => ({ ...f, location: e.target.value }))}
          />
          <TextField
            id="expPeriod"
            label={'period (e.g. "Jun 2026 - present")'}
            value={expForm.period}
            onChange={(e) => setExpForm((f) => ({ ...f, period: e.target.value }))}
          />
          <div className="sm:col-span-2">
            <TextareaField
              id="expBullets"
              label="bullets (one per line)"
              rows={4}
              value={expForm.bullets}
              onChange={(e) => setExpForm((f) => ({ ...f, bullets: e.target.value }))}
            />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" variant="ghost">
              + add experience
            </Button>
          </div>
        </form>
      </AdminSection>

      {!experience ? (
        <SkeletonTerminalCard title="experience.json" />
      ) : (
        <AdminSection title="experience.json">
          {experience.length === 0 ? (
            <p className="text-sm text-term-silver-dim">None yet.</p>
          ) : (
            <div className="space-y-3">
              {experience.map((row) => (
                <div key={row.id} className="rounded-md border border-term-border p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-term-white">
                        {row.role} &middot; {row.company}
                      </p>
                      <p className="text-xs text-term-silver-dim">
                        {row.location} {row.location && "—"} {row.period}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteExperience(row)}
                      className="shrink-0 text-xs text-term-red hover:underline"
                    >
                      delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminSection>
      )}

      <AdminSection title="add-education.json">
        <form onSubmit={handleAddEducation} className="grid gap-3 sm:grid-cols-2">
          <TextField
            id="eduSchool"
            label="school"
            value={eduForm.school}
            onChange={(e) => setEduForm((f) => ({ ...f, school: e.target.value }))}
          />
          <TextField
            id="eduDegree"
            label="degree"
            value={eduForm.degree}
            onChange={(e) => setEduForm((f) => ({ ...f, degree: e.target.value }))}
          />
          <TextField
            id="eduLocation"
            label="location"
            value={eduForm.location}
            onChange={(e) => setEduForm((f) => ({ ...f, location: e.target.value }))}
          />
          <TextField
            id="eduPeriod"
            label="period"
            value={eduForm.period}
            onChange={(e) => setEduForm((f) => ({ ...f, period: e.target.value }))}
          />
          <div className="sm:col-span-2">
            <Button type="submit" variant="ghost">
              + add education
            </Button>
          </div>
        </form>
      </AdminSection>

      {!education ? (
        <SkeletonTerminalCard title="education.json" />
      ) : (
        <AdminSection title="education.json">
          {education.length === 0 ? (
            <p className="text-sm text-term-silver-dim">None yet.</p>
          ) : (
            <div className="space-y-3">
              {education.map((row) => (
                <div key={row.id} className="rounded-md border border-term-border p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-term-white">{row.degree}</p>
                      <p className="text-xs text-term-silver-dim">
                        {row.school} {row.location && `— ${row.location}`} {row.period && `— ${row.period}`}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteEducation(row)}
                      className="shrink-0 text-xs text-term-red hover:underline"
                    >
                      delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminSection>
      )}
    </div>
  );
}
