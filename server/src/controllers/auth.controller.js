const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const prisma = require("../lib/prisma");
const { logAction } = require("../lib/audit");

const PENDING_COOKIE = "pending_session";
const SESSION_COOKIE = "session";
const PENDING_TTL = "5m";
const SESSION_TTL = "7d";

// Driven by an explicit flag rather than NODE_ENV: a "Secure" cookie is silently
// dropped by browsers over plain HTTP, and NODE_ENV is easy to have polluted by
// the host shell/environment, which would break login without any visible error.
const secureCookies = process.env.COOKIE_SECURE === "true";
const cookieBase = {
  httpOnly: true,
  secure: secureCookies,
  sameSite: "lax",
  path: "/",
};

async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const admin = await prisma.adminUser.findUnique({ where: { email } });
  const valid = admin && (await bcrypt.compare(password, admin.passwordHash));
  if (!valid) {
    await logAction("login_failed", email);
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const pendingToken = jwt.sign(
    { sub: admin.id, stage: "pending2fa" },
    process.env.JWT_SECRET,
    { expiresIn: PENDING_TTL }
  );

  res.cookie(PENDING_COOKIE, pendingToken, {
    ...cookieBase,
    maxAge: 5 * 60 * 1000,
  });

  return res.json({ requires2fa: true });
}

async function verifyTwoFactor(req, res) {
  const { code } = req.body || {};
  const pendingToken = req.cookies?.[PENDING_COOKIE];

  if (!pendingToken) {
    return res.status(401).json({ error: "No pending login" });
  }
  if (!code) {
    return res.status(400).json({ error: "2FA code is required" });
  }

  let payload;
  try {
    payload = jwt.verify(pendingToken, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ error: "Pending login expired, log in again" });
  }

  const admin = await prisma.adminUser.findUnique({ where: { id: payload.sub } });
  if (!admin) {
    return res.status(401).json({ error: "Account not found" });
  }

  const verified = speakeasy.totp.verify({
    secret: admin.totpSecret,
    encoding: "base32",
    token: code,
    window: 1,
  });

  if (!verified) {
    await logAction("2fa_failed", admin.email);
    return res.status(401).json({ error: "Invalid 2FA code" });
  }

  const sessionToken = jwt.sign(
    { sub: admin.id, email: admin.email, sv: admin.sessionVersion },
    process.env.JWT_SECRET,
    { expiresIn: SESSION_TTL }
  );

  res.clearCookie(PENDING_COOKIE, cookieBase);
  res.cookie(SESSION_COOKIE, sessionToken, {
    ...cookieBase,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  await logAction("login_success", admin.email);
  return res.json({ email: admin.email });
}

async function logout(req, res) {
  res.clearCookie(SESSION_COOKIE, cookieBase);
  res.clearCookie(PENDING_COOKIE, cookieBase);
  return res.status(204).send();
}

// Invalidates every outstanding session (this device and any other) by
// bumping sessionVersion — existing JWTs carry the old version and fail the
// requireAuth check from then on, even though they haven't expired yet.
async function logoutAll(req, res) {
  await prisma.adminUser.update({
    where: { id: req.admin.sub },
    data: { sessionVersion: { increment: 1 } },
  });
  res.clearCookie(SESSION_COOKIE, cookieBase);
  await logAction("logout_all", req.admin.email);
  return res.status(204).send();
}

async function me(req, res) {
  return res.json({ email: req.admin.email });
}

module.exports = { login, verifyTwoFactor, logout, logoutAll, me };
