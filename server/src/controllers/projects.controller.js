const prisma = require("../lib/prisma");
const { logAction } = require("../lib/audit");

async function list(req, res) {
  const projects = await prisma.project.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  res.json(projects);
}

async function getBySlug(req, res) {
  const project = await prisma.project.findUnique({
    where: { slug: req.params.slug },
    include: { docs: { orderBy: { order: "asc" } } },
  });
  if (!project) return res.status(404).json({ error: "Project not found" });
  return res.json(project);
}

async function create(req, res) {
  const project = await prisma.project.create({ data: req.body });
  await logAction("project_created", project.title);
  res.status(201).json(project);
}

async function update(req, res) {
  const project = await prisma.project
    .update({ where: { id: req.params.id }, data: req.body })
    .catch(() => null);
  if (!project) return res.status(404).json({ error: "Project not found" });
  await logAction("project_updated", project.title);
  return res.json(project);
}

async function remove(req, res) {
  const project = await prisma.project.delete({ where: { id: req.params.id } }).catch(() => null);
  if (project) await logAction("project_deleted", project.title);
  res.status(204).send();
}

module.exports = { list, getBySlug, create, update, remove };
