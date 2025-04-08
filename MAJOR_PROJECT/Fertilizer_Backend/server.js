require("dotenv").config();
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/";
const MONGO_DB_NAME = "weather_data_store";
const WEATHER_COLLECTION = "weather_data";
const RECOMMENDATION_COLLECTION = "fertilizer_recommendations";

const mongoClient = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToMongo() {
    try {
        await mongoClient.connect();
        console.log("✅ Connected to MongoDB");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1);
    }
}
connectToMongo();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Import & Use Routes
const authRoutes = require("./routes/authRoutes");
const faqRoutes = require("./routes/faqRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/faq", faqRoutes);

// External APIs
const ZIPPO_API_URL = "http://api.zippopotam.us/IN/{postalcode}";
const OPEN_METEO_API_URL = "https://api.open-meteo.com/v1/forecast";

// 📌 Fetch Weather Data
app.post("/api/get-weather", async (req, res) => {
    const { pincode, startDate, endDate } = req.body;

    try {
        // Fetch location data
        const zippoResponse = await axios.get(ZIPPO_API_URL.replace("{postalcode}", pincode));
        if (!zippoResponse.data.places || zippoResponse.data.places.length === 0) {
            return res.status(400).json({ error: "Invalid pincode" });
        }

        const { latitude, longitude } = zippoResponse.data.places[0];

        // Fetch weather data
        const weatherUrl = `${OPEN_METEO_API_URL}?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${endDate}&hourly=temperature_2m,soil_moisture_1_to_3cm,soil_moisture_3_to_9cm,rain&timezone=auto`;
        const weatherResponse = await axios.get(weatherUrl);

        res.json({ latitude, longitude, weatherData: weatherResponse.data.hourly });
    } catch (error) {
        console.error("❌ API Fetch Error:", error);
        res.status(500).json({ error: "Failed to fetch weather data." });
    }
});

// 📌 Fertilizer Recommendation API
app.post("/api/recommend-fertilizer", async (req, res) => {
    const { soilType, cropType, farmSize, nitrogen, phosphorus, potassium, soilPh, weatherData } = req.body;

    if (!soilType || !cropType || !farmSize || !weatherData) {
        return res.status(400).json({ error: "Missing required parameters." });
    }

    // 📌 Base Fertilizer Data per Hectare
    const cropFertilizerData = {
        Rice: { nitrogen: 100, phosphorus: 60, potassium: 50, recommendedFertilizer: "Urea + Ammonium Sulfate" },
        Wheat: { nitrogen: 120, phosphorus: 40, potassium: 60, recommendedFertilizer: "Urea + Superphosphate" },
        Corn: { nitrogen: 150, phosphorus: 50, potassium: 80, recommendedFertilizer: "Urea + Potassium Nitrate" },
        Sugarcane: { nitrogen: 200, phosphorus: 80, potassium: 100, recommendedFertilizer: "Urea + MOP" },
        Barley: { nitrogen: 90, phosphorus: 35, potassium: 50, recommendedFertilizer: "Urea + DAP" },
        Soybean: { nitrogen: 50, phosphorus: 60, potassium: 40, recommendedFertilizer: "Superphosphate + Potassium Sulfate" },
        Cotton: { nitrogen: 150, phosphorus: 60, potassium: 90, recommendedFertilizer: "Urea + Superphosphate" },
        Potato: { nitrogen: 160, phosphorus: 70, potassium: 120, recommendedFertilizer: "Urea + Potassium Sulfate" },
        Tomato: { nitrogen: 100, phosphorus: 50, potassium: 70, recommendedFertilizer: "Urea + DAP" },
        Onion: { nitrogen: 110, phosphorus: 60, potassium: 80, recommendedFertilizer: "Urea + MOP" },
    };

    if (!cropFertilizerData[cropType]) {
        return res.status(400).json({ error: "Crop type not supported." });
    }

    let recommendation = { ...cropFertilizerData[cropType] };

    // 📌 Soil Type Adjustments
    if (soilType === "Sandy") recommendation.nitrogen *= 1.2;
    if (soilType === "Clayey") recommendation.phosphorus *= 1.2;
    if (soilType === "Silty") recommendation.potassium *= 1.1;
    if (soilType === "Peaty") recommendation.nitrogen *= 0.8;

    // 📌 Weather Adjustments
    const avgTemperature = weatherData.temperature_2m.reduce((a, b) => a + b, 0) / weatherData.temperature_2m.length;
    const avgSoilMoisture = weatherData.soil_moisture_1_to_3cm.reduce((a, b) => a + b, 0) / weatherData.soil_moisture_1_to_3cm.length;
    const totalRainfall = weatherData.rain.reduce((a, b) => a + b, 0);

    if (avgTemperature > 30) recommendation.nitrogen *= 1.1;
    if (avgSoilMoisture < 0.15) {
        recommendation.nitrogen *= 0.9;
        recommendation.phosphorus *= 0.9;
        recommendation.potassium *= 0.9;
    }
    if (totalRainfall > 50) recommendation.nitrogen *= 0.9;

    // 📌 Soil pH Adjustments
    if (soilPh < 5.5) recommendation.recommendedFertilizer += " + Lime";
    if (soilPh > 7.5) recommendation.recommendedFertilizer += " + Sulfur";

    // 📌 Scale by Farm Size
    recommendation.nitrogen *= farmSize;
    recommendation.phosphorus *= farmSize;
    recommendation.potassium *= farmSize;

    // ✅ Store Recommendation in MongoDB
    try {
        const db = mongoClient.db(MONGO_DB_NAME);
        const collection = db.collection(RECOMMENDATION_COLLECTION);

        await collection.insertOne({
            soilType, cropType, farmSize,
            nitrogen: Math.round(recommendation.nitrogen),
            phosphorus: Math.round(recommendation.phosphorus),
            potassium: Math.round(recommendation.potassium),
            recommendedFertilizer: recommendation.recommendedFertilizer,
            timestamp: new Date(),
        });

        res.json({ message: "✅ Recommendation stored", recommendation });
    } catch (error) {
        console.error("❌ MongoDB Storage Error:", error);
        res.status(500).json({ error: "Failed to store recommendation." });
    }
});

// 📌 Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
