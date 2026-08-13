const prisma = require("../lib/prisma");

async function exportSite(req, res) {
  const [projects, skills, settings] = await Promise.all([
    prisma.project.findMany({ include: { docs: true }, orderBy: { order: "asc" } }),
    prisma.skill.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] }),
    prisma.siteSetting.findMany(),
  ]);

  const payload = {
    exportedAt: new Date().toISOString(),
    projects,
    skills,
    settings: Object.fromEntries(settings.map((s) => [s.key, s.value])),
  };

  res.setHeader("Content-Disposition", "attachment; filename=portfolio-export.json");
  res.json(payload);
}

module.exports = { exportSite };
