const Lesson = require("../models/lesson.model");
exports.createLesson = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    const lesson = await Lesson.create({
      title: title.trim(),
      description: description.trim(),
      mentorId: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Lesson created successfully",
      data: lesson,
    });
  } catch (error) {
    console.error("Create Lesson Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create lesson",
    });
  }
};

exports.getLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find()
      .populate("mentorId", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: lessons.length,
      data: lessons,
    });
  } catch (error) {
    console.error("Get Lessons Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch lessons",
    });
  }
};
