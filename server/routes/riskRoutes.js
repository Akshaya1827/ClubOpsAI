const express = require("express");

const {
    detectEventRisks,
} = require("../controllers/riskController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/event/:eventId",
    protect,
    detectEventRisks
);

module.exports = router;