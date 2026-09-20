const mongoose = require("mongoose");

const riskSchema = new mongoose.Schema(
    {
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true,
        },

        task: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            default: null,
        },

        type: {
            type: String,
            enum: [
                "overdue_task",
                "due_soon",
                "unassigned_task",
                "incomplete_event",
                "volunteer_shortage",
            ],
            required: true,
        },

        title: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            required: true,
        },

        severity: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },

        recommendation: {
            type: String,
            default: "",
        },

        status: {
            type: String,
            enum: ["open", "resolved"],
            default: "open",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Risk", riskSchema);