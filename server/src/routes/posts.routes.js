const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const validate = require("../middleware/validate");
const { createPostSchema, updatePostSchema } = require("../schemas/post.schema");
const controller = require("../controllers/posts.controller");

const router = express.Router();

router.get("/", controller.list);
router.post("/", requireAuth, validate(createPostSchema), controller.create);
router.put("/:id", requireAuth, validate(updatePostSchema), controller.update);
router.delete("/:id", requireAuth, controller.remove);

module.exports = router;
