const express = require("express");

const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

const router = express.Router();

// Create an event
router.post("/", createEvent);

// Get all events
router.get("/", getEvents);

// Get one event
router.get("/:id", getEventById);

// Update an event
router.put("/:id", updateEvent);

// Delete an event
router.delete("/:id", deleteEvent);

module.exports = router;