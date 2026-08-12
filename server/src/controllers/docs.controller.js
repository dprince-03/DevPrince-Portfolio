const prisma = require("../lib/prisma");
const { logAction } = require("../lib/audit");

async function list(req, res) {
  const docs = await prisma.projectDoc.findMany({
    where: { projectId: req.params.projectId },
    orderBy: { order: "asc" },
  });
  res.json(docs);
}

async function create(req, res) {
  const doc = await prisma.projectDoc.create({
    data: { ...req.body, projectId: req.params.projectId },
  });
  await logAction("doc_created", doc.name);
  res.status(201).json(doc);
}

async function update(req, res) {
  const doc = await prisma.projectDoc
    .update({ where: { id: req.params.docId }, data: req.body })
    .catch(() => null);
  if (!doc) return res.status(404).json({ error: "Doc not found" });
  await logAction("doc_updated", doc.name);
  return res.json(doc);
}

async function remove(req, res) {
  const doc = await prisma.projectDoc.delete({ where: { id: req.params.docId } }).catch(() => null);
  if (doc) await logAction("doc_deleted", doc.name);
  res.status(204).send();
}

module.exports = { list, create, update, remove };
