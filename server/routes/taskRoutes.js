const express = require("express");

const {
  createTask,
  getTasks,
  getTaskById,
  getUpcomingDeadlines,
  getOverdueDeadlines,
  getTodayDeadlines,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const router = express.Router();

// Create a task
router.post("/", createTask);

// Get all tasks
router.get("/", getTasks);

// Get upcoming deadlines
router.get("/deadlines/upcoming", getUpcomingDeadlines);

// Get overdue deadlines
router.get("/deadlines/overdue", getOverdueDeadlines);

// Get tasks due today
router.get("/deadlines/today", getTodayDeadlines);

// Get one task
router.get("/:id", getTaskById);

// Update a task
router.put("/:id", updateTask);

// Delete a task
router.delete("/:id", deleteTask);

module.exports = router;