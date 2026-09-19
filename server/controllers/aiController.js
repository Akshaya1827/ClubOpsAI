const { generateText } = require("../ai/aiService");

const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        message: "A valid message is required",
      });
    }

    const reply = await generateText(message);

    res.status(200).json({
      message: "AI response generated successfully",
      reply,
    });
  } catch (error) {
    console.error("AI controller error:", error.message);

    res.status(500).json({
      message: "Failed to generate AI response",
    });
  }
};

module.exports = {
  chatWithAI,
};