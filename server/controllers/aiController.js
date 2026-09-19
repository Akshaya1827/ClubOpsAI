const {
  generateAIResponse,
} = require("../ai/providerService");

const chatWithAI = async (req, res) => {
  try {

    const { message } = req.body;

    if (
      !message ||
      typeof message !== "string"
    ) {
      return res.status(400).json({
        message:
          "A valid message is required",
      });
    }

    const trimmedMessage =
      message.trim();

    if (!trimmedMessage) {
      return res.status(400).json({
        message:
          "A valid message is required",
      });
    }

    console.log(
      "\n========== AI CHAT =========="
    );

    console.log(
      "User ID:",
      req.user?.userId
    );

    console.log(
      "User role:",
      req.user?.role
    );

    console.log(
      "Message:",
      trimmedMessage
    );

    console.log(
      "=============================\n"
    );

    const result =
      await generateAIResponse(
        trimmedMessage,
        {
          user: req.user,
        }
      );

    return res.status(200).json({
      message:
        "AI response generated successfully",

      result,
    });

  } catch (error) {

    console.error(
      "\n========== AI CONTROLLER ERROR =========="
    );

    console.error(
      "Message:",
      error.message
    );

    console.error(
      "Stack:",
      error.stack
    );

    console.error(
      "==========================================\n"
    );

    return res.status(500).json({
      message:
        "Failed to generate AI response",
    });
  }
};

module.exports = {
  chatWithAI,
};