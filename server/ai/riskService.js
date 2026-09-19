const Task = require("../models/Task");
const Event = require("../models/Event");

const detectRisks = async (eventId) => {
    const event = await Event.findById(eventId);

    if (!event) {
        throw new Error("Event not found");
    }

    const tasks = await Task.find({
        event: eventId,
        status: { $ne: "completed" },
    });

    const risks = [];

    const now = new Date();

    // 1. Detect overdue tasks
    for (const task of tasks) {
        if (task.dueDate < now) {
            risks.push({
                event: eventId,
                task: task._id,
                type: "overdue_task",
                title: `Overdue task: ${task.title}`,
                description: `Task "${task.title}" is past its deadline.`,
                severity: "high",
                recommendation: "Complete the task immediately or reassign it.",
            });
        }
    }

    // 2. Detect tasks due soon (within 2 days)
    const twoDaysFromNow = new Date(
        now.getTime() + 2 * 24 * 60 * 60 * 1000
    );

    for (const task of tasks) {
        if (
            task.dueDate >= now &&
            task.dueDate <= twoDaysFromNow
        ) {
            risks.push({
                event: eventId,
                task: task._id,
                type: "due_soon",
                title: `Task due soon: ${task.title}`,
                description: `Task "${task.title}" is due within the next 2 days.`,
                severity: "medium",
                recommendation: "Prioritize this task and ensure it is completed on time.",
            });
        }
    }

    // 3. Detect unassigned high-priority tasks
    for (const task of tasks) {
        if (
            task.priority === "high" &&
            !task.assignedTo
        ) {
            risks.push({
                event: eventId,
                task: task._id,
                type: "unassigned_task",
                title: `Unassigned high-priority task: ${task.title}`,
                description: `High-priority task "${task.title}" has no volunteer assigned.`,
                severity: "high",
                recommendation: "Assign a volunteer to this task as soon as possible.",
            });
        }
    }

    // 4. Detect approaching event with incomplete tasks
    const eventDate = new Date(event.date);

    const daysUntilEvent =
        (eventDate - now) / (1000 * 60 * 60 * 24);

    const incompleteTasks = tasks.filter(
        (task) => task.status !== "completed"
    );

    if (
        daysUntilEvent >= 0 &&
        daysUntilEvent <= 7 &&
        incompleteTasks.length > 0
    ) {
        risks.push({
            event: eventId,
            task: null,
            type: "incomplete_event",
            title: "Event approaching with incomplete tasks",
            description: `The event "${event.title}" is within 7 days and has ${incompleteTasks.length} incomplete task(s).`,
            severity: "high",
            recommendation: "Review the remaining tasks and prioritize completion before the event.",
        });
    }

    return risks;
};

module.exports = {
    detectRisks,
};