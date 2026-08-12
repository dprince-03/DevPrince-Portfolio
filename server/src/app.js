const path = require("node:path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");

const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes");
const projectsRoutes = require("./routes/projects.routes");
const contactRoutes = require("./routes/contact.routes");
const messagesRoutes = require("./routes/messages.routes");
const skillsRoutes = require("./routes/skills.routes");
const settingsRoutes = require("./routes/settings.routes");
const mediaRoutes = require("./routes/media.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const exportRoutes = require("./routes/export.routes");
const activityRoutes = require("./routes/activity.routes");
const errorHandler = require("./middleware/errorHandler");
const { authLimiter } = require("./middleware/rateLimit");
const { UPLOAD_DIR } = require("./lib/upload");

const app = express();

// Needed so req.ip reflects the real client IP behind the nginx reverse
// proxy in prod (X-Forwarded-For), not nginx's own address — matters for
// analytics geo lookups and rate limiting.
app.set("trust proxy", 1);

app.use(
  helmet({
    // Media files are fetched cross-origin by the Next.js client (different
    // port in dev, same-origin-through-nginx in prod but still a distinct
    // request context) — the default same-origin policy would block that.
    crossOriginResourcePolicy: { policy: "cross-origin" },
    // Keep the default CSP rather than disabling it: it's inert for the JSON
    // API responses, but it's real protection for /uploads — we accept SVG
    // uploads, and a standalone SVG can embed <script>, so a strict
    // default-src/script-src still matters if one is ever linked to directly.
  })
);

// Any localhost/127.0.0.1 origin is allowed in addition to CLIENT_ORIGIN,
// regardless of environment: a real attacker can't forge a browser's Origin
// header to say "localhost" against a deployed prod server (the browser sets
// it from the actual page origin), so this only ever matters for local dev —
// where the client's port is not guaranteed to stay 3000 if something else on
// the machine is already using it.
const LOCALHOST_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin === process.env.CLIENT_ORIGIN || LOCALHOST_ORIGIN.test(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));
app.use("/uploads", express.static(UPLOAD_DIR));

app.use("/api/health", healthRoutes);
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/activity", activityRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use(errorHandler);

module.exports = app;
