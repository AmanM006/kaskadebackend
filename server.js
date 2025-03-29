const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors()); // ✅ Allow CORS for all origins
app.use(express.json());

// ✅ Root route (Avoid "Not Found" error at `/`)
app.get("/", (req, res) => {
    res.send("✅ KaskadeCRM Backend is Running!");
});

// ✅ API Routes
app.get("/api/users", async (req, res) => {
    try {
        res.json([{ id: 1, name: "John Doe" }]); // Dummy response for testing
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
