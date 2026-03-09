const express = require("express");

const router = express.Router();

const lessonController = require("../controllers/lesson.controller");

const { authToken } = require("../middleware/auth.middleware");
const { allowRoles } = require("../middleware/role.middleware");

router.post(
  "/",
  authToken,
  allowRoles("mentor"),
  lessonController.createLesson,
);

router.get("/", lessonController.getLessons);

module.exports = router;
