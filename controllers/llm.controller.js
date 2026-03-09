const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.summarizeText = async (req, res) => {
  try {
    let { text } = req.body;
    text = String(text || "").trim();
    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Text is required",
      });
    }

    if (text.length < 50) {
      return res.status(400).json({
        success: false,
        message: "Text must be at least 50 characters",
      });
    }

    if (text.length > 8000) {
      return res.status(413).json({
        success: false,
        message: "Text too large (max 8000 characters)",
      });
    }

    const workingModels = [
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-2.5-pro",
    ];

    let result, usedModel;

    for (const modelName of workingModels) {
      try {
        const geminiModel = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            temperature: 0.1,
            topK: 32,
            topP: 0.95,
            maxOutputTokens: 800,
          },
        });

        const prompt = `Summarize this text into 3-6 concise bullet points. 
Be professional, factual, and brief (max 20 words per point):

${text}`;

        result = await geminiModel.generateContent(prompt);

        if (result.response?.text()) {
          usedModel = modelName;
          console.log(`LLM summary generated using model: ${modelName}`);
          break;
        }
      } catch (modelError) {
        console.warn(
          `LLM model "${modelName}" failed. Attempting fallback model...`,
        );
        continue;
      }
    }

    if (!result?.response?.text()) {
      return res.status(503).json({
        success: false,
        message: "LLM service temporarily unavailable",
        modelsTried: workingModels,
      });
    }

    let summary = result.response.text().trim();

    // Remove markdown formatting
    summary = summary
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/_(.*?)_/g, "$1");
    // Normalize bullet points
    summary = summary
      .split("\n")
      .map((line) => {
        line = line.trim();
        if (!line) return null;
        line = line.replace(/^[•\-\*\+]\s*/, "");
        return `• ${line}`;
      })
      .filter(Boolean)
      .join("\n");
    const words = summary.split(/\s+/);

    if (words.length > 120) {
      summary = words.slice(0, 120).join(" ") + "...";
    }
    res.status(200).json({
      success: true,
      summary,
      model: usedModel,
    });
  } catch (error) {
    console.error("LLM ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate summary",
    });
  }
};
