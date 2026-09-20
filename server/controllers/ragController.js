const { searchRelevantChunks ,answerQuestion} = require("../services/ragService");

const searchRAG = async (req, res) => {
    try {
        const { query, eventId, topK } = req.body;

        if (!query || !query.trim()) {
            return res.status(400).json({
                success: false,
                message: "Query is required"
            });
        }

        const results = await searchRelevantChunks(
            query.trim(),
            eventId || null,
            topK || 3
        );

        res.status(200).json({
            success: true,
            query,
            count: results.length,
            results
        });

    } catch (error) {
        console.error("RAG search error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const askRAG = async (req, res) => {
    try {
        const { query, eventId } = req.body;

        if (!query || !query.trim()) {
            return res.status(400).json({
                success: false,
                message: "Query is required"
            });
        }

        const result = await answerQuestion(
            query.trim(),
            eventId || null
        );

        res.status(200).json({
            success: true,
            query,
            answer: result.answer,
            sources: result.sources
        });

    } catch (error) {
        console.error("RAG question answering error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    searchRAG,
    askRAG
};