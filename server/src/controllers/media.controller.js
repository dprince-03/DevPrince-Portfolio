const fs = require("node:fs/promises");
const path = require("node:path");
const prisma = require("../lib/prisma");
const { logAction } = require("../lib/audit");
const { UPLOAD_DIR } = require("../lib/upload");

async function list(req, res) {
  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });
  res.json(media);
}

async function upload(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const media = await prisma.media.create({
    data: {
      filename: req.file.originalname,
      url: `/uploads/${req.file.filename}`,
      mimeType: req.file.mimetype,
      size: req.file.size,
    },
  });
  await logAction("media_uploaded", media.filename);
  return res.status(201).json(media);
}

async function remove(req, res) {
  const media = await prisma.media.delete({ where: { id: req.params.id } }).catch(() => null);
  if (!media) return res.status(404).json({ error: "Media not found" });

  const filePath = path.join(UPLOAD_DIR, path.basename(media.url));
  await fs.unlink(filePath).catch(() => {});
  await logAction("media_deleted", media.filename);
  return res.status(204).send();
}

module.exports = { list, upload, remove };
