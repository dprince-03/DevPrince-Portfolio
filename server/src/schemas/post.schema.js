const { z } = require("zod");

const platformEnum = z.enum(["X", "LINKEDIN"]);

const createPostSchema = z.object({
  platform: platformEnum,
  url: z.string().url().max(500),
  order: z.number().int().optional().default(0),
});

const updatePostSchema = createPostSchema.partial();

module.exports = { createPostSchema, updatePostSchema };
