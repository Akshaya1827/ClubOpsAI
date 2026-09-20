const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  chatWithAI,
  analyzeMeetingController,
} = require("../controllers/aiController");

const router = express.Router();

// AI Chat
router.post(
  "/chat",
  protect,
  chatWithAI
);

// Meeting AI Analysis
router.post(
  "/meetings/analyze",
  protect,
  analyzeMeetingController
);

module.exports = router;