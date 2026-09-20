const dns = require("dns");

dns.setServers(["8.8.8.8"]);
require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("./config/db");
const { searchRelevantChunks } = require("./services/ragService");

const testRAG = async () => {
    try {
        await connectDB();

        const results = await searchRelevantChunks(
            "Who is responsible for technical arrangements?",
            "6aae82ca80a9b0b7ed0db90f",
            3
        );

        console.log("\nRelevant chunks:\n");

        results.forEach((result, index) => {
            console.log(`Result ${index + 1}`);
            console.log("Document:", result.documentName);
            console.log("Score:", result.score);
            console.log("Text:", result.text);
            console.log("----------------------------");
        });

        await mongoose.connection.close();
    } catch (error) {
        console.error("RAG test error:", error);
        process.exit(1);
    }
};

testRAG();