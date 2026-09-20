const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const dns = require("dns");
dotenv.config();
// Routes
const authRoutes = require("./routes/authRoutes");
const volunteerRoutes = require("./routes/volunteerRoutes");
const meetingRoutes = require("./routes/meetingRoutes");
const documentRoutes = require("./routes/documentRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const eventRoutes = require("./routes/eventRoutes");
const taskRoutes = require("./routes/taskRoutes");
const aiRoutes = require("./routes/aiRoutes");
const riskRoutes = require("./routes/riskRoutes");
const ragRoutes = require("./routes/ragRoutes");
dns.setServers(["8.8.8.8"]);


connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/risks", riskRoutes);
app.use("/api/rag", ragRoutes);
// Static Files
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
    res.json({
        message: "ClubOps AI backend is running"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});