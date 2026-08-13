const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const { exportSite } = require("../controllers/export.controller");

const router = express.Router();

router.get("/", requireAuth, exportSite);

module.exports = router;
