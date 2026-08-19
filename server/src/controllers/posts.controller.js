const prisma = require("../lib/prisma");
const { logAction } = require("../lib/audit");

async function list(req, res) {
  const posts = await prisma.socialPost.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
  res.json(posts);
}

async function create(req, res) {
  const post = await prisma.socialPost.create({ data: req.body });
  await logAction("post_created", `${post.platform}: ${post.url}`);
  res.status(201).json(post);
}

async function update(req, res) {
  const post = await prisma.socialPost
    .update({ where: { id: req.params.id }, data: req.body })
    .catch(() => null);
  if (!post) return res.status(404).json({ error: "Post not found" });
  await logAction("post_updated", `${post.platform}: ${post.url}`);
  return res.json(post);
}

async function remove(req, res) {
  const post = await prisma.socialPost.delete({ where: { id: req.params.id } }).catch(() => null);
  if (post) await logAction("post_deleted", `${post.platform}: ${post.url}`);
  res.status(204).send();
}

module.exports = { list, create, update, remove };
