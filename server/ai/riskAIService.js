const generateRiskExplanation = async (risk) => {
    /*
     * Gemini can be connected here later.
     * For now, we use deterministic explanations so
     * Risk Management works even when Gemini quota is exhausted.
     */

    switch (risk.type) {

        case "overdue_task":
            return {
                explanation:
                    `The task "${risk.title.replace("Overdue task: ", "")}" ` +
                    `has passed its deadline. This can delay other event preparations ` +
                    `if the task is dependent on other activities.`,
                recommendation:
                    "Complete the task immediately or reassign it to another volunteer."
            };

        case "due_soon":
            return {
                explanation:
                    `The task "${risk.title.replace("Task due soon: ", "")}" ` +
                    `is approaching its deadline. There is limited time remaining ` +
                    `to complete the work.`,
                recommendation:
                    "Prioritize this task and make sure the assigned volunteer completes it on time."
            };

        case "unassigned_task":
            return {
                explanation:
                    `The high-priority task "${risk.title.replace("Unassigned high-priority task: ", "")}" ` +
                    `does not currently have a volunteer assigned. This creates a risk of the task remaining incomplete.`,
                recommendation:
                    "Assign a suitable volunteer as soon as possible."
            };

        case "incomplete_event":
            return {
                explanation:
                    "The event is approaching while some tasks are still incomplete. " +
                    "Unfinished work close to the event date can affect event preparation.",
                recommendation:
                    "Review all remaining tasks and prioritize the most important ones before the event."
            };

        case "volunteer_shortage":
            return {
                explanation:
                    "The number of available volunteers may not be sufficient to handle " +
                    "the remaining event responsibilities.",
                recommendation:
                    "Review volunteer assignments and consider assigning additional volunteers."
            };

        default:
            return {
                explanation: "This risk may affect the successful completion of the event.",
                recommendation: "Review the risk and take appropriate action."
            };
    }
};

module.exports = {
    generateRiskExplanation
};