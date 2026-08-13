const { z } = require("zod");

const createMessageSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  message: z.string().min(1).max(4000),
});

module.exports = { createMessageSchema };
