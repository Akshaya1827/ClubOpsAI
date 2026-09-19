const express = require("express");

const {
  createMeeting,
  getMeetings,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
} = require("../controllers/meetingController");

const router = express.Router();

// Create a meeting
router.post("/", createMeeting);

// Get all meetings
router.get("/", getMeetings);

// Get one meeting
router.get("/:id", getMeetingById);

// Update a meeting
router.put("/:id", updateMeeting);

// Delete a meeting
router.delete("/:id", deleteMeeting);

module.exports = router;