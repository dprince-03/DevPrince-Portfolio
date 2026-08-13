const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const validate = require("../middleware/validate");
const { createDocSchema, updateDocSchema } = require("../schemas/doc.schema");
const controller = require("../controllers/docs.controller");

// mergeParams: true so :projectId from the parent router (projects.routes.js) is visible here
const router = express.Router({ mergeParams: true });

router.get("/", controller.list);
router.post("/", requireAuth, validate(createDocSchema), controller.create);
router.put("/:docId", requireAuth, validate(updateDocSchema), controller.update);
router.delete("/:docId", requireAuth, controller.remove);

module.exports = router;
