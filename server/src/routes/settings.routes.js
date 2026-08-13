const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const validate = require("../middleware/validate");
const { updateSettingsSchema } = require("../schemas/setting.schema");
const controller = require("../controllers/settings.controller");

const router = express.Router();

router.get("/", controller.list);
router.put("/", requireAuth, validate(updateSettingsSchema), controller.update);

module.exports = router;
