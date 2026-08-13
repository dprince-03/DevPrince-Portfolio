const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const { upload } = require("../lib/upload");
const controller = require("../controllers/media.controller");

const router = express.Router();

router.get("/", requireAuth, controller.list);
router.post("/", requireAuth, upload.single("file"), controller.upload);
router.delete("/:id", requireAuth, controller.remove);

module.exports = router;
