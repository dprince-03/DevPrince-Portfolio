const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const { list, markRead } = require("../controllers/messages.controller");

const router = express.Router();

router.get("/", requireAuth, list);
router.patch("/:id", requireAuth, markRead);

module.exports = router;
