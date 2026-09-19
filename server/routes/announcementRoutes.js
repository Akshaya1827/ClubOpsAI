const express = require("express");

const {
  createAnnouncement,
  getAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
  publishAnnouncement,
  unpublishAnnouncement,
} = require("../controllers/announcementController");

const router = express.Router();

// Create an announcement
router.post("/", createAnnouncement);

// Get all announcements
router.get("/", getAnnouncements);

// Get one announcement
router.get("/:id", getAnnouncementById);

// Update an announcement
router.put("/:id", updateAnnouncement);

// Delete an announcement
router.delete("/:id", deleteAnnouncement);

// Publish an announcement
router.patch("/:id/publish", publishAnnouncement);

// Unpublish an announcement
router.patch("/:id/unpublish", unpublishAnnouncement);

module.exports = router;