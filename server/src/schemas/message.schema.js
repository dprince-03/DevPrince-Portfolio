const { z } = require("zod");

const createMessageSchema = z
  .object({
    firstName: z.string().min(1).max(60),
    lastName: z.string().min(1).max(60),
    channel: z.enum(["WHATSAPP", "EMAIL"]),
    phone: z.string().max(30).optional(),
    email: z.string().email().max(200).optional(),
    purpose: z.enum(["HIRE", "CONSULT"]),
    message: z.string().max(4000).optional().default(""),
  })
  .refine((data) => (data.channel === "WHATSAPP" ? Boolean(data.phone) : Boolean(data.email)), {
    message: "phone is required for the WhatsApp channel, email is required for the Email channel",
  });

module.exports = { createMessageSchema };
