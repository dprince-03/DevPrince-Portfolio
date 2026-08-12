const { z } = require("zod");

const typeEnum = z.enum(["FILE", "FOLDER"]);

const createDocSchema = z.object({
  parentId: z.string().optional().nullable(),
  name: z.string().min(1).max(120),
  type: typeEnum,
  content: z.string().max(20000).optional().default(""),
  order: z.number().int().optional().default(0),
});

const updateDocSchema = createDocSchema.partial();

module.exports = { createDocSchema, updateDocSchema };
