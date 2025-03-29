const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors()); // ✅ Fix CORS
app.use(express.json()); // ✅ Ensure JSON support

// ✅ Check if server is running
app.get("/", (req, res) => {
    res.send("✅ KaskadeCRM Backend is Running!");
});

// ✅ Example API route
app.get("/api/users", async (req, res) => {
    try {
        res.json([{ id: 1, name: "John Doe" }]); // Dummy data for testing
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ Start the server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
