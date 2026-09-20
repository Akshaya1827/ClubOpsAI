const express = require("express");

const { searchRAG,askRAG } = require("../controllers/ragController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/search", authMiddleware, searchRAG);
router.post("/ask", authMiddleware, askRAG);

module.exports = router;