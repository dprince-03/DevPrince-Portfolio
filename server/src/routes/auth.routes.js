const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const { login, verifyTwoFactor, logout, logoutAll, me } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/login", login);
router.post("/2fa", verifyTwoFactor);
router.post("/logout", logout);
router.post("/logout-all", requireAuth, logoutAll);
router.get("/me", requireAuth, me);

module.exports = router;
