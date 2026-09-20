const mongoose = require("mongoose");
const documentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },

    fileUrl: {
      type: String,
      default: "",
    },

    fileType: {
      type: String,
      default: "",
    },

    uploadedBy: {
      type: String,
      default: "",
    },
    content: { type: String, default: "" },

    chunks: {
      type: [
        {
          text: { type: String, required: true },
          embedding: { type: [Number], default: [] }
        }
      ],
      default: []
    },

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Document", documentSchema);