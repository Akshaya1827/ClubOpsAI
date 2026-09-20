const express = require("express");

const {
    analyzeMeetingController
} = require("../controllers/aiController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/meetings/analyze",
    protect,
    analyzeMeetingController
);

module.exports = router;