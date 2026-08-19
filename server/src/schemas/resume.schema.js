const { z } = require("zod");

const createExperienceSchema = z.object({
  company: z.string().min(1).max(120),
  role: z.string().min(1).max(120),
  location: z.string().max(120).optional().default(""),
  period: z.string().min(1).max(80),
  bullets: z.array(z.string().min(1).max(500)).optional().default([]),
  order: z.number().int().optional().default(0),
});

const updateExperienceSchema = createExperienceSchema.partial();

const createEducationSchema = z.object({
  school: z.string().min(1).max(120),
  degree: z.string().min(1).max(120),
  location: z.string().max(120).optional().default(""),
  period: z.string().max(80).optional().default(""),
  order: z.number().int().optional().default(0),
});

const updateEducationSchema = createEducationSchema.partial();

module.exports = {
  createExperienceSchema,
  updateExperienceSchema,
  createEducationSchema,
  updateEducationSchema,
};
