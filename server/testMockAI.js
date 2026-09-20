require("dotenv").config();

const {
  generateMockResponse,
} = require("./ai/mockAIService");

const runTest = async () => {
  console.log("\n========== MOCK AI TEST ==========\n");

  const prompts = [
    "What tasks are overdue?",
    "Show me upcoming deadlines",
    "Show my tasks",
    "Hello ClubOps AI",
  ];

  for (const prompt of prompts) {
    console.log("User:", prompt);

    const result = await generateMockResponse(prompt);

    console.log("Mock AI:", JSON.stringify(result, null, 2));
    console.log("----------------------------------");
  }

  console.log("\nMock AI test successful!\n");
};

runTest();