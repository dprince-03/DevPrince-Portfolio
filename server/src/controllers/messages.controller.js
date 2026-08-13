const prisma = require("../lib/prisma");

async function create(req, res) {
  const message = await prisma.contactMessage.create({ data: req.body });
  res.status(201).json({ id: message.id });
}

async function list(req, res) {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  res.json(messages);
}

async function markRead(req, res) {
  const message = await prisma.contactMessage
    .update({ where: { id: req.params.id }, data: { read: req.body?.read ?? true } })
    .catch(() => null);
  if (!message) return res.status(404).json({ error: "Message not found" });
  return res.json(message);
}

module.exports = { create, list, markRead };
