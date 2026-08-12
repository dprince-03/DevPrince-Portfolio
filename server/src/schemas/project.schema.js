const { z } = require("zod");

const statusEnum = z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETE"]);

const createProjectSchema = z.object({
  title: z.string().min(1).max(120),
  slug: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "slug must be lowercase, hyphen-separated"),
  summary: z.string().min(1).max(280),
  description: z.string().max(5000).optional().default(""),
  techStack: z.array(z.string().max(40)).max(30).optional().default([]),
  repoUrl: z.string().url().optional().nullable(),
  liveUrl: z.string().url().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  status: statusEnum.optional().default("NOT_STARTED"),
  featured: z.boolean().optional().default(false),
  order: z.number().int().optional().default(0),
});

const updateProjectSchema = createProjectSchema.partial();

module.exports = { createProjectSchema, updateProjectSchema };
