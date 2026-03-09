const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    topic: {
      type: String,
      required: true,
    },

    summary: {
      type: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Session", sessionSchema);
