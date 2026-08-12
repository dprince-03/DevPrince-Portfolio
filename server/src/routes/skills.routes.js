const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const validate = require("../middleware/validate");
const { createSkillSchema, updateSkillSchema } = require("../schemas/skill.schema");
const controller = require("../controllers/skills.controller");

const router = express.Router();

router.get("/", controller.list);
router.post("/", requireAuth, validate(createSkillSchema), controller.create);
router.put("/:id", requireAuth, validate(updateSkillSchema), controller.update);
router.delete("/:id", requireAuth, controller.remove);

module.exports = router;
