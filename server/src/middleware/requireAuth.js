const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");

async function requireAuth(req, res, next) {
  const token = req.cookies?.session;
  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ error: "Invalid or expired session" });
  }

  // sv (sessionVersion) lets a "log out everywhere" action invalidate every
  // outstanding token immediately, without a server-side session store.
  const admin = await prisma.adminUser.findUnique({
    where: { id: payload.sub },
    select: { sessionVersion: true },
  });
  if (!admin || admin.sessionVersion !== payload.sv) {
    return res.status(401).json({ error: "Session revoked, log in again" });
  }

  req.admin = payload;
  return next();
}

module.exports = requireAuth;
