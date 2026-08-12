const prisma = require("../lib/prisma");
const { logAction } = require("../lib/audit");

async function list(req, res) {
  const skills = await prisma.skill.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] });
  res.json(skills);
}

async function create(req, res) {
  const skill = await prisma.skill.create({ data: req.body });
  await logAction("skill_created", skill.name);
  res.status(201).json(skill);
}

async function update(req, res) {
  const skill = await prisma.skill
    .update({ where: { id: req.params.id }, data: req.body })
    .catch(() => null);
  if (!skill) return res.status(404).json({ error: "Skill not found" });
  await logAction("skill_updated", skill.name);
  return res.json(skill);
}

async function remove(req, res) {
  const skill = await prisma.skill.delete({ where: { id: req.params.id } }).catch(() => null);
  if (skill) await logAction("skill_deleted", skill.name);
  res.status(204).send();
}

module.exports = { list, create, update, remove };
