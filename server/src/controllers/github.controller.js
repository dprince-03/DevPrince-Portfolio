const prisma = require("../lib/prisma");

// In-memory cache — contribution data doesn't need to be fresher than this,
// and it keeps a portfolio-scale trickle of visitors well under GitHub's
// GraphQL rate limit.
const CACHE_TTL_MS = 60 * 60 * 1000;
let cache = { key: null, data: null, expiresAt: 0 };

const QUERY = `
  query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`;

async function contributions(req, res) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return res.status(503).json({ error: "GitHub contributions not configured (GITHUB_TOKEN missing)" });
  }

  const setting = await prisma.siteSetting.findUnique({ where: { key: "github_username" } });
  const username = setting?.value;
  if (!username) {
    return res.status(404).json({ error: "github_username not set" });
  }

  if (cache.key === username && cache.expiresAt > Date.now()) {
    return res.json(cache.data);
  }

  const ghRes = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query: QUERY, variables: { login: username } }),
  });

  if (!ghRes.ok) {
    return res.status(502).json({ error: "GitHub API request failed" });
  }

  const body = await ghRes.json();
  const calendar = body?.data?.user?.contributionsCollection?.contributionCalendar;
  if (!calendar) {
    return res.status(502).json({ error: "Unexpected GitHub API response" });
  }

  const days = calendar.weeks.flatMap((w) => w.contributionDays);

  // Consecutive-day streak ending today; if today has no contributions yet
  // (the day isn't over), that alone doesn't break a streak still active
  // through yesterday.
  let i = days.length - 1;
  if (days[i]?.contributionCount === 0) i--;
  let currentStreak = 0;
  for (; i >= 0; i--) {
    if (days[i].contributionCount > 0) currentStreak++;
    else break;
  }

  const data = { totalContributions: calendar.totalContributions, weeks: calendar.weeks, currentStreak };
  cache = { key: username, data, expiresAt: Date.now() + CACHE_TTL_MS };
  res.json(data);
}

module.exports = { contributions };
