const prisma = require("../lib/prisma");

async function list(req, res) {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  res.json(logs);
}

module.exports = { list };
