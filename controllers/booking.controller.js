const Booking = require("../models/booking.model");
const Student = require("../models/student.model");
const Lesson = require("../models/lesson.model");

exports.createBooking = async (req, res) => {
  try {
    const { studentId, lessonId } = req.body;

    if (!studentId || !lessonId) {
      return res.status(400).json({
        success: false,
        message: "studentId and lessonId required",
      });
    }

    const student = await Student.findById(studentId);

    if (!student || student.parentId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Student does not belong to this parent",
      });
    }

    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    const booking = await Booking.create({
      studentId,
      lessonId,
    });

    res.status(201).json({
      success: true,
      message: "Lesson booked successfully",
      data: booking,
    });

  } catch (error) {
    console.error("Booking Error:", error);

    res.status(500).json({
      success: false,
      message: "Booking failed",
    });
  }
};