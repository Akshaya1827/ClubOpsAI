const { analyzeMeeting } = require("../ai/meetingService");
const { createTasksFromActionItems } = require("../ai/actionService");
const Meeting = require("../models/Meeting");
const analyzeMeetingController = async (req, res) => {
    try {
        const { transcript, eventId } = req.body;

        if (!transcript) {
            return res.status(400).json({
                message: "Meeting transcript is required"
            });
        }

        if (!eventId) {
            return res.status(400).json({
                message: "Event ID is required"
            });
        }

        // Step 1: Analyze meeting with AI
        const result = await analyzeMeeting(transcript);
        // Save AI meeting analysis
const meeting = await Meeting.create({
    eventId,
    transcript,
    summary: result.summary,
    decisions: result.decisions,
    actionItems: result.actionItems.map((item) => ({
        description: item.description,
        owner: item.owner,
        deadline: item.deadline
    })),
    date: new Date(),
    title: "AI Analyzed Meeting",
    status: "Completed"
});

        // Step 2: Create tasks from AI action items
        const createdTasks = await createTasksFromActionItems(
            result.actionItems,
            eventId
        );

        res.status(200).json({
            success: true,
            meetingAnalysis: result,
            createdTasks
        });

    } catch (error) {
        console.error("Meeting analysis error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to analyze meeting",
            error: error.message
        });
    }
};

module.exports = {
    analyzeMeetingController
};