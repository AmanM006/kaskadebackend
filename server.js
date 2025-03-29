const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors()); // ✅ Fix CORS issues
app.use(express.json()); // ✅ Parse JSON requests

// ✅ Root Route (Check if server is running)
app.get("/", (req, res) => {
    res.send("✅ KaskadeCRM Backend is Running!");
});

// ✅ Test API Route
app.get("/api/users", (req, res) => {
    res.json([{ id: 1, name: "John Doe" }]); // Dummy Data
});

// ✅ Start Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
