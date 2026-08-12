const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const validate = require("../middleware/validate");
const { createProjectSchema, updateProjectSchema } = require("../schemas/project.schema");
const controller = require("../controllers/projects.controller");
const docsRouter = require("./docs.routes");

const router = express.Router();

router.get("/", controller.list);
router.get("/:slug", controller.getBySlug);
router.post("/", requireAuth, validate(createProjectSchema), controller.create);
router.put("/:id", requireAuth, validate(updateProjectSchema), controller.update);
router.delete("/:id", requireAuth, controller.remove);

router.use("/:projectId/docs", docsRouter);

module.exports = router;
