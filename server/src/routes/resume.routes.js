const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const validate = require("../middleware/validate");
const {
  createExperienceSchema,
  updateExperienceSchema,
  createEducationSchema,
  updateEducationSchema,
} = require("../schemas/resume.schema");
const controller = require("../controllers/resume.controller");

const router = express.Router();

router.get("/experience", controller.listExperience);
router.post("/experience", requireAuth, validate(createExperienceSchema), controller.createExperience);
router.put("/experience/:id", requireAuth, validate(updateExperienceSchema), controller.updateExperience);
router.delete("/experience/:id", requireAuth, controller.removeExperience);

router.get("/education", controller.listEducation);
router.post("/education", requireAuth, validate(createEducationSchema), controller.createEducation);
router.put("/education/:id", requireAuth, validate(updateEducationSchema), controller.updateEducation);
router.delete("/education/:id", requireAuth, controller.removeEducation);

module.exports = router;
