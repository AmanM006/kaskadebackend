require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
app.use(cors({ origin: "https://amanm006.github.io" })); // Allow frontend
const app = express();
app.use(cors());
app.use(express.json());
const LoyaltyTrendsModel = require("./models/LoyaltyTrends.js"); // Adjust path as needed

// Ensure MONGO_URI exists
if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is missing in .env file");
    process.exit(1);
}

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1);
    });

// Define Schema and Model
const userSchema = new mongoose.Schema({
    name: String,
    userID: Number,
    purchases: Number,
    lastActivity: String,
    loyaltyScore: Number,
    reward: String
}, { collection: 'users' });

const User = mongoose.model("User", userSchema); // ✅ Define the model properly

// Function to fetch users
async function fetchUsersFromDatabase() {
    return await User.find(); // Fetch all users from MongoDB
}

// Function to fetch loyalty trends (FIXED)
async function fetchLoyaltyTrendsFromDatabase() {
    try {
        const trends = await LoyaltyTrendsModel.find();
        console.log("📊 Loyalty Trends from DB:", trends);

        return trends.map(trend => ({
            year: trend.year,
            month: trend.month,
            label: `${trend.year}-${trend.month}`,
            value: trend.value
        }));
    } catch (error) {
        console.error("❌ Error fetching loyalty trends:", error);
        return [];
    }
}



// API Endpoint to Fetch All Users
app.get("/api/users", async (req, res) => {
    try {
        const users = await fetchUsersFromDatabase();
        console.log("Users from DB:", users);
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/api/data", async (req, res) => {
    try {
        const users = await fetchUsersFromDatabase();
        console.log("✅ Users fetched:", users);

        const totalUsers = users.length || 1; // ✅ Prevent division by zero
        const loyalCount = users.filter(u => u.loyaltyScore >= 80).length;
        const atRiskCount = users.filter(u => u.loyaltyScore < 30 && u.loyaltyScore > 10).length;
        const churnedCount = users.filter(u => u.loyaltyScore <= 10).length;

        const customerDistribution = {
            loyal: (loyalCount / totalUsers) * 100,
            atRisk: (atRiskCount / totalUsers) * 100,
            churned: (churnedCount / totalUsers) * 100,
            totalUsers: totalUsers
        };

        console.log("📊 Calculated Customer Distribution:", customerDistribution);

        // ✅ Dynamically Calculate Loyalty Trends
        const trendsMap = {};

        users.forEach(user => {
            const date = new Date(user.lastActivity);
            const year = date.getFullYear();
            const month = date.getMonth() + 1; // JS months are 0-based

            const key = `${year}-${month}`;

            if (!trendsMap[key]) {
                trendsMap[key] = { totalScore: 0, count: 0 };
            }

            trendsMap[key].totalScore += user.loyaltyScore;
            trendsMap[key].count += 1;
        });

        // ✅ Convert map to array
        const loyaltyTrends = Object.entries(trendsMap).map(([key, data]) => {
            const [year, month] = key.split("-");
            return {
                year: parseInt(year),
                month: parseInt(month),
                value: data.totalScore / data.count // Average loyalty score
            };
        });

        console.log("📊 Derived Loyalty Trends:", loyaltyTrends);

        res.json({
            loyaltyTrends,
            users,
            customerDistribution
        });
    } catch (error) {
        console.error("❌ Error fetching data:", error.message);
        res.status(500).json({ error: "Server error", details: error.message });
    }
});





// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
