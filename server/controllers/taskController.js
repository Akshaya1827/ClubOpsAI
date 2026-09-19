const Task = require("../models/Task");

// Create a task
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      event,
      assignedTo,
      priority,
      status,
      dueDate,
    } = req.body;

    const task = await Task.create({
      title,
      description,
      event,
      assignedTo,
      priority,
      status,
      dueDate,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create task",
      error: error.message,
    });
  }
};

// Get all tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("event", "title date")
      .sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
};

// Get a single task
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "event",
      "title date"
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch task",
      error: error.message,
    });
  }
};

// Get upcoming deadlines
const getUpcomingDeadlines = async (req, res) => {
  try {
    const now = new Date();

    const tasks = await Task.find({
      dueDate: { $gte: now },
      status: { $ne: "completed" },
    })
      .populate("event", "title date")
      .sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch upcoming deadlines",
      error: error.message,
    });
  }
};

// Get overdue deadlines
const getOverdueDeadlines = async (req, res) => {
  try {
    const now = new Date();

    const tasks = await Task.find({
      dueDate: { $lt: now },
      status: { $ne: "completed" },
    })
      .populate("event", "title date")
      .sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch overdue deadlines",
      error: error.message,
    });
  }
};

// Get tasks due today
const getTodayDeadlines = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const tasks = await Task.find({
      dueDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: { $ne: "completed" },
    })
      .populate("event", "title date")
      .sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch today's deadlines",
      error: error.message,
    });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const {
      title,
      description,
      event,
      assignedTo,
      priority,
      status,
      dueDate,
    } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        event,
        assignedTo,
        priority,
        status,
        dueDate,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("event", "title date");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update task",
      error: error.message,
    });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete task",
      error: error.message,
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  getUpcomingDeadlines,
  getOverdueDeadlines,
  getTodayDeadlines,
  updateTask,
  deleteTask,
};