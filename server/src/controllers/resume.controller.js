const prisma = require("../lib/prisma");
const { logAction } = require("../lib/audit");

async function listExperience(req, res) {
  const rows = await prisma.experience.findMany({ orderBy: { order: "asc" } });
  res.json(rows);
}

async function createExperience(req, res) {
  const row = await prisma.experience.create({ data: req.body });
  await logAction("experience_created", `${row.role} @ ${row.company}`);
  res.status(201).json(row);
}

async function updateExperience(req, res) {
  const row = await prisma.experience.update({ where: { id: req.params.id }, data: req.body }).catch(() => null);
  if (!row) return res.status(404).json({ error: "Experience not found" });
  await logAction("experience_updated", `${row.role} @ ${row.company}`);
  return res.json(row);
}

async function removeExperience(req, res) {
  const row = await prisma.experience.delete({ where: { id: req.params.id } }).catch(() => null);
  if (row) await logAction("experience_deleted", `${row.role} @ ${row.company}`);
  res.status(204).send();
}

async function listEducation(req, res) {
  const rows = await prisma.education.findMany({ orderBy: { order: "asc" } });
  res.json(rows);
}

async function createEducation(req, res) {
  const row = await prisma.education.create({ data: req.body });
  await logAction("education_created", `${row.degree} @ ${row.school}`);
  res.status(201).json(row);
}

async function updateEducation(req, res) {
  const row = await prisma.education.update({ where: { id: req.params.id }, data: req.body }).catch(() => null);
  if (!row) return res.status(404).json({ error: "Education not found" });
  await logAction("education_updated", `${row.degree} @ ${row.school}`);
  return res.json(row);
}

async function removeEducation(req, res) {
  const row = await prisma.education.delete({ where: { id: req.params.id } }).catch(() => null);
  if (row) await logAction("education_deleted", `${row.degree} @ ${row.school}`);
  res.status(204).send();
}

module.exports = {
  listExperience,
  createExperience,
  updateExperience,
  removeExperience,
  listEducation,
  createEducation,
  updateEducation,
  removeEducation,
};
