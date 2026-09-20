const Document = require("../models/Document");
const { generateEmbedding } = require("./embeddingService");
const { generateAIResponse } = require("../ai/aiService");
const cosineSimilarity = (vectorA, vectorB) => {
    if (vectorA.length !== vectorB.length) {
        throw new Error("Embedding dimensions do not match");
    }

    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < vectorA.length; i++) {
        dotProduct += vectorA[i] * vectorB[i];

        magnitudeA += vectorA[i] * vectorA[i];
        magnitudeB += vectorB[i] * vectorB[i];
    }

    if (magnitudeA === 0 || magnitudeB === 0) {
        return 0;
    }

    return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
};

const searchRelevantChunks = async (query, eventId = null, topK = 3) => {
    const queryEmbedding = await generateEmbedding(query);

    const filter = {
        "chunks.embedding.0": { $exists: true }
    };

    if (eventId) {
        filter.eventId = eventId;
    }

    const documents = await Document.find(filter);

    const results = [];

    for (const document of documents) {
        for (const chunk of document.chunks) {
            if (!chunk.embedding || chunk.embedding.length === 0) {
                continue;
            }

            const similarity = cosineSimilarity(
                queryEmbedding,
                chunk.embedding
            );

            results.push({
                documentId: document._id,
                documentName: document.name,
                text: chunk.text,
                score: similarity
            });
        }
    }

    results.sort((a, b) => b.score - a.score);

    return results.slice(0, topK);
};
const answerQuestion = async (query, eventId = null) => {
    const relevantChunks = await searchRelevantChunks(
        query,
        eventId,
        3
    );

    if (relevantChunks.length === 0) {
        return {
            answer: "I could not find relevant information in the uploaded documents.",
            sources: []
        };
    }

    const context = relevantChunks
        .map((chunk, index) => {
            return `Source ${index + 1}:
${chunk.text}`;
        })
        .join("\n\n");

    const prompt = `
You are the ClubOps AI assistant.

Answer the user's question using ONLY the information provided in the context below.

If the answer is not present in the context, say:
"I could not find this information in the uploaded documents."

Do not invent information.

Context:
${context}

User Question:
${query}

Give a short and clear answer.
`;

    const aiResponse = await generateAIResponse(prompt);

    return {
        answer: aiResponse,
        sources: relevantChunks
    };
};

module.exports = {
    cosineSimilarity,
    searchRelevantChunks,
    answerQuestion
};