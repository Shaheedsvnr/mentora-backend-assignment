const Session = require("../models/session.model");
const Lesson = require("../models/lesson.model");

exports.createSession = async (req, res) => {
  try {
    const { lessonId, date, topic, summary } = req.body;
    if (!lessonId || !date || !topic) {
      return res.status(400).json({
        success: false,
        message: "lessonId, date and topic are required",
      });
    }
    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }
    if (lesson.mentorId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to create session for this lesson",
      });
    }
    const session = await Session.create({
      lessonId,
      date,
      topic: topic.trim(),
      summary: summary ? summary.trim() : "",
    });

    return res.status(201).json({
      success: true,
      message: "Session created successfully",
      data: session,
    });
  } catch (error) {
    console.error("Create Session Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create session",
    });
  }
};

exports.getLessonSessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      lessonId: req.params.id,
    }).sort({ date: 1 });

    return res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions,
    });
  } catch (error) {
    console.error("Get Sessions Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch sessions",
    });
  }
};
