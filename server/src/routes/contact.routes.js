const express = require("express");
const validate = require("../middleware/validate");
const { contactLimiter } = require("../middleware/rateLimit");
const { createMessageSchema } = require("../schemas/message.schema");
const { create } = require("../controllers/messages.controller");

const router = express.Router();

router.post("/", contactLimiter, validate(createMessageSchema), create);

module.exports = router;
