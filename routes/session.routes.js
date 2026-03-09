const express = require("express");
const router = express.Router();

const sessionController = require("../controllers/session.controller");
const { authToken } = require("../middleware/auth.middleware");

// create session
router.post("/", authToken, sessionController.createSession);

// get sessions of a lesson
router.get("/lesson/:id", sessionController.getLessonSessions);

module.exports = router;
