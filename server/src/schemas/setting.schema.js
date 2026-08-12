const { z } = require("zod");

// Body is an arbitrary set of key/value pairs to upsert, e.g.
// { "tagline": "...", "resume_url": "...", "social_github": "..." }
const updateSettingsSchema = z.record(z.string().max(60), z.string().max(2000));

module.exports = { updateSettingsSchema };
