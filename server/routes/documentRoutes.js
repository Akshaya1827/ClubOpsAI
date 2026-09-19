const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const {
  createDocument,
  getDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
} = require("../controllers/documentController");

const router = express.Router();

// Create a document
router.post("/", upload.single("file"), createDocument);

// Get all documents
router.get("/", getDocuments);

// Get one document
router.get("/:id", getDocumentById);

// Update a document
router.put("/:id", updateDocument);

// Delete a document
router.delete("/:id", deleteDocument);

module.exports = router;