const prisma = require("./prisma");

async function logAction(action, detail = "") {
  try {
    await prisma.auditLog.create({ data: { action, detail } });
  } catch (err) {
    // Auditing must never break the request it's logging.
    console.error("[audit] failed to record", action, err);
  }
}

module.exports = { logAction };
