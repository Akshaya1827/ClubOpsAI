const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },

    date: {
      type: Date,
      required: true,
    },

    location: {
      type: String,
      trim: true,
    },

    attendees: {
      type: [String],
      default: [],
    },

    notes: {
      type: String,
      default: "",
    },

    transcript: {
      type: String,
      default: "",
    },
    summary: {
  type: String,
  default: "",
},

decisions: {
  type: [String],
  default: [],
},
actionItems: {
  type: [
    {
      description: {
        type: String,
        required: true,
      },

      owner: {
        type: String,
        default: null,
      },

      deadline: {
        type: Date,
        default: null,
      },
    },
  ],
  default: [],
},
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled"],
      default: "Scheduled",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Meeting", meetingSchema);