require("dotenv").config();

const { generateEmbedding } = require("./services/embeddingService");

const testEmbedding = async () => {
    try {
        const text =
            "Rahul is responsible for event coordination for College Fest 2026.";

        const embedding = await generateEmbedding(text);

        console.log("Embedding generated successfully.");
        console.log("Embedding length:", embedding.length);
        console.log("First 5 values:", embedding.slice(0, 5));
    } catch (error) {
        console.error(error.message);
    }
};

testEmbedding();