const express = require("express");

const router = express.Router();

const bookingController = require("../controllers/booking.controller");

const { authToken } = require("../middleware/auth.middleware");
const { allowRoles } = require("../middleware/role.middleware");

router.post(
  "/",
  authToken,
  allowRoles("parent"),
  bookingController.createBooking,
);

module.exports = router;
