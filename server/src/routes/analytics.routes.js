const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const validate = require("../middleware/validate");
const { pageviewSchema } = require("../schemas/analytics.schema");
const { trackPageview, summary } = require("../controllers/analytics.controller");

const router = express.Router();

router.post("/pageview", validate(pageviewSchema), trackPageview);
router.get("/summary", requireAuth, summary);

module.exports = router;
