const Student = require("../models/student.model");

// Create Student (Parent Only)
exports.createStudent = async (req, res) => {
  try {
    const { name, age } = req.body;

    // validation
    if (!name || !age) {
      return res.status(400).json({
        success: false,
        message: "Name and age are required",
      });
    }

    if (age <= 0) {
      return res.status(400).json({
        success: false,
        message: "Age must be a valid number",
      });
    }

    const student = await Student.create({
      name: name.trim(),
      age,
      parentId: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student,
    });
  } catch (error) {
    console.error("Create Student Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create student",
    });
  }
};

// Get Students (Parent Only)
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find({ parentId: req.user.id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    console.error("Get Students Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch students",
    });
  }
};
