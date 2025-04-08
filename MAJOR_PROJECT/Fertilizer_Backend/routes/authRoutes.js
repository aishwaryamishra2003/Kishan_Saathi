const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { MongoClient } = require("mongodb");

const router = express.Router();
const JWT_SECRET = "9vD8a$3uT6@X1!pLQf&zR#jY0M*W2kC"; // Secure key
const MONGO_URI = "mongodb://localhost:27017/";
const MONGO_DB_NAME = "weather_data_store";
const USERS_COLLECTION = "users";

// 📌 Connect to MongoDB
async function getDb() {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    return client.db(MONGO_DB_NAME);
}

// 📌 Signup Route
router.post("/signup", async (req, res) => {
    const { username, password, name, age, village, district } = req.body;

    if (!username || !password || !name || !age || !village || !district) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        const db = await getDb();
        const collection = db.collection(USERS_COLLECTION);

        const existingUser = await collection.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await collection.insertOne({ username, password: hashedPassword, name, age, village, district });

        res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

// 📌 Login Route
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required." });
    }

    try {
        const db = await getDb();
        const collection = db.collection(USERS_COLLECTION);

        const user = await collection.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials." });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { username, name: user.name, age: user.age, village: user.village, district: user.district },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ message: "Login successful.", token });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

// 📌 Get User Details (Protected Route)
router.get("/user-details", async (req, res) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

    try {
        const decoded = jwt.verify(token.split(" ")[1], JWT_SECRET);
        const db = await getDb();
        const collection = db.collection(USERS_COLLECTION);

        // Fetch full user details from MongoDB (excluding password)
        const user = await collection.findOne(
            { username: decoded.username },
            { projection: { password: 0 } } // Exclude password from response
        );

        if (!user) return res.status(404).json({ error: "User not found." });

        res.json({ message: "User details fetched.", user });
    } catch (error) {
        console.error("Token Verification Error:", error);
        res.status(401).json({ error: "Invalid token." });
    }
});

module.exports = router;
