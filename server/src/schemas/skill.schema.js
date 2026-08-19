const { z } = require("zod");

const categoryEnum = z.enum(["LANGUAGE", "FRAMEWORK", "DATABASE", "TOOL", "PLATFORM"]);

const createSkillSchema = z.object({
  name: z.string().min(1).max(60),
  category: categoryEnum,
  slug: z.string().max(60).optional().default(""),
  order: z.number().int().optional().default(0),
});

const updateSkillSchema = createSkillSchema.partial();

module.exports = { createSkillSchema, updateSkillSchema };
