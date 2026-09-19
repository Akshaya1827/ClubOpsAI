const express = require("express");
const dotenv = require("dotenv");
const eventRoutes = require("./routes/eventRoutes");
const taskRoutes = require("./routes/taskRoutes");
const cors = require("cors");
const connectDB = require("./config/db");
const dns = require("dns");

dns.setServers(["8.8.8.8"]);
dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/events", eventRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "ClubOps AI backend is running"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});