const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const { summarizeText } = require("../controllers/llm.controller");
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many requests. Try again in 1 minute.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
router.post("/summarize", limiter, summarizeText);

module.exports = router;
