const {
  generateAIResponse,
} = require("../ai/providerService");

const {
  analyzeMeeting,
} = require("../ai/meetingService");

const {
  createTasksFromActionItems,
} = require("../ai/actionService");

const Meeting = require("../models/Meeting");

// =========================================
// AI CHAT CONTROLLER
// =========================================

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

// =========================================
// MEETING AI CONTROLLER
// =========================================

const analyzeMeetingController =
  async (req, res) => {
    try {
      const {
        transcript,
        eventId,
      } = req.body;

      if (!transcript) {
        return res.status(400).json({
          message:
            "Meeting transcript is required",
        });
      }

      if (!eventId) {
        return res.status(400).json({
          message:
            "Event ID is required",
        });
      }

      // Step 1: Analyze meeting with AI
      const result =
        await analyzeMeeting(
          transcript
        );

      // Step 2: Save AI meeting analysis
      const meeting =
        await Meeting.create({
          eventId,
          transcript,
          summary: result.summary,
          decisions: result.decisions,
          actionItems:
            result.actionItems.map(
              (item) => ({
                description:
                  item.description,
                owner: item.owner,
                deadline:
                  item.deadline,
              })
            ),
          date: new Date(),
          title:
            "AI Analyzed Meeting",
          status: "Completed",
        });

      // Step 3: Create tasks from AI action items
      //
      // Pass the authenticated user so the
      // Action Service can enforce permissions.
      const createdTasks =
        await createTasksFromActionItems(
          result.actionItems,
          eventId,
          {
            user: req.user,
          }
        );

      return res.status(200).json({
        success: true,
        meetingAnalysis: result,
        meeting,
        createdTasks,
      });
    } catch (error) {
      console.error(
        "Meeting analysis error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to analyze meeting",
        error: error.message,
      });
    }
  };

// =========================================
// EXPORT BOTH CONTROLLERS
// =========================================

module.exports = {
  chatWithAI,
  analyzeMeetingController,
};