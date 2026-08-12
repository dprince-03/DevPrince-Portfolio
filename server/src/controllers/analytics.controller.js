const crypto = require("node:crypto");
const geoip = require("geoip-lite");
const prisma = require("../lib/prisma");

const VISITOR_COOKIE = "visitor_id";
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;
const secureCookies = process.env.COOKIE_SECURE === "true";

// Anonymous, not the admin session cookie — just enough to dedupe unique
// visitors. No raw IP is ever persisted (see Visit model / security test.md §11).
function getOrSetVisitorId(req, res) {
  let id = req.cookies?.[VISITOR_COOKIE];
  if (!id) {
    id = crypto.randomUUID();
    res.cookie(VISITOR_COOKIE, id, {
      httpOnly: true,
      secure: secureCookies,
      sameSite: "lax",
      path: "/",
      maxAge: ONE_YEAR_MS,
    });
  }
  return id;
}

async function trackPageview(req, res) {
  const cookieId = getOrSetVisitorId(req, res);
  const ip = (req.ip || "").replace("::ffff:", "");
  const geo = ip ? geoip.lookup(ip) : null;

  await prisma.visit.create({
    data: {
      cookieId,
      path: req.body.path,
      referrer: req.body.referrer || null,
      userAgent: req.headers["user-agent"] || null,
      country: geo?.country || null,
    },
  });

  res.status(204).send();
}

async function summary(req, res) {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [totalVisits, recentVisits, topPaths, topReferrers, countries] = await Promise.all([
    prisma.visit.count(),
    prisma.visit.findMany({
      where: { createdAt: { gte: since } },
      select: { cookieId: true, createdAt: true },
    }),
    prisma.visit.groupBy({
      by: ["path"],
      _count: { path: true },
      orderBy: { _count: { path: "desc" } },
      take: 10,
    }),
    prisma.visit.groupBy({
      by: ["referrer"],
      _count: { referrer: true },
      where: { referrer: { not: null } },
      orderBy: { _count: { referrer: "desc" } },
      take: 10,
    }),
    prisma.visit.groupBy({
      by: ["country"],
      _count: { country: true },
      where: { country: { not: null } },
      orderBy: { _count: { country: "desc" } },
    }),
  ]);

  const byDay = {};
  for (const visit of recentVisits) {
    const day = visit.createdAt.toISOString().slice(0, 10);
    byDay[day] = (byDay[day] || 0) + 1;
  }

  res.json({
    totalVisits,
    last30Days: {
      visits: recentVisits.length,
      uniqueVisitors: new Set(recentVisits.map((v) => v.cookieId)).size,
      byDay,
    },
    topPaths: topPaths.map((p) => ({ path: p.path, count: p._count.path })),
    topReferrers: topReferrers.map((r) => ({ referrer: r.referrer, count: r._count.referrer })),
    countries: countries.map((c) => ({ country: c.country, count: c._count.country })),
  });
}

module.exports = { trackPageview, summary };
