const Task = require("../models/Task");
const User = require("../models/User");
const Event = require("../models/Event");

const createTasksFromActionItems = async (actionItems, eventId) => {
    // Check event
    const event = await Event.findById(eventId);

    if (!event) {
        throw new Error("Event not found");
    }

    const createdTasks = [];

    for (const item of actionItems) {

        let assignedTo = null;

        // Find user if AI identified an owner
        if (item.owner) {
            const user = await User.findOne({
                name: {
                    $regex: `^${item.owner}$`,
                    $options: "i"
                }
            });

            if (!user) {
                console.warn(
                    `User not found for owner: ${item.owner}`
                );
            } else {
                assignedTo = user._id;
            }
        }

        // Task requires a dueDate
        if (!item.deadline) {
            console.warn(
                `Skipping task "${item.description}" because deadline is missing`
            );
            continue;
        }

        // Check if the same task already exists for this event
const existingTask = await Task.findOne({
    title: item.description,
    event: eventId,
    dueDate: new Date(item.deadline)
});

if (existingTask) {
    console.log(
        `Task already exists: ${item.description}`
    );
    continue;
}

const task = await Task.create({
    title: item.description,
    description: item.description,
    event: eventId,
    assignedTo,
    dueDate: new Date(item.deadline)
});

createdTasks.push(task);
    }

    return createdTasks;
};

module.exports = {
    createTasksFromActionItems
};