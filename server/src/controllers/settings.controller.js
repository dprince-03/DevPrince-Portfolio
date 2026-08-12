const prisma = require("../lib/prisma");
const { logAction } = require("../lib/audit");

async function list(req, res) {
  const rows = await prisma.siteSetting.findMany();
  const settings = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  res.json(settings);
}

async function update(req, res) {
  const entries = Object.entries(req.body);
  await prisma.$transaction(
    entries.map(([key, value]) =>
      prisma.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } })
    )
  );
  await logAction("settings_updated", entries.map(([k]) => k).join(", "));
  const rows = await prisma.siteSetting.findMany();
  res.json(Object.fromEntries(rows.map((r) => [r.key, r.value])));
}

module.exports = { list, update };
