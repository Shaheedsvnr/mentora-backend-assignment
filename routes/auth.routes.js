const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth.controller");
const { authToken } = require("../middleware/auth.middleware");

router.post("/signup", authController.signup);

router.post("/login", authController.login);

router.get("/me", authToken, authController.me);

module.exports = router;
