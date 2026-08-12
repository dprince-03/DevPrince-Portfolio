const { z } = require("zod");

const pageviewSchema = z.object({
  path: z.string().min(1).max(300),
  referrer: z.string().max(500).optional().nullable(),
});

module.exports = { pageviewSchema };
