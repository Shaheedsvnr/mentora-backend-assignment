const express = require("express");

const router = express.Router();

const studentController = require("../controllers/student.controller");

const { authToken } = require("../middleware/auth.middleware");
const { allowRoles } = require("../middleware/role.middleware");

router.post(
  "/",
  authToken,
  allowRoles("parent"),
  studentController.createStudent,
);

router.get("/", authToken, allowRoles("parent"), studentController.getStudents);

module.exports = router;
