const { detectRisks } = require("../ai/riskService");
const { generateRiskExplanation } = require("../ai/riskAIService");
const Risk = require("../models/Risk");

const detectEventRisks = async (req, res) => {
    try {
        const { eventId } = req.params;

        // 1. Detect risks
        const risks = await detectRisks(eventId);

        // 2. Add AI explanation
        const risksWithAI = await Promise.all(
            risks.map(async (risk) => {
                const aiResult = await generateRiskExplanation(risk);

                return {
                    ...risk,
                    aiExplanation: aiResult.explanation,
                    aiRecommendation: aiResult.recommendation
                };
            })
        );

        // 3. Save/update risks in MongoDB
        const savedRisks = [];

        for (const risk of risksWithAI) {
            const savedRisk = await Risk.findOneAndUpdate(
                {
                    event: risk.event,
                    task: risk.task,
                    type: risk.type,
                    status: "open"
                },
                {
                    event: risk.event,
                    task: risk.task,
                    type: risk.type,
                    title: risk.title,
                    description: risk.description,
                    severity: risk.severity,
                    recommendation: risk.aiRecommendation,
                    status: "open"
                },
                {
                    new: true,
                    upsert: true
                }
            );

            savedRisks.push(savedRisk);
        }

        res.status(200).json({
            success: true,
            count: savedRisks.length,
            risks: savedRisks
        });

    } catch (error) {
        console.error("Risk detection error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to detect risks",
            error: error.message
        });
    }
};

module.exports = {
    detectEventRisks
};