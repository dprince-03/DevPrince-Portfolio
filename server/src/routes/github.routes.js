const express = require("express");
const controller = require("../controllers/github.controller");

const router = express.Router();

// Public — proxies GitHub's GraphQL API using a server-side token so the
// token itself never reaches the browser.
router.get("/contributions", controller.contributions);

module.exports = router;
